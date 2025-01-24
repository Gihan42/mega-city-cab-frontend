import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

function PasswordChange ({
  currentPassword, setCurrentPassword,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  resetInputs
}) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Handlers for toggling visibility
  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col justify-center items-start p-2">
      <div className="justify-center items-center flex w-full mb-4">
        <h3 className="text-2xl font-normal text-sky-900">Welcome</h3>
      </div>

      {/* Current Password */}
      <label htmlFor="current-password" className="form-label">Current Password*</label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="current-password">Password</InputLabel>
        <OutlinedInput
          id="current-password"
          type={showPassword.current ? 'text' : 'password'}
          value={currentPassword}  // controlled input
          onChange={(e) => setCurrentPassword(e.target.value)}  // update state on change
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword.current ? 'Hide password' : 'Show password'}
                onClick={() => handleClickShowPassword('current')}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword.current ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          sx={{ borderRadius: '8px' }}
        />
      </FormControl>

      {/* New Password */}
      <label htmlFor="new-password" className="form-label">New Password*</label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="new-password">Password</InputLabel>
        <OutlinedInput
          id="new-password"
          type={showPassword.new ? 'text' : 'password'}
          value={newPassword}  // controlled input
          onChange={(e) => setNewPassword(e.target.value)}  // update state on change
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword.new ? 'Hide password' : 'Show password'}
                onClick={() => handleClickShowPassword('new')}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword.new ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          sx={{ borderRadius: '8px' }}
        />
      </FormControl>

      {/* Confirm Password */}
      <label htmlFor="confirm-password" className="form-label">Confirm Password*</label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="confirm-password">Password</InputLabel>
        <OutlinedInput
          id="confirm-password"
          type={showPassword.confirm ? 'text' : 'password'}
          value={confirmPassword}  // controlled input
          onChange={(e) => setConfirmPassword(e.target.value)}  // update state on change
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
                onClick={() => handleClickShowPassword('confirm')}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          sx={{ borderRadius: '8px' }}
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
        Update
      </button>
    </div>
  );
}

export default PasswordChange;
