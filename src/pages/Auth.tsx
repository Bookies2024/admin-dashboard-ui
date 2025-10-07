import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box, Button, Card, FormControl, IconButton,
  InputAdornment, InputLabel, MenuItem, OutlinedInput,
  Select, Typography
} from '@mui/material';
import React, { useState } from 'react';
import BookiesLogo from "../assets/bookies_logo.png";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setConfig } from '../store/auth/auth-slice';
import { useLoginMutation } from '../store/auth/auth-api-slice';
import { useGetCitiesQuery } from '../store/app/app-api-slice';

const Auth = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery({})
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (!selectedCity || !passkey) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await login({ city: selectedCity, password: passkey }).unwrap()
      if (!res?.success) {
        throw new Error("Invalid credentials");
      }
      dispatch(setConfig({ config: res.data, city: selectedCity }))
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check credentials.');
      console.log(err)
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
      <Box sx={{ display: 'grid', gap: 4, mt: -10 }}>
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
                disabled={isCitiesLoading || isLoginLoading}
              >
                {cities?.data?.map((city: string) => (
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
              disabled={isCitiesLoading || isLoginLoading}
            >
              {isCitiesLoading ? "Loading..." : "Continue"}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Auth;
