import express from "express";
import { decryptMessage, encryptMessage, getMessages } from "../controllers/messageController.js";



const router = express.Router();
router.route('/encrypt').post(encryptMessage)
router.route('/decrypt').post(decryptMessage)
router.route('/').get(getMessages)

 

export default router;