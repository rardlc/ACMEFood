import React, { useEffect, useState } from "react";
import DietMenu from "./components/DietMenu.js"
import {Card,Tag,Form,Input,Button,Dropdown, Menu,Modal, DatePicker} from "antd"
import styles from "./CSS/EditarMenu.module.css"

const axios = require('axios');

const backendIP = "../api"

function EditMenu () {

    const [menus, setMenus] = useState([{key: "REG"}, {key: "KTO"},{key: "PSC"},{key: "VEG"},{key: "ATL"},{key: "TRD"}])

    const [menuTypes, setMenuTypes] = useState([
    {key:"REG", diet:"Regular"},
    {key:"KTO", diet:"Keto"},
    {key:"PSC", diet:"Pescatarian"},
    {key:"VEG", diet:"Vegetarian"},
    {key:"ATL", diet:"Atleta"},
    {key:"TRD", diet:"Traditional"}])

    const [expanded, setExpanded] = useState({"REG": false,"KTO": false, "PSC": false, "VEG": false, "ATL": false, "TRD":false})

    const [today, setToday] = useState(new Date())
    const [weekday, setWeekday] = useState()


    useEffect( () => {
        console.log("I loaded right now.")
    },[])
    
    function getMenuTypes() {
        return axios.get(`${backendIP}/getDietTypes`).then(
            (res) => {
                var types = []
                var expands = {}
                var totalMenus = []

                res.data.forEach(e => {
                    //console.log(e)
                    var expandedKey = e["DietId"]
                    types.push({
                        key: e["DietId"],
                        diet: e.DietDesc
                    })
                    expands[expandedKey] = false
                    totalMenus.push({
                        key: e["DietId"]
                    })

                });
                setMenuTypes(types)
                setExpanded(expands)
                setMenus(totalMenus)
            })

    }
    // useEffect(() => {
    //     if(menuTypes === null){
    //         getMenuTypes()
    //     }}, [])

    function submitMenu(e){

        //TODO Check whether all fields are filled in
        
        //console.log(menus);
        var approvedMenus = []
        menus.forEach( menu => {
            if (menu["calendar"]) {
                approvedMenus.push(menu)
            }
        })
        var post_config = {
            method: 'post',
            url: `${backendIP}/setWeeklyMenus`,
            data: {
              weeklyMenus: approvedMenus,
              date: weekday
            }
        }
        axios(post_config).then( (res) => {
            //console.log(res)
            return (
                alert("Menus have been created")
            )
        },(err)=> {
            console.log(err)
        })
    }

    function setDishesInDiet(dietId, dishes, isNew){
        menus.map( (dietMenu, index) => {

            //add dishes to its editarMenu equivalent
            if (dietMenu.key === dietId) {
                //console.log(dietId)
                menus[index]["calendar"] = dishes
                menus[index]["isNew"] = isNew

                /*
                REGULAR entirely to ATLETA

                PESCATARIAN Breakfast onto VEGETARIAN
                */
            }
            //REGULAR changes are put into Atleta
            // if(dietMenu.key === "ATL"){

            //     if (dietId === "REG"){
            //         console.log("Adding dish from REG to ATL")

            //         menus[index]["calendar"] = dishes
            //         menus[index]["isNew"] = isNew

            //     }
            // } else if (dietMenu.key === "VEG"){
            //     //adding breakfast from PSC to VEG
            //     if(dietId==="PSC"){
            //         console.log("Adding PSC breakfasts to VEG")
            //         // if(menus[index]["calendar"].length > 0){
            //             menus[index]["calendar"][0] = dishes[0]
            //         // } else {

            //         // }
            //     }
            // }

                setMenus(menus)
                
            })
    }


    useEffect( () => {
        console.log("I loaded right now.")
    },[])

    /*
    Where the MenuDate (of Menus table) is picked function. 
    The date picked changes the DietMenu.js weekday prop component
    */
    function datePicked(date, str){
        //console.log(date)
        //console.log(str)
        if(date){
            setWeekday(date["_d"])
        } else {
            setWeekday(null)
        }
    }
    // day/month/year = "/" + today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear()
    return(
        <Form className={styles.container} style={{"flexFlow": "flex"}}>

            <DatePicker style={{margin: "1rem"}} onChange={datePicked} picker="week"/>
            <Button className={styles.submitMenu} name="submit" onClick={submitMenu}>Hacer Schedule</Button>

            {weekday ? null: <p>Escoje una semana para editar su menu...</p>}

            { menuTypes ? 
                menuTypes.map( (diet,index) => {
                    var key = diet.key
                    //console.log(weekday)
                    return (
                        <div key={diet.key} style={{display:"flex",flexFlow:"column wrap"}}>
                            
                            <button style={{width:"100%"}} type="button" className="collapsible" onClick={()=>{setExpanded({...expanded, [key]: !expanded[key]})}} >{diet.diet}</button>
                            {expanded[key] && weekday ? <DietMenu dietId={diet.key} dishesCallback={setDishesInDiet} weekday={weekday}></DietMenu>: null}

                        </div>
                    )

                })
            : null}

            {/* <Modal title="Creando un Menu Nuevo..." visible={promptVisible} onOk={promptFinish} onCancel={promptCancel}>
                <label>Menu para: </label>
                <select name="menuType" id="menuType">
                    {menuTypes.map( option => {
                        return (<option onClick={(e)=>{
                            setMenuOptions({...menuOptions, key: e.target.value});
                        }} value={option.key}>{option.diet}</option>)

                    })}
                </select>
            </Modal> */}
        </Form>
        
    )}
export default EditMenu;
