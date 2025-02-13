import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

function SignUpComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(''); // State for password validation error

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const navigatePage = (role) => {
    console.log(role);
    if (role === 'User') {
      navigate('/User');
    } else if (role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Validate password
  const validatePassword = (password) => {
    if (password.length < 10) {
      return 'Password must be at least 10 characters';
    }
    return '';
  };

  // Register user
  const register = async (event) => {
    event.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    // Validate name
    const nameRegex = /^[A-Za-z\s]*$/;
    if (!nameRegex.test(name)) {
      setNameError(true);
      return;
    }

    // Validate password
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Clear password error if validation passes
    setPasswordError('');

    const registerRequest = {
      username: name,
      password: password,
      contactNumber: 'null',
      email: email,
      address: 'null',
      nic: 'null',
      status: '1',
      role: 'User',
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
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
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  // Validate email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value));
  };

  // Validate name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    const nameRegex = /^[A-Za-z\s]*$/;
    setNameError(!nameRegex.test(value));
  };

  return (
    <div className="flex items-center justify-center flex-col w-full">
      <form className="flex items-start justify-center flex-col w-full max-w-md px-4 py-8">
        {/* Email Input Field */}
        <label htmlFor="outlined-basic" className="form-label">
          Email*
        </label>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{
            marginBottom: '1rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          error={emailError}
          helperText={emailError ? 'Please enter a valid email address' : ''}
        />

        {/* Name Input Field */}
        <label htmlFor="outlined-basic-name" className="form-label">
          Name*
        </label>
        <TextField
          id="outlined-basic-name"
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={handleNameChange}
          sx={{
            marginBottom: '1rem',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          error={nameError}
          helperText={nameError ? 'Name should only contain letters and spaces' : ''}
        />

        {/* Password Input Field */}
        <label htmlFor="outlined-adornment-password" className="form-label">
          Password*
        </label>
        <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
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
          {passwordError && (
            <span className="text-red-500 text-sm mt-1">{passwordError}</span>
          )}
        </FormControl>

        {/* Submit Button */}
        <button
          type="button"
          onClick={register}
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
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignUpComponent;