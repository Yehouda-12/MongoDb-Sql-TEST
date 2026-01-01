import express from "express";
import { decryptMessage, encryptMessage } from "../controllers/messageController.js";



const router = express.Router();
router.route('/encrypt').post(encryptMessage)
router.route('/decrypt').post(decryptMessage)

 

export default router;