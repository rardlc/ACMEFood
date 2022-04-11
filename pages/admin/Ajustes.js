import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const backendIP = "../api"

function Ajustes({selectionCallback}) {
    // const history = useHistory()
    const [conflictData, setConflictData] = useState()


    useEffect( () => {
        console.log("I loaded right now.")
    },[])

    useEffect(() => {
        // TODO get clients with missing food fields from schedule
        const getConfig = {
            method: 'get',
            url: `${backendIP}/getScheduleConflicts`,
        }
        axios(getConfig).then((res)=>{
            console.log(res)
            setConflictData(res.data)
        }, (err) => {
            console.log(err)
        })
    }, []) 
    
    function routeToClient(clientId, accountId){
        selectionCallback({ClientId: clientId, AccountId: accountId})
    }

    var columns = [
        {
            title: "Account ID",
            dataIndex: "AccountId",
            key: "AccountId"
        },
        {
            title: 'Client ID',
            dataIndex: 'ClientId',
            key: 'ClientId',
            render: (clientId,record) => (
                <a onClick={() => {routeToClient(clientId, record["AccountId"])}} >{clientId}</a>
            )
        },
        {
            title: 'Client Name',
            dataIndex: 'ClientName',
            key: 'ClientName'
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date',
            sorter: (a,b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
        },
        {
            title: 'Desayuno',
            dataIndex: 'BFast',
            key: 'BFast'
        },
        {
            title: 'Almuerzo',
            dataIndex: 'Lunch',
            key: 'Lunch'
        },
        {
            title: 'Cena',
            dataIndex: 'Dinner',
            key: 'Dinner'
        },
        {
            title: 'Extra',
            dataIndex: 'Extra',
            key: 'Extra'
        },
        {
            title: 'Merienda',
            dataIndex: 'Snack',
            key: 'Snack'
        }
    ]

    return (
        <div>
            <Table columns={columns} dataSource={conflictData}></Table>

        </div>
    );
}

export default Ajustes;