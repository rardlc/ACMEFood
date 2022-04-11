import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from "./CSS/dashboard.module.css"

import EditarMenu from "./EditarMenu"
import SearchBox from './components/ClientSearchBox'
import Ajustes from './Ajustes'
import Account from "./account"
import axios from 'redaxios'
import { Spin } from 'antd'
import { userFromRequest } from "../../DB/tokens"
import ExportPage from "./ExportPage"

const backendIP = "http://localhost:3000"


export default function Admin({ dbClients }) {

    const [active, setActive] = useState()
    const [accountId, setAccountId] = useState()
    const [clientId, setClientId] = useState()
    const [clientSrc, setClientSrc] = useState([])
    const [dbClientData, setDBClientData] = useState([])
    const [clientIdSrc, setClientIdSrc] = useState([])

    useEffect(
        () => {
            const saved = localStorage.getItem("tab")
            setActive(saved || "Scheduling")
        }
        , [])

    useEffect(
        () => {
            if (active) {

                if (active === "NewAccount") {
                    setAccountId(34)
                }

                localStorage.setItem("tab", active)

            }


        }
        , [active])

    function settingAccountJS(accountDetails) {
        console.log(accountDetails)
        if (accountDetails["ClientId"]) {
            setClientId(accountDetails["ClientId"])
            setAccountId(accountDetails["AccountId"])
            setActive("Search")

        } else {
            setAccountId(accountDetails)
            setActive("Search")
        }

    }

    function getAllClients() {
        let getConfig = {
            method: "GET",
            url: `${backendIP}/getAllClientsInAccounts`
        }
        return axios(getConfig).then(
            (res) => {
                console.log(res.data)
                setClientSrc(res.data)

            },
            (err) => {
                return (err)
            }
        )
    }



    useEffect(
        () => {
            if (accountId) {
                console.log("AccountId is changed")
                axios({
                    method: "post",
                    url: `../api/getAccount`,
                    data: { accountId: accountId }
                }).then(
                    (res) => {
                        setDBClientData(res.data)
                    }
                )
            }

        }
        , [accountId])

    // useEffect(
    //     () => {
    //         getAllClients()
    //     }
    // ,[])
    useEffect(
        () => {
            getAllClients()
            setDBClientData(dbClients)
        }
        , [])




    return (

        <div>
            <nav className={styles.topbar}>
                <a className={active === "Scheduling" ? styles.topbarOption + " " + styles.topbarActive : styles.topbarOption} onClick={() => { setActive("Scheduling") }}>
                    Planificacción
                </a>
                <div onClick={() => { setActive("Conflicts") }}>
                    <a className={active === "Conflicts" ? styles.topbarOption + " " + styles.topbarActive : styles.topbarOption}>Conflictos</a>
                </div>
                <div onClick={() => { setActive("Export") }}>
                    <a className={active === "Export" ? styles.topbarOption + " " + styles.topbarActive : styles.topbarOption}>Exportar</a>
                </div>
                <div onClick={() => { setActive("NewAccount"); }}>
                    <a className={active === "NewAccount" ? styles.topbarOption + " " + styles.topbarActive : styles.topbarOption}>Administracción</a>
                </div>
                <div className={styles.topbarOption} onClick={() => { setActive("Search") }}>
                    {/* TODO notifying of Clients without AccountId */}
                    {clientSrc ? <SearchBox label="Encuentra un cliente..." displayProps={["AccountId", "ClientId", "FistName", "LastName"]} selectionCallback={settingAccountJS} dataSource={clientSrc} searchProps={["FistName", "LastName"]}></SearchBox> : <Spin />}
                </div>

            </nav>

            <div className={styles.mainView}>
                {
                    active === "Scheduling" ? <EditarMenu></EditarMenu> :
                        active === "Conflicts" ? <Ajustes selectionCallback={settingAccountJS}></Ajustes> :
                            active === "Export" ? <ExportPage /> :
                                active === "NewAccount" && accountId ? <Account accountId={accountId} dbClients={dbClientData}></Account> :
                                    active === "Search" && accountId ? <Account accountId={accountId} clientId={clientId} dbClients={dbClientData}></Account> : null
                }


            </div>

        </div>



    )
}

export async function getServerSideProps(context) {

    const backendIP = "http://localhost:3000"

    const account = await userFromRequest(context.req)
    console.log("getServerSideProps - User Retrieved:")
    if(account){
        console.log(account)
    } else {
        console.log("nothing...")
    }
    if (!account || account.accountId !== 34) return {
        redirect: {
            destination: "/client/account",
            permanent: false
        }
    }

    console.log("Entered Admin Account - Getting all clients")

    return { props: { dbClients: account.clients } }
    // return {props: }
}