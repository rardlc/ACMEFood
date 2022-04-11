
import './pageCSS/ClientForm.css';
import { Form, Input, Button, Select, Switch, Tag, Dropdown, Menu, Checkbox, Row, Col } from 'antd';
import React, { useEffect, useState } from "react";
import RestrictionPopup from "../popups/RestrictionPopup.js"
import EditAddrs from "../popups/EditAddrs.js"
import Calendar from "../popups/Calendar.js"
import axios from "axios"
import EditWeeklyMenu from "../popups/EditWeeklyMenu.js"
import { useHistory, useLocation } from "react-router-dom";


const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

function ClientForm() {


  const location = useLocation();
  const history = useHistory()
  const [clientId, setClientId] = useState("")
  const [dietId, setDietId] = useState()
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({})
  const [spcInst, setSpcInst] = useState("")
  const [addrs, setAddrs] = useState({primary:null,addrs:[]})
  const [dbAddrs, setDBAddrs] = useState({primary:null,addrs:[]})
  const [calDate, setCalDate] = useState()
  const [weeklyMeals, setWeeklyMeals] = useState()

  function setClientData(clientId){
    var postConfig = {
      method: 'post',
      url: 'http://localhost:3001/getClient',
      data: {id: clientId}
    }
    axios(postConfig).then( client => {
      setFormData(client.data[0])
    })

    var postConfig = {
      method: 'post',
      url: 'http://localhost:3001/getSpcInstr',
      data: {id: clientId}
    }

    axios(postConfig).then( spcInst => {
      if(spcInst.data[0]){
        setSpcInst(spcInst.data[0]["SpcInstDescr"])
      } else {
        setSpcInst("")
      }
      // ////console.log(spcInst)
    })

  }

  const [restBool, setRestBool] = useState(false);
  const [restArr, setRestArr] = useState([]);
  const [restChanges, setRestChanges] = useState({oldArr:[], add:[],remove:[]})
  const [dietTypes, setDietTypes] = useState([])

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(true);

  function getDietTypes(){
    var getConfig = {
      method: "GET",
      url: "http://localhost:3001/getDietTypes"
    }
    axios(getConfig).then(
      res => {
        setDietTypes(res.data.map(
          (diet, index) => {
            return {
              "key": diet["DietId"],
              "value": diet["DietId"]
            }
          }
        )) 
      }
    )
  }

  const [render, setRender] = useState(false)

  const [calBool, setCalBool] = useState(false);
  const [cal, setCal] = useState([])
  const [num1, setNum1] = useState()
  const [num2, setNum2] = useState()

  function dbSaveAddrs(clientId){
    //client addresses changes
    var postConfig3 = {
      method: "post",
      url: "http://localhost:3001/setClientAddrs",
      data: {
        clientId: clientId,
        add: [],
        remove: [],
        primary: addrs["primary"]
      }
    }

    if (addrs !== dbAddrs) {

      console.log("DB: ",dbAddrs)
      console.log("Front End: ",addrs)

      if(dbAddrs["addrs"]){
        dbAddrs["addrs"].forEach(
          addr => {
            if(!(addrs["addrs"].includes(addr))){
              postConfig3["data"]["remove"].push(addr)
              console.log("DELETING: " + addr)
            }
          }
        )
      }

      addrs["addrs"].forEach(
        addr => {
          if(!(dbAddrs["addrs"].includes(addr)) || addr["AddrId"] === addrs["primary"]){
            postConfig3["data"]["add"].push(addr)
            console.log("ADDING: " + addr)

          }
        }
      )

      postConfig3["data"]["primary"] = addrs["primary"]
      console.log(postConfig3.data)
      axios(postConfig3).then(
        res => {
          console.log(res)
        }
      )
    }
  }

  function clientAdd(event){
    ////console.log(event)
    console.log(restChanges["oldArr"])
    restChanges["oldArr"].forEach(
      ogRest => {
        ////console.log(ogRest)
        if(!(restArr.includes(ogRest))){
          restChanges.remove.push(ogRest)
          setRestChanges(restChanges)
      }
    })
    
    restArr.forEach(
      currRest => {
        if (!(restChanges["oldArr"].includes(currRest))){
          restChanges.add.push(currRest)
          setRestChanges(restChanges)
        }
      }
    )

    if(clientId === ""){
      //new client
      var currentForm = form.getFieldsValue();
      var basic = {
        fname:currentForm["fname"],
        lname:currentForm["lname"],
        active:currentForm["active"],
        num1:currentForm["num1"],
        diet:currentForm["diet"],
      }

      var postConfig = {
        method: "post",
        url: "http://localhost:3001/setClient",
        data: {
          basic: basic
        }
      }
      //console.log("Setting client for the first time:", postConfig.data)

      axios(postConfig).then(
        res => {

          basic["weekly"] = weeklyMeals.join("")
          basic["num2"] = currentForm["num2"]

          setClientId(res.data["ClientId"])

          //console.log("Client ID of client created is:", res.data["ClientId"])

          var postConfig = {
            method: "post",
            url: "http://localhost:3001/setClientChanges",
            data: {
              clientId: res.data["ClientId"],
              basic: basic,
              rest: restChanges,
              cal: cal,
              calDate: calDate
            }
          }

          //console.log("Setting client changes:", postConfig.data)

          if (currentForm["spcInst"] !== spcInst){
            postConfig["data"]["spcInst"] = currentForm["spcInst"]
          }

          axios(postConfig)
          dbSaveAddrs(res.data["ClientId"])
          alert("Saved Client")
        }
      )




    }else {

      var currentForm = form.getFieldsValue();
      var dbForm = formData;
  
      var updates = {}
      if (currentForm["fname"] !== dbForm["FistName"]){
          updates["fname"] = currentForm["fname"]
        }
  
      if (currentForm["lname"] !== dbForm["LastName"]){
        updates["lname"] = currentForm["lname"]
      }
  
      if (currentForm["active"] !== dbForm["Active"]){
        updates["active"] = currentForm["active"]
      }
  
      if (currentForm["num1"] !== dbForm["Phone1"]){
        updates["num1"] = currentForm["num1"]
      } 
  
      if (currentForm["num2"] !== dbForm["Phone2"]){
        updates["num2"] = currentForm["num2"]
      } 
  
      if (currentForm["diet"] !== dbForm["DietId"]){
        updates["diet"] = currentForm["diet"]
      }

      console.log(weeklyMeals)
      updates["weekly"] = weeklyMeals.join("")
      //console.log(updates["weekly"])
      //spcInstructions changes
      var postConfig = {
        method: "post",
        url: "http://localhost:3001/setClientChanges",
        data: {
          clientId: clientId,
          basic: updates,
          rest: restChanges,
          cal: cal,
          calDate: calDate
        }
      }
  
      if (currentForm["spcInst"] !== spcInst){
        postConfig["data"]["spcInst"] = currentForm["spcInst"]
      }

      axios(postConfig).then(
        res => {
          console.log(res)
        }
      )
      dbSaveAddrs(clientId)
    }
  }
  
  //onMount & dismount
  useEffect( () => {
    getDietTypes()
    
  },[])

  useEffect( () => {
    //TODO: Check for render and prompt to save if it hasn't happened yet
    if (clientId !== ""){
      setClientData(clientId)
      setAddrs({primary:null,addrs:[]})
      setDBAddrs({primary:null, addrs:[]})
      setRestArr([])
    }

  }, [clientId])

  useEffect( () => {
    if(location.search.slice(1) !== clientId){
      setClientId(location.search.slice(1))
    }
  },[location])

  useEffect( () => {
    if (formData["Restrictions"]) {
      //set rest array with clientId
      const postConfig = {
        method : "post",
        url : "http://localhost:3001/getClientRestrictions",
        data : {id : formData["ClientId"]}
      }

      axios(postConfig).then(
        res => {
          var newRestArr = []
          res.data["rest"].forEach(
            rest => {
              newRestArr.push(rest["desc"])
            })
          setRestArr(newRestArr)
          setRestChanges({...restChanges, oldArr: [...newRestArr]})
        }
      )
    } else {
      setRestArr([])
    }
    if (formData["Active"]){
      form.setFieldsValue({
        "active": true
      })
    } else {
      ////console.log(formData["Active"])
      form.setFieldsValue({
        "active": false
      })
    }

    setCal([])

    if (formData["WeeklyMeal"]){
      setWeeklyMeals(formData["WeeklyMeal"].split(""))
    }

    form.setFieldsValue({
      fname: formData["FistName"],
      lname: formData["LastName"],
      num1: formData["Phone1"],
      num2: formData["Phone2"],
      diet: formData["DietId"],
      spcInst: spcInst
    })
  }, [formData])

  useEffect( ()=>{
    form.setFieldsValue({
      rest:restArr
    })

  },[restArr])
  
  useEffect( () => {
    form.setFieldsValue({
      spcInst:spcInst
    })
  }, [spcInst])

  function handleDietPick(e){
    ////console.log(e)
  }
  
  const dietMenu = (
    <Menu onClick={handleDietPick}>
      {dietTypes ? dietTypes.forEach( (diet, index) => {
        return <Menu.Item key={diet["DietId"]}>
          {diet["DietId"]}
        </Menu.Item>
      }): "CHANGE"}
    </Menu>
  );
    
  function setAddrForm(addrsPkg){

    setAddrs({"primary":addrsPkg["primary"], "addrs": addrsPkg["addrs"]})
    setDBAddrs({"primary":addrsPkg["dbPrimary"], "addrs":addrsPkg["dbAddrs"]})
    console.log(addrsPkg["dbPrimary"],addrsPkg["dbAddrs"], "DB ADDRS ARE:")

    if( addrsPkg["addrs"] !== [] && addrsPkg["primary"] !== null){
      form.setFieldsValue(
        {direc: addrsPkg["addrs"]}
      )
      //console.log(form.getFieldValue())
    }
  }
  
  useEffect(() => {
    //console.log(form.getFieldValue())
  },[form])

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

  return (
    <div className="clientForm">
      <Form form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={clientAdd}
      >
        <div className="oneline">
          <Form.Item
            label="Activo"
            name="active"
            valuePropName="checked"
          >
            <Switch checkedChildren="Si" unCheckedChildren="No" />
            </Form.Item>
          <Form.Item
            label="Nombre"
            name="fname"
            rules={[{ required: true, message: 'Nombre' }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="lname"
            rules={[{ required: true, message: 'Apellido' }]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Telefono 1"
            name="num1"
            rules={[{ required: true, message: 'Pon un numero de telefono!' }]}
          >
            <Input onChange={(e) => {
              //console.log(e.target.value);
              var num = normalizeInput(e.target.value,num1);
              //console.log(num)
              form.setFieldsValue({num1:num})
              setNum1(num1)
              }
            }
            />
          </Form.Item>

          <Form.Item
            label="Telefono 2"
            name="num2"
            rules={[{message: 'Pon un numero de telefono!' }]}
          >
            <Input onChange={(e) => {
              //console.log(e.target.value);
              var num = normalizeInput(e.target.value,num2);
              //console.log(num)
              form.setFieldsValue({num2:num})
              setNum2(num2)
              }}
            />
          </Form.Item>

          <Form.Item
            label="Dieta"
            name="diet"
            rules={[{ required: true, message: 'Que dieta?' }]}
          >
            
            <Select options={dietTypes} onSelect={() => {setDietId(form.getFieldValue("diet"))}}>
            </Select>
          </Form.Item>


          
        </div>
        <div className="multi-line">
        <EditWeeklyMenu weeklyMenu={weeklyMeals} setWeeklyMenu={setWeeklyMeals}/>

        <Form.Item label="" name="direc" rules={[{required: true, message: "Se necesita una direccion primaria"}]}>
          <EditAddrs setDBAddrs={setDBAddrs} dbAddr={dbAddrs} clientId={clientId} handleChange={setAddrForm}/>
        </Form.Item>

        <Form.Item
          label="Instrucciónes"
          name="spcInst"
          rules={[{message:"Que mas quiere el cliente?"}]}>
            <TextArea rows={3}></TextArea>
          </Form.Item>
        <Form.Item
          name="rest"
        >
          <Button type="link" htmlType="button" onClick={() => setRestBool(!restBool)}> Restrictions </Button>
          {
            restBool && (
              <RestrictionPopup formCallback={setRestArr} restArr={restArr}/>
            )
          }
        </Form.Item>

        <Form.Item
          name="cal"
        >
          <Button type="link" htmlType="button" onClick={() => {setCalBool(!calBool)}} disabled={clientId === null}> Change Schedule or Address </Button>
          {
            calBool ?
              <Calendar weeklyMeals={weeklyMeals} sendDate={setCalDate} formCallback={setCal} cal={cal} addrs={addrs.addrs} clientId={clientId} dietId={form.getFieldValue("diet")}/>
              : null
          }
        </Form.Item>

        <div className="submitContainer">
        <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        </div>

        </div>
        
      </Form>
  </div>
  );
}

export default ClientForm;