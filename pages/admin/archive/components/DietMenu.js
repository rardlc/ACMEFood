/* Diet Menu's calendar rendering and data structure looks different from Calendar.js or
    the database schema for Schedule and Menus. *Despite* that I kept it since its 
    function at setting the schedule from its data structure was tested all the way through and works.*/
import React, { useState, useEffect, useCallback } from "react";
import {Input, Form, Card, Tag, AutoComplete, Button} from "antd";
import axios from "axios"
import RestrictionPopup from "../../client/components/RestrictionPopup";
import SearchBox from "../../components/SearchBox";
import EditDish from "../../client/components/EditDish";

function DietMenu({dietId, dishesCallback, weekday}){

    const [dishOptions, setDishOptions] = useState([]);

    /* Dishes is a 2D array. Each element/array in dishes is a row representing a meal time (breakfast, lunch, etc) 
    and each element of that row contains the dish object (name & restrictions) from monday to friday. */  
    const [dishes, setDishes] = useState([
        [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
        [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
        [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
        [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
        [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}]
    ])

    const [active, setActive] = useState()
    const [render, setRender] = useState(false)

    const [restTypes, setRestTypes] = useState(null)
    const [dishTypes, setDishTypes] = useState(null)
    const [validInput, setValidInput] = useState(false)
    const [editDish, setEditDish] = useState(null)
    const [isNew, setIsNew] = useState(null)
    const [lastValidText, setLastValidText] = useState(null)
    
    function getRestTypes() {
        return axios.get("http://localhost:3001/getRestrictionTypes").then(
            (res) => {
                var types = []
                ////console.log(res)
                res.data.forEach(e => {
                    types.push(e.RestDescription)
                });
                setRestTypes(types)
            })
    }

    /* When a change in the weekday prop happens, 
        each DietMenu will change their dishes state, *overwriting* the current one */
    useEffect(()=>{

        setDishes([
            [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
            [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
            [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
            [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}],
            [{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]},{nom:"",rest:[]}]
        ])
        
        const postConfig = {
            method: "post",
            url: "http://localhost:3001/getWeekMenu",
            data: {date: weekday, dietId: dietId}
        }       

        axios(postConfig).then(
            res => {
                if(res.data.length !== 0){
                    setIsNew(false)
                    // console.log(res.data)
                    res.data.forEach(
                        (day, index) => {
                            //console.log(day,index)
                            dishes[0][index]["id"] = day["BFast01"] //BFAST///////////////////
                            // get description
                            var getDescConfig = {
                                method: "post",
                                url: "http://localhost:3001/getDishDescById",
                                data: {dishId: day["BFast01"]}
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[0][index]["nom"] = res.data["DishDescription"]
                                    setDishes(dishes)
                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: "http://localhost:3001/getRestsByDishId",
                                data: {dishId: day["BFast01"]}            
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[0][index]["rest"] = res.data.map(
                                        rest => { return rest.RestDescription }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[1][index]["id"] = day["Lunch"] //LUNCH//////////////////

                            var getDescConfig = {
                                method: "post",
                                url: "http://localhost:3001/getDishDescById",
                                data: {dishId: day["Lunch"]}
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[1][index]["nom"] = res.data["DishDescription"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: "http://localhost:3001/getRestsByDishId",
                                data: {dishId: day["Lunch"]}            
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[1][index]["rest"] = res.data.map(
                                        rest => { return rest.RestDescription }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[2][index]["id"] = day["Dinner"] //DINNER//////////////////

                            var getDescConfig = {
                                method: "post",
                                url: "http://localhost:3001/getDishDescById",
                                data: {dishId: day["Dinner"]}
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[2][index]["nom"] = res.data["DishDescription"]
                                    setDishes(dishes)

                                }
                            )

                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: "http://localhost:3001/getRestsByDishId",
                                data: {dishId: day["Dinner"]}            
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[2][index]["rest"] = res.data.map(
                                        rest => { return rest.RestDescription }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[3][index]["id"] = day["Extra1"] //////////////////////
                            var getDescConfig = {
                                method: "post",
                                url: "http://localhost:3001/getDishDescById",
                                data: {dishId: day["Extra1"]}
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[3][index]["nom"] = res.data["DishDescription"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: "http://localhost:3001/getRestsByDishId",
                                data: {dishId: day["Extra1"]}            
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[3][index]["rest"] = res.data.map(
                                        rest => { return rest.RestDescription }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[4][index]["id"] = day["Snack"] ///////////////////////////
                            var getDescConfig = {
                                method: "post",
                                url: "http://localhost:3001/getDishDescById",
                                data: {dishId: day["Snack"]}
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[4][index]["nom"] = res.data["DishDescription"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: "http://localhost:3001/getRestsByDishId",
                                data: {dishId: day["Snack"]}            
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[4][index]["rest"] = res.data.map(
                                        rest => { return rest.RestDescription }
                                    )
                                    setDishes(dishes)
                                    setRender(index)

                                }
                            )
                        })
                    }
                }
            ) 
        }
    ,[weekday])

    function getDishTypes() {
        var postConfig = {
            method: "post",
            url: "http://localhost:3001/getDishTypes",
            data: {dietId: dietId}
        }

        return axios(postConfig).then(
            (res) => {
                var types = {}
                ////console.log(res)
                res.data.forEach(e => {
                    types[e.DishId] = {value: e.DishId, label:e.DishDescription}
                });
                setDishTypes(types)
            })
    }

    function deleteRest(e) {
        var idData = e.split("^")
        var restName = idData[0]
        var clone = [...dishes]
        dishes[idData[1]][idData[2]]["rest"] = dishes[idData[1]][idData[2]]["rest"].filter(tag => tag !== restName)
        setDishes(dishes)
    }

    // Set passed dishObj dishes and Set modal to null so it hides itself
    function addDishToDB(dishObj) {
        var [mIndex, dIndex] = editDish["loc"].split("^")
        dishes[mIndex][dIndex] = editDish
        var dishDesc = editDish["nom"]
        var rests = editDish["rest"]
        //set new dish to Dish table
        var postConfig = {
            method: "post",
            url: "http://localhost:3001/setDish",
            data: {dishDesc: dishDesc,
                    rest: rests,
                    diet: dietId}
        }
        axios(postConfig).then(
            (res) => {
                console.log(res.data)
                dishes[mIndex][dIndex]["id"] = res.data
                setDishes(dishes)
                setRender(!render)
                setEditDish(null)
            }
        );




    }

    function exitEditDish(){
        setEditDish(null)

    }


    
    // on mount get all restrictions and dishes
    useEffect(() => {
        if(restTypes === null){
            getRestTypes()
        }
        if(dishTypes === null){
            getDishTypes()
        }
    }, [])

    // when changes happen in below 3 states, set dishes in parent component
    useEffect( () => {
        dishesCallback(dietId, dishes, isNew)
        ////console.log(dishes)

    }, [dishes, active, render])

    useEffect( () => {
        getDishTypes()
    }, [dishes, editDish])
    

    // Main Dish search function for Autocomplete component, 
    const handleDishSearch = (value, label) => {
        var matches = []
        for (const [id, desc] of Object.entries(dishTypes)) {
            var str = desc["label"].toLowerCase();
            var start = str.search(value.toLowerCase());
            if(start !== -1){
                matches.push(dishTypes[id])
            }
        }
        matches.push({"value": "Añadir " + value, "label": "Añadir " + value})
        // dishTypes.forEach( (dish) => {
        //   var str = dish["label"].toLowerCase();
        //   var start = str.search(searchText.toLowerCase());
        //   if(start !== -1) {
        //     matches.push(dish)
        //   }
        // })
        setDishOptions(value ? matches : []);
      };


    const mealTimes = [
        "Desayuno",
        "Almuerzo",
        "Cena",
        "Extra",
        "Merienda"
    ]
    
    const saveMenu = (e) => {
        ////console.log(e.target)
    }

    function getRestsByDesc(desc, id){

        var postConfig = {
            method: "post",
            url: "http://localhost:3001/getRestsByDishId",
            data: {dishId: desc}
        }
        axios(postConfig).then(
            (res) => {
                ////console.log("Found Restrictions:")
                ////console.log(res.data)
                const dishesId = id.split("^")
                var restArr = []
                if (res.data.length !== 0){
                    res.data.forEach(
                        restDesc => {restArr.push(restDesc["RestDescription"])}
                    )
                    dishes[dishesId[0]][dishesId[1]]["rest"] = restArr
                    setDishes(dishes)
                    setRender(!render)

                }
                else {
                    ////console.log("Found no restrictions for this dish")
                    dishes[dishesId[0]][dishesId[1]]["rest"] = restArr
                    setDishes(dishes)
                    setRender(!render)
                }

                // dishes[dishesId[0]][dishesId[1]]
            }
        )
    }
    //render
    //console.log(editDish)
    return(
    <div>
        <table>
                <tr>
                    <td></td>
                    <td><strong>Domingo</strong></td>
                    <td><strong>Lunes</strong></td>
                    <td><strong>Martes</strong></td>
                    <td><strong>Miercole</strong></td>
                    <td><strong>Jueves</strong></td>
                    <td><strong>Viernes</strong></td>
                    <td><strong>Sabado</strong></td>
                </tr>

                {dishes[0] !== null ? dishes.map( (meal, mIndex) => {
                    return (
                        <tr>

                            <td>{mealTimes[mIndex]}</td>

                            {meal.map( (dish, dIndex) => {
                            
                            return (
                                <td>
                                    <AutoComplete
                                    style={{ width: 200 }}
                                    options={dishOptions}
                                    placeholder="Nueva..."
                                    id={mIndex + "^" + dIndex}
                                    key={dish["id"] ? dish["id"] : mIndex + "^" + dIndex}
                                    onFocus={(e) => {setLastValidText(e.target.value);setDishOptions([]);setActive(e.target.id);}}// e.target.value !== "" ? setValidInput(true) : setValidInput(false)}}
                                    onBlur={(e) => {
                                        ////console.log(validInput)
                                        if(!validInput){
                                            dishes[mIndex][dIndex]["nom"] = lastValidText
                                            dishes[mIndex][dIndex]["id"] = lastValidText
                                            setDishes([...dishes])

                                        }
                                        setRender(!render)
                                    }}
                                    onSelect={sel => {setValidInput(true) ; sel.split(" ")[0] === "Añadir" ? setEditDish({"nom": sel.split(" ").slice(1).join(" "), "rest": [], "loc": mIndex + "^" + dIndex}):

                                                getRestsByDesc(sel, mIndex + "^" + dIndex);
                                                    if (dishTypes[sel]) {
                                                        dishes[mIndex][dIndex]["id"] = sel;
                                                        dishes[mIndex][dIndex]["nom"] = dishTypes[sel]["label"];
                                                        setDishes(dishes);
                                                        setRender(!render)
                                                    }
                                                }}
                                    onSearch={handleDishSearch}
                                    onChange={(e) => {setValidInput(false);  e.split(" ")[0] === "Añadir" ? dishes[mIndex][dIndex]["nom"] = e.split(" ").slice(1).join(" "): dishes[mIndex][dIndex]["nom"] = e; setDishes(dishes)}}
                                    value={dishes[mIndex][dIndex]["nom"]}
                                    />
                                    {active === mIndex + "^" + dIndex ?  
                                        <div>
                                            {dishes[mIndex][dIndex]["rest"].map( (rest) => {
                                                ////console.log(rest)
                                                return(
                                                    <Tag key={rest+"^"+mIndex+"^"+dIndex} >{rest}</Tag>
                                                )
                                            })}
                                        </div>
                                    : null}
                                </td>
                                )
                            })}

                        </tr>
                    )
                }): null}
        </table>
        {editDish ? <EditDish dish={editDish} exit={exitEditDish} handleClose={addDishToDB}>
            {/* {////console.log("THIS IS EDIT DISH", editDish)} */}
        </EditDish>: null}

    </div>)
}
export default DietMenu;