import axios from "axios";
function testSetClientChanges(){

    const testingFunction = "setClientChanges"
    console.log(req.body)

  var clientInfo = req.body.basic
  var restChanges = req.body.rest
  var cal = req.body.cal
  var clientId = req.body.clientId
  var spcInst = req.body.spcInst
  var calDate = req.body.calDate
  var diet = req.body.basic.diet

    const postConfig = {
        url: `http://localhost:3000/${testingFunction}`,
        method: "post",
        data: {
            clientId: res.data[0],
            basic: basic,
            rest: restChanges,
            cal: cal,
            calDate: calDate
        }
    }
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", `http://localhost:3000/${testingFunction}`,true)
    httpRequest.setRequestHeader("Content-Type")
    //1. Understand how to re-create input
    //2. Execute the setClientChanges with recreated input
    //3. Answer: What output should I expecting from the previous execution? Write the output into Javascript
    //4. Retrieve the output (SELECT the output)
    //5. Compare the expected output with the executed output
        //if executed output and expected output
    

}


testSetClientChanges()