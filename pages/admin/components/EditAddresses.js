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

    function getClientAddr(){
        console.log("triggered getClientAddr for: " + clientId)
        if (clientId){
            var postConfig = {
                method: "post",
                url: `${backendIP}/getClientAddress`,
                data: {clientId: clientId}
            }
            axios(postConfig).then(
                res => {
                    if(res.data){
                        res.data.forEach( addr => {
                            addr["key"] = addr["AddrId"]
                        })
                        console.log(res.data)
                        setAddrs(res.data)
                        setDBAddrs([...res.data])
                    }
                }
            )
            
            postConfig = {
                method: "post",
                url: `${backendIP}/getClientPrimaryAddress`,
                data: {clientId: clientId}
            }
            axios(postConfig).then(
                res => {
                    if(res.data){
                        setPrimary(res.data["AddrId"])
                        setDBPrimary(res.data["AddrId"])
                    }
                }
            )

        }
    }

    useEffect( () => {
        // used for db retrieval of addresses
        // getClientAddr()
        },
    [clientId])

    useEffect( () => {
        console.log({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs})
        handleChange({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs}, clientId)
    }, [addrs, primary, render])

    function editCell(recordId){
        console.log(recordId)
        setActive(recordId)
    }

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

    const columns = [
        {
            title: "Numero de Calle",
            dataIndex:"StreetNo",
            render: (_t, record, _index) => {
                return active === record["AddrId"]? <Input defaultValue={record["StreetNo"]} onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], StreetNo:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p>{record["StreetNo"]}</p> 
            }
        },
        {
            title: "Nombre de Calle",
            dataIndex: "StreetName",
            render: (_t, record, _index) => {
                return active === record["AddrId"] ? <Input defaultValue={record["StreetName"]} onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], StreetName:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p>{record["StreetName"]}</p> 
            }
        },
        {
            title: "Numero de Apartamento",
            dataIndex: "Apt",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input defaultValue={record["Apt"]} maxLength="8" onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], Apt:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p>{record["Apt"]}</p> 
            }
        },
        {
            title: "Zip Code",
            dataIndex: "ZipCode",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input defaultValue={record["ZipCode"]} maxLength="5"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], ZipCode:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p>{record["ZipCode"]}</p> 
            }
        },
        {
            title: "Ciudad",
            dataIndex: "City",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input defaultValue={record["City"]} maxLength="20"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], City:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p>{record["City"]}</p> 
            }
        },
        {
            title: "Estado",
            dataIndex: "State",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input defaultValue={record["State"]} maxLength="2"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], State:e.target.value}
                    setAddrs([...addrs])
                }}
                ></Input> : <p>{record["State"] ? record["State"] : "FL"}</p> 
            }
        },
        {
            title: 'Acción',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (_t, record, _index) => {return(
                <>
                <Button icon={<EditOutlined/>} onClick={(e) => editCell(record["AddrId"])}></Button>
                
                <Button icon={<DeleteOutlined/>} onClick={(e) => delAddr(record["AddrId"])}></Button>
                </>
            )},
          }
    ]
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          setPrimary(selectedRows[0]["key"])
        },
        renderCell: (checked, record, index, originNode) => {
                // console.log(checked, record, index, originNode)
                if(record["AddrId"] === primary){
                    return (
                        <Radio checked={true}></Radio>
                    )
                } else {
                    return (
                        <Radio checked={false} onClick={(e)=>{setPrimary(record["AddrId"])}}></Radio>
                    )
                }
            }
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