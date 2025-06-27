import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Typography, Paper, Alert, Snackbar, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_LOGIN_URL = `${BASE_URL}/api/login`;
const API_REGISTER_URL = `${BASE_URL}/api/register`;

// onLogin プロップを受け取る
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSnackbarOpen(false);

    try {
      let response;
      if (isRegistering) {
        response = await axios.post(API_REGISTER_URL, { username, password });
      } else {
        response = await axios.post(API_LOGIN_URL, { username, password }, { withCredentials: true });
      }

      setSnackbarMessage(response.data.message || (isRegistering ? "登録成功" : "ログイン成功"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      if (!isRegistering) {
        console.log("Login successful in Login.js component.");
        console.log("Calling onLogin with username:", response.data.username);
        onLogin(response.data.username); // ログイン成功時に親コンポーネントに通知
        navigate('/'); // ★ログイン成功後、ランキング画面へ遷移するよう明示的に指示★
      } else {
        setIsRegistering(false);
        setUsername('');
        setPassword('');
      }

    } catch (error) {
      console.error("Auth error:", error);
      const errorMessage = error.response?.data?.error || "エラーが発生しました。";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {isRegistering ? '新規ユーザー登録' : 'ログイン'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="ユーザー名"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <TextField
            label="パスワード"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isRegistering ? "new-password" : "current-password"}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (isRegistering ? '登録' : 'ログイン')}
          </Button>
          {/* <Button
            variant="text"
            fullWidth
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? 'ログイン画面へ戻る' : '新規登録はこちら'}
          </Button> */}
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;