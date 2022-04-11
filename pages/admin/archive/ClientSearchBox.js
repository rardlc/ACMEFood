import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../node_modules/antd/dist/antd.css';
import './componentCSS/SearchBox.css'
import '../index.css';
import { Input, AutoComplete, Select } from 'antd';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from 'axios';

const { Option } = Select;
function ClientSearchBox({selectionCallback, label, dataSource}) {

    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {

      var post_config = {
        method: 'post',
        url: 'http://localhost:3001/getClientsByName',
        data: {
          fname: value
        }
      }
      //only if query when there's a value
      if (value){
        axios(post_config, value).then( (res) =>{
          console.log(value)
          console.log(res)
          var matches = []
          res.data.forEach( (obj, idx) => {
            var str = obj.FistName.toLowerCase()
            var start = str.search(value.toLowerCase());
            if(start !== -1) {
              matches.push( [obj.ClientId, obj , start] )
            }
          })
          setOptions(value ? searchResult(value, matches) : []);
        }, (e) => {console.log("ERROR");console.log(e)})
      }

    };
    
    const onSelect = (value) => {
        console.log('onSelect', value);
    };
    return (
      <div>
        <AutoComplete className="searchBox"
          dropdownMatchSelectWidth={252}
          style={{
            width: 300,
          }}
          options={options}
          onSelect={selectionCallback}
          onSearch={handleSearch}
        >

          <Input.Search allowClear={true} size="large" placeholder={label} enterButton />
          
        </AutoComplete>
      </div>

        
      );
}

function changeSearch(){
}

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

const searchResult = (query, matches) =>
  matches
    .map( (match, idx) => {
      const nom = `${match[1].FistName + " " + match[0]}`;
      return {
        value: match[1].ClientId,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {nom}
            </span>
          </div>
        ),
      };
    });



export default ClientSearchBox;