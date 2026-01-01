

export const registerUser = async (req, res) => {
  try {
    const db = req.mongoDbConn;
    const usersCollection = db.collection("users");
    const { username, password } = req.body;

    const result = await usersCollection.insertOne({
      username,
      password,
      encryptedMessagesCount: 0,
      createdAt: new Date(),
    });
    res.status(201).json({ id: result.insertedId, username });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      res.status(409).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
