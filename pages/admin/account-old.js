import axios from "axios"
import { useEffect, useState } from "react"
import styles from "./CSS/account.module.css"
import ClientForm from "./ClientForm.js"
import { userFromRequest } from "../../DB/tokens"



<<<<<<< HEAD
import { Button, Form } from 'antd';
=======
import { Button, ConfigProvider, Form } from 'antd';
>>>>>>> 1b4c457f8d7090a80ffc25b9c24e628e0cb28edb


export default function Account({ accountId, clientId }) {
    const [clients, setClients] = useState([])
    const [viewing, setViewing] = useState()
    const [forms, setForms] = useState([])
    const [newNum, setNewNum] = useState(0)
    const [newAccount, setNewAccount] = useState()

    function newClient() {
        clients.push({ ClientId: newNum, FistName: "New", LastName: "Client " + newNum })
        setNewNum(newNum - 1)
        setClients([...clients])
    }
    function addForm(formObject) {
        console.log(formObject.__INTERNAL__.name)
        console.log(forms)
        if (forms.length > 0) {
            let notRepeated = true
            forms.forEach(
                (savedFormObj) => {
                    if (savedFormObj.__INTERNAL__.name === formObject.__INTERNAL__.name) {
                        notRepeated = false
                    }
                }
            )
            if (notRepeated) {
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
        if (forms.length === clients.length) {
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


        console.log(accountId)
        console.log(clientId)
        console.log("Starting up")
        if(accountId){
            axios.post(`${backendIP}/getAccount`, { id: accountId }).then(
                (res) => {
                    setClients(res.data)
                    setNewAccount(false)
                    if(clientId){
                        setViewing(clientId)
                        console.log("Client ID is: " + clientId)
                    }
                }
            )
        } else {
            //we have no search query so we are dealing with a new account
            setNewAccount(true)
            console.log(newAccount)
        }


    }, [accountId, clientId])

    // Whenever clients changes, make a ClientForm object for each
    useEffect(() => {
        if (clients.length > 0) {
            setViewing(clients[0]["ClientId"])
            console.log(forms)
        }

    }, [clients])

    useEffect(() => {
        console.log(newAccount)
    }, [newAccount])

    return (

        <div style={{height:"100vh"}}>
            {/* <div className={newAccount ? styles.newAccountModal + " " + styles.visible : styles.newAccountModal} >
                <div className={styles.modalContent}>
                    <p style={{fontSize: "1.75rem"}}> Crea una cuenta nueva </p>
                    <label htmlFor="eml">Email</label>
                    <input id="eml" style={{margin: "1rem"}}/>

                    <label htmlFor="pesky">Password</label>
                    <input id="pesky" style={{margin: "1rem"}}/>

                    <div style={{padding: "1rem"}}>
                    <button style={{float: "right"}}>Save Person</button>
                    </div>
                </div>
            </div> */}

            {clients.length > 0 ?


                <div className={styles.container}>



                    <div className={styles.sidebar}>
                        <div className={styles.appLogo}>
                            <img src="../logo.png" width="250" height="100" />
                            <p className={styles.title}> People on this account </p>
                        </div>
                        {clients.map(
                            clInfo => {
                                return (<div key={"sidebarOption" + clInfo["ClientId"]} className={viewing === clInfo["ClientId"] ? styles.sidebarOption + " " + styles.active : styles.sidebarOption} onClick={() => { setViewing(clInfo["ClientId"]) }}>
                                    {clInfo["FistName"] + " " + clInfo["LastName"] + " " + clInfo["ClientId"]}
                                </div>)
                            }
                        )}
                        <div className={styles.addClientBtn} onClick={newClient}>
                            <span>&#10133;</span>
                        </div>
                        <Button onClick={() => { saveAllForms() }}>Save all Forms</Button>
                    </div>

                    <div className={styles.mainView}>
                        <Form.Provider onFormFinish={(name, { values, forms }) => { console.log(forms) }}>
                            {clients.map(
                                clInfo => {
                                    console.log(clInfo)
                                    return (<div className={viewing === clInfo["ClientId"] ? styles.visible : styles.hide}><ClientForm key={"CLForm" + clInfo["ClientId"]} formName={"CLForm" + clInfo["ClientId"]} addFormToParent={addForm} ClientId={clInfo["ClientId"]}></ClientForm></div>)
                                }
                            )}
                        </Form.Provider>
                    </div>

                </div>


                // TODO: If we have no clients, log the error and URL
                : <div>No Clients found for that account</div>}

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


    return {props: {dbClients: account.clients}}
    // return {props: }
}