/*
Unprotected internal server for handling front end calls for database functions
Server: Express
DB: MySQL with MySQLJs and Knex for user input (POSTs)

## Compromises
I wanted to catch up on everything it takes to use the browser and server combo as cross platform tools for software development. As a result, I got to apply lots of what I had learned in university, but I have also noticed some parts which are not yet production ready.
-	Package size: the admin page can take quite a while on its worst-case run (no caching & lots of clients). I inspected some of the files that were being added and I am unsure why all the possible icons and graphics of the design library antd are being added. I tested antd in a create-react-app environment and it did not give me the same >15MB package. NextJS was also telling me that over 2100 modules were being loaded for the admin page. Ideally, I would not compile and load all these libraries and pages at once and instead actively use React’s AJAX functionality on this page for requesting and rendering components as they first become needed and lazy loading the helper modules.
-	Dual server environments: I used NextJS and Express as my backend servers. I routed lots of requests from the client to the origin server over to the Express backend running on localhost:3000.
-	SQL Injections: Mixing up my SQL JavaScript drivers meant some of the staff fields are vulnerable to SQL injections. Luckily, you can’t SQL inject your way into rendering the staff pages with any real data. Later, I used the Knex query builder which escapes and provides some protection, but I would not consider this application secure until everything was ported to the mysql2 npm library which was the first one that allowed me to do prepared statements without resorting to the console or another run-time. 
-	Streaming: I did not prepare this app for the possibility of having to handle data and download documents bigger than 1.5Gbs. 
-	Paging: The auto-complete functionality simply loads all the data in the related tables and searches through once it arrives at the browser. Ideally, I would be querying straight from the database and passing the partial results in real-time to the front-end using node streams. I will learn more about this for my next project.
If you have any questions, do not hesitate to ask. I am still learning, and any feedback is really appreciated. 
*/

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const sql = require("mysql2");
var cors = require('cors')
const moment = require('moment');
const JSZip = require("jszip")
const fs = require("fs").promises
const { exec } = require('child_process')
require('dotenv').config()

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: "3306",
    user: "root",
    password: process.env.dbPass,
    database: 'ACMEFood'
  },
  pool: {
    min: 0, max: 10,
    // afterCreate: function (conn, done) {
    //   conn.query('SET timezone="UTC";', function (err) {
    //     if (err) {
    //       // first query failed, return error and don't try to make next query
    //       done(err, conn);
    //     } else {
    //       // do the second query...
    //       conn.query('SELECT set_limit(0.01);', function (err) {
    //         // if err is not falsy, connection is discarded from pool
    //         // if connection aquire was triggered by a query the error is passed to query promise
    //         done(err, conn);
    //       });
    //     }
    //   });
    // }
  }
});



//Start the mySQLjs connection
const pool = new sql.createPool({
  host: 'localhost',
  user: "root",
  password: process.env.dbPass,
  database: 'ACMEFood'
})



// console.log(knex({a: 'Clients', b: 'ClientAddress'})
//   .select({
//     client: 'a.ClientId',
//     clientAddrId: 'b.AddrId'
//   })
//   .whereRaw( '?? = ??', ['a.ClientId', 'b.ClientId']).then(
//     res => {
//       console.log(res)
//     }
//   ))

//hashing with bcrypt
const bcrypt = require('bcrypt');

// Allow only certain origins
app.use(cors({
  origin: ['http://localhost:8000', "http://192.168.50.192:8000"]
}))
// app.use(cors())


const today = new Date();

const allMeals = ["BFast", "Lunch", "Dinner", "Extra", "Snack"]
const allDays = ["Lunes", "Martes", "Miercole", "Jueves", "Viernes", "Sabado", "Domingo"]

// Week starts on sunday, so sunday's will give you the next value, 
// else get previous days until monday
function getThisMonday(date = (new Date)) {
  //////console.log(date)
  var dDate = new Date(date)
  var refDate = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), 12)
  if (refDate.getDay() === 0) {
    refDate.setDate(refDate.getDate() + 1)
    return refDate
  }
  else {
    for (let i = 0; i < 7; i++) {
      var compDate = new Date(refDate)
      compDate.setDate(refDate.getDate() - i)

      if (compDate.getDay() === 1) {
        return compDate
      }
    }
  }
}

var dateFormatSQL = function (date, hours = false) {
  // ////////console.log(date)
  // if (hours) {
  //   return moment.utc(date).format("YYYY-MM-DD HH:mm:ss")
  // } else {
  //   return moment.utc(date).format("YYYY-MM-DD")
  return date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate())
  // }
}

var pad = function (int) {
  if (int < 10) {
    return `0${int}`
  } else {
    return `${int}`
  }
}

function submit(sql, sendTo) {

  const q = pool.query(sql, (e, res) => {
    ////////console.log(res)
    sendTo.send(res)
    return res

  })
  // ////////console.log(`send ${new Date().toLocaleTimeString()}, sql = ${sql}`)
  q.on('submitted', d => {
    // ////////console.log(`query submitted ${new Date().toLocaleTimeString()}, sql = ${d.query_str}`)
    q.on('done', () => {
      // ////////console.log(`query done ${new Date().toLocaleTimeString()}`)})
    })
  })
}
// TODO: REMEMBER TO TURN ON SAFE UPDATES IN MYSQL for production -> Edit -> Preferences -> Query Editor (scroll down and check safe updates)



function insertAddresses(clientId, clientAddrs) {

  let debug = true
  //find the first address with the same id as primary
  const primaryAddress = clientAddrs["addrs"].filter(addr => addr["AddrId"] === clientAddrs["primary"])

  if (primaryAddress.length > 1) {
    if (debug) {
      console.log("You have two primary addresses, how should this be handled?")
      console.log(primaryAddress)
    }
  }

  clientAddrs["addrs"].forEach(
    addr => {
      knex("Address").insert({ "StreetNo": addr["StreetNo"], "StreetName": addr["StreetName"], "Apt": addr["Apt"], "ZipCode": addr["ZipCode"], "City": addr["City"], "State": addr["State"] }).then(
        res => {
          if (debug) {
            console.log(`insertAddresses for Client: AddrId for ${addr} is: ` + res)
          }

          let isPrimary = addr["AddrId"] === clientAddrs["primary"] ? 1 : 0

          knex("ClientAddress").insert({ "ClientId": clientId, "AddrId": res[0], isPrimary: isPrimary }).then(
            clientAddrIds => {
              if (debug) {
                console.log("Created ClientAddress entry#: " + clientAddrIds ? clientAddrIds : "" + " in DB between client" + clientId + " and address" + addr + "successfully")
              }

            },
            err => {
              console.log("Creating ClientAddress did not succeed. In DB between client" + clientId + " and address" + addr + "FAILED (failed)")
              throw err
            }
          )

        },
        err => {
          console.log(err)
          throw err;
        }
      )
    }
  )


}

//Parse raw body - allows req.body to be used
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', async (req, res) => {
  let loginForm = req.body
  const accounts = await knex("Accounts").select("AccountId", "Email", "Password", "MadeOn").where({ Email: loginForm.eml })

  console.log(accounts)

  if (accounts.length !== 1) { res.send(undefined); return null };

  const passMatch = await bcrypt.compare(loginForm.pesky, accounts[0].Password)
  console.log(passMatch)
  if (passMatch) {
    // Make sure all our lib methods obfuscate the password
    accounts[0].Password = "";
    loginForm.pesky = "";
    //success
    console.log("Logging in....")
    res.send(accounts[0]);
  } else {
    accounts[0].Password = "";
    loginForm.pesky = "";
    res.send([])

  }

})


app.post('/register', async (req, res) => {

  console.log("registering")
  let debug = true;

  function validate(personI, key2validate, time2validate, personsInfo = null, eml = null, pesky = null) {

    //if submitting failed once, start validating for onChange
    if (time2validate) {
      let validationStatus = true
      //each if statement is checking if the key2validate passed must be validated
      //  (fname in this case)
      if (key2validate === "fname") {
        // checking if it <b>is null</b>, if it then set fnameInvalid (in this case)
        // to a value which will be checked by the parent divs that set the style of the invalid inputs
        if (!personsInfo[personI][key2validate]) {
          validationStatus = false
          console.log("Fname returned false")

        }
        //add other checks for this key here...


      } else if (key2validate === "lname") {

        // is null
        if (!personsInfo[personI][key2validate]) {
          validationStatus = false
          console.log("Lname returned false")
        }

        //other checks

      } else if (key2validate === "telf") {

        if (!personsInfo[personI][key2validate]) {
          validationStatus = false
          console.log("telf returned false")

        }
        //other checks


      } else if (key2validate === "diet") {
        if (!personsInfo[personI][key2validate]) {
          validationStatus = false
          console.log("diet returned false")

        }
        //other checks

      } else if (key2validate === "eml") {
        //is null
        console.log(eml)
        if (!eml) {
          validationStatus = false
          console.log("email returned false")

        }
        else if (!eml.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          validationStatus = false
          console.log("email regex returned false")

        }
        //other checks

      } else if (key2validate === "pesky") {


        if (pesky === null || pesky.length < 8) {
          validationStatus = false
          console.log("pesky returned false")


        }
        //other checks

      } else if (key2validate === "weeklyMenu") {

        console.log(personsInfo[personI][key2validate])
        //is empty array
        if (personsInfo[personI][key2validate].length === 0) {
          validationStatus = false
          console.log("weeklyMenu returned false")

        }
        //other checks

      } else if (key2validate === "addrs") {
        let validationMessage = ""

        //is empty array
        if (personsInfo[personI][key2validate]["addrs"].length === 0) {
          validationStatus = false
          console.log("addrs returned false")

        }
        //other checks

        personsInfo[personI][key2validate]["addrs"].forEach(
          (addr, addrI) => {
            if (!addr["StreetNo"]) {
              validationStatus = false
              console.log("streetNo returned false")


            }

            if (!addr["StreetName"]) {
              validationStatus = false
              console.log("streetName returned false")


            }

            if (!addr["City"]) {
              validationStatus = false
              console.log("city returned false")

            }

            if (!addr["ZipCode"]) {
              validationStatus = false
              console.log("zipcode returned false")

            }

            if (!addr["State"]) {
              validationStatus = false
              console.log("state returned false")


            }

          }
        )
        //other checks

      } else {
        console.log("UNHANDLED validate: KEY = " + key2validate)
      }

      return validationStatus
    }
  }

  let allGood = true
  // validate all personsInfo
  req.body.personsInfo.forEach(
    (person, personI) => {
      if (personI < req.body.peopleNum) {
        for (const [key, value] of Object.entries(person)) {

          validate(personI, key, true, req.body.personsInfo) ? null : allGood = false

        }
      }
    }
  )
  // validate
  console.log(req.body.eml)
  validate(-1, "pesky", true, req.body.personsInfo, null, req.body.pesky) ? null : allGood = false
  console.log(req.body.pesky)
  validate(-1, "eml", true, req.body.personsInfo, req.body.eml, req.body.pesky) ? null : allGood = false

  //TODO check if email exists and //TODO add error messages
  await knex("Accounts").select({ Email: 'Email' }).where('Email', req.body.eml).then(
    dbData => {
      if (dbData.length > 0) {
        console.log("Email already exists, add error to error message and send request back")
        res.send({ err: true, errMsg: "Email already exists.", errType: "eml" })
        allGood = false

      } else {
        if (debug) {
          console.log("Email was not found. Can be used for an account.")
        }
      }
    },
    err => {
      console.log(err);
      throw err;
    }
  )

  if (allGood) {
    //console.log("ALL IS GOOD!")
    //hash the plaintext
    const password = await bcrypt.hash(req.body.pesky, 10)

    knex("Accounts").insert({ "Email": req.body.eml, "Password": password }).then(

      //success
      accountIds => {

        if (debug) {
          // console.log(hash)
          // console.log(req.body.pesky)
          console.log("AccountId created is" + accountIds)
        }

        let clientsAdded = 0
        //adding each client info
        if (req.body.personsInfo) {
          req.body.personsInfo.forEach(
            person => {
              console.log("/Accounts/")
              console.log(person)

              if (person.fname.length > 0) {
                //add the client to the Clients table
                try {
                  knex("Clients").insert({ FistName: person.fname, LastName: person.lname, Phone1: person.telf, Phone2: person.telf2, Active: 0, Restrictions: 0, DietId: person.diet, SpcInst: 0, WeeklyMeal: person.weeklyMenu.join("") }).then(
                    (clientId) => {
                      console.log("DB returned")
                      console.log("Client ID is: " + clientId)
                      console.log(person)
                      //insert addrs and connect them to client
                      insertAddresses(clientId[0], person.addrs)

                      //insert Client into AccountClient to associate Client with the account being made
                      knex("AccountClient").insert({ ClientId: clientId[0], AccountId: accountIds[0] }).then(
                        succ => {
                          console.log("Successfuly connected client" + clientId[0] + " with account " + accountIds[0])
                          clientsAdded++;

                          console.log(clientsAdded)
                          console.log(req.body.personsInfo.length)
                          console.log(req.body.peopleNum)
                          if (clientsAdded === req.body.peopleNum) {
                            res.send({ accountId: accountIds[0] })
                          }

                        },
                        err => { console.log(err); }
                      )

                      // TODO upon fully registering a client, make sure each person's calendar is made

                    },
                    (err) => {
                      console.log("Caught error:")
                      console.log(err)
                    }
                  )
                } catch (err) {
                  console.log("Account was made but Client was not inserted. personsInfo comes in as 6 objects no matter what, so we need to check each object inside")
                  console.log(err)
                }
              }
            }
          );
        }



      },
      err => {
        console.log(err)
        throw err
      }
    )
    //make an account entry to Accounts and connect the request content to it
  }
  //add the new account

})

