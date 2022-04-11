import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import axios from "axios";

// You should really not use the fallback and perhaps
// throw an error if this value is not set!
const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || "fidje98j3*&(%%$#490j30jSoss6";
const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

function setCookie(res, valuesObj, options) {
  var cookieList = []

  for (const prop in valuesObj) {
    let stringValue = typeof value === "object" ? `j:${JSON.stringify(valuesObj[prop])}` : String(valuesObj[prop]);

    cookieList.push(serialize(prop, String(stringValue),options))

  }
  console.log("Cookies added to browser - tokens.js")
  console.log(cookieList)

  res.setHeader("Set-Cookie", cookieList)
}

function storeToken(token, accountId) {
  axios({
    method: "post",
    url: "http://localhost:3000/setSession",
    data: {sessToken: token, accountId: accountId}
  })
}

export function authenticateUser(res, user) {

  if (!user) return;

  const token = jwt.sign({ email: user.Email }, JWT_TOKEN_KEY, {
    expiresIn: "1d"
  }) 

  setCookie(res, { "auth":token }, cookieOptions)
  storeToken(token, user.AccountId)
}


export function clearUser(res) {
  setCookie(res, {"auth": "0"}, {
    ...cookieOptions,
    path: "/",
    maxAge: 1
  })
}


export async function verifyCookies(req) {
  console.log("Checking browser cookies...")
  const { auth: token } = req.cookies

  if (!token) return undefined;
  
  console.log(token)
  
  try {
    const isVerified = jwt.verify(token, JWT_TOKEN_KEY)

    if (!isVerified) return undefined;

    console.log(isVerified)
    const {data} = await axios({
      method: "post",
      url: "http://localhost:3000/getSession",
      data: {sessToken: token}
    })
    console.log(data)

    if(data.length > 0 && data[0].AccountId){
      console.log("retuning account info after successful authentication")
      return data[0]
    }
  }
  catch (err) {
    console.log(err)
    return undefined
  }
}


export async function userFromRequest(req) {
  console.log("Checking browser cookies...")
  const { auth: token } = req.cookies

  if (!token) return undefined;

  try {
    const isVerified = jwt.verify(token, JWT_TOKEN_KEY)

    if (!isVerified) return undefined;
    console.log("Verified that we signed cookie: " + token )
    const {data} = await axios({
      method: "post",
      url: "http://localhost:3000/getSession",
      data: {sessToken: token}
    })
    console.log("Account Data from userFromRequest/tokens.js")
    console.log(data)
    
    if(!data[0]) return undefined;

    const user = await axios({
      method: "post",
      url: "http://localhost:3000/getAccount",
      data: {
        accountId: data[0].AccountId
      }
    })

    return {accountId: data[0].AccountId, clients: user.data};

  } catch (err) {
    console.log(err)
    return undefined;
  }

}