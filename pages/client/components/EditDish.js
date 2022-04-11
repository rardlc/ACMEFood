import { useEffect, useState } from "react"
import axios from "axios"
import {Input, Form, Card, Tag, AutoComplete} from "antd";
import './componentCSS/EditDish.module.css'
import RestrictionPopup from "./RestrictionPopup";


function EditDish({handleClose, dish, exit,children}) {
    
    const showHideClassName = dish ? "modal display-block" : "modal display-none";
    const [render, setRender] = useState(false)
    const [restArr, setRestArr] = useState([])

    //get init data
    useEffect( () => {
        console.log(dish)
    },[])

    useEffect( () => {
        dish["rest"] = restArr
        console.log(dish["rest"])
    },[restArr])

    return (
        <div className={showHideClassName}>
            <section className="modal-main">

                <label>Dish Name</label>
                <Input defaultValue={dish ? dish["nom"]: ""} onBlur={(e) => {dish["nom"] = e.target.value; console.log(dish)}}></Input>

                <RestrictionPopup restArr={restArr} formCallback={setRestArr}></RestrictionPopup>

                <button type="button" onClick={(e) => {handleClose(dish)}}>
                    Save
                </button>

                <button type="button" onClick={(e) => {exit()}}>
                    Close
                </button>
            </section>
        </div>
    )
}

export default EditDish