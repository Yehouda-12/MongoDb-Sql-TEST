
export const encryptMessage = async (req, res) => {
  try {
    const mysqlDb = req.mysqlConn;
    const mongoDb = req.mongoDbConn;
    const { message, cipherType } = req.body;
    const { username, password } = req.body;

    const usersCollection = mongoDb.collection("users");
    const user = await usersCollection.findOne({ username, password });
    if (!user) {
      return res
        .status(401)
        .json({ message: "no user wiyth this name or password" });
    }
    let encryptedText = "";
    if (cipherType === "reverse") {
      encryptedText = message.split("").reverse().join("").toUpperCase();
    } else {
      return res.status(400).json({ message: "cipher type no good" });
    }
    const [result] = await mysqlDb.query(
      `INSERT INTO messages (username,cipher_type,encrypted_text) VALUES (?,?,?)`,
      [username, cipherType, encryptedText]
    );
    const messageId = result.insertId;
    await usersCollection.updateOne(
      { username },
      { $inc: { encryptedMessagesCount: 1 } }
    );
    res.status(201).json({ id: messageId, cipherType, encryptedText });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};


export const decryptMessage = async (req, res) => {
  try {
    const mysqlDb = req.mysqlConn;
    const mongoDb = req.mongoDbConn;
    const { username, password, messageId } = req.body;
    const usersCollection = mongoDb.collection("users");
    const user = await usersCollection.findOne({ username, password });
    if (!user) {
      return res
        .status(401)
        .json({ message: "no user wiyth this name or password" });
    }
    const [rows] = await mysqlDb.query(
      `SELECT * FROM messages WHERE id = ? AND username = ?`,
      [messageId, username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "message not found" });
    }
    const message = rows[0];
    let decryptedText = null;
    if (message.cipher_type === "reverse") {
      decryptedText = message.encrypted_text
        .toLowerCase()
        .split("")
        .reverse()
        .join("");
    res.status(200).json({ id: message.id, decryptedText });
    } else {
        res
        .status(200)
        .json({ id: message.id, decryptedText: null, error: "CANNOT_DECRYPT" });

    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

// GET /api/messages 
// Basic Auth required - user needs to provide username and password, and must be 
// authenticated before allowed to the actual endpoint- you can pass username and password 
// in body/headers/query params 
// Response 200 
// { 
// } 
// "items": [ 
// { "id": 12, "cipherType": "ATBASH", "encryptedText": "..." } 
// ] 
// Description 
// Return all messages of the given username. Pass the username in body/path query/path 
// param 
export const getMessages = async (req,res)=>{
    try {
        const mysqlDb = req.mysqlConn;
        const mongoDb = req.mongoDbConn;
        const { username, password } = req.headers;
        const usersCollection = mongoDb.collection("users");
        const user = await usersCollection.findOne({ username, password });
        if (!user) {
      return res
        .status(401)
        .json({ message: "no user wiyth this name or password" });
    }
        const [rows] = await mysqlDb.query(
        `SELECT * FROM messages WHERE username = ?`,
        [username]
    );
        const items = rows.map(row=>({
            id: row.id,
            cipherType: row.cipher_type,
            encryptedText: row.encrypted_text
        }));
        res.status(200).json({ items });
        

    } catch (err){
        console.log(err);
        res.status(500).json({ message: "internal server error" });
        
    }
}