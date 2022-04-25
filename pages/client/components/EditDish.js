import { useEffect, useState } from "react"
import axios from "axios"
import { Input, Form, Card, Tag, AutoComplete } from "antd";
import styles from './componentCSS/EditDish.module.css'
import RestrictionPopup from "./RestrictionPopup";


function EditDish({ handleClose, dish, exit, children }) {

    const showHideClassName = dish ? styles.modal + " " + styles.displayBlock : styles.modal + " " + styles.displayNone;
    const [render, setRender] = useState(false)
    const [restArr, setRestArr] = useState([])
    const [nom, setNom] = useState()
    const [cals, setCals] = useState()
    const [carbs, setCarbs] = useState()

    const [fats, setFats] = useState()
    const [prots, setProts] = useState()



    //get init data
    useEffect(() => {
        setNom(dish["nom"])
        setCals(dish["cals"])
        setFats(dish["fats"])
        setProts(dish["prots"])
        setCarbs(dish["carbs"])

        if (dish["rest"]) {
            setRestArr(dish["rest"].map(
                (restObj) => {
                    return restObj["RestDescription"]
                }
            ))
        } else {
            setRestArr([])
        }



    }, [dish])

    useEffect(() => {
        if (restArr) {
            dish["rest"] = restArr
        }
    }, [restArr])

    return (
        <div className={showHideClassName}>
            <section className={styles.modalMain}>

                <label>Dish Name</label>
                <Input value={nom} onChange={(e) => {setNom(e.target.value) }}></Input>

                <label>Calories</label>
                <Input type="number" value={cals} placeholder="Calorie Amount (kCal/Cal)" onChange={(e) => { console.log(e.target.value); setCals(e.target.value) }}></Input>

                <label>Carbohydrates</label>
                <Input type="number" value={carbs} placeholder="Carbohydrate Amount (g)" onChange={(e) => { setCarbs(e.target.value) }}></Input>

                <label>Fats</label>
                <Input type="number" value={fats} placeholder="Fats Amount (g)" onChange={(e) => { setFats(e.target.value) }}></Input>

                <label>Proteins</label>
                <Input type="number" value={prots} placeholder="Protein Amount (g)" onChange={(e) => { setProts(e.target.value)}}></Input>

                <RestrictionPopup restArr={restArr} formCallback={setRestArr}></RestrictionPopup>

                <button type="button" onClick={(e) => { handleClose({nom: nom, cals: cals, carbs: carbs, fats: fats, prots: prots, rest: restArr, loc: dish["loc"]}) }}>
                    Save
                </button>

                <button type="button" onClick={(e) => { exit() }}>
                    Close
                </button>
            </section>
        </div>
    )
}

export default EditDish