import styles from "../components/styles/EditAddresses.module.css"
import { useEffect, useState } from "react"
import {Input, Form, Card, Tag, AutoComplete, Radio, Table, Button, Switch} from "antd";
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import "../node_modules/@ant-design/icons/lib/fill/DeleteFill.js"
import axios from "axios";

const {TextArea} = Input;

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
                url: "http://localhost:3001/getClientAddress",
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
                url: "http://localhost:3001/getClientPrimaryAddress",
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
        getClientAddr()
        },
    [clientId])

    useEffect( () => {
        console.log({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs})
        handleChange({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs})
    }, [addrs, primary, render])

    function editCell(recordId){
        console.log(recordId)
        setActive(recordId)
    }

    function newAddr(e){
        addrs.push({"AddrId":newId.toString(),"StreetNo": "", "StreetName": "", "Apt": "", "ZipCode": "", "City": "", "State":""})
        var newAddrs = [...addrs]
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
            title: "Notas",
            dataIndex: "Notes",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <TextArea defaultValue={record["Notes"]} maxLength=""  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], State:e.target.value}
                    setAddrs([...addrs])
                }}
                    placeholder="Que es necesario saber para los mandados a este lugar?"
                ></TextArea> : <p>{record["Notes"] ? record["Notes"] : ""}</p> 
            }
        },
        {
            title: 'Acci??n',
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
        <div className="grid">
            {
                addrs.map(
                    (addr,index) => {
                        return (
                            <div key={"addr" + index} className="resizeCard">
                                <div className={styles.addrCtrl}>
                                    <p style={{fontSize: "1.2rem",marginTop:"auto"}}>Send here? </p>
                                    <label className={styles.switch}>
                                        <input type="checkbox" checked={primary === addrs[index]["AddrId"]} onClick={(e)=> {setPrimary(addrs[index]["AddrId"])}}/>
                                        <span className={styles.slider + " " + styles.round}></span>
                                    </label>
                                    <div style={{float: "right"}}>
                                    <button onClick={(e) => delAddr(addrs[index]["AddrId"])}>???</button>
                                </div>

                                </div>
                                
                                <div style={{"display": "flex","flexFlow": "column wrap"}}>
                                <p>Street No</p>
                                <input type="text"/>

                                <p>Street Name</p>
                                <input type="text"/>

                                <p>Apt #</p>
                                <input type="text"/>

                                <p>City</p>
                                <input type="text"/>


                                <p>Zip Code</p>
                                <input type="text" maxLength="5"/>


                                <p>State</p>
                                <input type="text" maxLength="2"/>
                                </div>
                            
                                
                            </div>
                        )

                    }
                )
            }
            <button style={{marginRight: "auto", marginLeft: "auto"}} onClick={e => {newAddr(e)}}>+ Add New Address</button>
        </div>
    )

}

export default EditAddresses;