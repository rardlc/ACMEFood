import React, { useState, useEffect } from "react";
import { AutoComplete, DatePicker, Select } from "antd";
import axios from "axios"
import styles from "./componentCSS/Calendar.module.css"

const { Option } = Select;

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
    const [dishTypes, setDishTypes] = useState([[], [], [], [], [], [], []])

    useEffect(() => {
        console.log("I loaded right now.")
    }, [])

    function datePicked(date, dateString) {
        //console.log(props)

        setDatePick(date)

        if (date) {
            if (props.clientId) {
                var postConfig = {
                    method: "post",
                    url: `../../api/getClientSchedule`,
                    data: {
                        date: date,
                        clientId: props.clientId
                    }
                }
                axios(postConfig).then(
                    res => {
                        // console.log(res.data)

                        if (res.data.length !== 0) {

                            let cal = []
                            // console.log(res.data)
                            res.data.forEach(
                                (schRow, i) => {
                                    let alreadyAdded = false

                                    if (i > 0) {
                                        cal.forEach(
                                            (existingEntry, index) => {
                                                if (existingEntry[0].Date === schRow.Date) {
                                                    cal[index].push(schRow)
                                                    alreadyAdded = true
                                                }
                                            }
                                        )
                                    }

                                    if (!alreadyAdded) {
                                        cal.push([schRow])
                                    }

                                }
                            )

                            // console.log(cal)

                            setDishes(cal)

                        } else {
                            setDishes([])
                        }
                        //console.log(dishes)
                    }
                )
            } else {
                setDishes([])
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

    function getAddrTypes() {
        var types = {}
        if (props.addrs) {
            //console.log(props.addrs)
            props.addrs.forEach(e => {
                types[e.AddrId] = { value: e.AddrId, label: e.StreetNo + " " + e.StreetName + " " + e.Apt + " " + e.ZipCode + " " + e.City }
            });
            setaddrTypes(types)
        }
    }

    function getDishTypes() {
        //console.log("KOWABUNGA")
        var postConfig = {
            method: "post",
            url: `../../api/getEachDaysDishes`,
            data: { date: datePick }
        }

        return axios(postConfig).then(
            (res) => {
                if (res.data) {
                    setDishTypes(res.data)
                }
            })
    }

    useEffect(() => {
        datePicked(datePick, null)
        //get autocomplete options
        getRestTypes()
        getAddrTypes()

    }, [props.clientId])

    useEffect(() => {
        //get autocomplete options
        getAddrTypes()

    }, [props.addrs])

    useEffect(() => {
        props.formCallback(dishes)
        // console.log(dishes)
        //console.log(addrTypes)
    }, [dishes, active, render])

    useEffect(() => {
        //console.log(datePick)
        getDishTypes()
    }, [datePick])

    function onSelect(e) {
        // console.log(e)
        setValidInput(true)
    }

    function onSearchDish(searchText, dishSrc, dishLoc) {
        var matches = []
        for (const [id, desc] of Object.entries(dishSrc)) {
            if (desc["DishDescription"]) {
                var str = desc["DishDescription"].toLowerCase();
                // console.log(str)
                // console.log(searchText.toLowerCase())
                var start = str.search(searchText.toLowerCase());
                // console.log(start)
                if (start !== -1) {
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
        // console.log(searchResult(searchText, matches))
        setDishOptions(searchText ? searchResult(searchText, matches, dishLoc) : []);
    }

    function searchResult(searchTerm, matches, dishLoc) {
        return matches.map(
            (match, idx) => {
                // console.log(match)
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
                                let mealI = dishLoc[1]
                                let mealName = dishLoc[2]

                                // console.log(dishLoc)

                                dishes[dayI][mealI][mealName] = match["DishId"]
                                dishes[dayI][mealI][mealName + "Desc"] = match["DishDescription"]

                                setDishOptions(null)
                                setDishes([...dishes])
                                setValidInput(true)
                                console.log(dishes)

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

    function onSearchAddress(searchText) {
        //console.log(searchText)
        var matches = []
        for (const [id, desc] of Object.entries(addrTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if (start !== -1) {
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
        , [dishOptions])

    const mealHeaders = ["BFast", "Lunch", "Dinner", "Extra", "Snack"]
    const dayHeaders = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
    return (
        <div>
            <DatePicker onChange={datePicked} picker="week" />
            {dishes[0] && datePick !== null ?
                <table className={styles.tformat}>
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
                        {
                            mealHeaders.map((mealHeader, mealIndex) => {
                                return (
                                    <tr>
                                        <th className={styles.fullCell}>{mealHeader == "BFast" ? "Breakfast" : mealHeader}</th>
                                        {
                                            dishes.length > 0 ? dishes.map((day, dayI) => {

                                                let mealsExpected = parseInt(props.currWeeklyMeals[(dayI * 5) + mealIndex])
                                                let dataAvailable = day.filter(
                                                    (entry) => {
                                                        if( entry[mealHeader + "Desc"] ){
                                                            return entry;
                                                        }
                                                    }
                                                )
                                                return (
                                                    <td className={day[mealHeader + "Desc"] === "" ? styles.emptyCell : styles.fullCell}
                                                        onBlur={() => setActive()}>
                                                        {
                                                            new Array( parseInt(props.currWeeklyMeals[(dayI * 5) + mealIndex]) ).fill(0).map(
                                                                (_, mealI) => {

                                                                        if (mealsExpected > 0) {

                                                                            mealsExpected--;
                                                                            return (
                                                                                active === dayI + "^" + mealI + "^" + mealHeader + "Desc" ?
                                                                                    <div>
                                                                                        <AutoComplete
                                                                                            allowClear={true}
                                                                                            defaultValue={dataAvailable[mealI] ? dataAvailable[mealI][mealHeader + "Desc"] : ""}
                                                                                            options={dishOptions}
                                                                                            onBlur={(e) => {
                                                                                                if (validInput) {
                                                                                                    console.log(e.target)
                                                                                                    setValidInput(false)
                                                                                                    // dishes[dayI][mealI][mealHeader] = e.target.value;
                                                                                                    // dishes[dayI][mealI][mealHeader + "Desc"] = dishTypes[e.target.value]["label"]
                                                                                                    // setDishes(dishes);                                          
                                                                                                }
                                                                                            }}

                                                                                            style={{
                                                                                                width: 200,
                                                                                                padding: 0
                                                                                            }}
                                                                                            onSelect={onSelect}
                                                                                            onSearch={(searchTerm) => { onSearchDish(searchTerm, dishTypes[dayI], [dayI, mealI,mealHeader]) }}
                                                                                            placeholder="Meal not found; Type to find"
                                                                                            onClear={() => {dishes[dayI][mealI][mealHeader] = ""; dishes[dayI][mealI][mealHeader + "Desc"] = ""; setDishes([...dishes]); setValidInput(false); }}
                                                                                        />
                                                                                    </div>
                                                                                    : <div
                                                                                        className={ dataAvailable[mealI] && dataAvailable[mealI][mealHeader + "Desc"] && parseInt(props.currWeeklyMeals[(dayI * 5) + mealIndex]) > 0 ? styles.fullCell : styles.emptyCell}
                                                                                        id={dayI + "^" + mealI + "^" + mealHeader + "Desc"}
                                                                                        onClick={(e) => { setActive(e.target.id) }}>
                                                                                        {dataAvailable[mealI] ? dataAvailable[mealI][mealHeader + "Desc"] : ""}
                                                                                        
                                                                                    </div>
                                                                            )
                                                                        }
                                                                }
                                                            )
                                                        }
                                                    </td>
                                                )
                                            }) : null
                                        }
                                    </tr>
                                )
                            })
                        }

                        <tr>
                            <th className={styles.fullCell}>Direccion</th>
                            {dishes.map((day, dayI) => {

                                return (
                                    active === dayI + "^" + "AddrId" ?
                                        <td><AutoComplete
                                            allowClear={true}
                                            defaultValue={day["Addr"]}
                                            options={addrOptions}
                                            onBlur={(e) => {
                                                if (validInput) {
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
                                            onClear={() => { setValidInput(false); dishes[dayI]["Addr"] = ""; dishes[dayI]["AddrDesc"] = ""; setDishes(dishes) }}
                                            placeholder="Address not found; Type to find"
                                        /></td>
                                        : <td className={!day["Addr"] && props.currWeeklyMeals[(dayI * 5) + 1] === "1" ? styles.emptyCell : styles.fullCell} id={dayI + "^" + "AddrId"} onClick={(e) => { setActive(e.target.id) }}>{day["Addr"]}</td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
                : null}
        </div>)
}
export default Calendar;