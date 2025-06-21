import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Shield, Activity, Upload } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';

interface ProfilePageProps {
  onClose: () => void;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  joinDate: string;
  avatar: string;
  bio: string;
  skills: string[];
  certifications: string[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useLocalStorage<ProfileData>('userProfile', {
    name: 'Supply Chain Manager',
    email: 'manager@company.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    department: 'Supply Chain Operations',
    role: 'Senior Manager',
    joinDate: '2022-03-15',
    avatar: '👨‍💼',
    bio: 'Experienced supply chain professional with 8+ years in logistics optimization and team leadership.',
    skills: ['Supply Chain Management', 'Logistics', 'Data Analysis', 'Team Leadership', 'Process Optimization'],
    certifications: ['CSCP - Certified Supply Chain Professional', 'PMP - Project Management Professional']
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editedProfile.name.trim()) newErrors.name = 'Name is required';
    if (!editedProfile.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(editedProfile.email)) newErrors.email = 'Invalid email format';
    if (!editedProfile.phone.trim()) newErrors.phone = 'Phone is required';
    if (!editedProfile.location.trim()) newErrors.location = 'Location is required';
    if (!editedProfile.bio.trim()) newErrors.bio = 'Bio is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setProfile(editedProfile);
      setIsEditing(false);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.'
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the errors before saving.'
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !editedProfile.certifications.includes(newCertification.trim())) {
      setEditedProfile(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleAvatarChange = () => {
    const emojis = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🏭', '👩‍🏭', '👨‍🔬', '👩‍🔬'];
    const currentIndex = emojis.indexOf(editedProfile.avatar);
    const nextIndex = (currentIndex + 1) % emojis.length;
    setEditedProfile(prev => ({ ...prev, avatar: emojis[nextIndex] }));
  };

  const stats = [
    { label: 'Projects Managed', value: '47', icon: Activity },
    { label: 'Cost Savings', value: '$2.4M', icon: Shield },
    { label: 'Team Members', value: '12', icon: User },
    { label: 'Years Experience', value: '8+', icon: Calendar }
  ];

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
            <User className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Profile</h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            ) : (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Avatar and Basic Info */}
              <div className="space-y-6">
                {/* Avatar */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                      {editedProfile.avatar}
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAvatarChange}
                        className="absolute bottom-0 right-0 bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-full transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{profile.name}</h3>
                  <p className="text-gray-400">{profile.role}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/30 rounded-lg p-4 text-center"
                      >
                        <Icon className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                            className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                              errors.email ? 'border-red-500' : 'border-gray-500'
                            } focus:border-sky-400 focus:outline-none`}
                          />
                          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-400">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="tel"
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                              errors.phone ? 'border-red-500' : 'border-gray-500'
                            } focus:border-sky-400 focus:outline-none`}
                          />
                          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-400">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Location
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={editedProfile.location}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                            className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                              errors.location ? 'border-red-500' : 'border-gray-500'
                            } focus:border-sky-400 focus:outline-none`}
                          />
                          {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                        </div>
                      ) : (
                        <p className="text-gray-400">{profile.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Join Date
                      </label>
                      <p className="text-gray-400">{new Date(profile.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">About</h4>
                  {isEditing ? (
                    <div>
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                          errors.bio ? 'border-red-500' : 'border-gray-500'
                        } focus:border-sky-400 focus:outline-none h-24 resize-none`}
                        placeholder="Tell us about yourself..."
                      />
                      {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-400">{profile.bio}</p>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Skills & Expertise</h4>
                  {isEditing && (
                    <div className="mb-4 flex space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill..."
                        className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:border-sky-400 focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addSkill}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.skills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-sky-600/20 text-sky-400 px-3 py-1 rounded-full text-sm border border-sky-600/30 flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => removeSkill(skill)}
                            className="text-sky-400 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Certifications</h4>
                  {isEditing && (
                    <div className="mb-4 flex space-x-2">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                        placeholder="Add a certification..."
                        className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:border-sky-400 focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addCertification}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                  )}
                  <div className="space-y-2">
                    {editedProfile.certifications.map((cert, index) => (
                      <motion.div
                        key={cert}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{cert}</span>
                        </div>
                        {isEditing && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeCertification(cert)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};