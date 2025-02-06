import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import mainPage  from '../../admin/main/mainPage';
import { useNavigate } from 'react-router-dom';


function LogingComponent() {

  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const navigatePage = (role) => {
    console.log(role)
    if (role === 'User'){ navigate('/User')}
    else if (role === 'Admin'){navigate('/admin')} 
    else{ navigate('/')}
  }

  // loging function
  const loging = async (event) => {
    event.preventDefault();
    const loginRequest = {
      email: email,
      password: password,
    }
    console.log(loginRequest)

    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.userId);
        localStorage.setItem('name', data.userName);
        console.log(data);
        navigatePage(data.role);


      } else {
        alert(data.message);
      }
    }catch (error) {
      console.log(error)
      alert('error')
    }
   
  };
//validate email 
const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setEmailError(!emailRegex.test(value));
};
  return (
    <div className='flex items-center justify-center flex-col w-full mb-12'>
      <form className='flex items-start justify-center flex-col w-full max-w-md px-4 py-8'>
        {/* Username Input Field */}
        <label for="outlined-basic" className="form-label">email*</label>
        <TextField
      id="outlined-basic"
      label="Email"
      variant="outlined"
      value={email}
      onChange={handleEmailChange}
      fullWidth
      sx={{
        marginBottom: '1rem',
        '& .MuiInputLabel-root': {
          // Add any styling for label here
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
      }}
      error={emailError}
      helperText={emailError ? 'Please enter a valid email address' : ''}
    />
    

        {/* Password Input Field */}
        <label for="outlined-adornment-password" className="form-label"> password*</label>
        <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className='mb-4'>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            sx={{
              borderRadius: '8px',
              
            }}
          />
        </FormControl>

        {/* Submit Button */}
        <button
          onClick={loging}
          type="button"
          className="btn btn-primary"
          style={{
            marginTop: '1rem',
            backgroundColor: '#0D3B66',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
          }}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default LogingComponent;
