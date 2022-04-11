import React, { useEffect, useState } from 'react';
import { Input, AutoComplete, Select } from 'antd';


const { Option } = Select;
function SearchBox({selectionCallback, label, dataSource, searchProps, displayProps}) {

    const [restText, setRestText] = useState("")
    const [options, setOptions] = useState([]);
    const [valueLabel, setValueLabel] = useState();

    const handleSearch = (value) => {
      var matches = []
      dataSource.forEach( (obj, objIndex) => {
        let propString = "";
        //merge each of the designated (searchProps elements) obj properties into a single string to be compared with value
        searchProps.forEach( 
          (prop) => {
            propString += obj[prop].toString() + " "
          }
        )
        let foundStartIndex = propString.toLowerCase().search(value.toLowerCase())

        //if we found a match in any of the designated obj properties, add this obj to search results
        if (foundStartIndex !== -1){

          /*TODO use foundStartIndex and searchResult(value, matches) to highlight
          the text found in the View */

          /*TODO Give more information in the searchResult(_, matches)
           for the user to see and pick the right choice at a glance */
          obj["index"] = objIndex
          matches.push(obj)
        }

        // var str = obj.toLowerCase();
        // var start = str.search(value.toLowerCase());
        // if(start !== -1) {
        //   matches.push( [stringValue, start] )
      })

      //handle item render props

      //handle search results after all matches have been found      
      setOptions(value ? searchResult(value, matches) : []);
    };
    
    const searchResult = (query, matches) =>
    matches
      .map( (matchObj, idx) => {
  
        return {
          value: matchObj["FistName"] + " " + matchObj["LastName"],
          key: matchObj["ClientId"].toString() + idx.toString() + matchObj["index"],
          label: (
            <div
              key={matchObj["ClientId"].toString() + idx.toString()}
  
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            onClick={() => {
              selectionCallback(matchObj)
            }}>
              <span>
                {matchObj["FistName"] + " " + matchObj["LastName"]}
              </span>
            </div>
          ),
        };
      });

    useEffect( () => {
      console.log("I loaded right now.")
    },[])

    return (
      <div>
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{
            width: 300,
          }}
          options={options}
          onSearch={handleSearch}>

          <Input.Search 
            allowClear={true}
            size="large" placeholder={label} value={valueLabel} enterButton />
          
        </AutoComplete>
      </div>

        
      );
}

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}





export default SearchBox;