import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DietMenu from "../popups/DietMenu.js"
import {Card,Tag,Form,Input,Button,Dropdown, Menu,Modal, DatePicker} from "antd"
import SearchBox from "../components/SearchBox"
import RestrictionPopup from "../popups/RestrictionPopup.js";
import styles from "./CSS/EditarMenu.css"

const axios = require('axios');



function EditMenu () {

    const history = useHistory()
    const [menus, setMenus] = useState([{key: "REG"}, {key: "KTO"}])
    const [menuTypes, setMenuTypes] = useState([{key:"REG", diet:"Regular"},{key:"KTO", diet:"Keto"}])

    const [expanded, setExpanded] = useState({"REG": false,"KTO": false})

    const [today, setToday] = useState(new Date())
    const [weekday, setWeekday] = useState()


    function getMenuTypes() {
        return axios.get("http://localhost:3001/getDietTypes").then(
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
            url: 'http://localhost:3001/setWeeklyMenus',
            data: {
              weeklyMenus: approvedMenus,
              date: weekday
            }
        }
        axios(post_config).then( (res) => {
            //console.log(res)
            return (
                history.push("/ajustes")
            )
        },(err)=> {
            //console.log(err)
        })
    }

    function setDishesInDiet(dietId, dishes, isNew){
        menus.map( (dietMenu, index) => {
            if (dietMenu.key === dietId) {
                //console.log(dietId)
                menus[index]["calendar"] = dishes
                menus[index]["isNew"] = isNew
                setMenus(menus)
            }
        })
    }


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
        <Form style={{"flexFlow": "flex"}}>
            <DatePicker onChange={datePicked} picker="week"/>
            { menuTypes ? 
                menuTypes.map( (diet) => {
                    var key = diet.key
                    //console.log(weekday)
                    return (
                        <>
                            <button type="button" className="collapsible" onClick={()=>{setExpanded({...expanded, [key]: !expanded[key]})}} >{diet.diet}</button>
                            {expanded[key] && weekday ? <DietMenu dietId={diet.key} dishesCallback={setDishesInDiet} weekday={weekday}></DietMenu>: "Escoje una semana para editar su menu..."}

                        </>
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
            <Button name="submit" onClick={submitMenu}>Hacer Schedule</Button>
        </Form>
        
    )}
export default EditMenu;
