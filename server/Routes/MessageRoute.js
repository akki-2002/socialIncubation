import express from 'express';
import MessageModel from '../Models/MessageModel.js';

const router = express.Router();

// Add a message
router.post('/', async (req, res) => {
  const newMessage = new MessageModel(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get messages of a chat
router.get('/:chatId', async (req, res) => {
  try {
    const messages = await MessageModel.find({ chatId: req.params.chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
