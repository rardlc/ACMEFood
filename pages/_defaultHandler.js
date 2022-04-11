import nextConnect from "next-connect";

export default function defualtHandler(){
    return nextConnect({
        attachParams: true,
        onError: (err, req, res) => {
            console.log(err);

            res.status(500).json({error:"Internal Server Error"})
        }
    })
}