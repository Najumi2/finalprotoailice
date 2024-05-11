'use client'

import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken library for decoding JWT tokens
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

// Chat components
function Message({ text, isUser }) {
  const messageStyle = {
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '10px',
    width: 'fit-content',
    maxWidth: '70%', // Set maximum width for better readability
    background: isUser ? '#e3f2fd' : '#c8e6c9', // User message color: light blue, Bot message color: light green
    borderRadius: '10px',
    padding: '10px',
  };

  return (
    <Typography variant="body1" gutterBottom style={messageStyle}>
      {text}
    </Typography>
  );
}

function MessageList({ messages }) {
  return (
    <Box
      marginTop={0}
      marginBottom={0}
      marginLeft={5}
      marginRight={5}
      padding={5}
      maxHeight="calc(100vh - 300px)"
      overflow="auto"
      width="90%"
      style={{ display: 'flex', flexDirection: 'column-reverse', flexGrow: 1 }}
    >
      {messages.map((message, index) => (
        <Message key={index} text={message.text} isUser={message.isUser} />
      ))}
    </Box>
  );
}

function MessageInput({ onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false); // State to track if message is being sent

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputText.trim() !== '') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (inputText.trim() !== '') {
      setSending(true); // Set sending state to true
      onSendMessage(inputText);
      setInputText('');
      setTimeout(() => {
        setSending(false); // Set sending state back to false after 2 seconds
      }, 2000);
    }
  };

  return (
    <Box marginBottom={2} marginLeft={1} marginRight={1} display="flex">
      <TextField
        fullWidth
        variant="outlined"
        label="Message"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={sending} // Disable input while sending
        style={{ borderRadius: '10px', flexGrow: 1, marginRight: '20px' }}
      />
      <Button variant="contained" onClick={sendMessage} disabled={sending} style={{ borderRadius: '10px' }}>
        Send
      </Button>
    </Box>
  );
}

// Combined ChatPage
const ChatPage = () => {
  const [user, setUser] = useState({ email: '', username: '' });
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const decodeToken = (token) => {
    const decoded = jwt.decode(token); // Use jwt.decode instead of jwt-decode
    setUser({ email: decoded.email, username: decoded.username });
    setLoggedIn(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      decodeToken(token);
    }
  }, []);

  const handleSendMessage = (text) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser: true }]);
    // Simulate bot response (you would replace this with actual backend API calls)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'AI is still not integrated so this will be the default response', isUser: false },
      ]);
    }, 500);
  };

  const handleLogout = () => {
    // Reset user state
    setUser({ email: '', username: '' });
    setLoggedIn(false);
    localStorage.removeItem('token');
  
    // Redirect to /logreg
    window.location.href = '/logreg';
  };

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="90vh"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="10px"
        right="10px"
        zIndex="100"
        display="flex"
        alignItems="center"
      >
        {loggedIn && (
          <>
            <Typography variant="body1" style={{ marginRight: '10px' }}>
              Logged in as: {user.email} ({user.username})
            </Typography>
            <Button variant="contained" onClick={handleLogout} style={{ borderRadius: '10px' }}>
              Logout
            </Button>
          </>
        )}
      </Box>
      <Typography variant="h3" gutterBottom style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1 }}>
        Ailice
      </Typography>
      <Box
        style={{
          position: 'fixed',
          bottom: '50px',
          width: '500px',
          maxWidth: '95vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
        }}
      >
        <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flexGrow: 1 }}>
            <MessageList messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ChatPage;

















