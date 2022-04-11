// import { NextApiRequest, NextApiResponse } from "next";
// import { login } from "lib/auth";
import { authenticateUser, clearUser, userFromRequest, verifyCookies } from "../../DB/tokens"
import defaultHandler from "../_defaultHandler";
import axios from "redaxios"

// endpoint accessed by Registration.js after Login (POST request) 
//and account.js after handleLogout (DELETE request)
const handler = defaultHandler()
.get(
    async (req, res) => {
        console.log("verifying cookies")
        const account = await verifyCookies(req)
        console.log(account)
        if(account){
            res.send(account)
        } else {
            res.send(undefined)
        }
    }
)
.post(
    async (req, res) => {
        console.log("Logging in")
        const user = await axios({
            method: "post",
            url: "http://localhost:3000/login",
            data: req.body
        })
        console.log("results from :3000/login")
        console.log(user.data)

        if (user.data) {
            authenticateUser(res, user.data)
            res.json(user.data);
        } else {
            res.send("")
        }
    })
.delete( 
    (_req, res) => {
        clearUser(res)
        res.send("");
    })

export default handler