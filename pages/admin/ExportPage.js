import axios from "axios"
import {DatePicker, Button} from "antd"

import {useState, useEffect} from "react"
import styles from "./CSS/ExportPage.module.css";
const backendIP = "../api"

const { RangePicker } = DatePicker;

export default function Export(){

    const [rangeOptions, setRangeOptions] = useState()
    const [startDay, setStartDay] = useState()
    const [endDay, setEndDay] = useState()

    function datePicked(date, str){
        console.log(arguments)
        if(str.length){
            setStartDay(str[0])
            setEndDay(str[1])
            
        } else {
            setStartDay(str)
            setEndDay(str)
        }

    }

    // function makeCSV(){

    //     console.log(weekday)
    //     const makeCSVConf = {
    //         method: "post",
    //         url: `/api/downloadCSV`,
    //         data: {weekday: weekday}
    //     }

    //     axios(makeCSVConf).then(
    //         (res) => {
    //             console.log(res.data)

    //             // var encodedUri = encodeURI(res.data);
    //             // var link = document.createElement("a");
    //             // link.setAttribute("href", encodedUri);
    //             // link.setAttribute("download", "Meals.csv");
    //             // document.body.appendChild(link); // Required for FF
    //             // link.click(); // This will download the data file named "Meals.csv".

    //         }
    //     )
    // }
    
    function getSomeWeek(dateObj){
        let picked;
        if(dateObj){
            console.log(dateObj["_d"])
            picked = dateObj["_d"]
        } else {
            picked = new Date()
        }
        console.log(picked)
        if (picked){
            var date = new Date(picked)
            console.log(date)
    
            var monday = new Date(getThisMonday(date));
    
            var sunday = new Date(monday)
            sunday.setDate(monday.getDate() - 1)
    
            var tuesday = new Date(monday)
            tuesday.setDate(monday.getDate() + 1)
    
            var wednesday = new Date(monday)
            wednesday.setDate(monday.getDate() + 2)
    
            var thursday = new Date(monday)
            thursday.setDate(monday.getDate() + 3)
    
            var friday = new Date(monday)
            friday.setDate(monday.getDate() + 4)
    
            var saturday = new Date(monday)
            saturday.setDate(monday.getDate() + 5)
    
            var week = [dateFormatSQL(sunday), dateFormatSQL(monday), dateFormatSQL(tuesday), dateFormatSQL(wednesday), dateFormatSQL(thursday), dateFormatSQL(friday), dateFormatSQL(saturday)]
    
            setStartDay(week[0])
            setEndDay(week[6])
        }

    }

    var dateFormatSQL = function (date, hours = false) {
        // ////////console.log(date)
        // if (hours) {
        //   return moment.utc(date).format("YYYY-MM-DD HH:mm:ss")
        // } else {
        //   return moment.utc(date).format("YYYY-MM-DD")
          return date.getFullYear()        + '-' +
          pad(date.getMonth() + 1)  + '-' +
          pad(date.getDate())
        // }
      }
      
    var pad = function(int){
        if(int < 10){
            return `0${int}`
        } else {
            return `${int}`
        }
    }

    // Week starts on sunday, so sunday's will give you the next value, 
    // else get previous days until monday
    function getThisMonday(date = (new Date)) {
        //////console.log(date)
        var dDate = new Date(date)
        var refDate = new Date(dDate.getFullYear(), dDate.getMonth(), dDate.getDate(), 12)
        if (refDate.getDay() === 0) {
        refDate.setDate(refDate.getDate() + 1)
        return refDate
        }
        else {
        for (let i = 0; i < 7; i++) {
            var compDate = new Date(refDate)
            compDate.setDate(refDate.getDate() - i)
    
            if (compDate.getDay() === 1) {
            return compDate
            }
        }
        }
    }

    const [hover, setHover] = useState(false)

    
    useEffect( () => {
        console.log("I loaded right now.")
    },[])

    return <>
    <div className={styles.exportDisplay}>

        
        <Button onClick={() => {getSomeWeek()}}>Esta semana</Button>
        <Button onClick={() => {setRangeOptions("someWeek")}}>Alguna semana</Button>
        <Button onClick={() => {setRangeOptions("someDay")}}>Algun día</Button>
        <Button onClick={() => {setRangeOptions("someRange")}}>Algun rango de días</Button>

        {
                rangeOptions === "someWeek" ? <DatePicker style={{margin: "1rem"}} onChange={(dateObj) => getSomeWeek(dateObj)} picker="week"/> :
                    rangeOptions === "someDay" ? <DatePicker style={{margin: "1rem"}} onChange={datePicked}></DatePicker> :
                        rangeOptions === "someRange" ? <RangePicker style={{margin: "1rem"}} onChange={datePicked}></RangePicker> : null

        }
        {
            startDay && endDay ? <a className={"bareBtn"} href={`/api/downloadCSV?startDate=${startDay.toString()}&endDate=${endDay.toString()}`} download={"file.csv"}>
                <div>
                Exportar Etiquetas
                </div>

                <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width={"2em"} height={"2em"} style={{marginLeft: "1rem",marginRight: "1rem"}}>
                <path d="m480 352h-133.5l-45.25 45.25c-12.05 12.05-28.15 18.75-45.25 18.75s-33.16-6.656-45.25-18.75l-45.25-45.25h-133.5c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96c0-17.7-14.3-32-32-32zm-48 104c-13.2 0-24-10.8-24-24s10.8-24 24-24 24 10.8 24 24-10.8 24-24 24zm-198.6-81.4c6.2 6.3 14.4 9.4 22.6 9.4s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25-12.5-12.5-32.76-12.5-45.25 0l-73.37 73.425v-242.8c0-17.67-14.33-32-32-32-17.7 0-32 14.33-32 32v242.8l-73.4-73.4c-12.49-12.5-32.75-12.5-45.25 0-12.49 12.5-12.49 32.75 0 45.25l128.05 127.95z"/>
                <path d="m28.105 511.34c-12.657-1.4799-23.536-11.213-26.975-24.135-1.1737-4.4095-1.1737-106 0-110.41 2.9433-11.058 10.931-19.36 22.55-23.438 2.5415-0.89194 10.998-1.0343 71.948-1.2114l69.068-0.20069 25.012 24.892c25.888 25.764 30.115 29.378 39.164 33.48 8.1542 3.6973 14.568 5.165 24.118 5.5194 10.307 0.3825 16.223-0.39762 24.119-3.1806 13.424-4.7312 15.75-6.5728 44.87-35.522l25.339-25.19 69.061 0.18696 69.061 0.18697 4.16 1.4898c10.267 3.6769 17.227 10.914 21.031 21.87 0.86501 2.4912 1.0298 9.5108 1.2206 51.993 0.13844 30.818-0.0237 51.301-0.43513 54.987-1.7215 15.419-13.096 26.993-28.217 28.712-6.531 0.7424-448.74 0.7104-455.09-0.033zm413.01-56.904c4.4861-1.7145 9.8359-6.4398 12.112-10.698 9.2619-17.329-4.191-37.654-23.716-35.831-8.5646 0.79977-16.844 6.9998-19.998 14.976-2.0302 5.1335-2.0349 13.091-0.0107 18.207 1.5865 4.01 5.9251 9.2589 9.458 11.442 6.3806 3.9434 14.902 4.6757 22.155 1.9038z" fill="#00d084" stroke-width=".64"/>
                <path d="m247.36 382.49c-7.9528-2.6292-6.4984-1.2751-76.983-71.674-37.061-37.015-68.214-68.597-69.23-70.181-3.0469-4.7499-4.5984-10.364-4.5984-16.64 0-12.541 6.8085-23.093 18.504-28.678 4.8864-2.3333 5.0456-2.3624 12.947-2.3624 7.75 0 8.15 0.0685 12.8 2.1933 4.6808 2.1388 5.7727 3.1629 43.984 41.252l39.184 39.059 0.17687-124.45c0.15934-112.12 0.27822-124.74 1.2001-127.33 2.2423-6.3113 4.1732-9.4315 8.538-13.796 6.6643-6.6643 12.836-9.2437 22.116-9.2437s15.452 2.5794 22.116 9.2437c4.3648 4.3648 6.2957 7.4849 8.538 13.796 0.92185 2.5947 1.0407 15.208 1.2001 127.33l0.17687 124.45 39.184-39.059c38.212-38.089 39.304-39.114 43.984-41.252 4.6549-2.127 5.0433-2.1933 12.848-2.1933h8.0482l5.4231 2.6872c6.9633 3.4504 11.788 8.3466 15.138 15.364 2.3564 4.9348 2.3821 5.0752 2.3821 12.989 0 7.746-0.0695 8.1524-2.1898 12.8-2.1649 4.7454-2.9614 5.5733-70.08 72.832-67.886 68.028-67.891 68.033-73.28 70.719-5.254 2.6189-5.5679 2.6903-12.48 2.838-4.5553 0.0974-8.0057-0.15104-9.6504-0.69478z" fill="#00d084" stroke-width=".64"/>
                </svg>

                </a> : null
        }
    </div>

    
    </>
}