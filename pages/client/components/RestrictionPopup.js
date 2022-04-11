import { Card, Tag } from 'antd';
import { useEffect, useState } from 'react';
import SearchBox from './SearchBox';
import axios from "axios"

const backendIP = "../../api"

function RestrictionPopup({formCallback, restArr}) {

    const [restrictionTypes, setRestrictionTypes] = useState(null)
    
    useEffect( () => {
        getRestTypes()
    }, [])

    function getRestTypes() {
        return axios.get(`${backendIP}/getRestrictionTypes`).then(
            (res) => {
                console.log(res)
                let types = res.data.map(
                    e => {
                        return e.RestDescription
                    }
                )

                setRestrictionTypes(types)
            })

    }

    function setNewRest(rest) {
        const postConfig = {
            method: "POST",
            url:`${backendIP}/newRestriction`,
            data: {newRest: rest}
        }
        axios(postConfig).then(
            res => {
                console.log("Set New Restriction successfully")
                console.log(res)
            }
        )
    }

    function deleteRest(rest){
        restArr.forEach( (currRest,index) => {
            //found in array
            if (rest === currRest){
                console.log('1')
                restArr.splice(index,1)
                formCallback([...restArr])
            }
        })
    }

    const onSelect = (value) => {
        if (value.split(" ")[0] === "Añadir") {
            value = value.slice(6)
            console.log("Adding new restriction")
            setNewRest(value)
            
            console.log(value)
            
        }
        var alreadyAdded = false
        restArr.forEach( (rest) => {
            if (value === rest){
                alreadyAdded = true
            }
        })
        if (!alreadyAdded) {
            formCallback(restArr.concat([value]))
        }
        console.log(restArr)
    };


    return (
        <>
        {restrictionTypes ? 
            <Card title={<SearchBox 
                dataSource={restrictionTypes}
                label={"Encuentra una restriction..."}
                selectionCallback={onSelect}
                searchProps={["RestDescription"]}
            />} >
            Restrictiones Applicables
            <br></br>
            
            {restArr ? restArr.map( (rest,index) => {
                return (
                    <Tag key={rest + index} closable onClose={() => deleteRest(rest)}>{rest}</Tag>
                )
            }): null}

            </Card>
        : null}

        </>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
    const res = await fetch('https://.../posts')
    const posts = await res.json()
  
    return {
      props: {
        posts,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      revalidate: 10, // In seconds
    }
  }

export default RestrictionPopup;