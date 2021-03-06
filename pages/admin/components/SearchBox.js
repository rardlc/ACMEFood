import React, { useState } from 'react';
import './componentCSS/SearchBox.module.css'
// import '../index.css';
import { Input, AutoComplete, Select } from 'antd';


const { Option } = Select;
function SearchBox({selectionCallback, label, dataSource}) {

    const [restText, setRestText] = useState("")
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState()

    const handleSearch = (value) => {
      console.log(dataSource)
      var matches = []
      if(dataSource){
        dataSource.forEach( (stringValue) => {
          var str = stringValue.toLowerCase();
          var start = str.search(value.toLowerCase());
          if(start !== -1) {
            matches.push( [stringValue, start] )
          }
        })
        matches.push(["Añadir " + value, -1])
        setOptions(value ? searchResult(value, matches) : []);
      }

    };
    
    function onSelect(e){
      setValue("")
      selectionCallback(e)
    }

    return (
      <div>
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{
            width: 300,
          }}
          options={options}
          onSelect={onSelect}
          onSearch={handleSearch}
          value={value} onChange={(val) => {setValue(val)}}
        >

          <Input.Search 
            allowClear={true}
            size="large" placeholder={label}  enterButton />
          
        </AutoComplete>
      </div>

        
      );
}

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

const searchResult = (query, matches) =>
  matches
    .map( (match, idx) => {
      const category = `${match[0]}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {match[0]}
            </span>
          </div>
        ),
      };
    });



export default SearchBox;