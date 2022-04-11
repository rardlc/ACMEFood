import axios from "axios"
import { useEffect, useState } from "react"
import styles from "./CSS/account.module.css"
import ClientForm from "./ClientForm.js"

import { Button, Form } from 'antd';
import { userFromRequest } from "../../DB/tokens"
import router from "next/router";

const accountSearchParam = 'clid'

const backendIP = "../api"

export default function Account({accountId, dbClients, clientId}){
    const [clients,setClients] = useState([])
    const [viewing, setViewing] = useState( () => {
        const saved = localStorage.getItem("view")
        return JSON.parse(saved) || ""
        }
    )
    const [forms, setForms] = useState([])
    const [newNum, setNewNum] = useState(0)


    useEffect( () => {
        console.log("I loaded right now.")
    },[])

    function newClient(){
        clients.push({ClientId: newNum, FormName: "CLForm" + newNum ,FistName: "New", LastName: "Client " + newNum})
        setViewing(newNum)
        setNewNum(newNum - 1)
        setClients([...clients])
        window.scrollTo(0, 0)
        
    }

    useEffect(
        () => {
            console.log(viewing)
            if(viewing){
                localStorage.setItem("view",viewing)
            }
        }
    ,[viewing])


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
    useEffect(() => {
        console.log(viewing)
    }, [viewing])
    // Get all Clients data from the url on page entry
    useEffect(() => {
        console.log(dbClients)
        if(dbClients) {
            console.log(dbClients)
            setClients(dbClients)
        }
        
        
    },[accountId,dbClients])

    // Whenever clients changes, make a ClientForm object for each
    // useEffect( () => {

    //     if (clients.length > 0) {
    //         setViewing(clients[0]["ClientId"])
    //         console.log(forms)
    //     }

    // },[clients])

    useEffect ( () => {
        if(clientId){
            setViewing(clientId)
        }
    },[clientId])

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
                    setClients([...clients])
                }
            }
        )
    }

    return(
        <div> 
        
            {clients.length > 0 ? 


                <div className={styles.container}>
                    
                    <div className={styles.sidebar}>
                        <div className={styles.appLogo}>
                            <img src="../logo.png" width="250" height="100"/>
                        </div>
                        {clients.map(
                            clInfo => {
                                return (<div tabindex={0} key={"sidebarOption" + clInfo["ClientId"]} className={viewing === clInfo["ClientId"] ? styles.sidebarOption + " " + styles.active : styles.sidebarOption} onKeyDown={(e) => { e.key === 'Enter' || e.key === ' ' ? setViewing(clInfo["ClientId"]) : null }} onClick={ () => { setViewing(clInfo["ClientId"]) }}>
                                    {clInfo["FistName"] + " " + clInfo["LastName"]}
                                </div>)
                            }
                        )}

                        <nav tabindex={0} className={styles.btnControl}>
                            <div tabindex={0} className={styles.circleBtn}  onKeyDown={(e) => { e.key === 'Enter' || e.key === ' ' ? newClient : false}} onClick={newClient}>
                                {/* <span>&#10133;</span> */}
                                <span><img src="../user-plus-solid-white.svg"></img></span>
                                <p>Clienté Nuevo</p>
                            </div>

                            <div tabindex={0} className={styles.circleBtn} onKeyDown={(e) => { e.key === 'Enter' || e.key === ' ' ? saveAllForms() : false}} onClick={() => {saveAllForms()}}><span><img src="../floppy-disk-solid-white.svg"></img></span>
                            
                            <p>Salvar a Todos</p>
                            
                            </div>
                            <div tabindex={0} className={styles.circleBtn} onKeyDown={(e) => { e.key === 'Enter' || e.key === ' ' ? handleLogout() : false}} onClick={() => {handleLogout()}}><span><img src="../door-open-solid-white.svg"></img></span>
                            <p>Cerrar Sesión</p>
                            </div>
                        </nav>


                    </div>

                    <div className={styles.mainView}>
                        <Form.Provider onFormFinish={ (name, {values, forms}) => onClientFormFinished(name, {values, forms})}>
                        {clients.map(
                            clInfo => {
                                // console.log(clInfo)
                                return (<div  className={ viewing === clInfo["ClientId"] ? styles.visible : styles.hide }> {viewing === clInfo["ClientId"] ? <ClientForm accountId={accountId} key={"CLForm" + clInfo["ClientId"]} formName={"CLForm" + clInfo["ClientId"]} addFormToParent={addForm} ClientId={clInfo["ClientId"]}></ClientForm> :null}</div>)
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
            destination: "/admin/account",
            permanent: false
            }
        }
    }

    return {props: {accountId: account.accountId, dbClients: account.clients}}
    // return {props: }
    
}