import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import Login from './components/Login';
import AppContent from './AppContent';
import { api, CHECK_LOGIN_URL, LOGOUT_URL } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const response = await api.get(CHECK_LOGIN_URL);
      if (response.data.isLoggedIn) {
        setIsLoggedIn(true);
        setUsername(response.data.username);
        api.defaults.headers['X-CSRFToken'] = response.data.csrfToken;
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    } catch (error) {
      console.error("Login status check failed:", error);
      setIsLoggedIn(false);
      setUsername(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = (loggedInUsername) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const handleLogout = async () => {
    try {
      await api.post(LOGOUT_URL);
      setIsLoggedIn(false);
      setUsername(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>認証中...</Typography>
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AppContent
                isLoggedIn={isLoggedIn}
                username={username}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;