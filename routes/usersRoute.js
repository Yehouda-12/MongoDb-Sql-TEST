import express from "express";
import { getUser } from "../controllers/usersController.js";



const router = express.Router();
router.route('/me').get(getUser)

 

export default router;