import axios from "axios"
import { useEffect, useState } from "react"
import styles from "./CSS/account.module.css"
import ClientForm from "./ClientForm.js"

import { Button, Form } from 'antd';
import { userFromRequest } from "../../DB/tokens"
import router from "next/router"; 

const accountSearchParam = 'clid'

const backendIP = "../api"

export default function Account({accountId, dbClients}){
    const [clients,setClients] = useState([])
    const [viewing, setViewing] = useState( () => {
        const saved = localStorage.getItem("view")
        return JSON.parse(saved) || ""
    })
    const [forms, setForms] = useState([])
    const [newNum, setNewNum] = useState(0)

    useEffect(
        () => {
            console.log(viewing)
            if(viewing){
                localStorage.setItem("view",viewing)
            }
        }
    ,[viewing])

    function newClient(){
        clients.push({ClientId: newNum, FormName: "CLForm" + newNum ,FistName: "New", LastName: "Client " + newNum})
        console.log(clients)
        setViewing(newNum)
        setNewNum(newNum - 1)
        setClients([...clients])
    }


    function addForm(formObject) {
        console.log(formObject.__INTERNAL__.name)
        console.log(forms)
        if(forms.length > 0){
            let notRepeated = true
            forms.forEach(
                (savedFormObj) => {
                    if(savedFormObj.__INTERNAL__.name === formObject.__INTERNAL__.name){
                        notRepeated = false
                    }
                }
            )
            if(notRepeated){
                forms.push(formObject)
                setForms([...forms])

                let newClientName = formObject.getFieldValue("fname") + " " + formObject.getFieldValue("lname")
                console.log(formObject.getFieldValue("fname"))
            }


        } else {
            forms.push(formObject)
            setForms([...forms])
        }

    }

    function saveAllForms() {
        console.log("saveAllForms triggered:", forms.length, clients.length)
        if(forms.length === clients.length){
            console.log("SAVING ALL FORMS")
            forms.forEach(
                (formObj) => {
                    formObj.submit()
                }
            )
        }

    }

    // Get all Clients data from the url on page entry
    useEffect(() => {
        if(dbClients) {

            console.log(dbClients)
            setClients(dbClients)
        }
        
        
    },[])

    function handleLogout(){
        axios({
            method: "delete",
            url:"/api/sessions"
        })
        router.push("/")
    }

    function onClientFormFinished(formName, {values, submittedFormList}) {

        clients.forEach(
            (accountFormView,formIndex) => {
                if(accountFormView["FormName"] === formName){
                    accountFormView["FistName"] = values["fname"]
                    accountFormView["LastName"] = values["lname"]
                    clients[formIndex] = accountFormView
                    console.log()
                    setClients([...clients])
                }
            }
        )
    }


    // Whenever clients changes, make a ClientForm object for each
    useEffect( () => {
        if (clients.length > 0) {
            setViewing(clients[0]["ClientId"])
            console.log(forms)
        }

    },[clients])

    return(
        <div> 
        
            {clients.length > 0 ? 


                <div className={styles.container}>
                    
                    <div className={styles.sidebar}>
                        <div className={styles.appLogo}>
                            <img src="../logo.png" width="250" height="100"/>
                            <p className={styles.title}> People on this account </p>
                        </div>
                        {clients.map(
                            clInfo => {
                                return (<div key={"sidebarOption" + clInfo["ClientId"]} className={viewing === clInfo["ClientId"] ? styles.sidebarOption + " " + styles.active : styles.sidebarOption} onClick={ () => { setViewing(clInfo["ClientId"]) }}>
                                    {clInfo["FistName"] + " " + clInfo["LastName"]}
                                </div>)
                            }
                        )}
                        <div className={styles.addClientBtn} onClick={newClient}>
                            <span>&#10133;</span>
                        </div>
                        <Button onClick={() => {saveAllForms()}}>Save all Forms</Button>
                        <Button onClick={() => {handleLogout()}}>Logout</Button>

                    </div>

                    <div className={styles.mainView}>
                        <Form.Provider onFormFinish={ (name, {values, forms}) => onClientFormFinished(name, {values, forms})}>
                        {clients.map(
                            clInfo => {
                                // console.log(clInfo)
                                return (<div className={ viewing === clInfo["ClientId"] ? styles.visible : styles.hide }><ClientForm accountId={accountId} key={"CLForm" + clInfo["ClientId"]} formName={"CLForm" + clInfo["ClientId"]} addFormToParent={addForm} ClientId={clInfo["ClientId"]}></ClientForm></div>)
                            }
                        )}
                        </Form.Provider>
                    </div>

                </div>
            

            // TODO: If we have no clients, log the error and URL
            :<div>No Clients found for that account</div>}

        </div>
    )
}

export async function getServerSideProps(context){
    const account = await userFromRequest(context.req)
    console.log("getServerSideProps - User Retrieved:")
    console.log(account)
    if (!account) return {
        redirect: {
          destination: "/",
          permanent: false  
        }
      }

    if (account.accountId === 34){
        return {redirect: { 
            destination: "/admin/dashboard",
            permanent: false
            }
        }
    }

    return {props: {accountId: account.accountId, dbClients: account.clients}}
    // return {props: }
    
}