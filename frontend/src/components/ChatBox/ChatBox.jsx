import React, { useEffect, useState, useRef } from "react";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from 'react-input-emoji';

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        console.log("User data: ", data); // Log user data
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        console.log("Messages fetched: ", data); // Log fetched messages
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  const scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    const receiverId = chat.members.find((id) => id !== currentUser);

    // send message to socket server
    setSendMessage({ ...message, receiverId });

    // send message to database
    try {
      const { data } = await addMessage(message);
      console.log("Message sent: ", data); // Log sent message
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage?.chatId === chat?._id) {
      console.log("New message arrived: ", receivedMessage); // Log received message
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* chat-header */}
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* chat-body */}
          <div className="chat-body">
            {messages.map((message) => (
              <div
                key={message._id}
                ref={scroll}
                className={`message ${message.senderId === currentUser ? "own" : ""}`}
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* chat-sender */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
            />
            <button className="send-button" onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">Tap on a Chat to start conversation...</span>
      )}
    </div>
  );
};

export default ChatBox;
