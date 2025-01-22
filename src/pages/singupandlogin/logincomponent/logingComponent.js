import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

function LogingComponent() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className='flex items-center justify-center flex-col w-full mb-12'>
      <form className='flex items-start justify-center flex-col w-full max-w-md px-4 py-8'>
        {/* Username Input Field */}
        <label for="outlined-basic" className="form-label">email*</label>
        <TextField
          id="outlined-basic"
          label="eamil"
          variant="outlined"
          fullWidth
          sx={{
            marginBottom: '1rem',
            '& .MuiInputLabel-root': {
              
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
             
            },
          }}
        />

        {/* Password Input Field */}
        <label for="outlined-adornment-password" className="form-label"> password*</label>
        <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className='mb-4'>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
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
          type="submit"
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

export default LogingComponent;
