import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { Alert } from 'antd';

function PasswordChange({
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

  const [updatePasswordVisible, updatePasswordSetAlertVisible] = useState(false);
  const [error, setError] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogout = (userId) => {
    const currentUserId = localStorage.getItem('id');
    if (userId === currentUserId) {
      localStorage.clear();
      navigate('/');
    }
  };

  const validatePassword = (password, fieldName) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 10) {
      return 'Password must be at least 10 characters';
    } else if (password.length > 20) {
      return 'Password must be at most 20 characters';
    }
    return '';
  };

  const changePassword = async (event) => {
    event.preventDefault();

    // Validate all fields
    const currentPasswordError = validatePassword(currentPassword, 'currentPassword');
    const newPasswordError = validatePassword(newPassword, 'newPassword');
    const confirmPasswordError = validatePassword(confirmPassword, 'confirmPassword');

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      setValidationErrors({
        currentPassword: currentPasswordError,
        newPassword: newPasswordError,
        confirmPassword: 'New Password and Confirm Password must match',
      });
      return;
    }

    // Set validation errors
    setValidationErrors({
      currentPassword: currentPasswordError,
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    // If there are any validation errors, stop here
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      return;
    }

    // Reset mismatch error if fixed
    setPasswordMismatch(false);

    const passwordRequest = {
      userId: localStorage.getItem('id'),
      currentPassword: currentPassword,
      newPassword: confirmPassword,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/user/updateUserPassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(passwordRequest),
      });

      if (response.ok) {
        updatePasswordSetAlertVisible(true);
        setTimeout(() => {
          updatePasswordSetAlertVisible(false);
          handleLogout(passwordRequest.userId);
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-start p-2">
      {/* Success Alert */}
      {updatePasswordVisible && (
        <Alert
          className="w-96 mb-5"
          message="Password Updated Successfully"
          type="success"
          showIcon
          closable
        />
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description="Something went wrong, try again"
          type="error"
          showIcon
        />
      )}

      {/* Password Mismatch Alert */}
      {passwordMismatch && (
        <Alert
          message="Password Mismatch"
          description="New Password and Confirm Password must be the same"
          type="warning"
          showIcon
        />
      )}

      <div className="justify-center items-center flex w-full mb-4">
        <h3 className="text-2xl font-normal text-sky-900">Welcome</h3>
      </div>

      {/* Current Password */}
      <label htmlFor="current-password" className="form-label">
        Current Password*
      </label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="current-password">Password</InputLabel>
        <OutlinedInput
          id="current-password"
          type={showPassword.current ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
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
        {validationErrors.currentPassword && (
          <span className="text-red-500 text-sm">{validationErrors.currentPassword}</span>
        )}
      </FormControl>

      {/* New Password */}
      <label htmlFor="new-password" className="form-label">
        New Password*
      </label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="new-password">Password</InputLabel>
        <OutlinedInput
          id="new-password"
          type={showPassword.new ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
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
        {validationErrors.newPassword && (
          <span className="text-red-500 text-sm">{validationErrors.newPassword}</span>
        )}
      </FormControl>

      {/* Confirm Password */}
      <label htmlFor="confirm-password" className="form-label">
        Confirm Password*
      </label>
      <FormControl sx={{ m: 0, width: '100%' }} variant="outlined" className="mb-4">
        <InputLabel htmlFor="confirm-password">Password</InputLabel>
        <OutlinedInput
          id="confirm-password"
          type={showPassword.confirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
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
        {validationErrors.confirmPassword && (
          <span className="text-red-500 text-sm">{validationErrors.confirmPassword}</span>
        )}
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
        onClick={changePassword}
      >
        Update
      </button>
    </div>
  );
}

export default PasswordChange;