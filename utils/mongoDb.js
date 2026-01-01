import { MongoClient } from "mongodb";


const MONGO_URL = 'mongodb://admin:password123@localhost:27018/usersDb?authSource=admin'
const DB_NAME = "usersDb";

let mongocClient = null;
let mongoConn = null;


export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(DB_NAME);
    
    const productsCollection = mongoConn.collection('users');
    
   
    await productsCollection.createIndex({ username: 1 }, { unique: true });
    
    console.log("Database initialized and unique index created on 'username' field");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}


export async function getMongoDbConnection() {
      if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
      await mongocClient.connect();
    }
    mongoConn = mongocClient.db(DB_NAME);
  }
  return mongoConn;
}


    
