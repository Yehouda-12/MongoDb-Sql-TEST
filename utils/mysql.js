import mysql2 from "mysql2/promise";


export async function initSqlDb() {
  const connection = await mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
  });
  await connection.query(`create database if not exists messagesDb;`);
  await connection.query(`use messagesDb;`);
//   ● id 
// ● username 
// ● cipher_type 
// ● encrypted_text 
// ● inserted_at
  await connection.query(`CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    cipher_type VARCHAR(255) NOT NULL,
    encrypted_text TEXT NOT NULL,
    inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  
);`);
}


export async function getMysqlConnection(){
    const connection = await mysql2.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
  });
    await connection.query(`use messagesDb;`);
    return connection;
}