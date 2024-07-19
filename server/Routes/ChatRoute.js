import express from 'express'
import { createChat, findChat, userChats } from '../Controllers/ChatController.js';

const router = express.Router()

router.post('/', createChat);
router.get('/allChats', userChats);
router.get('/find/:firstId/:secondId', findChat);

export default router