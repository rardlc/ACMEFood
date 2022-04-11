import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

import Form from "antd"
import EditWeeklyMenu from './components/EditWeeklyMenu'
import EditAddresses from './components/EditAddresses'
import axios from 'axios'


import styles from '../styles/Registration.module.css'
import { userFromRequest } from '../DB/tokens'

const backendIP = "./api"

export default function Registration() {

  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [customizing, setCustomizing] = useState(false)

  //form states
  const [diet, setDiet] = useState(null)

  const [weeklyMenu, setWeeklyMenu] = useState([])
  const [mealNum, setMealNum] = useState([])

  const [fname, setFname] = useState(null)
  const [lname, setLname] = useState(null)
  const [telf, setTelf] = useState(null)
  const [telf2, setTelf2] = useState(null)
  const [eml, setEml] = useState(null)

  const [activePreset, setActivePreset] = useState(null)

  const [peopleNum, setPeopleNum] = useState(1)

  const [pesky, setPesky] = useState(null)
  const [peskyMatch, setPeskyMatch] = useState(null)

  const [subTotal, setSubTotal] = useState("0.00")
  const [totalMeals, setTotalMeals] = useState({ accountTotal: 0, personsBreakdown: [{ total: 0 }, { total: 0 }, { total: 0 }, { total: 0 }, { total: 0 }, { total: 0 }] })

  const [loginState, setLoginState] = useState("login");

  const [failedRegister, setFailedRegister] = useState(false)

  const [formType, setFormType] = useState("same")

  const [personsInfo, setPersonsInfo] = useState([{ "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }, { "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }, { "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }, { "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }, { "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }, { "fname": "", "lname": "", "telf": "", "telf2": "", "diet": "", "weeklyMenu": [], "copyAddrs": false }])
  /*
  personsInfo keys
    [personIndex]: {  }
  */


  const [visualInfo, setVisualInfo] = useState([])
  // validating input immedietly after a failed register() call 
  function validate(personI, key2validate, time2validate = failedRegister) {
    console.log("KEY: " + key2validate)

    if (personI !== -1) {
      console.log("INFO: " + personsInfo[personI][key2validate])
    }
    //if submitting failed once, start validating for onChange
    if (time2validate) {
      let validationStatus = true
      //each if statement is checking if the key2validate passed must be validated
      //  (fname in this case)
      if (key2validate === "fname") {
        let validationMessage = ""


        // checking if it <b>is null</b>, if it then set fnameInvalid (in this case)
        // to a value which will be checked by the parent divs that set the style of the invalid inputs
        if (!personsInfo[personI][key2validate]) {
          validationMessage += "Please include a first name for this person.\n"
          validationStatus = false

        }
        //add other checks for this key here...

        //no checks after these 2 lines 
        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "lname") {
        let validationMessage = ""

        // is null
        if (!personsInfo[personI][key2validate]) {
          validationMessage += "Please include a last name for this person.\n"
          validationStatus = false

        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "telf") {
        let validationMessage = ""

        if (!personsInfo[personI][key2validate]) {
          validationMessage += "Please include a phone number for this person.\n"
          validationStatus = false

        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "diet") {

        let validationMessage = ""
        console.log(!personsInfo[personI][key2validate])
        if (!personsInfo[personI][key2validate]) {
          validationMessage += "Please include a diet plan for this person.\n"
          validationStatus = false
        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "eml") {
        let validationMessage = ""

        //is null
        if (!eml) {

          validationMessage += "Please include an email for this account.\n"
          validationStatus = false

        }
        if (!eml.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          validationMessage += "Please format your email as {address}@{domain}.com.\n Example: pasta_lord1969@gov.ca\n"
          validationStatus = false
        }
        //other checks

        personsInfo[0][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "pesky") {

        let validationMessage = ""

        if (pesky === null || pesky.length < 8) {

          validationMessage += "Please include a password with 8+ characters.\n"
          validationStatus = false

        }
        //other checks

        personsInfo[0][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

        if (pesky !== peskyMatch) {

          validationMessage += "Please make sure both passwords match.\n"
          validationStatus = false

        }
        //other checks

        personsInfo[0][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "weeklyMenu") {
        let validationMessage = ""

        console.log(personsInfo[personI][key2validate])
        //is empty array
        if (personsInfo[personI][key2validate].length === 0) {
          validationMessage += "Please include a delivery plan for this person.\n"
          validationStatus = false
        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "addrs") {
        let validationMessage = ""

        //is empty array
        if (personsInfo[personI][key2validate]["addrs"].length === 0) {
          validationMessage += "Please include at least one address for this person.\n"
          validationStatus = false
        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])


        personsInfo[personI][key2validate]["addrs"].forEach(
          (addr, addrI) => {
            if (!addr["StreetNo"]) {
              validationStatus = false
              validationMessage += "You are missing the StreetNo in address #" + (addrI + 1) + "\n"

            }

            if (!addr["StreetName"]) {
              validationStatus = false
              validationMessage += "You are missing the Street name in address #" + (addrI + 1) + "\n"

            }

            if (!addr["City"]) {
              validationStatus = false
              validationMessage += "You are missing the City in address #" + (addrI + 1) + "\n"

            }

            if (!addr["ZipCode"]) {
              validationStatus = false
              validationMessage += "You are missing the Zipcode in address #" + (addrI + 1) + "\n"

            }

            if (!addr["State"]) {
              validationStatus = false
              validationMessage += "You are missing the State in address #" + (addrI + 1) + "\n"

            }

          }
        )
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else if (key2validate === "pesky") {
        let validationMessage = ""

        if (!pesky) {
          validationMessage += "Please include a password for this person.\n"
          console.log(validationMessage)

          validationStatus = false

        }
        //other checks

        personsInfo[personI][key2validate + "Invalid"] = validationMessage
        setPersonsInfo([...personsInfo])

      } else {
        console.log("UNHANDLED validate: KEY = " + key2validate)
      }

      return validationStatus
    }
  }

  function register() {

    let allGood = true
    // validate all personsInfo
    personsInfo.forEach(
      (person, personI) => {
        if (personI < peopleNum) {
          for (const [key, value] of Object.entries(person)) {

            validate(personI, key, true) ? null : allGood = false

          }
        }
      }
    )
    validate(-1, "eml", true) ? null : allGood = false
    validate(-1, "pesky", true) ? null : allGood = false

    console.log("ALL GOOD: " + allGood)
    console.log(process.env.dbIP)
    if (allGood) {
      axios.post(`${backendIP}/register`,
        {
          personsInfo: personsInfo,
          eml: eml,
          pesky: pesky,
          peopleNum: peopleNum
        }).then(
          res => {
            console.log(res.data)
            if (res.data["err"]) {
              if (res.data["errType"] === "eml") {
                personsInfo[0]["emlInvalid"] = res.data.errMsg
                setPersonsInfo([...personsInfo])
                setCurrentPage(peopleNum + 1)
              }
              else {
                setCurrentPage(peopleNum + 1)
              }
            } else {
              axios({
                method: "post",
                url: "/api/sessions",
                data: {
                  eml: eml,
                  pesky: pesky
                }
              }).then(
                (succ) => {
                  alert("You are registered!")
                  console.log(succ.data)
                  router.push("/client/account")
                },
                (err) => {
                  console.log(err)
                }
              )


            }
          }
          , err => {
            console.log(err)
          })
    } else {
      alert("Please go back through the form and fix any errors displayed")
      setCurrentPage(1)
    }
  }



  function setAddresses(addrs, personIndex) {
    personsInfo[personIndex]["addrs"] = addrs
    setPersonsInfo([...personsInfo])
  }

  const pricingTable = {
    "Breakfast": "10.00",
    "Lunch": "11.00",
    "Dinner": "12.00",
    "Extra": "13.00",
    "Snack": "6.00"

  }

  useEffect(async () => {
    axios({
      method: "get",
      url: "/api/sessions"
    }).then(
      (res) => {
        console.log("Sessions API brought back:")
        console.log(res.data)
        if(res.data){

          if(res.data.AccountId){
            if(res.data.AccountId === 34){
              router.push("/admin/dashboard")

            } else {
              router.push("/client/account")

            }
          }

        }
      },
      (err) => {
        console.log(err)
      }
    )
  }, [])

  useEffect(() => {

    totalMeals["accountTotal"] = 0
    let totalCost = 0

    // updating total meal number (updating totalMeals; used on the total meal number tooltip)
    personsInfo.forEach(
      (person, personIndex) => {

        totalMeals["personsBreakdown"][personIndex]["total"] = 0

        if (person["weeklyMenu"] && personIndex < peopleNum) {
          let weeklyMenu = person["weeklyMenu"]

          // calculates the dollar ammount for that weeklyMenu using pricingTable constant
          totalCost += calcSubtotal(weeklyMenu)

          weeklyMenu.forEach(
            (mealTime, index) => {
              // does have a meal, add it to the total number of meals for that person
              if (parseInt(mealTime) > 0) {
                totalMeals["personsBreakdown"][personIndex]["total"] += parseInt(mealTime)
              }
              // instantiate these key/value pairs for the first time
              if (index === 0) {

                totalMeals["personsBreakdown"][personIndex]["breakfastTotal"] = parseInt(weeklyMenu[index])
                totalMeals["personsBreakdown"][personIndex]["lunchTotal"] = parseInt(weeklyMenu[index + 1])
                totalMeals["personsBreakdown"][personIndex]["dinnerTotal"] = parseInt(weeklyMenu[index + 2])
                totalMeals["personsBreakdown"][personIndex]["extraTotal"] = parseInt(weeklyMenu[index + 3])
                totalMeals["personsBreakdown"][personIndex]["snackTotal"] = parseInt(weeklyMenu[index + 4])

                // update all 5 meal counts every 5 steps
              } else if (index % 5 === 0) {

                // start of a new day
                totalMeals["personsBreakdown"][personIndex]["breakfastTotal"] += parseInt(weeklyMenu[index])
                totalMeals["personsBreakdown"][personIndex]["lunchTotal"] += parseInt(weeklyMenu[index + 1])
                totalMeals["personsBreakdown"][personIndex]["dinnerTotal"] += parseInt(weeklyMenu[index + 2])
                totalMeals["personsBreakdown"][personIndex]["extraTotal"] += parseInt(weeklyMenu[index + 3])
                totalMeals["personsBreakdown"][personIndex]["snackTotal"] += parseInt(weeklyMenu[index + 4])
              }
            }
          )
          // update the total amount of meals from all sources by the total amount of meals found in this person
          totalMeals["accountTotal"] += totalMeals["personsBreakdown"][personIndex]["total"]
        }
      }
    )
    setSubTotal(totalCost)
    setTotalMeals({ ...totalMeals })



  }, [personsInfo, peopleNum])

  useEffect(() => {
    //set to an array sized by peopleNum
    setVisualInfo(Array.apply(null, Array(peopleNum)))

  }, [peopleNum])

  //calculate the subtotal for one person's weeklyMenu
  function calcSubtotal(weeklyMenu) {
    let total = 0

    weeklyMenu.forEach(
      (mealCount, index) => {
        if (index % 5 === 0) {
          total += pricingTable["Breakfast"] * mealCount
        } else if (index % 5 === 1) {
          total += pricingTable["Lunch"] * mealCount
        } else if (index % 5 === 2) {
          total += pricingTable["Dinner"] * mealCount
        } else if (index % 5 === 3) {
          total += pricingTable["Extra"] * mealCount
        } else if (index % 5 === 4) {
          total += pricingTable["Snack"] * mealCount
        }
      }
    )

    return (total)
  }

  const [loginEml, setLoginEml] = useState("")
  const [loginPesky, setLoginPesky] = useState("")

  function signIn() {

    let validationStatus = true
    let validationMessage = ""

    if (!loginEml.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      personsInfo[0]["loginEmlInvalid"] = "Please format your email as {address}@{domain}.com.\n Example: pasta_lord1969@gov.ca\n";
      validationStatus = false

    }

    if (loginPesky === null || loginPesky.length < 8) {
      personsInfo[0]["loginPeskyInvalid"] = "Please include a password with 8+ characters.\n"
      validationStatus = false

    }

    if (validationStatus === true) {

      let postConfig = {
        method: "post",
        url: "/api/sessions",
        data: {
          eml: loginEml,
          pesky: loginPesky
        }
      }

      axios(postConfig).then(
        (res) => {
          console.log("final return from  api/sessions")
          console.log(res.data)
          if(res.data.AccountId === 34){
            router.push("/admin/dashboard")
          } else {
            router.push("/client/account")
          }



        },
        (err) => {
          console.log(err)
        }
      )

    }

  }
  //render jsx
  return (
    <div className={styles.container}>
      <div className={styles.mainBlank}>
      </div>

      <main className={styles.main}>
        <img src="./logo.png"></img>

        {/* Login Screen */}
        <div className={loginState === "login" ? styles.formCard + " " + styles.viewGrid : styles.disappear}>
          <div className={styles.centerInputs}>
            <h2 className={styles.title}>Login</h2>

            <a className={styles.textBtn} onClick={() => { setLoginState("registering") }}> Don't have an account? Register Here! </a>

            <div className={styles.inputCol + " " + styles.center}>
              <p>Email</p>
              <input className={styles.textInput} value={loginEml} onChange={(e) => { setLoginEml(e.target.value) }} type="text"></input>
            </div>

            <div className={styles.inputCol + " " + styles.center}>
              <p className={styles.center}>Password</p>
              <input className={styles.textInput} value={loginPesky} onChange={(e) => { setLoginPesky(e.target.value) }} type="password"></input>
            </div>

            <a className={styles.textBtn} > Forgot Password </a>

            <div className={styles.inputCol + " " + styles.center}>
              <button className={styles.center} onClick={signIn}> Sign-in </button>
            </div>

            <div className={styles.growingHSpace}>

            </div>


          </div>
        </div>

        {
          /* Registration Form */
          loginState === "registering" ? <div className={loginState === "registering" ? null : styles.disappear}>
            {/* Back to logins Button */}
            <div className={styles.center}>
              <span className={styles.textBtn} onClick={() => { setLoginState("login") }}> Back to Logins </span>
              <p className={styles.description}>
                Get registered by filling out the form below!
              </p>
            </div>

            {/* Cost Row */}
            <div className={styles.navBttnDiv}>
              <span className={styles.overviewIcon}>&#129490;{peopleNum}</span>
              <span className={styles.tooltip}> i <span className={styles.tooltipText}> The number of people being served on this account </span></span>

              <span className={styles.overviewIcon}>&#127858;{totalMeals.accountTotal}</span>
              <span className={styles.tooltip}> i <span className={styles.tooltipText}> The amount of meals which will be cooked and delivered to you weekly.<br />
                {
                  totalMeals["personsBreakdown"].map(
                    (mealBreakdown, index) => {
                      if ((mealBreakdown["breakfastTotal"] || mealBreakdown["lunchTotal"] || mealBreakdown["dinnerTotal"] || mealBreakdown["extraTotal"] || mealBreakdown["snackTotal"]) && index < peopleNum) {
                        let returnText = personsInfo[index]["fname"] ? personsInfo[index]["fname"] + " " + (personsInfo[index]["lname"] ? personsInfo[index]["lname"] + ":\n" : ": \n") : "Form " + (index + 1) + " indicates: \n"
                        if (mealBreakdown["breakfastTotal"]) {
                          returnText += "Number of breakfasts: " + mealBreakdown["breakfastTotal"] + "\n"
                        }
                        if (mealBreakdown["lunchTotal"]) {
                          returnText += "Number of lunches: " + mealBreakdown["lunchTotal"] + "\n"
                        }
                        if (mealBreakdown["dinnerTotal"]) {
                          returnText += "Number of dinners: " + mealBreakdown["dinnerTotal"] + "\n"
                        }
                        if (mealBreakdown["extraTotal"]) {
                          returnText += "Number of extra meals: " + mealBreakdown["extraTotal"] + "\n"
                        }
                        if (mealBreakdown["snackTotal"]) {
                          returnText += "Number of snacks " + mealBreakdown["snackTotal"] + "\n"
                        }
                        return <p style={{ whiteSpace: 'pre-line' }}> {returnText} </p>
                      }
                    }
                  )}</span></span>

              <span className={styles.overviewIcon}>&#128178;{subTotal}</span>
              <span className={styles.tooltip}> i <span className={styles.tooltipText}> The total cost to you every week</span></span>

            </div>

            {/* Nav Buttons and total cost Row */}
            <div className={styles.navBttnDiv}>
              <button className={styles.navButton} onClick={() => { setCurrentPage(currentPage - 1) }} disabled={currentPage === 1 ? true : false}>
                Previous
              </button>

              <input className={styles.navButton} type="submit" value="Create Account" hidden={currentPage === peopleNum + 2 ? false : true}></input>
              <button className={styles.navButton} hidden={currentPage === peopleNum + 2 ? true : false} onClick={() => { setCurrentPage(currentPage + 1) }} disabled={currentPage === peopleNum + 2 ? true : false}>Next</button>
            </div>

            {/* Viewable area */}
            <div className={styles.slidingView}>

              {/* Content to scroll to */}
              <div className={styles["slidingContent" + currentPage]}>
                {
                  // Additional pages being added based on visualInfo (an array sized by peopleNum)
                  visualInfo.map(
                    (_, index) => {
                      return (
                        <div className={styles.viewGrid + " " + styles.fullWidth} key={"CLT" + index.toString()}>

                          {
                            index === 0
                              ? <div style={{ display: "flex", flexDirection: "column", textAlign: "center", alignItems: "center" }}>

                                <p>How many people would you like to feed?</p>

                                <div className={styles.optionPill}>
                                  <div className={peopleNum === 1 ? styles.active : null} onClick={() => { setPeopleNum(1) }}>1</div>
                                  <div className={peopleNum === 2 ? styles.active : null} onClick={() => { setPeopleNum(2) }}>2</div>
                                  <div className={peopleNum === 3 ? styles.active : null} onClick={() => { setPeopleNum(3) }}>3</div>
                                  <div className={peopleNum === 4 ? styles.active : null} onClick={() => { setPeopleNum(4) }}>4</div>
                                  <div className={peopleNum === 5 ? styles.active : null} onClick={() => { setPeopleNum(5) }}>5</div>
                                  <div className={peopleNum === 6 ? styles.active : null} onClick={() => { setPeopleNum(6) }}>6</div>
                                </div>
                              </div>

                              : null
                          }

                          <div>
                            <div className={styles.formCard + " " + styles.fullWidth}>
                              <h2 style={{ marginTop: "0.0rem" }}>Tell us more about {index !== 0 ? <span>person {index + 1}...</span> : <span>you</span>}</h2>

                              <div className={styles.inputCell + " " + personsInfo[index]["fnameInvalid"] ? " " + styles.invalid : null}>
                                {personsInfo[index]["fnameInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["fnameInvalid"]}</p> : null}
                                <label htmlFor="fname">First Name:<span className={styles.required}>*</span></label>
                                <input required className={styles.textInput} id="fname" onChange={(e) => { personsInfo[index]["fname"] = e.target.value; setPersonsInfo([...personsInfo]) }} type="text"></input>
                              </div>

                              <div className={styles.inputCell + " " + personsInfo[index]["lnameInvalid"] ? " " + styles.invalid : null}>
                                {personsInfo[index]["lnameInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["lnameInvalid"]}</p> : null}
                                <label htmlFor="lname">Last Name:<span className={styles.required}>*</span>  </label>
                                <input className={styles.textInput} id="lname" value={lname} onChange={(e) => { personsInfo[index]["lname"] = e.target.value; setPersonsInfo([...personsInfo]) }} type="text"></input>
                              </div>

                              <div className={styles.inputCell + " " + personsInfo[index]["telfInvalid"] ? " " + styles.invalid : null}>
                                {personsInfo[index]["telfInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["telfInvalid"]}</p> : null}

                                <label htmlFor="telf">Primary Phone:<span className={styles.required}>*</span>  </label>
                                <input className={styles.textInput} id="telf" pattern="[0-9]{10}" value={personsInfo[index]["telf"]} onChange={(e) => { var num = normalizeInput(e.target.value, telf);  personsInfo[index]["telf"] = num; setPersonsInfo([...personsInfo]) }} title="Phone number" type="text"></input>
                              </div>

                              <div className={styles.inputCell}>
                                <label htmlFor="telf2">Backup Phone:  </label>
                                <input className={styles.textInput} id="telf2" pattern="[0-9]{10}" value={personsInfo[index]["telf2"]} onChange={(e) => { var num = normalizeInput(e.target.value, telf2); personsInfo[index]["telf2"] = num; setPersonsInfo([...personsInfo]) }} title="Phone number" type="text"></input>
                              </div>

                              <div className={personsInfo[index]["dietInvalid"] ? " " + styles.invalid : null}>

                                <p style={{ marginTop: "1rem", textAlign: "center" }}>What diet do{index !== 0 ? <span>es this person want?</span> : <span> you want?</span>}<span className={styles.required}>*</span></p>

                                {personsInfo[index]["dietInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["dietInvalid"]}</p> : null}

                                <div className={styles.optionPill}>
                                  <div className={personsInfo[index]["diet"] === "REG" ? styles.active : null} onClick={() => { personsInfo[index]["diet"] = "REG"; setPersonsInfo([...personsInfo]) }}>Regular</div>
                                  <div className={personsInfo[index]["diet"] === "VEG" ? styles.active : null} onClick={() => { personsInfo[index]["diet"] = "VEG"; setPersonsInfo([...personsInfo]) }}>Vegetarian</div>
                                  <div className={personsInfo[index]["diet"] === "KTO" ? styles.active : null} onClick={() => { personsInfo[index]["diet"] = "KTO"; setPersonsInfo([...personsInfo]) }}>Keto</div>
                                  <div className={personsInfo[index]["diet"] === "PSC" ? styles.active : null} onClick={() => { personsInfo[index]["diet"] = "PSC"; setPersonsInfo([...personsInfo]) }}>Pescatarian</div>
                                  <div className={personsInfo[index]["diet"] === "ATL" ? styles.active : null} onClick={() => { personsInfo[index]["diet"] = "ATL"; setPersonsInfo([...personsInfo]) }}>Athletic</div>
                                </div>
                              </div>

                              <div className={personsInfo[index]["weeklyMenuInvalid"] ? " " + styles.invalid : null}>

                                <div className={styles.grid} style={{ marginTop: "1rem" }}>
                                  <p>How often are{index !== 0 ? <span> they eating?</span> : <span>{" "}you eating?</span>}<span className={styles.required}>*</span></p>


                                  <span className={styles.tooltip}> i <span className={styles.tooltipText} style={{ whiteSpace: 'pre-line' }}>Pricing Table:{"\n"} {Object.keys(pricingTable).map((key, index) => { return (key + " $" + pricingTable[key] + " per meal\n") })}</span></span>

                                  {personsInfo[index]["weeklyMenuInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["weeklyMenuInvalid"]}</p> : null}

                                  <a className={personsInfo[index]["activePreset"] === 1 ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => {
                                    personsInfo[index]["weeklyMenu"] = [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0]
                                    personsInfo[index]["activePreset"] = 1
                                    personsInfo[index]["customizing"] = false
                                    setPersonsInfo([...personsInfo])

                                  }} >Every weekday, every meal + snacks</a>

                                  <a className={personsInfo[index]["activePreset"] === 2 ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => {
                                    personsInfo[index]["weeklyMenu"] = [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
                                    personsInfo[index]["activePreset"] = 2
                                    personsInfo[index]["customizing"] = false
                                    setPersonsInfo([...personsInfo])

                                    setActivePreset(2)
                                    personsInfo[index]["customizing"] = false

                                  }} >Every weekday, breakfast, lunch and dinner</a>

                                  <a className={personsInfo[index]["activePreset"] === 3 ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => {
                                    personsInfo[index]["weeklyMenu"] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
                                    personsInfo[index]["activePreset"] = 3
                                    personsInfo[index]["customizing"] = false
                                    setPersonsInfo([...personsInfo])

                                    setActivePreset(3)
                                    personsInfo[index]["customizing"] = false


                                  }} >Every weekday, lunch and dinner</a>

                                  <a className={personsInfo[index]["activePreset"] === 4 && personsInfo[index]["customizing"] === false ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => {
                                    personsInfo[index]["weeklyMenu"] = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
                                    personsInfo[index]["activePreset"] = 4
                                    personsInfo[index]["customizing"] = false
                                    setPersonsInfo([...personsInfo])



                                  }} >Every weekday, breakfast and lunch</a>

                                  <a className={personsInfo[index]["activePreset"] === 5 ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => {
                                    personsInfo[index]["weeklyMenu"] = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]
                                    personsInfo[index]["activePreset"] = 5
                                    personsInfo[index]["customizing"] = false
                                    setPersonsInfo([...personsInfo])



                                  }} >Every weekday, breakfast and dinner</a>
                                </div>
                                <div className={styles.grid}>
                                  <p style={{ marginLeft: "50%", marginRight: "50%" }}>OR</p>
                                  <a className={personsInfo[index]["activePreset"] === 0 ? styles.fullCard + " " + styles.active : styles.fullCard} onClick={() => { personsInfo[index]["customizing"] = true; personsInfo[index]["activePreset"] = 0; setPersonsInfo([...personsInfo]) }}>Custom</a>
                                </div>
                              </div>

                              {personsInfo[index]["customizing"] ?
                                <div>


                                  <h2>Custom Order</h2>

                                  <div>Please choose the amount of food you would like us to deliver to you over the week on the corresponding days and meals.</div>
                                  <br />
                                  {personsInfo[index]["customizing"] ? <EditWeeklyMenu setWeeklyMenu={(weeklyMenu) => { personsInfo[index]["weeklyMenu"] = weeklyMenu; setPersonsInfo([...personsInfo]) }} weeklyMenu={personsInfo[index]["weeklyMenu"]} /> : <p>Error</p>}


                                </div> : null
                              }

                              <div className={personsInfo[index]["addrsInvalid"] ? " " + styles.invalid : null}>

                                <label htmlFor={"editAddresses" + index} style={{ fontSize: "1.2rem", marginTop: "1rem" }}><strong> Addresses<span className={styles.required}>*</span></strong></label>
                                {personsInfo[index]["addrsInvalid"] ? <p className={styles.invalidText}>{personsInfo[index]["addrsInvalid"]}</p> : null}
                                {/* { peopleNum > 1 ? //This block will allow you to pick from other forms, it can be disabled and enabled and has styles 

                                  <div className={!personsInfo[index]["copyAddrs"] ? styles.disabled : null }>
                                  <input type="checkbox" onClick={() => {personsInfo[index]["copyAddrs"] = !personsInfo[index]["copyAddrs"]; setPersonsInfo([...personsInfo])}}/>
                                  <label htmlFor={"copyAddrs"}> Same as... </label>
                                  <select name="copyAddrs" id="copyAddrs" disabled={!personsInfo[index]["copyAddrs"]}>
                                    {personsInfo.map(
                                      (person, pIndex) => {
                                        if(pIndex < peopleNum){
                                          if(pIndex !== index){
                                            return (
                                              <option key={"copyAddrs" + pIndex}>{person["fname"] ? person["fname"] : "Form " + (pIndex + 1)}</option>
                                            )
                                          }
                                        }
                                      }
                                    )}
                                  </select>
                                </div> : null} */}
                                <EditAddresses id={"editAddresses" + index} handleChange={setAddresses} clientId={index}></EditAddresses>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )
                }






                <div className={styles.viewGrid}>
                  <div className={styles.formCard + " " + styles.fullWidth}>
                    <h2>Log In Details</h2>
                    <p>
                      Instructions:
                    </p>
                    <p style={{ marginBottom: "30px" }}>
                      This is how you log in to your account.
                    </p>

                    <div className={styles.inputCol + " " + (personsInfo[0]["emlInvalid"] ? " " + styles.invalid : null)}>
                      {personsInfo[0]["emlInvalid"] ? <p className={styles.invalidText}>{personsInfo[0]["emlInvalid"]}</p> : null}
                      <span htmlFor="mail">Email:  </span>
                      <input className={styles.textInput} id="mail" value={eml} onChange={(e) => { setEml(e.target.value) }} title="Email" type="text"></input>
                    </div>

                    <div className={styles.inputCol + " " + (personsInfo[0]["peskyInvalid"] ? " " + styles.invalid : null)}>
                      {personsInfo[0]["peskyInvalid"] ? <p className={styles.invalidText}>{personsInfo[0]["peskyInvalid"]}</p> : null}

                      <span htmlFor="pw" >Password:  </span>
                      <input className={styles.textInput} id="pw" value={pesky} onChange={(e) => { setPesky(e.target.value) }} title="Password" type="password"></input>

                    </div>

                    <div className={styles.inputCol}>
                      <span htmlFor="pw">Retype Password:  </span>
                      <input className={styles.textInput} id="pw" onChange={(e) => { setPeskyMatch(e.target.value) }} title="Retype Password" type="password"></input>
                    </div>

                    {peskyMatch === null || peskyMatch === "" ? "" : peskyMatch === pesky ? <p style={{ color: 'green' }}>Passwords Match!</p> : <p style={{ color: 'red' }}> Passwords do not match!</p>}

                    <button style={{ float: "right" }} className={styles.navButton} onClick={register} >Create Account</button>


                  </div>

                </div>

                <div className={styles.viewGrid}>
                  <div className={styles.formCard + " " + styles.fullWidth}>
                    <div className={styles.inputCol}>
                      <h2 style={{ marginTop: "0.0rem" }}>Account Summary</h2>
                      {
                        totalMeals["personsBreakdown"].map(
                          (mealBreakdown, index) => {
                            let personCost = 0
                            if ((mealBreakdown["breakfastTotal"] || mealBreakdown["lunchTotal"] || mealBreakdown["dinnerTotal"] || mealBreakdown["extraTotal"] || mealBreakdown["snackTotal"]) && index < peopleNum) {
                              let returnText = personsInfo[index]["fname"] ? personsInfo[index]["fname"] + " " + (personsInfo[index]["lname"] ? personsInfo[index]["lname"] + ":\n" : ": \n") : "Form " + (index + 1) + " indicates: \n"
                              if (mealBreakdown["breakfastTotal"]) {
                                returnText += "Number of breakfasts: " + mealBreakdown["breakfastTotal"] + " days x $" + pricingTable["Breakfast"] + "\n"
                                personCost += mealBreakdown["breakfastTotal"] * parseFloat(pricingTable["Breakfast"])
                              }
                              if (mealBreakdown["lunchTotal"]) {
                                returnText += "Number of lunches: " + mealBreakdown["lunchTotal"] + " days x $" + pricingTable["Lunch"] + "\n"
                                personCost += mealBreakdown["lunchTotal"] * parseFloat(pricingTable["Lunch"])

                              }
                              if (mealBreakdown["dinnerTotal"]) {
                                returnText += "Number of dinners: " + mealBreakdown["dinnerTotal"] + " days x $" + pricingTable["Dinner"] + "\n"
                                personCost += mealBreakdown["dinnerTotal"] * parseFloat(pricingTable["Dinner"])

                              }
                              if (mealBreakdown["extraTotal"]) {
                                returnText += "Number of extra meals: " + mealBreakdown["extraTotal"] + " days x $" + pricingTable["Extra"] + "\n"
                                personCost += mealBreakdown["extraTotal"] * parseFloat(pricingTable["Extra"])

                              }
                              if (mealBreakdown["snackTotal"]) {
                                returnText += "Number of snacks " + mealBreakdown["snackTotal"] + " days x $" + pricingTable["Snack"] + "\n"
                                personCost += mealBreakdown["snackTotal"] * parseFloat(pricingTable["Snack"])

                              }

                              return <div style={{ whiteSpace: 'pre-line' }}> <p>{returnText}</p><hr /> <p>${personCost + "\n\n"}</p></div>
                            } else {

                              if (index < visualInfo.length) {

                                return <p>Nothing to show for form of person number {index + 1}</p>

                              }
                            }
                          }
                        )}
                      <div className={styles.overviewIcon}>${subTotal}</div>




                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div> : null

        }


      </main>

      <div className={styles.mainBlank}>
      </div>
    </div>
  )
}

const normalizeInput = (value, previousValue) => {
  // return nothing if no value
  if (!value) return value;

  // only allows 0-9 inputs
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {

    // returns: "x", "xx", "xxx"
    if (cvLength < 4) return currentValue;

    // returns: "(xxx)", "(xxx) x", "(xxx) xx", "(xxx) xxx",
    if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;

    // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};

export async function getServerSideProps(context) {

  const user = await userFromRequest(context.req)
  console.log(" / retrieved ")
  console.log(user)
  // if (user.accountId) {
  //   return {
  //     redirect: {
  //       destination: "/client/account",
  //       permanent: false
  //     }
  //   }
  // }

  return {
    props: {}
  };
}

