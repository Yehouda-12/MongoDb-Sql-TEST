import express from 'express'
// import products from './routes/products.js'
// import orders from "./routes/orders.js"
import { getMongoDbConnection, initMongoDb } from "./utils/mongoDb.js";
import { getMysqlConnection, initSqlDb } from "./utils/mysql.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());


app.use(async (req, res, next) => {
  req.mongoDbConn = await getMongoDbConnection();
  req.mysqlConn = await getMysqlConnection()
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


// app.use("/api/products",products );
// app.use('/api/orders',orders)


app.listen(PORT, async () => {
  await initMongoDb();
  await initSqlDb()

  console.log(`Server is running on port ${PORT}...`);
})