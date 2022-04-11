<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import {Input, Form, Card, Tag, AutoComplete, DatePicker, Select} from "antd";
import axios from "axios"
import RestrictionPopup from "./RestrictionPopup.js";
import SearchBox from "./SearchBox.js";
import styles from "./componentCSS/Calendar.module.css"
import { useLocation } from "react-router-dom";

const {Option} = Select;
const backendIP = "http://localhost:3000"

const Calendar = props => {

    
    const [dishes, setDishes] = useState([]) 

    const [active, setActive] = useState()
    const [render, setRender] = useState(false)
    const [validInput, setValidInput] = useState(false)
    const [dishOptions, setDishOptions] = useState([])
    const [addrTypes, setaddrTypes] = useState([])
    const [addrOptions, setAddrOptions] = useState([])
    const [datePick, setDatePick] = useState()


    const [restTypes, setRestTypes] = useState(null)
    const [dishTypes, setDishTypes] = useState(null)

    
    function datePicked(date, dateString) {
        console.log(props)

        setDatePick(date)

        if(date){
            if(props.clientId){
                var postConfig = {
                    method: "post",
                    url: `${backendIP}/getClientSchedule`,
                    data: {
                        date : date,
                        clientId: props.clientId
                    }
                }
                axios(postConfig).then(
                    res => {
                        if(res.data.length !== 0){
                            setDishes(res.data)
                        } else {
                            setDishes([{"key":"Lunes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "", "AddrId":""},
                            {"key":"Martes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Miercole","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Jueves","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Viernes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Sabado","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Domingo","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""}])
                        }
                        console.log(dishes)
                    }
                )
            } else {
                setDishes([{"key":"Lunes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Martes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Miercole","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Jueves","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Viernes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Sabado","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Domingo","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""}])
            }
            props.sendDate(date)

        }
    }

    function getRestTypes() {
        return axios.get(`${backendIP}/getRestrictionTypes`).then(
            (res) => {
                var types = []
                console.log(res)
                res.data.forEach(e => {
                    types.push(e.RestDescription)
                });
                setRestTypes(types)
            })
 
    }

    function getAddrTypes(){
        var types = {}
        if (props.addrs){
            console.log(props.addrs)
            props.addrs.forEach(e => {
                types[e.AddrId] = {value: e.AddrId, label: e.StreetNo + " " + e.StreetName + " " + e.Apt + " " + e.ZipCode + " " + e.City}
            });
            setaddrTypes(types)
        }
    }

    function getDishTypes() {
        var postConfig = {
            method: "post",
            url: `${backendIP}/getDishTypes`,
            data: {dietId: props.dietId}
        }

        return axios(postConfig).then(
            (res) => {
                var types = {}
                console.log(res)
                res.data.forEach(e => {
                    types[e.DishId] = {value: e.DishId, label:e.DishDescription}
                });
                setDishTypes(types)
            })
    }

    useEffect(() => {
        datePicked(datePick,null)
        //get autocomplete options
        getRestTypes()
        getDishTypes()
        getAddrTypes()

    }, [props.clientId])

    useEffect(() => {
        //get autocomplete options
        getAddrTypes()

    }, [props.addrs])

    useEffect( () => {
        props.formCallback(dishes)
        console.log(dishes)
    }, [dishes, active, render])

    useEffect( ()=> {
        console.log("reached")
        getDishTypes()
    },[props.dietId])
    function onSelect(e){
        console.log(e)
        setValidInput(true)
    }

    function onSearchDish(searchText){
        console.log(searchText)
        var matches = []
        for (const [id, desc] of Object.entries(dishTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if(start !== -1){
                matches.push(dishTypes[id])
            }
        }
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setDishOptions(searchText ? matches : []);
    }

    function onSearchAddress(searchText){
        console.log(searchText)
        var matches = []
        for (const [id, desc] of Object.entries(addrTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if(start !== -1){
                matches.push(addrTypes[id])
            }
        }
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setAddrOptions(searchText ? matches : []);
    }

    return(
    <div>
        <DatePicker onChange={datePicked} picker="week" />
        {dishes[0] && datePick !== null ? 
        <table>
            <thead>
                <th></th>
                <th>Domingo</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miercole</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sabado</th>
            </thead>
            <tbody className={styles.center}>
                <tr className={styles.center}> 
                    <th>Desayuno</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "BFast" ? 
                        <AutoComplete
                               allowClear={true}
                               defaultValue={day["BFastDesc"]} 
                               options={dishOptions}
                               onBlur={(e) => {
                                    if(validInput){
                                        console.log(e.target.value)
                                        setValidInput(false)
                                        dishes[dayI]["BFast"] = e.target.value;
                                        dishes[dayI]["BFastDesc"] = dishTypes[e.target.value]["label"]
                                        setDishes(dishes);                                         
                                    }
                                    setActive()
                                }}
                               onClear={() => {setValidInput(false);dishes[dayI]["BFast"] = ""; dishes[dayI]["BFastDesc"] = ""; setDishes(dishes)}}
                               style={{
                                   width: 200
                               }}
                               onSelect={(e) => {onSelect(e,dayI + "^" + "BFast")}}
                               onSearch={onSearchDish}
                               placeholder="Meal not found; Type to find"
                               />
                        :<td className={ day["BFastDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "BFast"} onClick={(e)=>{setActive(e.target.id)}}>{day["BFastDesc"]}</td>
                        )
                    })}
                    
                </tr>
                <tr> 
                    <th>Almuerzo</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "LunchDesc" ? 
                        <AutoComplete
                        allowClear={true}

                        defaultValue={day["LunchDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Lunch"] = e.target.value;
                                dishes[dayI]["LunchDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                      
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        onClear={() => {setValidInput(false);dishes[dayI]["Lunch"] = ""; dishes[dayI]["LunchDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["LunchDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "LunchDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["LunchDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Cena</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "DinnerDesc" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["DinnerDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Dinner"] = e.target.value;
                                dishes[dayI]["DinnerDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                     
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        onClear={() => {setValidInput(false);dishes[dayI]["Dinner"] = ""; dishes[dayI]["DinnerDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["DinnerDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "DinnerDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["DinnerDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Extra</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "ExtraDesc" ?                         
                        <AutoComplete
                        allowClear={true}

                        defaultValue={day["ExtraDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Extra"] = e.target.value;
                                dishes[dayI]["ExtraDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                    
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onClear={() => {setValidInput(false);dishes[dayI]["Extra"] = ""; dishes[dayI]["ExtraDesc"] = ""; setDishes(dishes)}}
                        onSearch={onSearchDish}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["ExtraDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "ExtraDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["ExtraDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Snack</th>
                    {dishes.map((day, dayI) =>{
                        return(
                        active === dayI + "^" + "SnackDesc" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["SnackDesc"]}
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Snack"] = e.target.value;
                                dishes[dayI]["SnackDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                          
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        placeholder="Meal not found; Type to find"
                        onClear={() => {setValidInput(false);dishes[dayI]["Snack"] = ""; dishes[dayI]["SnackDesc"] = ""; setDishes(dishes)}}
                        />
                        :<td className={ day["SnackDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "SnackDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["SnackDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Direccion</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "AddrId" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["Addr"]} 
                        options={addrOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["AddrId"] = e.target.value;
                                dishes[dayI]["Addr"] = addrTypes[e.target.value]["label"]
                                setDishes(dishes);                            
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchAddress}
                        onClear={() => {setValidInput(false);dishes[dayI]["Addr"] = ""; dishes[dayI]["AddrDesc"] = ""; setDishes(dishes)}}
                        placeholder="Address not found; Type to find"
                        />
                        :<td className={ day["Addr"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "AddrId"} onClick={(e)=>{setActive(e.target.id)}}>{day["Addr"]}</td>
                        )
                    })}
                </tr>
            </tbody>
        </table>
        :null}
    </div>)}
=======
import React, { useState, useEffect, useCallback } from "react";
import {Input, Form, Card, Tag, AutoComplete, DatePicker, Select} from "antd";
import axios from "axios"
import RestrictionPopup from "./RestrictionPopup.js";
import SearchBox from "./SearchBox.js";
import styles from "./componentCSS/Calendar.module.css"
import { useLocation } from "react-router-dom";

const {Option} = Select;
const backendIP = "http://localhost:3000"

const Calendar = props => {

    
    const [dishes, setDishes] = useState([]) 

    const [active, setActive] = useState()
    const [render, setRender] = useState(false)
    const [validInput, setValidInput] = useState(false)
    const [dishOptions, setDishOptions] = useState([])
    const [addrTypes, setaddrTypes] = useState([])
    const [addrOptions, setAddrOptions] = useState([])
    const [datePick, setDatePick] = useState()


    const [restTypes, setRestTypes] = useState(null)
    const [dishTypes, setDishTypes] = useState(null)

    
    function datePicked(date, dateString) {
        console.log(props)

        setDatePick(date)

        if(date){
            if(props.clientId){
                var postConfig = {
                    method: "post",
                    url: `${backendIP}/getClientSchedule`,
                    data: {
                        date : date,
                        clientId: props.clientId
                    }
                }
                axios(postConfig).then(
                    res => {
                        if(res.data.length !== 0){
                            setDishes(res.data)
                        } else {
                            setDishes([{"key":"Lunes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "", "AddrId":""},
                            {"key":"Martes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Miercole","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Jueves","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Viernes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Sabado","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                            {"key":"Domingo","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""}])
                        }
                        console.log(dishes)
                    }
                )
            } else {
                setDishes([{"key":"Lunes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Martes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Miercole","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Jueves","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Viernes","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Sabado","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""},
                {"key":"Domingo","BFast": "","Lunch": "","Dinner": "","Extra": "","Snack": "","AddrId":""}])
            }
            props.sendDate(date)

        }
    }

    function getRestTypes() {
        return axios.get(`${backendIP}/getRestrictionTypes`).then(
            (res) => {
                var types = []
                console.log(res)
                res.data.forEach(e => {
                    types.push(e.RestDescription)
                });
                setRestTypes(types)
            })
 
    }

    function getAddrTypes(){
        var types = {}
        if (props.addrs){
            console.log(props.addrs)
            props.addrs.forEach(e => {
                types[e.AddrId] = {value: e.AddrId, label: e.StreetNo + " " + e.StreetName + " " + e.Apt + " " + e.ZipCode + " " + e.City}
            });
            setaddrTypes(types)
        }
    }

    function getDishTypes() {
        var postConfig = {
            method: "post",
            url: `${backendIP}/getDishTypes`,
            data: {dietId: props.dietId}
        }

        return axios(postConfig).then(
            (res) => {
                var types = {}
                console.log(res)
                res.data.forEach(e => {
                    types[e.DishId] = {value: e.DishId, label:e.DishDescription}
                });
                setDishTypes(types)
            })
    }

    useEffect(() => {
        datePicked(datePick,null)
        //get autocomplete options
        getRestTypes()
        getDishTypes()
        getAddrTypes()

    }, [props.clientId])

    useEffect(() => {
        //get autocomplete options
        getAddrTypes()

    }, [props.addrs])

    useEffect( () => {
        props.formCallback(dishes)
        console.log(dishes)
    }, [dishes, active, render])

    useEffect( ()=> {
        console.log("reached")
        getDishTypes()
    },[props.dietId])
    function onSelect(e){
        console.log(e)
        setValidInput(true)
    }

    function onSearchDish(searchText){
        console.log(searchText)
        var matches = []
        for (const [id, desc] of Object.entries(dishTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if(start !== -1){
                matches.push(dishTypes[id])
            }
        }
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setDishOptions(searchText ? matches : []);
    }

    function onSearchAddress(searchText){
        console.log(searchText)
        var matches = []
        for (const [id, desc] of Object.entries(addrTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if(start !== -1){
                matches.push(addrTypes[id])
            }
        }
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setAddrOptions(searchText ? matches : []);
    }

    return(
    <div>
        <DatePicker onChange={datePicked} picker="week" />
        {dishes[0] && datePick !== null ? 
        <table>
            <thead>
                <th></th>
                <th>Domingo</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miercole</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th>Sabado</th>
            </thead>
            <tbody className={styles.center}>
                <tr className={styles.center}> 
                    <th>Desayuno</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "BFast" ? 
                        <AutoComplete
                               allowClear={true}
                               defaultValue={day["BFastDesc"]} 
                               options={dishOptions}
                               onBlur={(e) => {
                                    if(validInput){
                                        console.log(e.target.value)
                                        setValidInput(false)
                                        dishes[dayI]["BFast"] = e.target.value;
                                        dishes[dayI]["BFastDesc"] = dishTypes[e.target.value]["label"]
                                        setDishes(dishes);                                         
                                    }
                                    setActive()
                                }}
                               onClear={() => {setValidInput(false);dishes[dayI]["BFast"] = ""; dishes[dayI]["BFastDesc"] = ""; setDishes(dishes)}}
                               style={{
                                   width: 200
                               }}
                               onSelect={(e) => {onSelect(e,dayI + "^" + "BFast")}}
                               onSearch={onSearchDish}
                               placeholder="Meal not found; Type to find"
                               />
                        :<td className={ day["BFastDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "BFast"} onClick={(e)=>{setActive(e.target.id)}}>{day["BFastDesc"]}</td>
                        )
                    })}
                    
                </tr>
                <tr> 
                    <th>Almuerzo</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "LunchDesc" ? 
                        <AutoComplete
                        allowClear={true}

                        defaultValue={day["LunchDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Lunch"] = e.target.value;
                                dishes[dayI]["LunchDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                      
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        onClear={() => {setValidInput(false);dishes[dayI]["Lunch"] = ""; dishes[dayI]["LunchDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["LunchDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "LunchDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["LunchDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Cena</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "DinnerDesc" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["DinnerDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Dinner"] = e.target.value;
                                dishes[dayI]["DinnerDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                     
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        onClear={() => {setValidInput(false);dishes[dayI]["Dinner"] = ""; dishes[dayI]["DinnerDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["DinnerDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "DinnerDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["DinnerDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Extra</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "ExtraDesc" ?                         
                        <AutoComplete
                        allowClear={true}

                        defaultValue={day["ExtraDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Extra"] = e.target.value;
                                dishes[dayI]["ExtraDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                    
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onClear={() => {setValidInput(false);dishes[dayI]["Extra"] = ""; dishes[dayI]["ExtraDesc"] = ""; setDishes(dishes)}}
                        onSearch={onSearchDish}
                        placeholder="Meal not found; Type to find"
                        />
                        :<td className={ day["ExtraDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "ExtraDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["ExtraDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Snack</th>
                    {dishes.map((day, dayI) =>{
                        return(
                        active === dayI + "^" + "SnackDesc" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["SnackDesc"]}
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["Snack"] = e.target.value;
                                dishes[dayI]["SnackDesc"] = dishTypes[e.target.value]["label"]
                                setDishes(dishes);                                          
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchDish}
                        placeholder="Meal not found; Type to find"
                        onClear={() => {setValidInput(false);dishes[dayI]["Snack"] = ""; dishes[dayI]["SnackDesc"] = ""; setDishes(dishes)}}
                        />
                        :<td className={ day["SnackDesc"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "SnackDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["SnackDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th>Direccion</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "AddrId" ?                         
                        <AutoComplete
                        allowClear={true}
                        defaultValue={day["Addr"]} 
                        options={addrOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target.value)
                                setValidInput(false)
                                dishes[dayI]["AddrId"] = e.target.value;
                                dishes[dayI]["Addr"] = addrTypes[e.target.value]["label"]
                                setDishes(dishes);                            
                             }
                             setActive()
                         }}
                        style={{
                            width: 200
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchAddress}
                        onClear={() => {setValidInput(false);dishes[dayI]["Addr"] = ""; dishes[dayI]["AddrDesc"] = ""; setDishes(dishes)}}
                        placeholder="Address not found; Type to find"
                        />
                        :<td className={ day["Addr"] === "" ? "emptyCell": "fullCell"} id={dayI + "^" + "AddrId"} onClick={(e)=>{setActive(e.target.id)}}>{day["Addr"]}</td>
                        )
                    })}
                </tr>
            </tbody>
        </table>
        :null}
    </div>)}
>>>>>>> 1b4c457f8d7090a80ffc25b9c24e628e0cb28edb
export default Calendar;