

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
    } 
    else if (cipherType === "ATBASH") {
        encryptedText = atbash(message.toUpperCase());
    } else if (cipherType === "RANDOM_SHUFFLE") {
        let letters = message.split("");
        for (let i = 0; i < 5000; i++) {
            let index1 = Math.floor(Math.random() * letters.length);
            let index2 = Math.floor(Math.random() * letters.length);
            while (index1 === index2) {
                index2 = Math.floor(Math.random() * letters.length);
            }
            let temp = letters[index1];
            letters[index1] = letters[index2];
            letters[index2] = temp;
        }
        encryptedText = letters.join("").toUpperCase();


    }
    else {
        return res.status(400).json({ message: "i cipher type not good" });}

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


let lookup_table = {
  A: "Z",
  B: "Y",
  C: "X",
  D: "W",
  E: "V",
  F: "U",
  G: "T",
  H: "S",
  I: "R",
  J: "Q",
  K: "P",
  L: "O",
  M: "N",
  N: "M",
  O: "L",
  P: "K",
  Q: "J",
  R: "I",
  S: "H",
  T: "G",
  U: "F",
  V: "E",
  W: "D",
  X: "C",
  Y: "B",
  Z: "A",
};

function atbash(message) {
  let cipher = "";
  for (let letter of message) {
    if (letter !== " ") {
      cipher += lookup_table[letter];
    } else {
      cipher += " ";
    }
  }
  return cipher;
}
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
      res.status(200).json({ id: message.id, decryptedText });}
    else if (message.cipher_type === "ATBASH") {
        decryptedText = atbash(message.encrypted_text);
        res.status(200).json({ id: message.id, decryptedText });
      }
    else {
      res
        .status(200)
        .json({ id: message.id, decryptedText: null, error: "CANNOT_DECRYPT" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
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
    const items = rows.map((row) => ({
      id: row.id,
      cipherType: row.cipher_type,
      encryptedText: row.encrypted_text,
    }));
    res.status(200).json({ items });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};
