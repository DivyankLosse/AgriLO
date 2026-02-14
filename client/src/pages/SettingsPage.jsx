import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const SettingsPage = () => {
    const { user, logout, updateProfile } = useAuth();
    const { language, changeLanguage } = useLanguage();

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
    });

    // Preferences State
    const [notifications, setNotifications] = useState({
        push: true,
        weeklyReport: false,
        email: true // Hidden in UI but part of state
    });

    const [uiNotification, setUiNotification] = useState({ show: false, type: '', message: '' });

    const showNotification = (type, message) => {
        setUiNotification({ show: true, type, message });
        setTimeout(() => setUiNotification({ show: false, type: '', message: '' }), 3000);
    };

    // Initialize state from user object
    React.useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                phone: user.phone || '',
            });
            if (user.settings?.notifications) {
                setNotifications(prev => ({ ...prev, ...user.settings.notifications }));
            }
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfile(profileData);
            setIsEditing(false);
            showNotification('success', 'Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            showNotification('error', 'Failed to update profile. Please try again.');
        }
    };

    const toggleNotification = async (key) => {
        const newNotifications = { ...notifications, [key]: !notifications[key] };
        setNotifications(newNotifications);

        // Auto-save settings
        try {
            await updateProfile({
                settings: {
                    ...user?.settings,
                    notifications: newNotifications
                }
            });
            showNotification('success', 'Preferences saved!');
        } catch (error) {
            console.error("Failed to update settings", error);
            // Revert on failure?
            setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
            showNotification('error', 'Failed to save preferences.');
        }
    };

    const handleLanguageChange = async (newLang) => {
        changeLanguage(newLang);
        // Persist language to backend
        try {
            await updateProfile({ language: newLang });
            showNotification('success', 'Language preference saved!');
        } catch (error) {
            console.error("Failed to update language", error);
            showNotification('error', 'Failed to save language preference.');
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-10">
            <h1 className="text-3xl font-black text-text-main dark:text-white leading-tight tracking-[-0.033em]">
                Settings & Profile
            </h1>

            {/* Notification Toast */}
            {uiNotification.show && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-white transition-all transform animate-in slide-in-from-top-2 ${uiNotification.type === 'success' ? 'bg-primary' : 'bg-red-500'}`}>
                    {uiNotification.message}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="hidden md:flex flex-col gap-2">
                    {[
                        { icon: 'person', label: 'My Profile', active: true },
                        { icon: 'notifications', label: 'Notifications', active: false },
                        { icon: 'language', label: 'Language & Region', active: false },
                        { icon: 'lock', label: 'Privacy & Security', active: false },
                    ].map((item, idx) => (
                        <button key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-colors ${item.active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-light dark:text-text-secondary-dark hover:bg-[#f0f4f0] dark:hover:bg-white/5'}`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 mt-4 transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2 flex flex-col gap-6">

                    {/* Perspective: Profile */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-white dark:border-[#2a3c2e] shadow-sm">
                                <span className="material-symbols-outlined text-4xl">person</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-main dark:text-white">{user?.name || 'Farmer User'}</h2>
                                <p className="text-text-light dark:text-text-secondary-dark">{user?.email || 'user@example.com'}</p>
                            </div>
                            <button
                                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                className={`ml-auto px-4 py-2 rounded-lg border font-bold text-sm transition-colors ${isEditing ? 'bg-primary text-white border-primary' : 'border-[#dbe6dc] dark:border-[#4a5c4e] hover:bg-[#f0f4f0] dark:hover:bg-white/5'}`}
                            >
                                {isEditing ? 'Save' : 'Edit'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    readOnly={!isEditing}
                                    className={`w-full h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] text-text-main dark:text-white border-none focus:ring-2 focus:ring-primary/50 transition-all ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-light dark:text-text-secondary-dark uppercase mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    readOnly={!isEditing}
                                    className={`w-full h-12 px-4 rounded-xl bg-[#f6f8f6] dark:bg-[#1a2c1e] text-text-main dark:text-white border-none focus:ring-2 focus:ring-primary/50 transition-all ${!isEditing && 'opacity-70 cursor-not-allowed'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Perspective: Preferences */}
                    <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-[#f0f4f0] dark:border-[#2a3c2e] shadow-sm">
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-6">Preferences</h3>

                        <div className="flex flex-col gap-6">
                            {/* Language */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">translate</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white">App Language</p>
                                        <p className="text-xs text-text-light dark:text-text-secondary-dark">Select your preferred language</p>
                                    </div>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="bg-[#f6f8f6] dark:bg-[#1a2c1e] border-none rounded-lg px-3 py-2 font-medium cursor-pointer"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi (हिंदी)</option>
                                    <option value="mr">Marathi (मराठी)</option>
                                </select>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">notifications</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white">Push Notifications</p>
                                        <p className="text-xs text-text-light dark:text-text-secondary-dark">Receive alerts about disease detection</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('push')}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${notifications.push ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${notifications.push ? 'left-6' : 'left-1'}`}></span>
                                </button>
                            </div>

                            {/* Weekly Report */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">summarize</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white">Weekly Email Report</p>
                                        <p className="text-xs text-text-light dark:text-text-secondary-dark">Get a summary of your farm's health</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('weeklyReport')}
                                    className={`w-12 h-7 rounded-full transition-colors relative ${notifications.weeklyReport ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${notifications.weeklyReport ? 'left-6' : 'left-1'}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Sign Out */}
                    <button onClick={logout} className="md:hidden w-full h-12 rounded-xl border border-red-200 text-red-500 font-bold hover:bg-red-50 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
