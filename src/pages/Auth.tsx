import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box, Button, Card, FormControl, IconButton,
  InputAdornment, InputLabel, MenuItem, OutlinedInput,
  Select, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import BookiesLogo from "../assets/bookies_logo.png";
import { getCities, login } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [cities, setCities] = useState<string[] | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setConfig, setIsAuthenticated, setCurrentCity } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getCities();
        if (res) setCities(res);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!selectedCity || !passkey) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(selectedCity, passkey);
      setConfig(res);
      setIsAuthenticated(true);
      setCurrentCity(selectedCity);
      navigate('/mail');
    } catch (err) {
      alert('Login failed. Please check credentials.');
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box sx={{
      display: 'grid',
      placeItems: 'center',
      height: '100vh',
      bgcolor: '#FFE6D5'
    }}>
      <Box sx={{ display: 'grid', gap: 4, mt: -16 }}>
        <Box sx={{
          p: 2, fontWeight: 'bold',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <img src={BookiesLogo} style={{ blockSize: 100 }} alt="Bookies Logo" />
          <Typography color='primary' sx={{ fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedCity || "Mumbai"} Bookies</Typography>
          <Typography color='primary' variant='subtitle2'>Admin Dashboard</Typography>
        </Box>

        <Card sx={{ boxShadow: 'none', width: 400, p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'grid', placeItems: 'center', gap: 2 }}>
            <Lock fontSize='large' color='primary' />

            <FormControl fullWidth>
              <InputLabel id="city-label">Select City</InputLabel>
              <Select
                labelId="city-label"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                sx={{ bgcolor: 'whitesmoke' }}
                label="Select City"
                disabled={isLoading}
              >
                {cities?.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="passkey">Passkey</InputLabel>
              <OutlinedInput
                id="passkey"
                type={showPassword ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                sx={{ bgcolor: 'whitesmoke' }}
                onKeyDown={handleKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Passkey"
              />
            </FormControl>

            <Button
              variant='contained'
              fullWidth
              sx={{ py: 1.5 }}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Auth;
