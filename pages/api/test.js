import axios from "redaxios"

import { authenticateUser, clearUser, userFromRequest, verifyCookies } from "../../DB/tokens"
import defaultHandler from "../_defaultHandler";

// endpoint accessed by Registration.js after Login (POST request) 
//and account.js after handleLogout (DELETE request)

const backendIP = "http://localhost:3000"

const handler = defaultHandler()
.get(
    async (req, res) => {
        console.log("Accounts GET reached")
    }
)
.post(
    async (req, res) => {
        const conf = {
            method: "post",
            url: `${backendIP}`,
            data: req.body
        }

        axios(conf).then(
            (dbD) => {
                res.send(dbD.data)
            },
            (err) => {
                console.log(err)
            }
        )

    }
)

export default handler