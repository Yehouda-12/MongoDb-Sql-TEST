import { ObjectId} from "mongodb";

export const registerUser = async (req,res)=>{
    const db = req.mongoDbConn;
    const productsCollection = db.collection("users");

    

}