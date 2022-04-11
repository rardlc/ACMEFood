import React, { useState, useEffect } from "react";
import {AutoComplete, DatePicker, Select} from "antd";
import axios from "axios"
import styles from "./componentCSS/Calendar.module.css"

const {Option} = Select;

const backendIP = "../../api"

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
    const [dishTypes, setDishTypes] = useState([[],[],[],[],[],[],[]])

    useEffect( () => {
        console.log("I loaded right now.")
    },[])
    
    function datePicked(date, dateString) {
        //console.log(props)

        setDatePick(date)

        if(date){
            if(props.clientId){
                var postConfig = {
                    method: "post",
                    url: `../../api/getClientSchedule`,
                    data: {
                        date : date,
                        clientId: props.clientId
                    }
                }
                axios(postConfig).then(
                    res => {
                        console.log(res.data)

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
                        //console.log(dishes)
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
                //console.log(res)
                res.data.forEach(e => {
                    types.push(e.RestDescription)
                });
                setRestTypes(types)
            })
 
    }

    function getAddrTypes(){
        var types = {}
        if (props.addrs){
            //console.log(props.addrs)
            props.addrs.forEach(e => {
                types[e.AddrId] = {value: e.AddrId, label: e.StreetNo + " " + e.StreetName + " " + e.Apt + " " + e.ZipCode + " " + e.City}
            });
            setaddrTypes(types)
        }
    }

    function getDishTypes() {
        //console.log("KOWABUNGA")
        var postConfig = {
            method: "post",
            url: `../../api/getEachDaysDishes`,
            data: {date: datePick}
        }

        return axios(postConfig).then(
            (res) => {
                if(res.data){
                    setDishTypes(res.data)
                }
            })
    }

    useEffect(() => {
        datePicked(datePick,null)
        //get autocomplete options
        getRestTypes()
        getAddrTypes()

    }, [props.clientId])

    useEffect(() => {
        //get autocomplete options
        getAddrTypes()

    }, [props.addrs])

    useEffect( () => {
        props.formCallback(dishes)
        console.log(dishes)
        //console.log(addrTypes)
    }, [dishes, active, render])

    useEffect( ()=> {
        //console.log(datePick)
        getDishTypes()
    },[datePick])

    function onSelect(e,dishLoc){
        console.log(e)

        
        setValidInput(true)
    }

    function onSearchDish(searchText, dishSrc, dishLoc){
        var matches = []
        for (const [id, desc] of Object.entries(dishSrc)) {
            if(desc["DishDescription"]){
                var str = desc["DishDescription"].toLowerCase();
                console.log(str)
                console.log(searchText.toLowerCase())
                var start = str.search(searchText.toLowerCase());
                console.log(start)
                if(start !== -1){
                    matches.push(dishSrc[id])
                }
            }
        }
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        console.log(searchResult(searchText, matches))
        setDishOptions(searchText ? searchResult(searchText, matches, dishLoc) : []);
    }

    function searchResult(searchTerm, matches, dishLoc){
        return matches.map(
            (match, idx) => {
                console.log(match)
                return {
                    key: match["DishId"],
                    value: match["DishDescription"],
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                            onClick={() => {
                                let dayI = dishLoc[0]
                                let meal = dishLoc[1]

                                console.log(dishLoc)

                                dishes[dayI][meal] = match["DishId"]
                                dishes[dayI][meal + "Desc"] = match["DishDescription"]

                                setDishOptions(null)
                                setDishes([...dishes])

                            }}
                        >
                            <span>
                                {match["DishDescription"]}
                            </span>

                        </div>
                    )
                }

            }
        )
    }

    function onSearchAddress(searchText){
        //console.log(searchText)
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

    useEffect(() => {
        // console.log(dishOptions)
        }
    ,[dishOptions])


    return(
    <div>
        <DatePicker onChange={datePicked} picker="week" />
        {dishes[0] && datePick !== null ? 
        <table>
            <thead>
                <th className={styles.fullCell}></th>
                <th className={styles.fullCell}>Domingo</th>
                <th className={styles.fullCell}>Lunes</th>
                <th className={styles.fullCell}>Martes</th>
                <th className={styles.fullCell}>Miercole</th>
                <th className={styles.fullCell}>Jueves</th>
                <th className={styles.fullCell}>Viernes</th>
                <th className={styles.fullCell}>Sabado</th>
            </thead>
            <tbody>
                <tr> 
                    <th className={styles.fullCell}>Desayuno</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "BFast" ? 
                        <td className={ day["BFastDesc"] === "" && props.currWeeklyMeals[(dayI * 5) + 0] === "1" ? styles.emptyCell: styles.fullCell}><AutoComplete
                               allowClear={true}
                               defaultValue={day["BFastDesc"]} 
                               options={dishOptions}
                               onBlur={(e) => {
                                    if(validInput){
                                        console.log(e.target)
                                        setValidInput(false)
                                        // dishes[dayI]["BFast"] = e.target.value;
                                        // dishes[dayI]["BFastDesc"] = dishTypes[e.target.value]["label"]
                                        // setDishes(dishes);                                         
                                    }
                                    setActive()
                                }}
                               onClear={() => {setValidInput(false);dishes[dayI]["BFast"] = ""; dishes[dayI]["BFastDesc"] = ""; setDishes(dishes)}}
                               style={{
                                   width: 200,
                                   padding: 0,
                                   margin: 0
                               }}
                               onSelect={(e) => {onSelect(e,[dayI,"BFast"])}}
                               onSearch={(searchTerm) => {onSearchDish(searchTerm, dishTypes[dayI], [dayI,"BFast"])}}
                               placeholder="Meal not found; Type to find"
                               /></td>
                        :<td className={ !day["BFastDesc"] && props.currWeeklyMeals[(dayI * 5) + 0] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "BFast"} onClick={(e)=>{setActive(e.target.id)}}>{day["BFastDesc"]}</td>
                        )
                    })}
                    
                </tr>
                <tr> 
                    <th className={styles.fullCell}>Almuerzo</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "LunchDesc" ? 
                        <td className={ day["LunchDesc"] === "" ? styles.emptyCell: styles.fullCell}><AutoComplete
                        allowClear={true}

                        defaultValue={day["LunchDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target)
                                setValidInput(false)
                                // dishes[dayI]["Lunch"] = e.target.value;
                                // dishes[dayI]["LunchDesc"] = dishTypes[e.target.value]["label"]
                                // setDishes(dishes);                                      
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                            padding: 0
                        }}
                        onSelect={onSelect}
                        onSearch={(searchTerm) => {onSearchDish(searchTerm, dishTypes[dayI], [dayI,"Lunch"])}}
                        onClear={() => {setValidInput(false);dishes[dayI]["Lunch"] = ""; dishes[dayI]["LunchDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        /></td>
                        :<td className={ !day["LunchDesc"] && props.currWeeklyMeals[(dayI * 5) + 1] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "LunchDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["LunchDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th className={styles.fullCell}>Cena</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "DinnerDesc" ?                         
                        <td className={ day["DinnerDesc"] === "" && active !== dayI + "^" + "DinnerDesc" ? styles.emptyCell: styles.fullCell}><AutoComplete
                        allowClear={true}
                        defaultValue={day["DinnerDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target)
                                setValidInput(false)
                                // dishes[dayI]["Dinner"] = e.target.value;
                                // dishes[dayI]["DinnerDesc"] = dishTypes[e.target.value]["label"]
                                // setDishes(dishes);                                     
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                            padding: 0
                        }}
                        onSelect={onSelect}
                        onSearch={(searchTerm) => {onSearchDish(searchTerm, dishTypes[dayI], [dayI,"Dinner"])}}
                        onClear={() => {setValidInput(false);dishes[dayI]["Dinner"] = ""; dishes[dayI]["DinnerDesc"] = ""; setDishes(dishes)}}
                        placeholder="Meal not found; Type to find"
                        /></td>
                        :<td className={ !day["DinnerDesc"] && props.currWeeklyMeals[(dayI * 5) + 2] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "DinnerDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["DinnerDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th className={styles.fullCell}>Extra</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "ExtraDesc" ?                         
                        <td className={ day["ExtraDesc"] === "" ? styles.emptyCell: styles.fullCell} ><AutoComplete
                        allowClear={true}

                        defaultValue={day["ExtraDesc"]} 
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target)
                                setValidInput(false)
                                // dishes[dayI]["Extra"] = e.target.value;
                                // dishes[dayI]["ExtraDesc"] = dishTypes[e.target.value]["label"]
                                // setDishes(dishes);                                    
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                            padding: 0
                        }}
                        onSelect={onSelect}
                        onClear={() => {setValidInput(false);dishes[dayI]["Extra"] = ""; dishes[dayI]["ExtraDesc"] = ""; setDishes(dishes)}}
                        onSearch={(searchTerm) => {onSearchDish(searchTerm, dishTypes[dayI], [dayI,"Extra"])}}
                        placeholder="Meal not found; Type to find"
                        /></td>
                        :<td className={ !day["ExtraDesc"] && props.currWeeklyMeals[(dayI * 5) + 3] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "ExtraDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["ExtraDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th className={styles.fullCell}>Snack</th>
                    {dishes.map((day, dayI) =>{
                        return(
                        active === dayI + "^" + "SnackDesc" ?                         
                        <td><AutoComplete
                        allowClear={true}
                        defaultValue={day["SnackDesc"]}
                        options={dishOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target)
                                setValidInput(false)
                                // dishes[dayI]["Snack"] = e.target.value;
                                // dishes[dayI]["SnackDesc"] = dishTypes[e.target.value]["label"]
                                // setDishes(dishes);                                          
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                            padding: 0
                        }}
                        onSelect={onSelect}
                        onSearch={(searchTerm) => {onSearchDish(searchTerm, dishTypes[dayI], [dayI,"Snack"])}}
                        placeholder="Meal not found; Type to find"
                        onClear={() => {setValidInput(false);dishes[dayI]["Snack"] = ""; dishes[dayI]["SnackDesc"] = ""; setDishes(dishes)}}
                        /></td>
                        :<td className={ !day["SnackDesc"] && props.currWeeklyMeals[(dayI * 5) + 4] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "SnackDesc"} onClick={(e)=>{setActive(e.target.id)}}>{day["SnackDesc"]}</td>
                        )
                    })}
                </tr>
                <tr> 
                    <th className={styles.fullCell}>Direccion</th>
                    {dishes.map((day, dayI) =>{

                        return(
                        active === dayI + "^" + "AddrId" ?                         
                        <td><AutoComplete
                        allowClear={true}
                        defaultValue={day["Addr"]} 
                        options={addrOptions}
                        onBlur={(e) => {
                             if(validInput){
                                console.log(e.target)
                                setValidInput(false)
                                dishes[dayI]["AddrId"] = e.target.value;
                                dishes[dayI]["Addr"] = addrTypes[e.target.value]["label"]
                                setDishes(dishes);                            
                             }
                             setActive()
                         }}
                        style={{
                            width: 200,
                            padding: 0
                        }}
                        onSelect={onSelect}
                        onSearch={onSearchAddress}
                        onClear={() => {setValidInput(false);dishes[dayI]["Addr"] = ""; dishes[dayI]["AddrDesc"] = ""; setDishes(dishes)}}
                        placeholder="Address not found; Type to find"
                        /></td>
                        :<td className={ !day["Addr"] && props.currWeeklyMeals[(dayI * 5) + 1] === "1"? styles.emptyCell: styles.fullCell} id={dayI + "^" + "AddrId"} onClick={(e)=>{setActive(e.target.id)}}>{day["Addr"]}</td>
                        )
                    })}
                </tr>
            </tbody>
        </table>
        :null}
    </div>)}
export default Calendar;