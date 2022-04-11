import styles from "./CSS/EditWeeklyMenu.module.css"
import { useEffect, useState } from "react"
import {InputNumber} from "antd";

function EditWeeklyMenu({weeklyMenu, setWeeklyMenu}){

    const [weeklyMeals, setWeeklyMeals] = useState(["1","1","1","0","0","1","1","1","0","0","1","1","1","0","0","1","1","1","0","0","1","1","1","0","0","1","1","1","0","0","1","1","1","0","0"])

    useEffect( () => {
        setWeeklyMenu(weeklyMeals)
    },[])

    const [dayLabels, setDayLabels] = useState(["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    const [mealLabels, setMealLabels] = useState(["Breakfast", "Lunch", "Dinner", "Extra", "Snack"])
    return (
        <div className={styles.mealContainer}>
            {
                weeklyMeals ?
                //Assuming weekly menu is a string of numbers
                weeklyMeals.map(
                    (dayMeal, index) => {
                        if (index % mealLabels.length === 0){
                            return (
                                <span>
                                <p><strong>{dayLabels[index/mealLabels.length]}</strong></p>
                                <label htmlFor={dayLabels[index%dayLabels.length] + mealLabels[index%mealLabels.length]}>{mealLabels[index%mealLabels.length]}</label>
                                <input type="number" className={styles.mealNumber} id={dayLabels[index%dayLabels.length] + mealLabels[index%mealLabels.length]} min={0} max={9} 
                                    value={parseInt(weeklyMeals[index])} 
                                    onChange={ 
                                        (e) => {
                                            if(e.nativeEvent.data){
                                                console.log(e);

                                                weeklyMeals[index] = e.nativeEvent.data; 
                                                setWeeklyMenu([...weeklyMeals])
                                            }
                                        }
                                    }
                                    onBlur={
                                        (e) => {
                                            console.log(weeklyMeals[index])
                                            if(weeklyMeals[index] === undefined){
                                                weeklyMeals[index] = "0"
                                                console.log("settting back to zero")
                                                setWeeklyMeals([...weeklyMeals]); 
                                                setWeeklyMenu(weeklyMeals)
                                            }
                                        }
                                    }
                                />
                                </span>
                            )
                        } 
                        else {
                            return (
                                <span>
                                <label htmlFor={dayLabels[index%dayLabels.length] + mealLabels[index%mealLabels.length]}>{mealLabels[index%mealLabels.length]}</label>
                                <input type="number" className={styles.mealNumber} id={dayLabels[index%dayLabels.length] + mealLabels[index%mealLabels.length]} min={0} max={9} 
                                    value={parseInt(weeklyMeals[index])} 
                                    onChange={ 
                                        (e) => {
                                            console.log(e);
                                            if(e.nativeEvent.data){
                                                weeklyMeals[index] = e.nativeEvent.data; 
                                                setWeeklyMenu([...weeklyMeals])
                                            }
                                        }
                                    }
                                    onBlur={
                                        (e) => {
                                            console.log(weeklyMeals[index])
                                            if(weeklyMeals[index] === undefined){
                                                weeklyMeals[index] = "0"
                                                console.log("settting back to zero")
                                                setWeeklyMeals([...weeklyMeals]); 
                                                setWeeklyMenu(weeklyMeals)
                                            }
                                        }
                                    }
                                /></span>
                            )
                        }

                    }
                ):null
                
            }
        </div>
    )
}

export default EditWeeklyMenu