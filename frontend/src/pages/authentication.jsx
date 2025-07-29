import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthContext } from '../contexts/AuthContext';

const defaultTheme = createTheme();

export default function Authentication() {
  const [formState, setFormState] = React.useState(0); // 0 = Sign In, 1 = Sign Up
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setName('');
        setUsername('');
        setPassword('');
        setMessage(result);
        setOpen(true);
        setError('');
        setFormState(0);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 'Something went wrong';
      setError(errorMsg);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          height: '100vh',
          backgroundImage: 'url(https://picsum.photos/1920/1080)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CssBaseline />

        <Grid
          item
          xs={11}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            padding: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '480px',
            maxWidth: '420px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant={formState === 0 ? 'contained' : 'outlined'}
              onClick={() => setFormState(0)}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? 'contained' : 'outlined'}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </Button>
          </Box>

          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                visibility: formState === 1 ? 'visible' : 'hidden',
                height: '0',
                mb: formState === 1 ? 2 : 0,
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!!error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleAuth}
            >
              {formState === 0 ? 'Login' : 'Register'}
            </Button>
          </Box>

          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={() => setOpen(false)}
            message={message}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
