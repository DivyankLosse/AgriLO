import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { t } = useLanguage(); // Use translation
    const { user } = useAuth(); // Import useAuth to access user data if needed for role-based menu

    const menuItems = [
        { name: 'Home', path: '/dashboard', icon: 'home' },
        { name: 'Analysis', path: '/detect', icon: 'potted_plant' },
        { name: 'Root Check', path: '/root', icon: 'grass' }, // Added Root Check
        { name: 'Analytics', path: '/analytics', icon: 'analytics' },
        { name: 'AI Chat', path: '/chat', icon: 'chat' },
        { name: 'Support', path: '/support', icon: 'support_agent' },
        { name: 'Settings', path: '/settings', icon: 'settings' }, // Added Settings based on previous context
    ];

    return (
        <aside className={`w-64 bg-white dark:bg-[#1a2e1d] border-r border-[#f0f4f0] dark:border-[#2a402d] flex flex-col h-full flex-none transition-transform duration-300 md:translate-x-0 fixed md:static z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">spa</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[#111812] dark:text-white text-lg font-bold leading-normal">Agri-Lo</h1>
                        <p className="text-[#618965] dark:text-[#8abf90] text-xs font-normal leading-normal">Smart Farming</p>
                    </div>
                </div>
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && onClose()}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group ${isActive
                                    ? 'bg-[#f0f4f0] dark:bg-white/10'
                                    : 'hover:bg-[#f0f4f0] dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] ${isActive ? 'text-[#111812] dark:text-white' : 'text-[#111812] dark:text-[#a0cfa5]'}`}>
                                    {item.icon}
                                </span>
                                <p className={`text-sm font-medium leading-normal ${isActive ? 'text-[#111812] dark:text-white' : 'text-[#111812] dark:text-[#d1e8d3] group-hover:text-black dark:group-hover:text-white'}`}>
                                    {item.name}
                                </p>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-6">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-xl">science</span>
                        <p className="text-xs font-bold text-primary">EXPERT ANALYSIS</p>
                    </div>
                    <p className="text-xs text-[#618965] dark:text-[#8abf90] mb-3">Book a professional soil test for just ₹199.</p>
                    <Link to="/book-test" onClick={onClose} className="block w-full text-center py-2 bg-white dark:bg-black/20 rounded-lg text-xs font-bold text-[#111812] dark:text-white hover:bg-white/80 transition-colors">
                        Book Now
                    </Link>
                </div>
            </div>
        </aside>
    );
};



const Header = ({ toggleSidebar, title }) => {
    const { language, changeLanguage, t } = useLanguage();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'mr', name: 'मराठी' }
    ];

    const currentLangName = languages.find(l => l.code === language)?.name || 'English';

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#1a2e1d] border-b border-[#f0f4f0] dark:border-[#2a402d] flex-none z-10 sticky top-0">
            <div className="flex items-center gap-4 text-[#111812] dark:text-white md:hidden">
                <button onClick={toggleSidebar} className="material-symbols-outlined">menu</button>
            </div>
            <div className="flex items-center gap-4 text-[#111812] dark:text-white hidden md:flex">
                <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dashboard</span>
                </div>
                <h2 className="text-[#111812] dark:text-white text-lg font-bold leading-tight">{title || 'Dashboard'}</h2>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
                <div className="hidden sm:flex gap-2 relative">
                    {/* Language Switcher */}
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="flex items-center justify-center rounded-xl h-9 px-3 bg-white dark:bg-white/5 border border-[#f0f4f0] dark:border-white/10 text-[#111812] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined mr-2 text-base">language</span>
                        <span>{currentLangName}</span>
                    </button>

                    {langOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)}></div>
                            <div className="absolute top-12 right-0 w-32 bg-white dark:bg-[#1a2e1d] rounded-xl shadow-lg border border-[#f0f4f0] dark:border-[#2a402d] overflow-hidden z-20">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-[#f0f4f0] dark:hover:bg-white/5 ${language === lang.code ? 'font-bold text-primary' : 'text-[#111812] dark:text-white'}`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Profile Button */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-white dark:border-[#2a402d] shadow-sm relative bg-gray-200"
                        >
                            {/* Placeholder for user avatar */}
                            <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border border-white dark:border-[#1a2e1d]"></div>
                        </button>

                        {profileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                                <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#1a2e1d] rounded-xl shadow-lg border border-[#f0f4f0] dark:border-[#2a402d] overflow-hidden z-20 py-1">
                                    <div className="px-4 py-3 border-b border-[#f0f4f0] dark:border-[#2a402d]">
                                        <p className="text-sm font-bold text-[#111812] dark:text-white truncate">{user?.name || 'Farmer'}</p>
                                        <p className="text-xs text-[#618965] dark:text-[#8abf90] truncate">{user?.email || 'user@agri.lo'}</p>
                                    </div>
                                    <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 text-sm text-[#111812] dark:text-white hover:bg-[#f0f4f0] dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">person</span>
                                        {t('profile')}
                                    </button>
                                    <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 text-sm text-[#111812] dark:text-white hover:bg-[#f0f4f0] dark:hover:bg-white/5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">settings</span>
                                        {t('settings')}
                                    </button>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">logout</span>
                                        {t('logout')}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Determine title based on path (basic mapping)
    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Dashboard';
            case '/detect': return 'Analysis';
            case '/analytics': return 'Analytics';
            case '/chat': return 'AI Chat';
            case '/support': return 'Support';
            case '/settings': return 'Settings';
            case '/root': return 'Root Check';
            default: return 'Agri-Lo';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-[#111812] dark:text-white">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={getTitle()} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
