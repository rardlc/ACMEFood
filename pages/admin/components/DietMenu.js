/* Diet Menu's calendar rendering and data structure looks different from Calendar.js or
    the database schema for Schedule and Menus. *Despite* that I kept it since its 
    function at setting the schedule from its data structure was tested all the way through and works.*/
import React, { useState, useEffect, useCallback } from "react";
import {Tag, AutoComplete, Button } from "antd";
import axios from "axios"
import EditDish from "./EditDish";
import { EditOutlined } from '@ant-design/icons';
import styles from "./componentCSS/DietMenu.module.css"

const backendIP = "../../api"

function DietMenu({initDishes, dietId, dishesCallback, weekday }) {


    useEffect( () => {
        console.log("I loaded right now.")
    },[])

    const [dishOptions, setDishOptions] = useState([]);

    /* Dishes is a 2D array. Each element/array in dishes is a row representing a meal time (breakfast, lunch, etc) 
    and each element of that row contains the dish object (name & restrictions) from monday to friday. */
    const [dishes, setDishes] = useState([

        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
        [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }]

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
        return axios.get(`${backendIP}/getRestrictionTypes`).then(
            (res) => {
                var types = []
                res.data.forEach(e => {
                    types.push(e)
                });
                setRestTypes(types)
            })
    }

    /* When a change in the weekday prop happens, 
        each DietMenu will change their dishes state, *overwriting* the current one */
    useEffect(() => {

        setDishes([
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }],
            [{ nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }, { nom: "", rest: [] }]
        ])

        const postConfig = {
            method: "post",
            url: `${backendIP}/getWeekMenu`,
            data: { date: weekday, dietId: dietId }
        }

        axios(postConfig).then(
            res => {
                console.log("huh")
                if (res.data.length !== 0) {
                    setIsNew(false)
                    console.log(res.data)
                    res.data.forEach(
                        (day, index) => {
                            //console.log(day,index)
                            dishes[0][index]["id"] = day["BFast01"] //BFAST///////////////////
                            // get description
                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["BFast01"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[0][index]["nom"] = res.data["DishDescription"]
                                    dishes[0][index]["cals"] = res.data["Calories"]
                                    dishes[0][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[0][index]["prots"] = res.data["Proteins"]
                                    dishes[0][index]["fats"] = res.data["Fats"]


                                    setDishes(dishes)
                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["BFast01"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[0][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes([dishes])

                                }
                            )

                            dishes[1][index]["id"] = day["Lunch"] //LUNCH//////////////////

                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["Lunch"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[1][index]["nom"] = res.data["DishDescription"]
                                    dishes[1][index]["cals"] = res.data["Calories"]
                                    dishes[1][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[1][index]["prots"] = res.data["Proteins"]
                                    dishes[1][index]["fats"] = res.data["Fats"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["Lunch"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[1][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[2][index]["id"] = day["Dinner"] //DINNER//////////////////

                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["Dinner"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[2][index]["nom"] = res.data["DishDescription"]
                                    dishes[2][index]["cals"] = res.data["Calories"]
                                    dishes[2][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[2][index]["prots"] = res.data["Proteins"]
                                    dishes[2][index]["fats"] = res.data["Fats"]
                                    setDishes(dishes)

                                }
                            )

                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["Dinner"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[2][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[3][index]["id"] = day["Extra1"] //EXTRA////////////////////
                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["Extra1"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[3][index]["nom"] = res.data["DishDescription"]
                                    dishes[3][index]["cals"] = res.data["Calories"]
                                    dishes[3][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[3][index]["prots"] = res.data["Proteins"]
                                    dishes[3][index]["fats"] = res.data["Fats"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["Extra1"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[3][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes(dishes)

                                }
                            )

                            dishes[4][index]["id"] = day["Snack"] //SNACK/////////////////////////
                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["Snack"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[4][index]["nom"] = res.data["DishDescription"]
                                    dishes[4][index]["cals"] = res.data["Calories"]
                                    dishes[4][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[4][index]["prots"] = res.data["Proteins"]
                                    dishes[4][index]["fats"] = res.data["Fats"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["Snack"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[4][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes(dishes)
                                    setRender(index)

                                }
                            )

                            dishes[5][index]["id"] = day["Extra2"] //EXTRA////////////////////
                            var getDescConfig = {
                                method: "post",
                                url: `${backendIP}/getDishDescById`,
                                data: { dishId: day["Extra2"] }
                            }
                            axios(getDescConfig).then(
                                res => {
                                    dishes[5][index]["nom"] = res.data["DishDescription"]
                                    dishes[5][index]["cals"] = res.data["Calories"]
                                    dishes[5][index]["carbs"] = res.data["Carbohydrates"]
                                    dishes[5][index]["prots"] = res.data["Proteins"]
                                    dishes[5][index]["fats"] = res.data["Fats"]
                                    setDishes(dishes)

                                }
                            )
                            //get restrictions
                            var getRestConfig = {
                                method: "post",
                                url: `${backendIP}/getRestsByDishId`,
                                data: { dishId: day["Extra2"] }
                            }
                            axios(getRestConfig).then(
                                res => {
                                    dishes[5][index]["rest"] = res.data.map(
                                        rest => { return rest }
                                    )
                                    setDishes(dishes)

                                }
                            )
                        })
                }
            }
        )
    }
        , [weekday])

    function getDishTypes() {
        const postConfig = {
            method: "post",
            url: `${backendIP}/getDishTypes`,
            data: { dietId: dietId }
        }


        axios(postConfig).then(
            (res) => {
                var types = {}
                res.data.forEach(e => {
                    types[e.DishId] = { value: e.DishId, label: e.DishDescription }
                });

                if(dietId === "ATL"){
                    const getRegDishConfig = {
                        method: "post",
                        url: `${backendIP}/getDishTypes`,
                        data: {dietId: "REG"}
                    }
                    axios(getRegDishConfig).then(
                        getRegRes => {
                            getRegRes.data.forEach(
                                (regDish) => {
                                    types[regDish.DishId] = {value: regDish.DishId, label: regDish.DishDescription}
                                }
                            )
                            console.log(dishTypes)
                            setDishTypes(types)
                        }
                    )
                } else if (dietId === "VEG"){
                    const getRegDishConfig = {
                        method: "post",
                        url: `${backendIP}/getDishTypes`,
                        data: {dietId: "PSC"}
                    }
                    axios(getRegDishConfig).then(
                        getRegRes => {
                            getRegRes.data.forEach(
                                (regDish) => {
                                    types[regDish.DishId] = {value: regDish.DishId, label: regDish.DishDescription}
                                }
                            )
                            console.log(dishTypes)
                            setDishTypes(types)
                        }
                    )
                }
                
                else {
                    setDishTypes(types)
                }
                
            },
            (err) => {
                console.log(err)
                throw err;
            })
    }

    useEffect(
        () => {
            if(dishTypes){

            }

        }
    ,[dishTypes])


    function deleteRest(e) {
        var idData = e.split("^")
        var restName = idData[0]
        var clone = [...dishes]
        dishes[idData[1]][idData[2]]["rest"] = dishes[idData[1]][idData[2]]["rest"].filter(tag => tag !== restName)
        setDishes(dishes)
    }

    // Set passed dishObj dishes and Set modal to null so it hides itself
    function addDishToDB(dishObj) {
        var [mIndex, dIndex] = dishObj["loc"].split("^")
        dishes[mIndex][dIndex] = dishObj
        var dishDesc = dishObj["nom"]
        var rests = dishObj["rest"]
        //set new dish to Dish table
        console.log("FE is passing: ")
        console.log(dishObj)
        var postConfig = {
            method: "post",
            url: `${backendIP}/setDish`,
            data: {
                dishDesc: dishDesc,
                rest: rests,
                diet: dietId,
                fats: dishObj["fats"],
                carbs: dishObj["carbs"],
                cals: dishObj["cals"],
                prots: dishObj["prots"]
            }
        }
        axios(postConfig).then(
            (res) => {
                dishes[mIndex][dIndex]["id"] = res.data[0]
                setDishes(dishes)
                setRender(!render)
                setEditDish(null)
            }
        );




    }

    function exitEditDish() {
        setEditDish(null)

    }

    useEffect( () => {
        getDishTypes()
    },[editDish])


    // on mount get all restrictions and dishes
    useEffect(() => {
        if (!restTypes) {
            getRestTypes()
        }
        if (!dishTypes) {
            console.log("Getting dish types")
            getDishTypes()
        }
    })

    // when changes happen in below 3 states, set dishes in parent component
    useEffect(() => {
        // initDishes needs to be set in dishes where dishes are empty
        dishesCallback(dietId, dishes, isNew)

    }, [dishes, active, render])

    // useEffect( () => {
    //     // getDishTypes()
    //     console.log("Dish we are editting")
    //     console.log(editDish)
    // }, [editDish])


    // Main Dish search function for Autocomplete component, 
    const handleDishSearch = (value, label) => {
        var matches = []
        if (dishTypes) {
            for (const [id, desc] of Object.entries(dishTypes)) {
                var str = desc["label"].toLowerCase();
                var start = str.search(value.toLowerCase());
                if (start !== -1) {
                    matches.push(dishTypes[id])
                }
            }
            matches.push({ "value": "Añadir " + value, "label": "Añadir " + value })
            // dishTypes.forEach( (dish) => {
            //   var str = dish["label"].toLowerCase();
            //   var start = str.search(searchText.toLowerCase());
            //   if(start !== -1) {
            //     matches.push(dish)
            //   }
            // })
            setDishOptions(value ? matches : []);
        }

    };


    const mealTimes = [
        "Desayuno",
        "Almuerzo",
        "Cena",
        "Extra",
        "Merienda",
        "Extra II"
    ]

    const saveMenu = (e) => {
        ////console.log(e.target)
    }

    function getRestsByDesc(desc, id) {

        var postConfig = {
            method: "post",
            url: `${backendIP}/getRestsByDishId`,
            data: { dishId: desc }
        }
        axios(postConfig).then(
            (res) => {
                ////console.log("Found Restrictions:")
                ////console.log(res.data)
                const dishesId = id.split("^")
                if (res.data.length !== 0) {
                    dishes[dishesId[0]][dishesId[1]]["rest"] = res.data
                    setDishes(dishes)
                    setRender(!render)

                }
                else {
                    ////console.log("Found no restrictions for this dish")
                    dishes[dishesId[0]][dishesId[1]]["rest"] = []
                    setDishes(dishes)
                    setRender(!render)
                }

                // dishes[dishesId[0]][dishesId[1]]
            }
        )
    }
    //render
    //console.log(editDish)
    return (
        <div className={styles.container}>
            <table>
                <tr className={styles.foodTitles}>
                    <td></td>
                    <td><strong>Domingo</strong></td>
                    <td><strong>Lunes</strong></td>
                    <td><strong>Martes</strong></td>
                    <td><strong>Miercole</strong></td>
                    <td><strong>Jueves</strong></td>
                    <td><strong>Viernes</strong></td>
                    <td><strong>Sabado</strong></td>
                </tr>

                {dishes[0] !== null ? dishes.map((meal, mIndex) => {
                    return (

                        <tr>
                            <td className={mIndex >= 5 ? styles.optionalTd : null}>{mealTimes[mIndex]}</td>

                            {meal.map((dish, dIndex) => {

                                return (
                                    <td key={dish["id"] ? dish["id"] + mIndex + "^" + dIndex : mIndex + "^" + dIndex} className={mIndex >= 5 ? styles.optionalTd : null}>
                                        <AutoComplete
                                            style={{ width: 200 }}
                                            options={dishOptions}
                                            placeholder="Nueva..."
                                            id={mIndex + "^" + dIndex}
                                            allowClear
                                            onFocus={(e) => { setLastValidText(e.target.value); setDishOptions([]); setActive(e.target.id); }}// e.target.value !== "" ? setValidInput(true) : setValidInput(false)}}
                                            onBlur={(e) => {
                                                ////console.log(validInput)
                                                if (!validInput) {
                                                    dishes[mIndex][dIndex]["nom"] = lastValidText
                                                    setDishes([...dishes])

                                                }
                                                setRender(!render)
                                                setActive("")
                                            }}
                                            onSelect={sel => {
                                                setValidInput(true); sel.toString().split(" ")[0] === "Añadir" ? setEditDish({ ...dishes[mIndex][dIndex], loc: mIndex + "^" + dIndex }) :

                                                    getRestsByDesc(sel, mIndex + "^" + dIndex);
                                                if (dishTypes[sel]) {
                                                    dishes[mIndex][dIndex]["id"] = sel;
                                                    dishes[mIndex][dIndex]["nom"] = dishTypes[sel]["label"];
                                                    setDishes(dishes);
                                                    setRender(!render)
                                                }
                                            }}
                                            onSearch={handleDishSearch}
                                            onChange={(e) => {
                                                setValidInput(false);
                                                if (e) {
                                                    e.toString().split(" ")[0] === "Añadir" ? dishes[mIndex][dIndex]["nom"] = e.split(" ").slice(1).join(" ") : dishes[mIndex][dIndex]["nom"] = e;
                                                    setDishes(dishes)
                                                } else {
                                                    dishes[mIndex][dIndex] = { nom: "", rest: [] }
                                                    setDishes(dishes)
                                                }

                                            }}
                                            value={dishes[mIndex][dIndex]["nom"]}
                                        />
                                        <Button icon={<EditOutlined />} onClick={(e) => { console.log({ ...dishes[mIndex][dIndex], loc: mIndex + "^" + dIndex }); setEditDish({ ...dishes[mIndex][dIndex], loc: mIndex + "^" + dIndex }) }}></Button>

                                        {active === mIndex + "^" + dIndex ?
                                            <div>
                                                {dishes[mIndex][dIndex]["rest"].length > 0 ? dishes[mIndex][dIndex]["rest"].map((rest) => {
                                                    return (
                                                        <Tag key={mIndex + "^" + dIndex}>{rest.RestDescription ? rest.RestDescription : rest}</Tag>
                                                    )
                                                }) : null}

                                            </div>
                                            : null}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                }) : null}
            </table>
            {editDish ? <EditDish dish={editDish} exit={exitEditDish} handleClose={addDishToDB}>
                {/* {////console.log("THIS IS EDIT DISH", editDish)} */}
            </EditDish> : null}

        </div>)
}
export default DietMenu;