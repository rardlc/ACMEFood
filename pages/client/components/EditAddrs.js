import "./componentCSS/EditAddrs.module.css"
import { useEffect, useState } from "react"
import {Input, Form, Card, Tag, AutoComplete, Radio, Table, Button} from "antd";
import { EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from "axios";

const {TextArea} = Input

const backendIP = "../../api"

function EditAddrs({handleChange, clientId}){
    const [addrsPkg, setAddrsPkg] = useState({})
    const [addrs,setAddrs] = useState([])
    const [primary, setPrimary] = useState(null)
    const [render, setRender] = useState(false)
    const [active, setActive] = useState()
    const [newId, setNewId] = useState(0)
    const [dbPrimary, setDBPrimary] = useState("")
    const [dbAddrs, setDBAddrs] = useState([])

    function getClientAddr(){
        //console.log("triggered getClientAddr for: " + clientId)
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
                        //console.log(res.data)
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
        getClientAddr()
        },
    [clientId])

    useEffect( () => {
        //console.log({primary: primary, addrs: addrs, dbPrimary: dbPrimary, dbAddrs: dbAddrs})
        addrsPkg.primary = primary
        addrsPkg.addrs = addrs
        addrsPkg.dbPrimary = dbPrimary
        addrsPkg.dbAddrs = dbAddrs
        console.log(addrsPkg)
        handleChange(addrsPkg)
    }, [addrs, primary, render])

    function editCell(recordId){
        //console.log(recordId)
        setActive(recordId)
    }

    function newAddr(e){
        const newAddr = {"key":newId.toString(),"AddrId":newId.toString(),"StreetNo": "", "StreetName": "", "Apt": "", "ZipCode": "", "City": "", "State":"FL", "Notes": ""}
        addrs.push(newAddr)
        var newAddrs = [...addrs]
        if(addrsPkg["add"]){
            addrsPkg["add"].push(newAddr)
        } else {
            addrsPkg["add"] = [newAddr]
        }
        setAddrs(newAddrs)
        setActive(newId)
        setNewId(newId - 1)
    }

    function delAddr(addrId){

        if(addrs.length > 1){
            const found = addrs.find( element => element["AddrId"] === addrId)
            const index = addrs.indexOf(found)
            console.log(index)
            if(addrsPkg["remove"]){
                addrsPkg["remove"].push(addrs[index])
            } else {
                addrsPkg["remove"] = [addrs[index]]
            }

            if(index > -1){
                addrs.splice(index, 1)
            }
            if (found["AddrId"] === primary){
                setPrimary(addrs[0]["AddrId"])
            }
            setAddrs([...addrs])
            setAddrsPkg(addrsPkg)
        } else {
            alert("You need to have at least one primary address for each client")
        }

    }

    const columns = [
        {
            title: "Numero de Calle",
            dataIndex:"StreetNo",
            render: (_t, record, _index) => {
                return active === record["AddrId"]? <Input key={"StreetNo" + _index} defaultValue={record["StreetNo"]} onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], StreetNo:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p key={"StreetNo" + _index}>{record["StreetNo"]}</p> 
            }
        },
        {
            title: "Nombre de Calle",
            dataIndex: "StreetName",
            render: (_t, record, _index) => {
                return active === record["AddrId"] ? <Input key={"StreetName" + _index} defaultValue={record["StreetName"]} onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], StreetName:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p key={"StreetName" + _index}>{record["StreetName"]}</p> 
            }
        },
        {
            title: "Numero de Apartamento",
            dataIndex: "Apt",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input key={"Apt" + _index} defaultValue={record["Apt"]} maxLength="8" onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], Apt:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p key={"Apt" + _index}>{record["Apt"]}</p> 
            }
        },
        {
            title: "Zip Code",
            dataIndex: "ZipCode",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input key={"ZipCode" + _index} defaultValue={record["ZipCode"]} maxLength="5"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], ZipCode:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p key={"ZipCode" + _index}>{record["ZipCode"]}</p> 
            }
        },
        {
            title: "Ciudad",
            dataIndex: "City",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input key={"City" + _index} defaultValue={record["City"]} maxLength="20"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], City:e.target.value}
                    setAddrs([...addrs])
                }}></Input> : <p key={"City" + _index}>{record["City"]}</p> 
            }
        },
        {
            title: "Estado",
            dataIndex: "State",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <Input key={"State" + _index} defaultValue={record["State"]} maxLength="2"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], State:e.target.value}
                    setAddrs([...addrs])
                }}
                ></Input> : <p key={"State" + _index}>{record["State"] ? record["State"] : "FL"}</p> 
            }
        },
        {
            title: "Notas",
            dataIndex: "Notes",
            render: (_t, record, _index) => {
                return active === record["AddrId"]  ? <TextArea defaultValue={record["Notes"]} maxLength="360"  onBlur={(e) => {
                    const found = addrs.find( element => element["AddrId"] === record["AddrId"] )
                    const index = addrs.indexOf(found)
                    addrs[index] = {...addrs[index], Notes:e.target.value}
                    setAddrs([...addrs])
                }}
                    placeholder="Que es necesario saber para los mandados a este lugar?"
                ></TextArea> : <p>{record["Notes"] ? record["Notes"] : ""}</p> 
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
        //   //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          setPrimary(selectedRows[0]["key"])
        },
        renderCell: (checked, record, index, originNode) => {
                // //console.log(checked, record, index, originNode)
                if(record["AddrId"] === primary){
                    console.log("SETTING PRIMARY ADDR")
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
        <div >
            <Table pagination={{position: ["topRight","none"]}} rowSelection={{type: "radio", ...rowSelection}} columns={columns} dataSource={addrs}> 
            </Table>          
            <Button type="button" onClick={newAddr} block> + Nueva Dirección</Button>
        </div>
    )

}

export default EditAddrs;