app.post('/export', (req, res) => {
  //call stored procedures

  // console.log("Exporting for Sun-Sat in week of:")
  console.log(req.body.startDate)
  console.log(req.body.endDate)

  // // breakfast only!!!
  // // give week 
  // var date = new Date(req.body.date)
  // console.log(date)

  // var monday = new Date(getThisMonday(date));

  // var sunday = new Date(monday)
  // sunday.setDate(monday.getDate() - 1)

  // var tuesday = new Date(monday)
  // tuesday.setDate(monday.getDate() + 1)

  // var wednesday = new Date(monday)
  // wednesday.setDate(monday.getDate() + 2)

  // var thursday = new Date(monday)
  // thursday.setDate(monday.getDate() + 3)

  // var friday = new Date(monday)
  // friday.setDate(monday.getDate() + 4)

  // var saturday = new Date(monday)
  // saturday.setDate(monday.getDate() + 5)

  // var week = [dateFormatSQL(sunday), dateFormatSQL(monday), dateFormatSQL(tuesday), dateFormatSQL(wednesday), dateFormatSQL(thursday), dateFormatSQL(friday), dateFormatSQL(saturday)]
  // console.log(week)

  // let startDate = week[0];
  // let endDate = week[6];
  //I need to give a StartDate and EndDate
  //BREAKFAST

  let startDate = req.body.startDate;
  let endDate = req.body.endDate;

  let breakfastCSV = getBreakfastLabels(startDate, endDate);
  let lunchCSV = getLunchLabels(startDate, endDate);
  let dinnerCSV = getDinnerLabels(startDate, endDate);
  let extraCSV = getExtraLabels(startDate, endDate);
  let snackCSV = getSnackLabels(startDate, endDate);

  const csvDropoffPath = "/home/pat/ACMEFood/label-maker/portable/csv-in"

  function writeOpenXML(err) {
    if (err) {
      console.log(err)
      throw err;
    }
    console.log("Starting dotnet process")
  }

  Promise.all([breakfastCSV, lunchCSV, dinnerCSV, extraCSV, snackCSV]).then(
    async (csvArr) => {
      // console.log(csvArr)

      const bfast = await fs.open(csvDropoffPath + "/" + "Breakfast-FROM-" + startDate + "-TO-" + endDate + ".csv", "w+")
      await bfast.writeFile(csvArr[0])
      await bfast.close();

      const lunch = await fs.open(csvDropoffPath + "/" + "Lunch-FROM-" + startDate + "-TO-" + endDate + ".csv", "w+")
      await lunch.writeFile(csvArr[1])
      await lunch.close()

      const dinner = await fs.open(csvDropoffPath + "/" + "Dinner-FROM-" + startDate + "-TO-" + endDate + ".csv", "w+")
      await dinner.writeFile(csvArr[2])
      await dinner.close()

      const extra = await fs.open(csvDropoffPath + "/" + "Extra-FROM-" + startDate + "-TO-" + endDate + ".csv", "w+")
      await extra.writeFile(csvArr[3])
      await extra.close()

      const snack = await fs.open(csvDropoffPath + "/" + "Snack-FROM-" + startDate + "-TO-" + endDate + ".csv", "w+")
      await snack.writeFile(csvArr[4])
      await snack.close()

      console.log("CSVs Written to", csvDropoffPath)

      exec("dotnet exec /home/pat/ACMEFood/label-maker/portable/openXMLParseNEdit.dll /home/pat/ACMEFood/label-maker/portable/csv-in /home/pat/ACMEFood/label-maker/portable/word-out",
        (err, stdout, stderr) => {
          if (err) {
            console.log(err)
            throw err;
          }
          else if (stderr) {
            console.log("CONSOLE STDERROR: " + stderr)
          } else {
            stdout = stdout.replaceAll("/\\n/gi", "")
            res.send(stdout.substring(0, stdout.length - 1))


          }
        }
      )


      //run CSVs through
      // res.send(csvArr)
    },
    (rejection) => {
      // console.log(rejection)
      console.log("Something was rejected:")
      throw rejection

    }
  )


  // toCSV()
  // writeCSVRow()



})

function getBreakfastLabels(startDate, endDate) {

  return new Promise((resolve, reject) => pool.execute(`SELECT "Breakfast" as Breakfast, C.FistName, C.LastName, C.DietId , S.BFast, S.Date        \
    ,D.DietId, D.DishDescription, D.Calories, D.Carbohydrates, D.Proteins, D.Fats\
    FROM ACMEFood.Clients C                                                         \
      INNER JOIN ACMEFood.Schedule S ON C.ClientId = S.ClientId                     \
      INNER JOIN ACMEFood.Dish D ON S.BFast = D.DishId                          \
    WHERE S.Date BETWEEN ? AND ?                                  \
    ORDER BY S.Date;`, [startDate, endDate], (err, dbD) => {
    // console.log(err)
    if (err) throw err;
    const csv = toCSV(dbD)
    resolve(csv)
  })
  )
}

function getLunchLabels(startDate, endDate) {
  return new Promise((resolve, reject) => pool.execute(`SELECT "Lunch" as Lunch, C.FistName, C.LastName, C.DietId , S.BFast, S.Date        \
    ,D.DietId, D.DishDescription, D.Calories, D.Carbohydrates, D.Proteins, D.Fats\
    FROM ACMEFood.Clients C                                                         \
      INNER JOIN ACMEFood.Schedule S ON C.ClientId = S.ClientId                     \
      INNER JOIN ACMEFood.Dish D ON S.Lunch = D.DishId                          \
    WHERE S.Date BETWEEN ? AND ?                                  \
    ORDER BY S.Date;`, [startDate, endDate], (err, dbD) => {
    // console.log(err)
    if (err) throw err;

    const csv = toCSV(dbD)
    resolve(csv)
  })
  )
}

function getDinnerLabels(startDate, endDate) {
  return new Promise((resolve, reject) => pool.execute(`SELECT "Dinner" as Dinner, C.FistName, C.LastName, C.DietId , S.BFast, S.Date        \
    ,D.DietId, D.DishDescription, D.Calories, D.Carbohydrates, D.Proteins, D.Fats\
    FROM ACMEFood.Clients C                                                         \
      INNER JOIN ACMEFood.Schedule S ON C.ClientId = S.ClientId                     \
      INNER JOIN ACMEFood.Dish D ON S.Dinner = D.DishId                          \
    WHERE S.Date BETWEEN ? AND ?                                  \
    ORDER BY S.Date;`, [startDate, endDate], (err, dbD) => {
    // console.log(err)
    if (err) throw err;
    const csv = toCSV(dbD)
    resolve(csv)
  })
  )

}

function getExtraLabels(startDate, endDate) {
  return new Promise((resolve, reject) => pool.execute(`SELECT "Extra" as Extra, C.FistName, C.LastName, C.DietId , S.BFast, S.Date        \
    ,D.DietId, D.DishDescription, D.Calories, D.Carbohydrates, D.Proteins, D.Fats\
    FROM ACMEFood.Clients C                                                         \
      INNER JOIN ACMEFood.Schedule S ON C.ClientId = S.ClientId                     \
      INNER JOIN ACMEFood.Dish D ON S.Extra = D.DishId                          \
    WHERE S.Date BETWEEN ? AND ?                                  \
    ORDER BY S.Date;`, [startDate, endDate], (err, dbD) => {
    // console.log(err)
    if (err) throw err;
    const csv = toCSV(dbD)
    resolve(csv)
  })
  )

}

function getSnackLabels(startDate, endDate) {
  return new Promise((resolve, reject) => pool.execute(`SELECT "Snack" as Snack, C.FistName, C.LastName, C.DietId , S.BFast, S.Date        \
    ,D.DietId, D.DishDescription, D.Calories, D.Carbohydrates, D.Proteins, D.Fats   \
    FROM ACMEFood.Clients C                                                         \
      INNER JOIN ACMEFood.Schedule S ON C.ClientId = S.ClientId                     \
      INNER JOIN ACMEFood.Dish D ON S.Snack = D.DishId                               \
    WHERE S.Date BETWEEN ? AND ?                                                        \
    ORDER BY S.Date;`, [startDate, endDate], (err, dbD) => {
    // console.log(err)
    if (err) throw err;
    const csv = toCSV(dbD)
    resolve(csv)
  })
  )
}

function toCSV(data, headerOrder) {

  let csv = ""
  let csvHeaders = []

  //set headers in order specified
  if (headerOrder) {

    for (const header in headerOrder) {
      csv += header + ","
      csvHeaders.push(header)

    }

    csv += "\r\n"

  } else {
    //set headers in whatever order they come up this first time
    for (const key in data[0]) {
      csv += key + ","
      csvHeaders.push(key)
    }

    csv += "\r\n"

  }

  data.forEach(
    (obj) => {
      //set data
      csvHeaders.forEach(
        (orderedProp, index) => {
          if (orderedProp === "Date") {
            obj[orderedProp] = dateFormatSQL(obj[orderedProp])
          }
          csv += obj[orderedProp] + (index + 1 === csvHeaders.length ? "" : ",")

        }
      )
      csv += "\r\n"

    }
  )
  return csv
}


