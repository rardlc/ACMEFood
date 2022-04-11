import axios from "redaxios"
import JSZip, { file } from "jszip"
import defaultHandler from "../_defaultHandler";

const fs = require("fs").promises

// endpoint accessed by Registration.js after Login (POST request) 
//and account.js after handleLogout (DELETE request)

const backendIP = "http://localhost:3000"

const handler = defaultHandler()
.get(
    async (req, res) => {
        console.log("reached API POST")
        console.log(req.query.startDate)
        console.log(req.query.endDate)

        const conf = {
            method: "post",
            url: `${backendIP}/export`,
            data: {
                startDate: req.query.startDate,
                endDate: req.query.endDate
            }
        }

        axios(conf).then(
            async (resPaths) => {
                // res.setHeader("Content-Type", "application/zip; charset=utf-8")
                res.setHeader("Content-Disposition", `attachment; filename=labels${"FROM" + req.query.startDate + "TO" + req.query.endDate}.zip`);
                var zip = new JSZip();
                
                const {readFileSync} = require("fs");

                let paths = resPaths.data.split(" ")
                paths.forEach(
                    (path, index) => {
                        const pathArr = path.split("/")
                        const filename = pathArr[pathArr.length - 1]
                        console.log(filename)
                        const f = readFileSync(path)
                        zip.file(filename, f)

                        if (index === paths.length -1){
                            zip.generateAsync({type:"nodebuffer"}).then(
                                (content) => {console.log("SENDING ZIP to Client as string"); res.send(content)}
                                )
                        }
                    }
                )
                



            },
            (err) => {
                throw err;
            }
        )
    }
)

export default handler