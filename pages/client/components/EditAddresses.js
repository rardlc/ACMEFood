import styles from "./componentCSS/EditAddresses.module.css"
import { useEffect, useState } from "react"
import {Input, Form, Card, Tag, AutoComplete, Radio, Table, Button, Switch} from "antd";
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from "axios";

const backendIP = "../../api"

function EditAddresses({handleChange, clientId}){

    const [addrs,setAddrs] = useState([])
    const [primary, setPrimary] = useState(null)
    const [render, setRender] = useState(false)
    const [active, setActive] = useState()
    const [newId, setNewId] = useState(0)
    const [dbPrimary, setDBPrimary] = useState("")
    const [dbAddrs, setDBAddrs] = useState([])

    useEffect( () => {
        console.log({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs})
        handleChange({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs}, clientId)
    }, [addrs, primary, render])

    function newAddr(e){
        addrs.push({"AddrId":newId.toString(),"StreetNo": "", "StreetName": "", "Apt": "", "ZipCode": "", "City": "", "State":""})
        var newAddrs = [...addrs]
        if (addrs.length === 1){
            setPrimary(newId.toString())
        }
        setAddrs(newAddrs)
        setActive(newId)
        setNewId(newId - 1)
    }

    function delAddr(addrId){
        const found = addrs.find( element => element["AddrId"] === addrId)
        const index = addrs.indexOf(found)


        if(index > -1){
            addrs.splice(index, 1)
        }
        if (found["AddrId"] === primary){
            if (addrs[0]){
                setPrimary(addrs[0]["AddrId"])
            }
        }
        setAddrs([...addrs])
    }

    return(
        <div className={styles.grid}>
            {

                addrs.map(
                    (addr,index) => {
                        return (
                            <div key={"addr" + index} className={styles.resizeCard}>
                                    <p style={{fontSize: "1.2rem",marginTop:"auto"}}>Send here? </p>
                                    
                                    <div style={{float: "right"}}>
                                        <button onClick={(e) => delAddr(addrs[index]["AddrId"])}>✖</button>
                                    </div>



                                
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={primary === addrs[index]["AddrId"]} onClick={(e)=> {setPrimary(addrs[index]["AddrId"])}}/>
                                    <span className={styles.slider + " " + styles.round}></span>
                                </label>

                                <div style={{"display": "flex","flexFlow": "column wrap"}}>
                                <p>Street No<span className={styles.required}>*</span></p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], StreetNo:e.target.value}; setAddrs([...addrs])}} />

                                <p>Street Name<span className={styles.required}>*</span></p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], StreetName:e.target.value}; setAddrs([...addrs])}}/>

                                <p>Apt #</p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], Apt:e.target.value}; setAddrs([...addrs])}}/>

                                <p>City<span className={styles.required}>*</span></p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], City:e.target.value}; setAddrs([...addrs])}}/>

                                <p>Zip Code<span className={styles.required}>*</span></p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], ZipCode:e.target.value}; setAddrs([...addrs])}} maxLength="5"/>

                                <p>State<span className={styles.required}>*</span></p>
                                <input type="text" onChange={(e) => {addrs[index] = {...addrs[index], State:e.target.value}; setAddrs([...addrs])}} maxLength="2"/>
                                </div>
                            
                                
                            </div>
                        )

                    }
                )
            }
            <button key="NewAddr" style={{marginRight: "auto", marginLeft: "auto", marginTop: "1rem", height: "fit-content"}} onClick={e => {newAddr(e)}}>+ Add New Address</button>
        </div>
    )

}

export default EditAddresses;