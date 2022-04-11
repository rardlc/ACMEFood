import { Table } from "antd";
import axios from "axios";
import { columns } from "mssql";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";


function Ajustes() {
    const history = useHistory()
    const [conflictData, setConflictData] = useState()

    useEffect(() => {
        // TODO get clients with missing food fields from schedule
        const getConfig = {
            method: 'get',
            url: 'http://localhost:3001/getScheduleConflicts',
        }
        axios(getConfig).then((res)=>{
            console.log(res)
            setConflictData(res.data)
        }, (err) => {
            console.log(err)
        })
    }, []) 
    
    function routeToClient(e){
        history.push("/clients?" + e.target.id)
    }

    var columns = [
        {
            title: 'ID',
            dataIndex: 'ClientId',
            key: 'ClientId',
            render: id => (
                <a onClick={routeToClient} id={id}>{id}</a>
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