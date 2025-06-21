import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Smartphone, Eye, EyeOff, X, Check, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';

interface SecurityPageProps {
  onClose: () => void;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: string;
  loginNotifications: boolean;
  sessionTimeout: number;
}

interface SecurityEvent {
  id: number;
  type: 'login' | 'password_change' | 'failed_login' | '2fa_enabled' | 'session_revoked';
  description: string;
  timestamp: string;
  ip: string;
  location?: string;
  device?: string;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onClose }) => {
  const { addNotification } = useNotifications();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [securitySettings, setSecuritySettings] = useLocalStorage<SecuritySettings>('securitySettings', {
    twoFactorEnabled: true,
    passwordLastChanged: '2025-01-10T14:22:00Z',
    loginNotifications: true,
    sessionTimeout: 30
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [securityEvents, setSecurityEvents] = useLocalStorage<SecurityEvent[]>('securityEvents', [
    {
      id: 1,
      type: 'login',
      description: 'Successful login from New York, NY',
      timestamp: '2025-01-15T10:30:00Z',
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2025-01-10T14:22:00Z',
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows'
    },
    {
      id: 3,
      type: 'failed_login',
      description: 'Failed login attempt',
      timestamp: '2025-01-08T09:15:00Z',
      ip: '203.0.113.45',
      location: 'Unknown',
      device: 'Unknown'
    }
  ]);

  const [activeSessions, setActiveSessions] = useLocalStorage<ActiveSession[]>('activeSessions', [
    {
      id: 'current',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: new Date().toISOString(),
      current: true
    },
    {
      id: 'mobile',
      device: 'iPhone • iOS App',
      location: 'New York, NY',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      current: false
    }
  ]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = () => {
    if (validatePasswordForm()) {
      // Simulate password change
      const newEvent: SecurityEvent = {
        id: Date.now(),
        type: 'password_change',
        description: 'Password changed successfully',
        timestamp: new Date().toISOString(),
        ip: '192.168.1.100',
        location: 'New York, NY',
        device: 'Chrome on Windows'
      };

      setSecurityEvents(prev => [newEvent, ...prev]);
      setSecuritySettings(prev => ({
        ...prev,
        passwordLastChanged: new Date().toISOString()
      }));
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
      
      addNotification({
        type: 'success',
        title: 'Password Updated',
        message: 'Your password has been successfully changed.'
      });
    }
  };

  const toggleTwoFactor = () => {
    const newStatus = !securitySettings.twoFactorEnabled;
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: newStatus }));
    
    const newEvent: SecurityEvent = {
      id: Date.now(),
      type: '2fa_enabled',
      description: `Two-factor authentication ${newStatus ? 'enabled' : 'disabled'}`,
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows'
    };

    setSecurityEvents(prev => [newEvent, ...prev]);
    
    addNotification({
      type: newStatus ? 'success' : 'warning',
      title: `2FA ${newStatus ? 'Enabled' : 'Disabled'}`,
      message: `Two-factor authentication has been ${newStatus ? 'enabled' : 'disabled'}.`
    });
  };

  const revokeSession = (sessionId: string) => {
    if (sessionId === 'current') {
      addNotification({
        type: 'error',
        title: 'Cannot Revoke',
        message: 'You cannot revoke your current session.'
      });
      return;
    }

    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    
    const newEvent: SecurityEvent = {
      id: Date.now(),
      type: 'session_revoked',
      description: 'Session revoked',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      location: 'New York, NY',
      device: 'Chrome on Windows'
    };

    setSecurityEvents(prev => [newEvent, ...prev]);
    
    addNotification({
      type: 'success',
      title: 'Session Revoked',
      message: 'The session has been successfully revoked.'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <Check className="w-4 h-4 text-green-400" />;
      case 'password_change': return <Key className="w-4 h-4 text-blue-400" />;
      case 'failed_login': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case '2fa_enabled': return <Shield className="w-4 h-4 text-green-400" />;
      case 'session_revoked': return <Trash2 className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-yellow-500';
    if (strength < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordForm.newPassword));
  }, [passwordForm.newPassword]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Password Section */}
            <div className="bg-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-sky-400" />
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 pr-10 border ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-500'
                      } focus:border-sky-400 focus:outline-none`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-400 text-xs mt-1">{errors.currentPassword}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 pr-10 border ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-500'
                      } focus:border-sky-400 focus:outline-none`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
                  {passwordForm.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Password Strength</span>
                        <span className={passwordStrength >= 75 ? 'text-green-400' : passwordStrength >= 50 ? 'text-blue-400' : passwordStrength >= 25 ? 'text-yellow-400' : 'text-red-400'}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 pr-10 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-500'
                      } focus:border-sky-400 focus:outline-none`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePasswordChange}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Update Password
                </motion.button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-sky-400" />
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300">Secure your account with 2FA</p>
                  <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTwoFactor}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securitySettings.twoFactorEnabled ? 'bg-sky-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
              {securitySettings.twoFactorEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-600/30 rounded-lg p-4"
                >
                  <p className="text-sm text-green-400 mb-2">✓ Two-factor authentication is enabled</p>
                  <p className="text-sm text-gray-400">Your account is protected with authenticator app</p>
                  <div className="mt-3 space-x-2">
                    <button className="text-sm text-sky-400 hover:text-sky-300">View Recovery Codes</button>
                    <span className="text-gray-500">•</span>
                    <button className="text-sm text-sky-400 hover:text-sky-300">Reconfigure</button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Active Sessions */}
            <div className="bg-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
              <div className="space-y-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-600/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {session.current ? 'Current Session' : session.device}
                      </p>
                      <p className="text-sm text-gray-400">{session.location} • {session.device}</p>
                      <p className="text-xs text-gray-500">
                        Last active: {session.current ? 'Now' : new Date(session.lastActive).toLocaleString()}
                      </p>
                    </div>
                    {session.current ? (
                      <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm">Active</span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => revokeSession(session.id)}
                        className="text-red-400 hover:text-red-300 text-sm bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                      >
                        Revoke
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Activity */}
            <div className="bg-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Security Activity</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {securityEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-4 bg-gray-600/30 rounded-lg"
                  >
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <p className="text-white text-sm">{event.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>IP: {event.ip}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Security Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Two-factor authentication {securitySettings.twoFactorEnabled ? 'enabled' : 'disabled'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Strong password in use</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span>Consider reviewing active sessions regularly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span>Password last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};