//prepared statements here
app.post('/setClient', (req, res) => {
  var clientInfo = req.body.basic

  var basicQ = "INSERT INTO Clients (FistName, LastName, Phone1, Restrictions, DietId, SpcInst) VALUES ('" + clientInfo["fname"] + "','" + clientInfo["lname"] + "','" + clientInfo["num1"] + "','1','" + clientInfo["diet"] + "','1')"

  knex("Clients").insert({ FistName: clientInfo.fname, LastName: clientInfo.lname, Phone1: clientInfo.num1, Phone2: clientInfo.num1, Active: 0, Restrictions: 0, DietId: clientInfo.diet, SpcInst: 0, WeeklyMeal: clientInfo.weeklyMeals.join("") }).then(
    (dbD) => {
      console.log("Client ID for the new client is:")
      console.log(dbD[0])
      knex("AccountClient").insert({ ClientId: dbD[0], AccountId: clientInfo["accountId"] }).then(
        (_) => {
          res.send(dbD)
        },
        (err) => {
          console.log("Error in SetClient setting AccountClient")
          console.log(err)
        }
      )

    },
    (err) => {
      console.log("Error in SetClient")
      console.log(err)
    }
  )

  ////////console.log(basicQ)
})

app.get('/testbackend', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from('<h2>Test String</h2>'));
})

//TODO: prepared statements here
app.post('/getClientsByName', (req, res) => {

  if (req.body.fname) {
    var fname = req.body.fname[0].toUpperCase() + req.body.fname.slice(1)
    var charsToQ = "'" + fname + "%'"
    const query = "SELECT * FROM Clients WHERE FistName LIKE " + charsToQ

    const q = submit(query, res)
  }
  else {
    // is this fine to leave without sending something back to axios? patched in frontend anyways
    ////////console.log("Query is empty")
  }
})

app.get('/getDietTypes', (req, res) => {

  const query = "SELECT * FROM Diet";

  pool.query(query, (e, dbData) => {
    res.send(dbData)
    return res
  })
})

app.get('/getRestrictionTypes', (req, res) => {

  const query = "SELECT * FROM Restriction";

  const q = pool.query(query, (e, dbData) => {
    res.send(dbData)
    return res
  })
})

