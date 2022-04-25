import React, { useState, useEffect } from "react";
import { AutoComplete, DatePicker, Select } from "antd";
import axios from "axios"
import styles from "./componentCSS/Calendar.module.css"


class _Calendar {
    totalMeals = 5;
    totalDays = 7;

    getTopMealCount(day, expectedClientMeals) {
        //for this day, find out the max loop count in each meal of this client
        let topLoopCount = 1
        let totalMeals = 5

        const clientMealWeek = expectedClientMeals.substring(day * this.totalMeals, day * this.totalMeals + this.totalMeals) //this client's meals for this week

        for (var i = 0; i < clientMealWeek.length; i++) {
            const currentMealAmount = parseInt(clientMealWeek.charAt(i))

            if (currentMealAmount > topLoopCount) {
                topLoopCount = currentMealAmount
            }
        }

        return topLoopCount
    }

    //a string of mealCount
    constructor(mealCount) {

        for (let dayI = 1; dayI <= this.totalDays; dayI++) {
            let maxEntries = this.getTopMealCount(dayI, mealCount)
            //it should look like the DB
            for (let mealI = 1; mealI <= this.totalMeals; mealI++) {

            }

        }

        for (let index = 0; index < mealCount.length; index += (this.totalMeals - 1)) {

            let topLoopCount = getTopMealCount(client["WeeklyMeal"]);

            for (let mealIndex = 0; mealIndex < topLoopCount.length; mealIndex++) {
                const element = array[mealIndex];

            }
            const mealQuantity = mealCount[index];


            let newDishEntry = {
                "EntryId": entryId,
                "ClientId": props.clientId,
                "BFast": "",
                "BFastDesc": "",
                "Lunch": "",
                "LunchDesc": "",
                "Dinner": "",
                "DinnerDesc": "",
                "Extra": "",
                "ExtraDesc": "",
                "Snack": "",
                "SnackDesc": "",
            }






        }


    }

}


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


    const mealHeaders = ["BFast", "Lunch", "Dinner", "Extra", "Snack"]
    const spanishMeals = ["Desayuno", "Almuerzo", "Comida", "Extra", "Merienda"]

    // const dayHeaders = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]

    useEffect(() => {
        console.log("I loaded right now.")
        let expectedWeeklyMeals = props.currWeeklyMeals

        let constructorDishes = []

        for (let index = 0; index < expectedWeeklyMeals.length; index += mealHeaders.length) {
            let expectedMeals = expectedWeeklyMeals.slice(index, index + mealHeaders.length)
            let maxForWeek = 1;

            expectedMeals.forEach(mealQuantity => {
                if (mealQuantity > maxForWeek) {
                    maxForWeek = mealQuantity
                }
            });
            let expectedEntries = []

            for (let index = 0; index < maxForWeek; index++) {
                expectedEntries.push({})
            }
            constructorDishes.push(expectedEntries)
        }

        setDishes(constructorDishes)
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

                            // console.log(res.data)

                            let dayI = 0;
                            let prevDate = res.data[0].Date
                            let entryIndex = 0;
                            res.data.forEach(
                                //schRows are days though some days have more than 1 schRow
                                (schRow) => {

                                    if (!(schRow.Date === prevDate)) {
                                        entryIndex = 0;
                                        dayI++;
                                        prevDate = schRow.Date
                                    }

                                    dishes[dayI][entryIndex] = schRow;


                                    mealHeaders.forEach(
                                        (mealHeader, mealIndex) => {
                                            let expectedForThisMeal = parseInt(props.currWeeklyMeals[dayI * mealHeaders.length + mealIndex])

                                            if(dishes[dayI][entryIndex][mealHeader] && expectedForThisMeal <= entryIndex){
                                                dishes[dayI][entryIndex][mealHeader] = ""
                                                dishes[dayI][entryIndex][mealHeader + "Desc"] = ""
                                            }

                                        }
                                    )

                                    entryIndex++;
                                }
                            )


                            setDishes([...dishes])
                        }
                        console.log(dishes)
                    }
                )
            }

            props.sendDate(date)

        }
    }

    const [entryId, setEntryId] = useState(-1);

    function addDish(dayI, mealI, mealHeader, mealId, mealDesc) {


        if (!dishes[dayI]) {
            dishes[dayI] = []
        }

        if (dishes[dayI][mealI] && dishes[dayI][mealI]["Date"]) {

            dishes[dayI][mealI][mealHeader] = mealId
            dishes[dayI][mealI][mealHeader + "Desc"] = mealDesc
            setDishes([...dishes])

        } else {
            console.log("DOES THIS EVER")
            let newDishEntry = {
                "EntryId": entryId,
                "ClientId": props.clientId,
                "Date": dishes[dayI][0].Date,
                "BFast": "",
                "BFastDesc": "",
                "Lunch": "",
                "LunchDesc": "",
                "Dinner": "",
                "DinnerDesc": "",
                "Extra": "",
                "ExtraDesc": "",
                "Snack": "",
                "SnackDesc": "",
                "Addr": dishes[dayI][0].Addr,
                "AddrId": dishes[dayI][0].AddrId
            }

            setEntryId(currEntry => currEntry - 1)

            newDishEntry[mealHeader] = mealId
            newDishEntry[mealHeader + "Desc"] = mealDesc

            dishes[dayI][mealI] = newDishEntry

            setDishes([...dishes])

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
        //console.log(addrTypes)
    }, [dishes, active, render])

    useEffect(() => {
        datePicked(datePick, null)
    },[props.currWeeklyMeals])

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
        console.log(matches.length)
        if (matches.length > 0) {
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
                                    //set dishes

                                    addDish(dayI, mealI, mealName, match["DishId"], match["DishDescription"])
                                    setDishOptions(null)
                                    setValidInput(true)

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

    }

    function onSearchAddress(searchText, dayI) {
        var matches = []
        for (const [id, desc] of Object.entries(addrTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(searchText.toLowerCase());
            if (start !== -1) {
                matches.push(addrTypes[id])
            }
        }
        console.log(matches)
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setAddrOptions(searchText ? searchAddrResult(searchText, matches, dayI) : []);
    }

    function searchAddrResult(searchText, matches, dayI) {
        if (matches.length > 0) {
            return matches.map(
                (match, idx) => {
                    return {
                        key: match["value"],
                        value: match["label"],
                        label: (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                                onClick={() => {

                                    dishes[dayI].forEach(
                                        (_, entryI) => {
                                            dishes[dayI][entryI]["Addr"] = match["label"]
                                            dishes[dayI][entryI]["AddrId"] = match["value"]
                                        }

                                    )
                                    setDishes([...dishes])
                                    //set dishes
                                    setAddrOptions(null)
                                    setValidInput(true)

                                }}
                            >
                                <span>
                                    {match["label"]}
                                </span>

                            </div>
                        )
                    }

                }
            )
        }
    }

    useEffect(() => {
        // console.log(dishOptions)
    }
        , [dishOptions])


    return (
        <div>
            <DatePicker onChange={datePicked} picker="week" />
            {datePick ?
                <table className={styles.tformat}>
                    <thead>
                        <th className={styles.fullCell}></th>
                        <th className={styles.fullCell}>Domingo</th>
                        <th className={styles.fullCell}>Lunes</th>
                        <th className={styles.fullCell}>Martes</th>
                        <th className={styles.fullCell}>Miercoles</th>
                        <th className={styles.fullCell}>Jueves</th>
                        <th className={styles.fullCell}>Viernes</th>
                        <th className={styles.fullCell}>Sabado</th>
                    </thead>
                    <tbody>
                        {
                            mealHeaders.map((mealHeader, mealIndex) => {
                                return (
                                    <tr>
                                        <th className={styles.fullCell}>{spanishMeals[mealIndex]}</th>
                                        {
                                            dishes.map((day, dayI) => {

                                                let expectedMeals = parseInt(props.currWeeklyMeals[dayI * mealHeaders.length + mealIndex])

                                                return (
                                                    <td className={styles.fullCell}
                                                        onBlur={() => setActive()}>
                                                        {
                                                            new Array(expectedMeals).fill(0).map(
                                                                (_, mealI) => {

                                                                    return (
                                                                        active === dayI + "^" + mealI + "^" + mealHeader + "Desc" ?
                                                                            <div>
                                                                                {dishTypes[dayI][0]["DishId"].length > 0 ? null : "El Menu de este día no contiene ninguna comida"}
                                                                                <AutoComplete
                                                                                    key={dayI + "^" + mealI + "^" + mealHeader + "Desc"}
                                                                                    allowClear={true}
                                                                                    defaultValue={dishes[dayI][mealI] ? dishes[dayI][mealI][mealHeader + "Desc"] : null}
                                                                                    options={dishOptions}
                                                                                    // onBlur={(e) => {
                                                                                    //     if (validInput) {
                                                                                    //         console.log(e.target)
                                                                                    //         setValidInput(false)
                                                                                    //         // dishes[dayI][mealI][mealHeader] = e.target.value;
                                                                                    //         // dishes[dayI][mealI][mealHeader + "Desc"] = dishTypes[e.target.value]["label"]
                                                                                    //         // setDishes(dishes);                                          
                                                                                    //     }
                                                                                    // }}

                                                                                    style={{
                                                                                        width: 200,
                                                                                        padding: 0
                                                                                    }}
                                                                                    onSelect={onSelect}
                                                                                    onSearch={(searchTerm) => { onSearchDish(searchTerm, dishTypes[dayI], [dayI, mealI, mealHeader]) }}
                                                                                    placeholder="Meal not found; Type to find"
                                                                                    onClear={() => { addDish(dayI, mealI, mealHeader, "", ""); setValidInput(false); }}
                                                                                />
                                                                            </div>
                                                                            : <div
                                                                                key={dayI + "^" + mealI + "^" + mealHeader + "Desc"}
                                                                                className={dishes[dayI][mealI] && dishes[dayI][mealI][mealHeader] && parseInt(props.currWeeklyMeals[(dayI * 5) + mealIndex]) > 0 ? styles.innerCell : styles.emptyCell}
                                                                                id={dayI + "^" + mealI + "^" + mealHeader + "Desc"}
                                                                                onClick={(e) => { setActive(e.target.id) }}>
                                                                                {dishes[dayI][mealI] ? dishes[dayI][mealI][mealHeader + "Desc"] : null}

                                                                            </div>
                                                                    )
                                                                }
                                                            )
                                                        }
                                                    </td>
                                                )
                                            }
                                            )
                                        }
                                    </tr>
                                )
                            })
                        }

                        <tr>
                            <th className={styles.fullCell}>Direccion</th>
                            {dishes.map((day, dayI) => {

                                return (
                                    <td  className={styles.fullCell}
                                        onBlur={() => setActive()}>
                                        {
                                            active === dayI + "^" + 0 + "^" + "Addr" ?
                                                <div>
                                                    <AutoComplete
                                                        key={dayI + "^" + 0 + "^" + "Addr"}
                                                        allowClear={true}
                                                        defaultValue={dishes[dayI][0] ? dishes[dayI][0]["Addr"] : null}
                                                        options={addrOptions}

                                                        style={{
                                                            width: 200,
                                                            padding: 0
                                                        }}
                                                        onSelect={onSelect}
                                                        onSearch={(searchTerm) => { onSearchAddress(searchTerm, dayI) }}
                                                        placeholder="Address not found; Type to find"
                                                        onClear={() => {
                                                            dishes[dayI].forEach(
                                                                (_, entryI) => {
                                                                    dishes[dayI][entryI]["Addr"] = ""
                                                                    dishes[dayI][entryI]["AddrId"] = ""
                                                                }

                                                            ); setDishes([...dishes]); setValidInput(false);
                                                        }}
                                                    />
                                                </div>
                                                : <div
                                                    key={dayI + "^" + 0 + "^" + "Addr"}
                                                    className={dishes[dayI][0]["Addr"] ? styles.innerCell : styles.emptyCell}
                                                    id={dayI + "^" + 0 + "^" + "Addr"}
                                                    onClick={(e) => { setActive(e.target.id) }}>
                                                    {dishes[dayI][0] ? dishes[dayI][0]["Addr"] : -1}
                                                </div>
                                        }
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
                : null}
        </div>)
}
export default Calendar;