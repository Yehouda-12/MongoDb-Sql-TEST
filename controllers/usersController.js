import { ObjectId } from "mongodb";



export const getUser = async (req, res) => {
  try {
    const mongoDb = req.mongoDbConn;

    const usersCollection = mongoDb.collection("users");
    const { username, password } = req.headers;
    const user = await usersCollection.findOne({ username, password });
    if (!user) {
      return res
        .status(401)
        .json({ message: "no user wiyth this name or password" });
    }
    res
      .status(200)
      .json({
        username: user.username,
        encryptedMessagesCount: user.encryptedMessagesCount,
      });
  } catch (err) {
    console.log(err);
  }
};
