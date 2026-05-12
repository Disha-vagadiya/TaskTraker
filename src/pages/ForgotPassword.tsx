import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await mockApi.resetPassword(email, currentPassword, newPassword);
      alert('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (err: any) {
      setErrors({ general: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Enter your details below to reset your password.</p>
        
        {errors.general && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{errors.general}</div>}
        
        <form onSubmit={handleSubmit}>
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }} 
            placeholder="Enter your email"
            error={errors.email}
          />
          <Input 
            label="Current Password" 
            type="password" 
            value={currentPassword} 
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (errors.currentPassword) setErrors({ ...errors, currentPassword: undefined });
            }} 
            placeholder="Enter current password"
            error={errors.currentPassword}
          />
          <Input 
            label="New Password" 
            type="password" 
            value={newPassword} 
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
            }} 
            placeholder="Enter new password"
            error={errors.newPassword}
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }} 
            placeholder="Confirm new password"
            error={errors.confirmPassword}
          />
          
          <Button type="submit" className="w-full mt-4" isLoading={loading}>
            Reset Password
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};
