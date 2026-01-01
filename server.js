import express from 'express'
import register from './routes/authRoute.js'
import message from './routes/messageRoute.js'
import users from './routes/usersRoute.js'
import { getMongoDbConnection, initMongoDb } from "./utils/mongoDb.js";
import { getMysqlConnection, initSqlDb } from "./utils/mysql.js";

const app = express();
const PORT = 8000;

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


app.use("/api/auth", register );
app.use("/api/messages",message );
app.use('/api/users',users)


app.listen(PORT, async () => {
  await initMongoDb();
  await initSqlDb()

  console.log(`Server is running on port ${PORT}...`);
})