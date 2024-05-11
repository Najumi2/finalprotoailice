'use client'

import React, { useState } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import { styled } from '@mui/material/styles';
import { TextField, Button, Card, CardContent, Typography, Box, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const CenteredContainer = styled('div')({
  textAlign: 'center',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
});

const FormContainer = styled('div')({
  position: 'relative',
  width: '100%',
  minHeight: '0', // Ensures the container can shrink
});

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [notification, setNotification] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // Clear the notification related to password mismatch
    if (notification === 'Password must be at least 8 characters long and include both letters and numbers') {
      setNotification('');
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    // Clear the notification related to password mismatch
    if (notification === 'Passwords do not match') {
      setNotification('');
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    // Clear the notification related to email or username already exists when the user starts typing
    if (notification === 'Email or username already exists' || notification === 'Username/email or password incorrect') {
      setNotification('');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    // Clear the notification related to email or username already exists when the user starts typing
    if (notification === 'Email or username already exists' || notification === 'Username/email or password incorrect') {
      setNotification('');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Pass email and password directly
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User logged in successfully');
        // Store the token securely
        localStorage.setItem('token', data.token);
  
        // Redirect to the chat page
        window.location.href = data.redirectTo;
      } else {
        console.error('Error logging in:', data.message);
        setNotification('Email or password incorrect');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setNotification('Internal server error');
    }
  };
  

  const handleRegister = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObj = Object.fromEntries(formData.entries());

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      setNotification('Password must be at least 8 characters long and include both letters and numbers');
      return;
    }

    if (password !== confirmPassword) {
      setNotification('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered successfully');
        setNotification('User registered successfully');
      } else {
        console.error('Error registering user:', data.error);
        setNotification('Email or username already exists');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setNotification('Internal server error');
    }
  };

  const isRegisterDisabled = (
    password !== confirmPassword || 
    !password || 
    !confirmPassword ||
    !email || 
    !username 
  );

  return (
    <CenteredContainer>
      <h1>AiLice</h1>
      <br />
      <div>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={handleLoginClick}>LOGIN</Button>
          <Button onClick={handleRegisterClick}>REGISTER</Button>
        </ButtonGroup>
      </div>
      <div style={{ marginTop: '20px' }}>
        <FormContainer>
          <AnimatePresence>
            {showLogin && (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <Card variant="outlined" sx={{ maxWidth: 300, margin: 'auto', marginTop: 4 }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                      Login
                    </Typography>
                    <form onSubmit={handleLogin}>
                    <TextField
                      id="email"
                      name="email" // Add name attribute
                      label="Email"
                      type="email"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={handleEmailChange}
                    />
                      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification('')}>
                        <Alert onClose={() => setNotification('')} severity={notification === 'User registered successfully' ? 'success' : 'error'} sx={{ width: '100%' }}>
                          {notification}
                        </Alert>
                      </Snackbar>
                      <TextField
                        id="password"
                        name="password" 
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <p></p>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                      </Button>
                    </form>

                  </CardContent>
                </Card>
              </motion.div>
            )}
            {showRegister && (
              <motion.div
                key="register"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <Card variant="outlined" sx={{ maxWidth: 400, margin: 'auto', marginTop: 4 }}>
                  <CardContent sx={{ width: '90%', margin: 'auto' }}>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                      Register
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleRegister}>
                      <TextField
                        id="username"
                        name="username"
                        label="Username"
                        fullWidth
                        margin="normal"
                        required
                        value={username}
                        onChange={handleUsernameChange}
                      />
                      <TextField
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        required
                        value={email}
                        onChange={handleEmailChange}
                        error={notification === 'Email or username already exists' || notification === 'Username/email or password incorrect'}
                      />
                      {/* Snackbar for displaying notifications */}
                      <Snackbar open={!!notification} autoHideDuration={6000} onClose={() => setNotification('')}>
                        <Alert onClose={() => setNotification('')} severity={notification === 'User registered successfully' ? 'success' : 'error'} sx={{ width: '100%' }}>
                          {notification}
                        </Alert>
                      </Snackbar>
                      <TextField
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                      />
                      <p></p>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isRegisterDisabled}
                      >
                        Register
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </FormContainer>
      </div>
    </CenteredContainer>
  );
};

export default HomePage;


