app.post('/getEachDaysDishes', (req, res) => {
  if (req.body.date) {

    var date = new Date(req.body.date)

    var monday = new Date(getThisMonday(date));

    var sunday = new Date(monday)
    sunday.setDate(monday.getDate() - 1)

    var tuesday = new Date(monday)
    tuesday.setDate(monday.getDate() + 1)

    var wednesday = new Date(monday)
    wednesday.setDate(monday.getDate() + 2)

    var thursday = new Date(monday)
    thursday.setDate(monday.getDate() + 3)

    var friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)

    var saturday = new Date(monday)
    saturday.setDate(monday.getDate() + 5)

    var week = [dateFormatSQL(sunday), dateFormatSQL(monday), dateFormatSQL(tuesday), dateFormatSQL(wednesday), dateFormatSQL(thursday), dateFormatSQL(friday), dateFormatSQL(saturday)]
    console.log(week)
    const q = `SELECT *, (SELECT DishDescription FROM Dish WHERE DishId = Menus.BFast01) as BFastDesc, 
              (SELECT DishDescription FROM Dish WHERE DishId = Menus.Lunch) as LunchDesc, 
              (SELECT DishDescription FROM Dish WHERE DishId = Menus.Dinner) as DinnerDesc, 
              (SELECT DishDescription FROM Dish WHERE DishId = Menus.Extra1) as ExtraDesc, 
              (SELECT DishDescription FROM Dish WHERE DishId = Menus.Snack) as SnackDesc 
              FROM Menus 
              WHERE (MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=?) ORDER BY MenuDate`

    pool.execute(q, week, (err, results) => {

      if (err) {
        console.log(err)
        return
      }
      console.log(results)
      let toReturn = [[], [], [], [], [], [], []]

      results.forEach(
        eachMealDay => {

          eachMealDay["MenuDate"] = dateFormatSQL(eachMealDay["MenuDate"])

          if (eachMealDay["MenuDate"] === week[0]) {
            if (!toReturn[0].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[0].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[0].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[0].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[0].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[0].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[0].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[0].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[0].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[0].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[1]) {
            if (!toReturn[1].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[1].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[1].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[1].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[1].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[1].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[1].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[1].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[1].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[1].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[2]) {
            if (!toReturn[2].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[2].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[2].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[2].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[2].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[2].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[2].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[2].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[2].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[2].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[3]) {
            if (!toReturn[3].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[3].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[3].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[3].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[3].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[3].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[3].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[3].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[3].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[3].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[4]) {
            if (!toReturn[4].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[4].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[4].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[4].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[4].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[4].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[4].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[4].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[4].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[4].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[5]) {
            if (!toReturn[5].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[5].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[5].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[5].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[5].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[5].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[5].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[5].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[5].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[5].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          } else if (eachMealDay["MenuDate"] === week[6]) {
            if (!toReturn[6].some(function (o) { return o["DishId"] === eachMealDay["BFast01"]; })) {
              toReturn[6].push({ DishId: eachMealDay["BFast01"], DishDescription: eachMealDay["BFastDesc"] })
            }
            if (!toReturn[6].some(function (o) { return o["DishId"] === eachMealDay["Lunch"]; })) {
              toReturn[6].push({ DishId: eachMealDay["Lunch"], DishDescription: eachMealDay["LunchDesc"] })
            }
            if (!toReturn[6].some(function (o) { return o["DishId"] === eachMealDay["Dinner"]; })) {
              toReturn[6].push({ DishId: eachMealDay["Dinner"], DishDescription: eachMealDay["DinnerDesc"] })
            }
            if (!toReturn[6].some(function (o) { return o["DishId"] === eachMealDay["Extra1"]; })) {
              toReturn[6].push({ DishId: eachMealDay["Extra1"], DishDescription: eachMealDay["ExtraDesc"] })
            }
            if (!toReturn[6].some(function (o) { return o["DishId"] === eachMealDay["Snack"]; })) {
              toReturn[6].push({ DishId: eachMealDay["Snack"], DishDescription: eachMealDay["SnackDesc"] })
            }
          }
        }
      )
      console.log(toReturn)
      res.send(toReturn)
    })
  } else {
    res.send("")
  }
})

app.post('/getDishTypes', (req, res) => {

  var dietId = req.body.dietId
  const query = "SELECT * FROM Dish WHERE DietId='" + dietId + "'";
  console.log(dietId)
  const q = pool.query(query, (e, dbData) => {
    res.send(dbData)
    return res
  })
})



app.get("/getScheduleConflicts", (req, res) => {

  // const query = "SELECT * FROM Schedule WHERE BFast='' OR Lunch='' OR Dinner='' OR Extra='' OR Snack='' ORDER BY Date"

  knex("Schedule").select().orWhere("BFast", "").orWhere("Lunch", "").orWhere("Dinner", "").orWhere("Extra", "").orWhere("Snack", "").orderBy("Date").then(
    (dbData) => {
      console.log(dbData)
      var counter = 0
      let conflictArr = []

      if (dbData.length > 0) {
        dbData.forEach(
          (schRow, index) => {

            let dishLabels = { "Date": schRow["Date"].getUTCFullYear() + "/" + (parseInt(schRow["Date"].getUTCMonth()) + 1) + "/" + schRow["Date"].getUTCDate() }

            //get Client Name and Client WeeklyMeal

            let clientQ = "SELECT * FROM Clients WHERE ClientId='" + schRow["ClientId"] + "'"
            //check if client's schedule is complete (does not get sent) or incomplete (gets sent)
            knex("Clients").select().where("ClientId", schRow["ClientId"]).then(
              (clientData) => {
                var client = clientData[0]["FistName"] + " " + clientData[0]["LastName"]
                dishLabels["ClientId"] = schRow["ClientId"]
                dishLabels["ClientName"] = client
                var weeklyMeals = clientData[0]["WeeklyMeal"].split("")
                //TRUE means everything is in order (complete) and does not need to be added, FALSE means that meal is a conflict because they NEED to have a meal there
                let mustBFast = schRow["BFast"] === "" || schRow["BFast"] === undefined ? (parseInt(weeklyMeals[(0) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
                let mustLunch = schRow["Lunch"] === "" || schRow["Lunch"] === undefined ? (parseInt(weeklyMeals[(1) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
                let mustDinner = schRow["Dinner"] === "" || schRow["Dinner"] === undefined ? (parseInt(weeklyMeals[(2) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
                let mustExtra = schRow["Extra"] === "" || schRow["Extra"] === undefined ? (parseInt(weeklyMeals[(3) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
                let mustSnack = schRow["Snack"] === "" || schRow["Snack"] === undefined ? (parseInt(weeklyMeals[(4) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true

                ////console.log(weeklyMeals[ (0) + (new Date(schRow["Date"]).getDay() * allDays.length)])

                if (mustBFast & mustLunch & mustDinner & mustExtra & mustSnack) {
                  ////console.log("No problems with client", client, clientData[0]["ClientId"], new Date(schRow["Date"]).getDay())
                  counter += 1

                  if (counter === dbData.length) {
                    res.send(conflictArr)
                  }

                } else {
                  //some meals were supposed to be included for that row of schedule but their restrictions meant they were not added to this person's calendar 
                  // (see app.post("/setWeeklyMenus") where this interaction happens)


                  // dishLabels["BFast"] = schRow["BFast"]
                  // dishLabels["Lunch"] = schRow["Lunch"]
                  // dishLabels["Dinner"] = schRow["Dinner"]
                  // dishLabels["Extra"] = schRow["Extra"]
                  // dishLabels["Snack"] = schRow["Snack"]
                  knex("AccountClient").select("AccountId").where("ClientId", schRow["ClientId"]).then(
                    accountArr => {
                      dishLabels["AccountId"] = accountArr[0]["AccountId"]

                      knex("Dish").select("DishDescription").where("DishId", schRow["BFast"]).then(
                        (dbD) => {

                          if (dbD[0]) {
                            dishLabels["BFast"] = dbD[0]["DishDescription"]
                          } else {
                            dishLabels["BFast"] = ""
                          }

                          knex("Dish").select("DishDescription").where("DishId", schRow["Lunch"]).then(
                            (dbD) => {

                              if (dbD[0]) {
                                dishLabels["Lunch"] = dbD[0]["DishDescription"]
                              } else {
                                dishLabels["Lunch"] = ""
                              }

                              knex("Dish").select("DishDescription").where("DishId", schRow["Dinner"]).then(
                                (dbD) => {

                                  if (dbD[0]) {
                                    dishLabels["Dinner"] = dbD[0]["DishDescription"]
                                  } else {
                                    dishLabels["Dinner"] = ""
                                  }

                                  knex("Dish").select("DishDescription").where("DishId", schRow["Extra"]).then(
                                    (dbD) => {

                                      if (dbD[0]) {
                                        dishLabels["Extra"] = dbD[0]["DishDescription"]
                                      } else {
                                        dishLabels["Extra"] = ""
                                      }

                                      knex("Dish").select("DishDescription").where("DishId", schRow["Snack"]).then(
                                        (dbD) => {

                                          if (dbD[0]) {
                                            dishLabels["Snack"] = dbD[0]["DishDescription"]
                                          } else {
                                            dishLabels["Snack"] = ""
                                          }

                                          counter += 1


                                          conflictArr.push(dishLabels)


                                          if (counter === dbData.length) {
                                            console.log(conflictArr)

                                            res.send(conflictArr)
                                          }
                                        },
                                        (err) => {
                                          console.log(err)
                                        }
                                      )
                                    },
                                    (err) => {
                                      console.log(err)
                                    }
                                  )
                                },
                                (err) => {
                                  console.log(err)
                                }
                              )
                            },
                            (err) => {
                              console.log(err)
                            }
                          )
                        },
                        (err) => {
                          console.log(err)
                        }
                      )


                    },
                    err => {
                      throw err
                    }
                  )


                  //getting the names of each row's Ids
                  //TODO wrap all this shit up in one SQL statement (SELECT and AS)
                  var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["BFast"] + "'"

                }
              },
              (err) => {
                console.log(err)
              }
            )
          }
        )
      } else {
        res.send([])
      }




      // pool.query(clientQ, (err, clientData) => {

      //   var client = clientData[0]["FistName"] + " " + clientData[0]["LastName"]
      //   dishLabels["ClientId"] = schRow["ClientId"]
      //   dishLabels["ClientName"] = client

      //   var weeklyMeals = clientData[0]["WeeklyMeal"].split("")
      //   //TRUE means everything is in order (complete) and does not need to be added, FALSE means that meal is a conflict because they NEED to have a meal there
      //   let mustBFast = schRow["BFast"] === "" || schRow["BFast"] === undefined ? (parseInt(weeklyMeals[(0) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
      //   let mustLunch = schRow["Lunch"] === "" || schRow["Lunch"] === undefined ? (parseInt(weeklyMeals[(1) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
      //   let mustDinner = schRow["Dinner"] === "" || schRow["Dinner"] === undefined ? (parseInt(weeklyMeals[(2) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
      //   let mustExtra = schRow["Extra"] === "" || schRow["Extra"] === undefined ? (parseInt(weeklyMeals[(3) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
      //   let mustSnack = schRow["Snack"] === "" || schRow["Snack"] === undefined ? (parseInt(weeklyMeals[(4) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true

      //   ////console.log(weeklyMeals[ (0) + (new Date(schRow["Date"]).getDay() * allDays.length)])

      //   if (mustBFast & mustLunch & mustDinner & mustExtra & mustSnack) {

      //     ////console.log("No problems with client", client, clientData[0]["ClientId"], new Date(schRow["Date"]).getDay())


      //     counter += 1

      //     if (counter === dbData.length) {
      //       res.send(conflictArr)
      //     }

      //     return

      //   } else {

      //     // dishLabels["BFast"] = schRow["BFast"]
      //     // dishLabels["Lunch"] = schRow["Lunch"]
      //     // dishLabels["Dinner"] = schRow["Dinner"]
      //     // dishLabels["Extra"] = schRow["Extra"]
      //     // dishLabels["Snack"] = schRow["Snack"]

      //     var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["BFast"] + "'"

      //     pool.query(getDishQ, (err, dbD) => {

      //       if (dbD[0]) {
      //         dishLabels["BFast"] = dbD[0]["DishDescription"]
      //       } else {
      //         dishLabels["BFast"] = ""
      //       }


      //       var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Lunch"] + "'"

      //       pool.query(getDishQ, (err, dbD) => {

      //         if (dbD[0]) {
      //           dishLabels["Lunch"] = dbD[0]["DishDescription"]
      //         } else {
      //           dishLabels["Lunch"] = ""
      //         }

      //         var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Dinner"] + "'"

      //         pool.query(getDishQ, (err, dbD) => {

      //           if (dbD[0]) {
      //             dishLabels["Dinner"] = dbD[0]["DishDescription"]
      //           } else {
      //             dishLabels["Dinner"] = ""
      //           }

      //           var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Extra"] + "'"

      //           pool.query(getDishQ, (err, dbD) => {

      //             if (dbD[0]) {
      //               dishLabels["Extra"] = dbD[0]["DishDescription"]
      //             } else {
      //               dishLabels["Extra"] = ""
      //             }

      //             var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Snack"] + "'"

      //             pool.query(getDishQ, (err, dbD) => {

      //               if (dbD[0]) {
      //                 dishLabels["Snack"] = dbD[0]["DishDescription"]
      //               } else {
      //                 dishLabels["Snack"] = ""
      //               }
      //               counter += 1

      //               conflictArr.push(dishLabels)
      //               if (counter === dbData.length) {
      //                 ////console.log(conflictArr)
      //                 res.send(conflictArr)

      //               }
      //             })
      //           })
      //         })
      //       })
      //     })
      //   }
      // })

    },
    (err) => {
      console.log(err)
    }
  )


  // const q = pool.query(query, (e, dbData) => {

  //   var counter = 0
  //   let conflictArr = []

  //   dbData.forEach(
  //     (schRow, index) => {

  //       let dishLabels = { "Date": schRow["Date"].getUTCFullYear() + "/" + (parseInt(schRow["Date"].getUTCMonth()) + 1) + "/" + schRow["Date"].getUTCDate() }

  //       //get Client Name and Client WeeklyMeal

  //       let clientQ = "SELECT * FROM Clients WHERE ClientId='" + schRow["ClientId"] + "'"
  //       //check if client's schedule is complete (does not get sent) or incomplete (gets sent)

  //       pool.query(clientQ, (err, clientData) => {

  //         var client = clientData[0]["FistName"] + " " + clientData[0]["LastName"]
  //         dishLabels["ClientId"] = schRow["ClientId"]
  //         dishLabels["ClientName"] = client

  //         var weeklyMeals = clientData[0]["WeeklyMeal"].split("")
  //         //TRUE means everything is in order (complete) and does not need to be added, FALSE means that meal is a conflict because they NEED to have a meal there
  //         let mustBFast = schRow["BFast"] === "" || schRow["BFast"] === undefined ? (parseInt(weeklyMeals[(0) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
  //         let mustLunch = schRow["Lunch"] === "" || schRow["Lunch"] === undefined ? (parseInt(weeklyMeals[(1) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
  //         let mustDinner = schRow["Dinner"] === "" || schRow["Dinner"] === undefined ? (parseInt(weeklyMeals[(2) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
  //         let mustExtra = schRow["Extra"] === "" || schRow["Extra"] === undefined ? (parseInt(weeklyMeals[(3) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true
  //         let mustSnack = schRow["Snack"] === "" || schRow["Snack"] === undefined ? (parseInt(weeklyMeals[(4) + (new Date(schRow["Date"]).getUTCDay() * allMeals.length)]) > 0 ? false : true) : true

  //         ////console.log(weeklyMeals[ (0) + (new Date(schRow["Date"]).getDay() * allDays.length)])

  //         if (mustBFast & mustLunch & mustDinner & mustExtra & mustSnack) {

  //           ////console.log("No problems with client", client, clientData[0]["ClientId"], new Date(schRow["Date"]).getDay())


  //           counter += 1

  //           if (counter === dbData.length) {
  //             res.send(conflictArr)
  //           }

  //           return

  //         } else {

  //           // dishLabels["BFast"] = schRow["BFast"]
  //           // dishLabels["Lunch"] = schRow["Lunch"]
  //           // dishLabels["Dinner"] = schRow["Dinner"]
  //           // dishLabels["Extra"] = schRow["Extra"]
  //           // dishLabels["Snack"] = schRow["Snack"]

  //           var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["BFast"] + "'"

  //           pool.query(getDishQ, (err, dbD) => {

  //             if (dbD[0]) {
  //               dishLabels["BFast"] = dbD[0]["DishDescription"]
  //             } else {
  //               dishLabels["BFast"] = ""
  //             }


  //             var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Lunch"] + "'"

  //             pool.query(getDishQ, (err, dbD) => {

  //               if (dbD[0]) {
  //                 dishLabels["Lunch"] = dbD[0]["DishDescription"]
  //               } else {
  //                 dishLabels["Lunch"] = ""
  //               }

  //               var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Dinner"] + "'"

  //               pool.query(getDishQ, (err, dbD) => {

  //                 if (dbD[0]) {
  //                   dishLabels["Dinner"] = dbD[0]["DishDescription"]
  //                 } else {
  //                   dishLabels["Dinner"] = ""
  //                 }

  //                 var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Extra"] + "'"

  //                 pool.query(getDishQ, (err, dbD) => {

  //                   if (dbD[0]) {
  //                     dishLabels["Extra"] = dbD[0]["DishDescription"]
  //                   } else {
  //                     dishLabels["Extra"] = ""
  //                   }

  //                   var getDishQ = "SELECT DishDescription FROM Dish WHERE DishId='" + schRow["Snack"] + "'"

  //                   pool.query(getDishQ, (err, dbD) => {

  //                     if (dbD[0]) {
  //                       dishLabels["Snack"] = dbD[0]["DishDescription"]
  //                     } else {
  //                       dishLabels["Snack"] = ""
  //                     }
  //                     counter += 1

  //                     conflictArr.push(dishLabels)
  //                     if (counter === dbData.length) {
  //                       ////console.log(conflictArr)
  //                       res.send(conflictArr)

  //                     }
  //                   })
  //                 })
  //               })
  //             })
  //           })
  //         }
  //       })
  //     })
  // })
})

app.post("/getRestDescById", (req, res) => {
  var restId = req.body.restId
  ////////console.log("Getting Restriction Description from ID:" + restId)

  const q = "SELECT RestDescription FROM Restriction WHERE RestId='" + restId + "'"
  pool.query(q, (err, dbD) => {
    //send first result
    res.send(dbD[0])
  })
})

app.post("/getDishDescById", (req, res) => {
  var dishId = req.body.dishId
  // ////////console.log("Getting Dish Description from ID:" + dishId)

  const q = "SELECT * FROM Dish WHERE DishId='" + dishId + "'"
  pool.query(q, (err, dbD) => {
    //send first result
    res.send(dbD[0])
  })
})

app.get('/stats', (req, res) => {


  /* 
  
  res.data = {
    totalMeals: x,
    dailyMealCounts: [{"sunday": [x: {total: 13, description: DishDescription}, y: {total: 16, description: DishDescription}, etc...]}, {"monday": [...]}, etc...]
    clientLabels: [{ClientName: "xxxx xxxx", 
                    "DeliveryAddress": Schedule.AddrDesc, 
                    "Phone Number": "xxx-xxx-xxxx", 
                    "MealDesc":"xxxxxx with xxxxx", 
                    "MealTime": "[BFast || Lunch || Dinner ||... etc]"}...]
  }


  */
})

app.post('/setWeeklyMenus', (req, res) => {
  var menus = req.body.weeklyMenus
  var date = req.body.date

  //1 - setting up variables for the queries
  //get week
  var monday = new Date(getThisMonday(date));

  var sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)
  sunday = dateFormatSQL(sunday)

  var tuesday = new Date(monday)
  tuesday.setDate(monday.getDate() + 1)
  tuesday = dateFormatSQL(tuesday)

  var wednesday = new Date(monday)
  wednesday.setDate(monday.getDate() + 2)
  wednesday = dateFormatSQL(wednesday)

  var thursday = new Date(monday)
  thursday.setDate(monday.getDate() + 3)
  thursday = dateFormatSQL(thursday)

  var friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  friday = dateFormatSQL(friday)

  var saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)
  saturday = dateFormatSQL(saturday)

  monday = dateFormatSQL(monday)
  const thisWeek = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
  var conflicts = []

  menus.forEach(
    (diet) => {

      //Does this menu already exist for this day?
      const findMenuQ = "SELECT * FROM Menus WHERE DietId='" + diet["key"] + "' AND (MenuDate='" + monday + "' OR MenuDate='" + tuesday + "' OR MenuDate='" + wednesday + "' OR MenuDate='" + thursday + "' OR MenuDate='" + friday + "' OR MenuDate='" + saturday + "' OR MenuDate='" + sunday + "') ORDER BY MenuDate"

      //transpose values of menu/calendars so rows are days and columns are meals of the day
      const weeklyMenu = diet["calendar"][0].map((_, colIndex) => diet["calendar"].map(row => row[colIndex]));
      pool.query(findMenuQ,
        (err, oldStoredMenu) => {

          //set Menus 
          weeklyMenu.forEach(
            (mealArr, day) => {

              // DECLARING VARIABLES WE WILL NEED
              let menuDate = thisWeek[day]
              let breakfast = mealArr[0]["id"] ? mealArr[0]["id"] : ""
              let lunch = mealArr[1]["id"] ? mealArr[1]["id"] : ""
              let dinner = mealArr[2]["id"] ? mealArr[2]["id"] : ""
              let extra = mealArr[3]["id"] ? mealArr[3]["id"] : ""
              let snack = mealArr[4]["id"] ? mealArr[4]["id"] : ""
              let extra2 = mealArr[5]["id"] ? mealArr[5]["id"] : ""


              //menu exists for this day (UPDATE Menus)
              if (oldStoredMenu.length > 0) {
                const menuQuery = `UPDATE Menus SET BFast01='${breakfast}', Lunch='${lunch}', Dinner='${dinner}', Extra1='${extra}', Snack='${snack}', Extra2='${extra2}' WHERE MenuDate='${menuDate}' AND DietId='${diet["key"]}'`
                pool.query(menuQuery, (err) => { console.log(err) })
              }
              //menu does not exist for this day (INSERT INTO Menus)
              else {
                const menuQuery = `INSERT INTO Menus (MenuDate, DietId, BFast01, Lunch, Dinner, Extra1, Snack, Extra2) VALUES ('${menuDate}','${diet["key"]}','${breakfast}','${lunch}','${dinner}','${extra}','${snack}','${extra2}')`
                console.log(menuQuery)
                //for each day, we set a menu query
                pool.query(menuQuery, (err) => { if (err) console.log(err) })
              }
            }
          )

          //set clients Schedule for this diet
          const clientsListQ = "SELECT ClientId, WeeklyMeal FROM Clients WHERE DietId='" + diet.key + "'"
          pool.query(clientsListQ,
            (err, clientList) => {
              if (err) {
                console.log(err)
                return
              }

              //for each client
              clientList.forEach(
                (client) => {



                  //find client's restrictions and diet
                  const clientDietAndRestrictionsQ = `
                    SELECT
                      CL.ClientId
                      ,CONCAT(CL.FistName," ",CL.LastName) as ClientFullName
                      ,CL.Phone1, CL.WeeklyMeal
                      ,AD.AddrId
                      ,AD.StreetNo
                      ,AD.StreetName as StreetName
                      ,AD.Apt as Apt
                      ,AD.City
                      ,AD.ZipCode
                      ,R.RestId
                      ,R.RestDescription
                      ,CA.Details
                      FROM ACMEFood.Clients CL
                      INNER JOIN ACMEFood.ClientAddress CA ON CL.ClientId = CA.ClientId
                      LEFT JOIN ACMEFood.Address AD ON CA.AddrId = AD.AddrId
                      LEFT JOIN ACMEFood.RestClient RC ON CL.ClientId = RC.ClientId
                      LEFT JOIN ACMEFood.Restriction R ON R.RestId = RC.RestId WHERE CL.ClientId='${client.ClientId}' AND CA.IsPrimary='1' AND RC.ExpiredOn is NULL
                    `

                  pool.query(clientDietAndRestrictionsQ,
                    (err, clientRestAddrInfo) => {

                      //we have all the information for this client, his weeklyMeals 
                      weeklyMenu.forEach(
                        (mealArr, day) => {
                          //we do 1 or more (depending on topLoopCount) SQL queries per day
                          let scheduleDay = thisWeek[day]

                          console.log(`SELECT * FROM Schedule WHERE ClientId='${client.ClientId}' AND Date='${scheduleDay}'`)
                          //checking whether this schedule for this client and day exists
                          pool.query(`SELECT * FROM Schedule WHERE ClientId='${client.ClientId}' AND Date='${scheduleDay}'`, (err, currentScheduleDay) => {
                            //do they have this date in their schedule, if so (UPDATE)
                            if (currentScheduleDay.length > 0) {

                              let sqlDishStrings = []

                              //check whether the restrictions of the client match the restrictions declared for this dish
                              //mealArr where 0 = breakfast, 1 = lunch, and so on
                              mealArr.forEach(
                                (dish, mealTime) => {

                                  let dishString = dish["id"] ? dish["id"] : ""

                                  clientRestAddrInfo.forEach((clientInfo) => {
                                    if (clientInfo["RestId"]) {
                                      if (dish.rest.find((restObj) => { if (restObj["RestId"] === clientInfo["RestId"]) return true; else return false })) {
                                        dishString = ""
                                      }
                                    }
                                  })

                                  sqlDishStrings.push(dishString)
                                }
                              )

                              currentScheduleDay.forEach(
                                (entryForDate, i) => {
                                  //before updating this meal, check that the current value in the schedule is the same as the value in the menu, then change it, otherwise leave the schedule value
                                  //the logic here is that we want to keep values that do not match the menus because they are custom values, put there by Patricia or a customer
                                  sqlDishStrings[0] = (oldStoredMenu[day]["BFast01"] === currentScheduleDay[i]["BFast"] || currentScheduleDay[i]["BFast"] === "") ? sqlDishStrings[0] : currentScheduleDay[i]["BFast"]
                                  sqlDishStrings[1] = (oldStoredMenu[day]["Lunch"] === currentScheduleDay[i]["Lunch"] || currentScheduleDay[i]["Lunch"] === "") ? sqlDishStrings[1] : currentScheduleDay[i]["Lunch"]
                                  sqlDishStrings[2] = (oldStoredMenu[day]["Dinner"] === currentScheduleDay[i]["Dinner"] || currentScheduleDay[i]["Dinner"] === "") ? sqlDishStrings[2] : currentScheduleDay[i]["Dinner"]
                                  sqlDishStrings[3] = (oldStoredMenu[day]["Extra1"] === currentScheduleDay[i]["Extra"] || currentScheduleDay[i]["Extra"] === "") ? sqlDishStrings[3] : currentScheduleDay[i]["Extra"]
                                  sqlDishStrings[4] = (oldStoredMenu[day]["Snack"] === currentScheduleDay[i]["Snack"] || currentScheduleDay[i]["Snack"] === "") ? sqlDishStrings[4] : currentScheduleDay[i]["Snack"]

                                  let q = `UPDATE Schedule SET BFast='${sqlDishStrings[0]}', Lunch='${sqlDishStrings[1]}', Dinner='${sqlDishStrings[2]}', Extra='${sqlDishStrings[3]}', Snack='${sqlDishStrings[4]}'  
                                          WHERE ClientId='${client.ClientId}' AND Date='${scheduleDay}' AND EntryId='${entryForDate["EntryId"]}'`
                                  console.log(q)

                                  pool.query(q)
                                }
                              )

                            }

                            //they do not have this date in their schedule (INSERT INTO)
                            else {

                              let mealCountDict = {}

                              function getTopMealCount(expectedClientMeals) {
                                //for this client, find out the max loop count in each meal of this person
                                let topLoopCount = 1
                                let totalMeals = 5

                                const clientMealWeek = expectedClientMeals.substring(day * totalMeals, day * totalMeals + totalMeals) //this client's meals for this week

                                mealCountDict[0] = parseInt(clientMealWeek.charAt(0))
                                mealCountDict[1] = parseInt(clientMealWeek.charAt(1))
                                mealCountDict[2] = parseInt(clientMealWeek.charAt(2))
                                mealCountDict[3] = parseInt(clientMealWeek.charAt(3))
                                mealCountDict[4] = parseInt(clientMealWeek.charAt(4))

                                for (var i = 0; i < clientMealWeek.length; i++) {
                                  const currentMealAmount = parseInt(clientMealWeek.charAt(i))

                                  if (currentMealAmount > topLoopCount) {
                                    topLoopCount = currentMealAmount
                                  }
                                }

                                return topLoopCount
                              }

                              let topLoopCount = getTopMealCount(client["WeeklyMeal"]);

                              console.log(mealCountDict)
                              // make SQL queries for this day's meal as many times as this client's weeklyMeal says
                              //we do 1 or more (depending on topLoopCount) SQL queries per day
                              for (var i = 1; i <= topLoopCount; i++) {

                                //each day will have a few records
                                let sqlDishStrings = []

                                //check whether the restrictions of the client match the restrictions declared for this dish
                                mealArr.forEach(
                                  //mealTime where 0 = breakfast, 1 = lunch, and so on
                                  (dish, mealTime) => {

                                    let dishString = dish["id"] ? dish["id"] : ""

                                    clientRestAddrInfo.forEach((clientInfo) => {
                                      if (clientInfo["RestId"]) {
                                        if (dish.rest.find((restObj) => { if (restObj["RestId"] === clientInfo["RestId"]) return true; else return false })) {
                                          dishString = ""
                                        }
                                      }
                                    })


                                    //check whether this is the time this person said they wanted to eat, and whether they wanted to eat it this many times
                                    if (mealCountDict[mealTime] <= 0) {
                                      dishString = ""
                                    }

                                    mealCountDict[mealTime]--

                                    sqlDishStrings.push(dishString)
                                  }
                                )

                                let q = `INSERT INTO Schedule (Date, ClientId, BFast, Lunch, Dinner, Extra, Snack, AddrId) VALUES 
                                ('${scheduleDay}', '${client.ClientId}', '${sqlDishStrings[0]}','${sqlDishStrings[1]}','${sqlDishStrings[2]}','${sqlDishStrings[3]}','${sqlDishStrings[4]}', '${clientRestAddrInfo[0]["AddrId"]}')`
                                console.log(q)
                                pool.query(q)
                              }
                            } // end of "for this day, write some sql queries"
                          })
                          //check whether the records for this day exist, if they do exist:
                          // - UPDATE each record that appeared
                          //if they do not exist:
                          // insert as many as the for-loop below 
                        }
                      )

                      if (err) {
                        console.log(err)
                        return
                      }
                      // checks whether restrictions or this meal apply to this person at this time

                    })
                }
              )
            }
          )
        }
      )
    }) //end of all menus and schedule related queries

  res.send("Processing callbacks...")
}) //  app.post end


app.post('/getWeekMenu', (req, res) => {
  ////////console.log("Processing /getWeekMenu...")
  var date = new Date(req.body.date)

  var monday = new Date(getThisMonday(date));

  var sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)

  var tuesday = new Date(monday)
  tuesday.setDate(monday.getDate() + 1)

  var wednesday = new Date(monday)
  wednesday.setDate(monday.getDate() + 2)

  var thursday = new Date(monday)
  thursday.setDate(monday.getDate() + 3)

  var friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)

  var saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)


  var week = [dateFormatSQL(monday), dateFormatSQL(tuesday), dateFormatSQL(wednesday), dateFormatSQL(thursday), dateFormatSQL(friday), dateFormatSQL(saturday), dateFormatSQL(sunday)]
  var dietId = req.body.dietId



  var q = `SELECT *, (SELECT DishDescription FROM Dish WHERE DishId = Menus.BFast01) as BFastDesc, (SELECT DishDescription FROM Dish WHERE DishId = Menus.Lunch) as LunchDesc, (SELECT DishDescription FROM Dish WHERE DishId = Menus.Dinner) as DinnerDesc, (SELECT DishDescription FROM Dish WHERE DishId = Menus.Extra1) as ExtraDesc, (SELECT DishDescription FROM Dish WHERE DishId = Menus.Snack) as SnackDesc FROM Menus WHERE (MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=? OR MenuDate=?) AND DietId='${dietId}' ORDER BY MenuDate`

  console.log(q)

  pool.execute(q, week, (err, dbD) => {
    if (err) {
      console.log(err)

    }
    console.log("LOADING MENU:", dbD)
    res.send(dbD)
  })

})


app.post('/getAccount', (req, res) => {
  //update cookie because, i need an indicator

  var acctId = req.body.accountId

  console.log(`accessing data for @${new Date()}`)
  console.log(acctId)

  knex("AccountClient").select("ClientId").where("AccountId", acctId).orderBy('ClientId', 'desc').then(
    (succ) => {

      let personsInfo = []
      console.log(succ)
      succ.forEach(
        (dataPacket) => {
          console.log(dataPacket)
          knex("Clients").select(["ClientId", "FistName", "LastName"]).where("ClientId", dataPacket["ClientId"]).then(
            clientInfo => {
              console.log(clientInfo);
              personsInfo.push(clientInfo[0])
              if (personsInfo.length === succ.length) {
                res.send(personsInfo)
              }
            }, err => { console.log(err); throw err }
          )
        }
      )

    },
    //TODO what happens when we hit the backend but we can't find acctId? Log as an error and move on?
    (err) => {
      console.log(err)
    }

  )

})

app.post('/getClient', (req, res) => {
  var clientId = req.body.id

  var q = "SELECT * FROM Clients WHERE ClientId='" + clientId + "'"

  knex("Clients").select().where("ClientId", clientId).then(
    (dbRes) => {
      console.log(dbRes)
      res.send(dbRes)
    },
    (err) => {
      console.log(err)
    }
  )
})

app.post('/getSession', (req, res) => {
  knex("AccountSession").select("AccountId").where("SessionToken", req.body.sessToken).then(
    (accountId) => {
      res.send(accountId)
    },
    (err) => {
      console.log(err)
      res.send(undefined)
    }
  )
})


app.post('/setSession',
  (req, res) => {
    console.log("Setting session in DB")
    console.log(req.body.accountId)
    knex("AccountSession").insert({ AccountId: req.body.accountId, SessionToken: req.body.sessToken }).then(
      (sessId) => {

        setTimeout(() => {
          knex("AccountSession").where("SessionToken", req.body.sessToken).del().then(
            (succ) => {
              console.log("SUCCESS DELETING " + req.body.sessToken)
            }
          )
        }, 1000 * 60 * 60 * 24);

        console.log("/getSession return result:")
        console.log(sessId)
        res.send(sessId)
      },
      (err) => {
        console.log(err)
        res.send(undefined)
      }
    )
  })

app.post('/clearSession', (req, res) => {
  knex("AccountSession").where("SessionToken", req.body.sessToken).del().then(
    (ok) => {
      res.sendStatus(200)
    },
    (err) => {
      console.log(err)
      res.sendStatus(500)
    }
  )
})

app.post('/setClientChanges', (req, res) => {
  //input
  console.log(req.body)


  var clientInfo = req.body.basic
  var restChanges = req.body.rest
  var cal = req.body.cal
  var clientId = req.body.clientId
  var spcInst = req.body.spcInst
  var calDate = req.body.calDate
  var diet = req.body.basic.diet

  console.log(req.body.cal)
  var weeklyMeals = clientInfo["weekly"]

  var monday = new Date(getThisMonday(calDate));

  var sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)

  var tuesday = new Date(monday)
  tuesday.setDate(monday.getDate() + 1)

  var wednesday = new Date(monday)
  wednesday.setDate(monday.getDate() + 2)

  var thursday = new Date(monday)
  thursday.setDate(monday.getDate() + 3)

  var friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)

  var saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)

  var week = [dateFormatSQL(sunday), dateFormatSQL(monday), dateFormatSQL(tuesday), dateFormatSQL(wednesday), dateFormatSQL(thursday), dateFormatSQL(friday), dateFormatSQL(saturday)]
  ////////console.log(spcInst)

  if (clientInfo.hasOwnProperty('fname')) {
    // var basicQ = "UPDATE Clients SET FistName='" + clientInfo["fname"] + "' WHERE ClientId='" + clientId + "'"
    knex("Clients").where("ClientId", clientId).update({ FistName: clientInfo["fname"] }).then(
      res => {
        console.log("Successfully changed FirstName")
      },
      err => {
        console.log(err)
      }
    )

    // pool.query(basicQ)

  }
  if (clientInfo.hasOwnProperty('lname')) {
    // var basicQ = "UPDATE Clients SET LastName='" + clientInfo["lname"] + "' WHERE ClientId='" + clientId + "'"
    // pool.query(basicQ)
    knex("Clients").where("ClientId", clientId).update({ LastName: clientInfo["lname"] }).then(
      res => {
        console.log("Successfully changed LastName")
      },
      err => {
        console.log(err)
      }
    )
  }
  if (clientInfo.hasOwnProperty('num1')) {
    // var basicQ = "UPDATE Clients SET Phone1='" + clientInfo["num1"] + "' WHERE ClientId='" + clientId + "'"
    // pool.query(basicQ)
    knex("Clients").where("ClientId", clientId).update({ Phone1: clientInfo["num1"] }).then(
      res => {
        console.log("Successfully changed Phone1")
      },
      err => {
        console.log(err)
      }
    )

  }
  if (clientInfo.hasOwnProperty('num2')) {
    // var basicQ = "UPDATE Clients SET Phone2='" + clientInfo["num2"] + "' WHERE ClientId='" + clientId + "'"
    // pool.query(basicQ)
    knex("Clients").where("ClientId", clientId).update({ Phone2: clientInfo["num2"] }).then(
      res => {
        console.log("Successfully changed Phone2")
      },
      err => {
        console.log(err)
      }
    )

  }
  if (clientInfo.hasOwnProperty('diet')) {
    // var basicQ = "UPDATE Clients SET DietId='" + clientInfo["diet"] + "' WHERE ClientId='" + clientId + "'"
    // pool.query(basicQ)
    knex("Clients").where("ClientId", clientId).update({ DietId: clientInfo["diet"] }).then(
      res => {
        console.log("Successfully changed Diet")
      },
      err => {
        console.log(err)
      }
    )

  }
  if (clientInfo.hasOwnProperty('active')) {

    //behaviour when active is being turned on or is on
    if (clientInfo['active']) {
      console.log(clientId)
      pool.execute('SELECT Active, WeeklyMeal FROM Clients WHERE ClientId=?', [clientId], (err, dbClientInfo) => {

        if (err) {
          console.log(err); return
        }

        if (dbClientInfo[0]['Active'] === 1) {
          //Still active. Check whether we must request payment due to a change in weeklyMeal.
          if (dbClientInfo[0]["WeeklyMeal"] !== weeklyMeals) {
            pool.execute("SELECT * FROM Prices WHERE DietId=?", [diet], (err, pricingTable) => {
              if (err) {
                console.log(err)
                return
              }

              // let total = 0
              // weeklyMeals.split("").forEach(
              //   (byte, byteIndex) => {
              //     if (byte === "1") {
              //       pricingTable.forEach(
              //         (mealCost) => {
              //           if (mealCost['MealType'] === "BFast") {
              //             if (byteIndex % 5 === 0) {
              //               total += parseFloat(mealCost['Cost'])
              //             }
              //           }
              //           if (mealCost['MealType'] === "Lunch") {
              //             if (byteIndex % 5 === 1) {
              //               total += parseFloat(mealCost['Cost'])
              //             }
              //           }
              //           if (mealCost['MealType'] === "Dinner") {
              //             if (byteIndex % 5 === 2) {
              //               total += parseFloat(mealCost['Cost'])
              //             }
              //           }
              //           if (mealCost['MealType'] === "Extra") {
              //             if (byteIndex % 5 === 3) {
              //               total += parseFloat(mealCost['Cost'])
              //             }
              //           }
              //           if (mealCost['MealType'] === "Snack") {
              //             if (byteIndex % 5 === 4) {
              //               total += parseFloat(mealCost['Cost'])
              //             }
              //           }
              //         }
              //       )
              //     }
              //   }
              // )
              //send request for payment

              //changing active status - should probably be after the request for payment, etc.
              pool.execute("UPDATE Clients SET Active='1' WHERE ClientId=?", [clientId], (err) => { if (err) console.log(err) })

            }) //end calculating cost to the customer
          }

        } //end client is still active, but we checked for changes in weeklyMeals

        else {
          //Client is being activated, we must request payment
          console.log(diet)
          //calculating total based on incoming weeklyMeal strings and diet
          pool.execute("SELECT * FROM Prices WHERE DietId=?", [diet], (err, pricingTable) => {
            if (err) {
              console.log(err)
              return
            }

            // let total = 0

            // weeklyMeals.split("").forEach(
            //   (byte, byteIndex) => {
            //     if (byte === "1") {
            //       pricingTable.forEach(
            //         (mealCost) => {
            //           if (mealCost['MealType'] === "BFast") {
            //             if (byteIndex % 5 === 0) {
            //               total += parseFloat(mealCost['Cost'])
            //             }
            //           }
            //           if (mealCost['MealType'] === "Lunch") {
            //             if (byteIndex % 5 === 1) {
            //               total += parseFloat(mealCost['Cost'])
            //             }
            //           }
            //           if (mealCost['MealType'] === "Dinner") {
            //             if (byteIndex % 5 === 2) {
            //               total += parseFloat(mealCost['Cost'])
            //             }
            //           }
            //           if (mealCost['MealType'] === "Extra") {
            //             if (byteIndex % 5 === 3) {
            //               total += parseFloat(mealCost['Cost'])
            //             }
            //           }
            //           if (mealCost['MealType'] === "Snack") {
            //             if (byteIndex % 5 === 4) {
            //               total += parseFloat(mealCost['Cost'])
            //             }
            //           }
            //         }
            //       )
            //     }
            //   }
            // )


            //sending request for payment

            //changing active status - should probably be after the request for payment, etc.
            pool.execute("UPDATE Clients SET Active=? WHERE ClientId=?", [1, clientId], (err) => { if (err) console.log(err) })

          }) //end pricing stuff
        } //end client activation (else statement)

        //TODO don't allow changes to WeeklyMeals until payment is secured
        //TODO prompt a change if Diet is changing
      })
    }
    //behaviour when active being turned off, or should stay off
    else {
      pool.execute("UPDATE Clients SET Active='0' WHERE ClientId=?", [clientId], (err) => { if (err) console.log(err) })
    }
  }

  //TODO cal should only change for the > 1's in the DB's WeeklyMenu. Make sure to check this here.
  if (cal) {

    /*TODO:
      1. DELETE all rows in this Calendar's Date
      2. INSERT all rows in Cal
    */
    pool.execute('SELECT Active, WeeklyMeal FROM Clients WHERE ClientId= ? ', [clientId], (err, dbClientInfo) => {

      pool.execute(`DELETE FROM Schedule WHERE ClientId=? AND Date BETWEEN ${week[0]} AND ${week[week.length - 1]}`, [clientId], (err) => {
        cal.forEach(
          //setting Schedule to changes in Calendar.js
          (day, dayI) => {
  
            console.log(day[0]["Date"])
            console.log("--------------------")
  
            let dayAddress = day[0]["AddrId"]
  
            day.forEach(
              (entry) => {
                if (weeklyMeals[(dayI * 5) + 0] === "0") {
                  entry["BFast"] = ""
                }
                if (weeklyMeals[(dayI * 5) + 1] === "0") {
                  entry["Lunch"] = ""
                }
                if (weeklyMeals[(dayI * 5) + 2] === "0") {
                  entry["Dinner"] = ""
                }
                if (weeklyMeals[(dayI * 5) + 3] === "0") {
                  entry["Extra"] = ""
                }
                if (weeklyMeals[(dayI * 5) + 4] === "0") {
                  entry["Snack"] = ""
                }
                if (entry["EntryId"] > 0) {
                  pool.execute("UPDATE Schedule SET BFast=?, Lunch=?, Dinner=?, Extra=?, Snack=?, AddrId=? WHERE ClientId=? AND Date=? AND EntryId=?", [entry["BFast"], entry["Lunch"], entry["Dinner"], entry["Extra"], entry["Snack"], dayAddress, clientId, dateFormatSQL(new Date(entry["Date"])), entry["EntryId"]], (err, v) => { if (err) console.log(err) })
                } else {
                  console.log("ADDING NEW SCHEDULE ENTRY...")
                  console.log(entry)
                  pool.execute("INSERT INTO Schedule (ClientId,Bfast,Lunch,Dinner,Extra,Snack,AddrId,Date) VALUES (?,?,?,?,?,?,?,?)", [clientId, entry["BFast"], entry["Lunch"], entry["Dinner"], entry["Extra"], entry["Snack"], entry["AddrId"], week[dayI]], (err) => { if (err) console.log(err) })
                }
  
              }
            )
          }
        )
      });
    })
  }
  console.log("SUCCESSFULLY FINISHED WITH CAL!")
  //TODO weeklyMeals should not be changed here. It should be changed on a successful payment
  if (weeklyMeals) {
    // var basicQ = "UPDATE Clients Set WeeklyMeal='" + weeklyMeals + "' WHERE ClientId='" + clientId + "'"
    // pool.query(basicQ)
    knex("Clients").where("ClientId", clientId).update({ WeeklyMeal: weeklyMeals }).then(
      res => {
        console.log("Successfully changed WeeklyMeals")
      },
      err => {
        console.log(err)
      }
    )

  }

  console.log(restChanges)
  if (restChanges["add"] && restChanges["add"].length > 0) {
    restChanges["add"].forEach(
      rest => {
        console.log(rest)
        // var restIdQ = "SELECT RestId FROM Restriction WHERE RestDescription='" + rest + "'"

        knex("Restriction").select("RestId").where("RestDescription", rest).then(
          (dbD) => {
            knex("RestClient").insert({ RestId: dbD[0]["RestId"], ClientId: clientId, CreatedOn: dateFormatSQL(new Date) }).then(
              (succ) => { console.log("Successfully connected client:" + clientId + "and restriction:" + rest) },
              (err) => { console.log(err) }
            )
            knex("Clients").where("ClientId", clientId).update({ Restrictions: 1 })
          },
          (err) => {
            console.log(err)
          }
        )

        // pool.query(restIdQ, (err, dbD) => {
        //   ////////console.log(dbD)
        //   var restClientQ = "INSERT INTO RestClient (RestId, ClientId, CreatedOn) VALUES ('" + dbD[0]["RestId"] + "','" + clientId + "','" + dateFormatSQL(new Date) + "')"
        //   ////////console.log(restClientQ)
        //   pool.query(restClientQ)

        //   pool.query("UPDATE Clients SET Restrictions=1 WHERE ClientId='" + clientId + "'")
        // })
      }
    )
  }

  if (restChanges["remove"] && restChanges["remove"] !== []) {
    restChanges["remove"].forEach(
      rest => {
        var restIdQ = "SELECT RestId FROM Restriction WHERE RestDescription='" + rest + "'"

        knex("Restriction").select("RestId").where("RestDescription", rest).then(
          (dbD) => {
            knex("RestClient").where({ ClientId: clientId, RestId: dbD[0]["RestId"] }).update({ ExpiredOn: dateFormatSQL(new Date) }).then(
              res => {
                console.log("Successfully deleted in RestClient")
              },
              err => {
                console.log(err)
              }
            )
          },
          (err) => {
            console.log(err)
          }
        )

        // pool.query(restIdQ, (err, dbD) => {

        //   var restClientQ = "UPDATE RestClient SET ExpiredOn='" + dateFormatSQL(new Date) + "' WHERE ClientId='" + clientId + "' AND RestId='" + dbD[0]["RestId"] + "'"
        //   ////////console.log(restClientQ)
        //   pool.query(restClientQ)
        //   //TODO: Logic for: If client has no restrictions afterwards, update Restrictions=0 in Client Table
        // })
      }
    )
  }
  ////////console.log("SPECIAL INSTRUCTIONS:")
  ////////console.log(spcInst !== undefined)
  ////////console.log(spcInst !== null)
  ////////console.log(spcInst !== "")
  if (spcInst && spcInst !== "" && spcInst !== null && spcInst !== undefined) {
    knex("SpcInstr").select("ClientId").where("ClientId", clientId).then(
      (res) => {
        if (res.length > 0) {
          //update
          knex("SpcInstr").where("ClientId", clientId).update({ SpcInstDescr: spcInst, CreateOn: new Date() }).then(
            res => {
              console.log("Successfully updated Special Instructions")
            },
            err => {
              console.log(err)
            }
          )
        } else {
          //insert into
          knex("SpcInstr").insert({ "ClientId": clientId, SpcInstDescr: spcInst, CreateOn: new Date() }).then(
            res => {
              console.log("Successfully added Special Instructions")
            },
            err => {
              console.log(err)
            }
          )
        }
      },
      (err) => {
        console.log(err)

        //TODO what happens if the text provided is too long? send a notification back

      }
    )
    // var q = "INSERT INTO SpcInstr (ClientId, SpcInstDescr, CreateOn) VALUES ('" + clientId + "','" + spcInst + "','" + dateFormatSQL(new Date, true) + "')"
    // pool.query(q)
    // res.sendStatus(200)
  }

  res.send("Great")
}) //end

app.post('/setDish', (req, res) => {
  ////////console.log(req.body)
  console.log(req.body)
  pool.query(`SELECT * FROM ACMEFood.Dish WHERE DishDescription='${req.body.dishDesc}'`,
    (err, exists) => {
      if (exists.length > 0) {
        var dishId = exists[0]["DishId"]

        // set changes for this dish
        pool.query(`UPDATE ACMEFood.Dish SET Calories=${parseInt(req.body.cals)}, Proteins=${parseInt(req.body.prots)}, Carbohydrates=${parseInt(req.body.carbs)}, Fats=${parseInt(req.body.fats)} WHERE DishId=${dishId}`)

        pool.query(`SELECT *, (SELECT RestDescription FROM Restriction AS R WHERE R.RestId=RD.RestId) AS RestDescription FROM ACMEFood.RestDish AS RD WHERE DishId='${dishId}'`,
          (err, DBDishRests) => {
            if (err) console.log(err);


            req.body.rest.forEach(
              incomingRest => {
                // if we can't find incomingRest in all of storedRests, incomingRest must be added
                if (!DBDishRests.some((storedDishRest) => storedDishRest["RestDescription"] === incomingRest)) {
                  //we must add incomingRest
                  pool.query(`SELECT RestId FROM Restriction WHERE RestDescription='${incomingRest}'`,
                    (err, incomingRestId) => {
                      if (err) console.log(err);
                      console.log(`INSERTING ${incomingRest} AS ${incomingRestId[0]["RestId"]} To DishId=${dishId}`)
                      pool.query(`INSERT INTO RestDish (RestId, DishId) VALUES (${incomingRestId[0]["RestId"]}, ${dishId})`)
                    }
                  )
                }
              }
            )

            DBDishRests.forEach(
              storedRestObj => {

                // // if we can't find storedRest in all of the incomingRests, storedRest must be deleted
                const storedRest = storedRestObj["RestDescription"]
                // const index = req.body.rest.findIndex(incomingRest => incomingRest === storedRest["DishDescription"])

                // if(index === -1){
                //   console.log(`DELETING ${storedRest["RestId"]} FROM Dish=${dishId}`)
                //   pool.query(`DELETE FROM RestDish WHERE RestId='${storedRest["RestId"]}' AND RestDish='${dishId}'`)

                // }

                if (!req.body.rest.includes(storedRest)) {
                  console.log(`DELETING ${storedRest} FROM Dish=${dishId}`)
                  pool.query(`DELETE FROM RestDish WHERE RestId='${storedRestObj["RestId"]}' AND DishId='${dishId}'`)
                }

                // storedExistsInIncoming = false

                // req.body.rest.forEach(
                //   (incomingRest) => {
                //     if(storedRest["RestDescription"] === incomingRest){
                //       storedExistsInIncoming = true
                //        break
                //     }
                //   }
                // )

                // if(!storedExistsInIncoming){
                //   pool.query(`DELETE FROM RestDish WHERE RestId='${storedRest["RestId"]}' AND RestDish='${dishId}'`)
                //   console.log(`DELETING ${storedRest["RestId"]} FROM Dish=${dishId}`)
                // } else {

                // }

              }
            )
          }
        )

        console.log("sending Dish Id of ", dishId)
        res.send([dishId])
      } else {
        const q = `INSERT INTO ACMEFood.Dish (DietId, DishDescription, Calories, Proteins, Carbohydrates, Fats) VALUES ('${req.body.diet}','${req.body.dishDesc}','${parseInt(req.body.cals)}','${parseInt(req.body.prots)}','${parseInt(req.body.carbs)}','${parseInt(req.body.fats)}')`
        pool.query(q, (e1, dbD) => {

          if (e1) {
            ////////console.log("ERROR 1: ")
            throw e1
          }

          const idsQ = "SELECT DishId FROM Dish WHERE DishDescription='" + req.body.dishDesc + "'"
          pool.query(idsQ, (e2, ids) => {
            ////////console.log("Getting DishIds after insterting Dish...")
            ////////console.log(ids)
            if (e2) {
              ////////console.log("ERROR 2: ")
              ////////console.log(e2)
            }

            var dishId = ids[0]["DishId"]
            ////////console.log(dishId);

            // Getting the restriction ID to connect this dish and this restriction
            req.body.rest.forEach(rest => {
              const restIdsQ = "SELECT RestId FROM Restriction WHERE RestDescription='" + rest + "'"
              pool.query(restIdsQ, (e3, restIds) => {

                if (e3) {
                  ////////console.log("ERROR 3: ")
                  ////////console.log(e3)
                }
                const restId = restIds[0]["RestId"]
                ////////console.log(restId);


                const addRestToDishQ = "INSERT INTO RestDish (DishId, RestId) VALUES ('" + dishId + "','" + restId + "')"
                ////////console.log(addRestToDishQ)
                pool.query(addRestToDishQ)

              })
            })
            console.log("sending Dish Id of ", dishId)
            res.send([dishId])
          })
        })
      }

    })


})

app.post('/getClientAddress', (req, res) => {
  const clientId = req.body.clientId

  // var addrQ = "SELECT AddrId FROM ClientAddress WHERE ClientId='" + clientId + "'"
  ////////console.log(addrQ)

  knex("ClientAddress").select("AddrId").where("ClientId", clientId).then(
    (dbD) => {

      knex("Address").select().whereIn("AddrId", dbD.map((addrInfo) => { return (addrInfo["AddrId"]) })).then(
        (clientAddresses) => {
          // console.log(clientAddresses)
          clientAddresses.forEach(
            (addr) => {
              addr["AddrLabel"] = addr["StreetNo"] + " " + addr["StreetName"] + " " + addr["ZipCode"]
            }
          )
          res.send(clientAddresses)
        },
        (err) => {
          console.log(err)
        }
      )

    },
    (err) => {
      console.log(err)
    }
  )

  // pool.query(addrQ, (err, dbD) => {

  //   var infoQ = "SELECT * FROM Address WHERE AddrId='"

  //   if (dbD.length === 0) {
  //     infoQ += "'"
  //   }
  //   dbD.forEach(
  //     (addr, i) => {

  //       if (i !== dbD.length - 1) {
  //         infoQ += addr["AddrId"] + "' OR AddrId='"
  //       }
  //       else {
  //         infoQ += addr["AddrId"] + "'"
  //       }
  //     }
  //   )
  //   ////////console.log(infoQ)

  //   pool.query(infoQ, (err, dbD) => {
  //     res.send(dbD)
  //   })

  // })
})

app.post('/delClientAddrs', (req, res) => {
  const addrsToDel = req.body.remove
  const clientId = req.body.clientId
  if (addrsToDel) {
    Promise.all(addrsToDel.map(
      (addr) => {
        knex("ClientAddress").where({ "AddrId": addr["AddrId"], "ClientId": clientId }).del().then(
          _ => {
            console.log("Successfully deleted ")
            console.log(addr)

            return knex("ClientAddress").select("AddrId").where("AddrId", addr["AddrId"]).then(
              remainingWId => {
                if (remainingWId.length === 0) {
                  knex("Address").where("AddrId", addr["AddrId"]).del()
                }

              }
            )
          },
          (err) => {
            console.log(err); res.send(500)
          }
        )
      }
    )).then(
      () => {
        res.sendStatus(200)
      },
      (err) => { console.log(err); res.sendStatus(500) }
    )
  } else {
    res.sendStatus(200)
  }


})

app.post('/setClientAddrs', async (req, res) => {

  const clientId = req.body.clientId
  const addrsToAdd = req.body.add
  const primaryId = req.body.primary

  let addrCnt = 0

  Promise.all(addrsToAdd.map(
    (addr) => {
      //only the original DB values have an ID given to them that is over 1
      if (addr["AddrId"] && addr["AddrId"] > 0) {
        //TODO if addr is new and has an AddrId > 0 then throw back an error

        return knex("Address").where("AddrId", addr["AddrId"]).update({
          StreetNo: addr["StreetNo"],
          StreetName: addr["StreetName"],
          Apt: addr["Apt"],
          ZipCode: addr["ZipCode"],
          City: addr["City"],
          State: addr["State"],
          Notes: addr["Notes"]
        }).then(
          () => {
            if (addr["AddrId"] === primaryId) {

              knex("ClientAddress").where("ClientId", clientId).update({ IsPrimary: 0 }).then(
                (dbD) => {
                  console.log("Successfully updated all addresses' IsPrimary field for client:" + clientId + " to 0. Responce (rows affected): ")
                  console.log(dbD)

                  // console.log( knex("ClientAddress").where({"ClientId": clientId, "AddrId": addr["AddrId"]}).toSQL().toNative() )
                  knex("ClientAddress").where({ "ClientId": clientId, "AddrId": addr["AddrId"] }).update({ IsPrimary: 1 }).then(
                    succ => {
                      if (succ > 1) {
                        console.log(":whoozy emoji:")
                      }
                      console.log("Updated " + succ + " rows with IsPrimary=1")
                    },
                    err => {
                      console.log(err)
                    }
                  )
                  // console.log( knex("ClientAddress").where({"ClientId": clientId, "AddrId": addr["AddrId"]}).update({IsPrimary: 1}).toSQL().toNative() )

                }
              )

            }
          },
          (err) => { console.log(err) }
        )


      }
      else {
        //create new record if there is no "ID"
        return knex("Address").insert({
          StreetNo: addr["StreetNo"],
          StreetName: addr["StreetName"],
          Apt: addr["Apt"],
          ZipCode: addr["ZipCode"],
          City: addr["City"],
          State: addr["State"],
          Notes: addr["Notes"]
        }).then(
          succ => {
            // connect id to client with ClientAddress table

            if (primaryId === addr["AddrId"]) {
              knex("ClientAddress").where("ClientId", clientId).update({ IsPrimary: 0 }).then(
                _ => {
                  // insert this new address into ClientAddress
                  knex("ClientAddress").insert({ ClientId: clientId, AddrId: succ[0], isPrimary: 1 }).then(
                    _ => {
                      addrCnt++
                    },
                    err => {
                      console.log(err)
                    }
                  )
                },
                err => {
                  console.log(err)
                }
              )
            } else {
              knex("ClientAddress").insert({ ClientId: clientId, AddrId: succ[0], isPrimary: 0 }).then(
                _ => {
                  addrCnt++
                },
                err => {
                  console.log(err)
                }
              )
            }
            // update all addresses to IsPrimary to be 0 then

          },
          err => {
            console.log(err)
          }
        )
      }
    }
  )).then(
    () => {
      res.sendStatus(200)

    },
    (err) => {
      console.log(err)
      res.sendStatus(500)
    }
  )

})

app.post('/getClientPrimaryAddress', (req, res) => {
  const clientId = req.body.clientId

  // const q = "SELECT AddrId FROM ClientAddress WHERE ClientId='" + clientId + "' AND IsPrimary=1"

  knex("ClientAddress").select("AddrId").where({ "ClientId": clientId, "IsPrimary": 1 }).then(
    dbD => {

      res.send(dbD[0])

    },
    err => {

      console.log(err)

    }
  )

  // pool.query(q, (err, dbD) => {
  //   res.send(dbD[0])
  // })
})

app.get("/getAllClientsInAccounts", (req, res) => {



  knex("Clients")
    .join("AccountClient", "Clients.ClientId", "=", "AccountClient.ClientId")
    .select("AccountClient.AccountId", "Clients.ClientId", "Clients.FistName", "Clients.LastName")
    .then(
      (dbD) => {
        res.send(dbD)
      },
      (err) => {
        console.log(err)
      }
    )
})

app.post('/newRestriction', (req, res) => {
  ////////console.log("Adding New Restriction")
  ////////console.log(req.body)
  knex("Restriction").select().where("RestDescription", req.body.newRest).then(
    IDs => {
      console.log(IDs)
      if (IDs.length >= 1) {
        console.log("Restriction already exists.")
        res.send("SQL sent (already exists)")
      } else {
        const q = "INSERT INTO Restriction (RestDescription) VALUES ('" + req.body.newRest + "')"
        pool.query(q)
        res.send("SQL sent (added)")
      }


    },
    err => {
      console.log(err)
    }
  )


})

app.post('/newClient', (req, res) => {
  res.send('Hello World!')
})

app.post('/getRestsByDishId', (req, res) => {
  ////////console.log("Getting RestDescriptions in Restrictions by DishDescription")
  ////////console.log(req.body)
  var dishDesc = req.body.dishId

  var q2 = "SELECT RestId FROM RestDish WHERE DishId='" + dishDesc + "'"
  ////////console.log(q2)
  pool.query(q2, (err, restIds) => {
    var restDescs = []
    ////////console.log(restIds)

    if (restIds.length !== 0) {
      var q3 = "SELECT * FROM Restriction WHERE "

      restIds.forEach(
        (restId, index) => {
          if (index < restIds.length - 1) {
            q3 += "RestId='" + restId["RestId"] + "' OR "
          }
          else {
            q3 += "RestId='" + restId["RestId"] + "'"

          }
        }
      )
      ////////console.log(q3)
      pool.query(q3, (err, restDesc) => {
        ////////console.log("Sending")
        res.send(restDesc)
        ////////console.log(restDesc)
      })
    }
    else {
      res.send([])
    }
  })
})

app.post('/getClientSchedule', (req, res) => {
  ////////console.log("Getting Client Schedule for:")
  ////////console.log(req.body)
  var clientId = req.body.clientId
  var date = new Date(req.body.date)
  ////console.log("Looking for schedule for week containing day:",date, clientId)
  //get week
  var monday = new Date(getThisMonday(date));

  var sunday = new Date(monday)
  sunday.setDate(monday.getDate() - 1)

  var tuesday = new Date(monday)
  tuesday.setDate(monday.getDate() + 1)

  var wednesday = new Date(monday)
  wednesday.setDate(monday.getDate() + 2)

  var thursday = new Date(monday)
  thursday.setDate(monday.getDate() + 3)

  var friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)

  var saturday = new Date(monday)
  saturday.setDate(monday.getDate() + 5)

  // monday = dateFormatSQL(monday)
  var week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday]

  var q = `SELECT \
  Date\
  ,ClientId\
  ,BFast\
  ,EntryId
, (SELECT DishDescription FROM ACMEFood.Dish\
    WHERE S.BFast = DishId) as BFastDesc\
  ,Lunch\
,  (SELECT DishDescription FROM ACMEFood.Dish\
    WHERE S.Lunch = DishId) as LunchDesc\
  ,Dinner\
,  (SELECT DishDescription FROM ACMEFood.Dish\
    WHERE S.Dinner = DishId) as DinnerDesc\
  ,Extra\
,  (SELECT DishDescription FROM ACMEFood.Dish\
    WHERE S.Extra = DishId) as ExtraDesc\
  ,Snack\
  , (SELECT DishDescription FROM ACMEFood.Dish\
    WHERE S.Snack = DishId) as SnackDesc\
  ,AddrId\
  ,(SELECT CONCAT(StreetNo, " ", StreetName, " ",City, " ",ZipCode) AS AddrLabel FROM ACMEFood.Address\
  WHERE S.AddrId = AddrId) as Addr\
  FROM ACMEFood.Schedule as S\
  WHERE (`


  week.forEach((weekday, index) => {
    const sqlD = dateFormatSQL(weekday)
    if (index < week.length - 1) {
      q += "Date='" + sqlD + "' OR "
    } else {
      q += "Date='" + sqlD + "')"
    }
  })
  q += " AND S.ClientId ='" + clientId + "' ORDER BY Date, EntryId"
  console.log(q)
  pool.query(q, (err, dbD) => {
    res.send(dbD)
  })

})

app.post('/getClientRestrictions', (req, res) => {
  var clientId = req.body.id

  var resData = {
    "clientId": clientId,
    "rest": []
  }

  const q = "SELECT * FROM RestClient WHERE ClientId='" + clientId + "' AND ExpiredOn IS NULL"

  pool.query(q, (err, dbD) => {
    if (err) {
      console.log(err)
      res.send(resData)

    }
    if (dbD.length > 0) {
      dbD.forEach(rest => {
        const q2 = "SELECT * FROM Restriction WHERE RestId='" + rest["RestId"] + "'"

        pool.query(q2, (err, restInfo) => {
          if (err) {
            console.log(err)
            res.send(resData)
          }
          restInfo.forEach(restInf => {
            resData["rest"].push({
              "id": restInf["RestId"],
              "desc": restInf["RestDescription"]
            })
          })
          ////////console.log(resData)
          if (dbD.length === resData["rest"].length) {
            res.send(resData)
          }
        })
      })
    } else {
      res.send(resData)
    }

  })
})

app.post('/getSpcInstr', (req, res) => {
  var clientId = req.body.id

  const q = "SELECT * FROM SpcInstr WHERE ClientID='" + clientId + "' ORDER BY CreateOn"
  ////////console.log(q)
  pool.query(q, (err, dbData) => {
    res.send(dbData)
  })
})

const port = 3000
const ip = "localhost"

app.listen(port, () => {
  console.log(`Backend listening at http://${ip}:${port}`)
})

