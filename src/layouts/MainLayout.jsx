import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    LayoutDashboard,
    ReceiptIndianRupee,
    Layers,
    BrainCircuit,
    User as UserIcon,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    Moon,
    Sun,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { cn } from '../components/ui';
import GlobalNotification from '../components/ui/GlobalNotification';

// ─── Nav item with tooltip support ───────────────────────────────────────────
const NavItem = ({ item, collapsed, onClick }) => {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) => cn(
                'relative flex items-center gap-3 rounded-xl transition-all duration-150 group',
                collapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2.5',
                isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon size={18} className="shrink-0" />

                    {!collapsed && (
                        <span className="text-sm font-medium leading-none">{item.name}</span>
                    )}

                    {/* Active indicator dot */}
                    {isActive && collapsed && (
                        <span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-white/60" />
                    )}

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                        <span className="
                            absolute left-full ml-3 px-2.5 py-1.5
                            bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium
                            rounded-lg whitespace-nowrap pointer-events-none
                            opacity-0 group-hover:opacity-100
                            translate-x-1 group-hover:translate-x-0
                            transition-all duration-150 z-50
                            shadow-lg
                        ">
                            {item.name}
                            {/* Arrow */}
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
};

// ─── Main layout ──────────────────────────────────────────────────────────────
const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);         // mobile drawer
    const [collapsed, setCollapsed] = useState(false);             // desktop collapsed
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [searchFocused, setSearchFocused] = useState(false);

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, section: 'main' },
        { name: 'Expenses', path: '/expenses', icon: ReceiptIndianRupee, section: 'main' },
        { name: 'Categories', path: '/categories', icon: Layers, section: 'main' },
        { name: 'AI Insights', path: '/ai', icon: BrainCircuit, section: 'tools' },
        // { name: 'Profile', path: '/profile', icon: UserIcon, section: 'account' },
    ];

    const mainNav = navItems.filter(i => i.section === 'main');
    const toolsNav = navItems.filter(i => i.section === 'tools');
    const accountNav = navItems.filter(i => i.section === 'account');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const sidebarWidth = collapsed ? 'w-[68px]' : 'w-64';

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">

            {/* Logo */}
            <div className={cn(
                'flex items-center gap-3 mb-8 px-2 shrink-0',
                collapsed && !isMobile ? 'justify-center px-0' : ''
            )}>
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/25">
                    <span className="font-bold text-base">E</span>
                </div>
                {(!collapsed || isMobile) && (
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        Expense Tracker
                    </span>
                )}
            </div>

            {/* Nav groups */}
            <nav className="flex-1 space-y-5 overflow-y-auto">

                {/* Main */}
                <div>
                    {(!collapsed || isMobile) && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-1.5">
                            Main
                        </p>
                    )}
                    <div className="space-y-0.5">
                        {mainNav.map(item => (
                            <NavItem
                                key={item.path}
                                item={item}
                                collapsed={collapsed && !isMobile}
                                onClick={() => isMobile && setSidebarOpen(false)}
                            />
                        ))}
                    </div>
                </div>

                {/* Tools */}
                <div>
                    {(!collapsed || isMobile) && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-3 mb-1.5">
                            Tools
                        </p>
                    )}
                    {collapsed && !isMobile && (
                        <div className="h-px bg-slate-100 dark:bg-slate-800 mb-2 mx-2" />
                    )}
                    <div className="space-y-0.5">
                        {toolsNav.map(item => (
                            <NavItem
                                key={item.path}
                                item={item}
                                collapsed={collapsed && !isMobile}
                                onClick={() => isMobile && setSidebarOpen(false)}
                            />
                        ))}
                    </div>
                </div>


            </nav>

            {/* User card + logout */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-1">

                {/* User info */}
                {(!collapsed || isMobile) && (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-500/30 shrink-0 overflow-hidden">
                            {user?.avatar
                                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                : user?.fullName?.[0]}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                                {user?.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <Sparkles size={9} className="text-amber-400" />
                                Premium
                            </p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={cn(
                        'relative flex items-center gap-3 rounded-xl transition-all duration-150 w-full group',
                        'text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400',
                        collapsed && !isMobile ? 'px-3 py-3 justify-center' : 'px-3 py-2.5'
                    )}
                >
                    <LogOut size={18} className="shrink-0" />
                    {(!collapsed || isMobile) && (
                        <span className="text-sm font-medium">Log out</span>
                    )}
                    {collapsed && !isMobile && (
                        <span className="
                            absolute left-full ml-3 px-2.5 py-1.5
                            bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium
                            rounded-lg whitespace-nowrap pointer-events-none
                            opacity-0 group-hover:opacity-100
                            translate-x-1 group-hover:translate-x-0
                            transition-all duration-150 z-50 shadow-lg
                        ">
                            Log out
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-inter">
            <GlobalNotification />

            {/* ── Mobile backdrop ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Mobile drawer ── */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 lg:hidden',
                'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64',
                'transition-transform duration-300',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                        <span /> {/* spacer */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <SidebarContent isMobile />
                </div>
            </aside>

            {/* ── Desktop sidebar ── */}
            <aside className={cn(
                'hidden lg:flex flex-col fixed inset-y-0 left-0 z-50',
                'bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800',
                'transition-all duration-300 ease-in-out',
                sidebarWidth
            )}>
                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm transition-colors z-10"
                >
                    {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </button>

                <div className={cn('p-5 h-full flex flex-col', collapsed && 'items-center px-3')}>
                    <SidebarContent />
                </div>
            </aside>

            {/* ── Main area ── */}
            <div className={cn(
                'flex-1 flex flex-col min-h-screen transition-all duration-300',
                collapsed ? 'lg:ml-[68px]' : 'lg:ml-64'
            )}>

                {/* ── Topbar ── */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 h-14 flex items-center px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">

                    {/* Mobile hamburger */}
                    <button
                        className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>

                    {/* Page title on mobile */}
                    <h2 className="text-base font-bold text-slate-900 dark:text-white sm:hidden truncate">
                        {navItems.find(i => i.path === location.pathname)?.name || 'App'}
                    </h2>

                    {/* Search */}
                    <div className={cn(
                        'hidden sm:flex items-center gap-2 rounded-xl border transition-all duration-200 px-3 py-1.5',
                        searchFocused
                            ? 'w-72 bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-500/50 ring-2 ring-indigo-100 dark:ring-indigo-500/10'
                            : 'w-52 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    )}>
                        <Search size={14} className="text-slate-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search transactions…"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="bg-transparent border-none text-sm outline-none w-full text-slate-700 dark:text-slate-300 placeholder:text-slate-400"
                        />
                        {searchFocused && (
                            <kbd className="text-[10px] text-slate-300 dark:text-slate-600 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                                esc
                            </kbd>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">

                        {/* Dark mode */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode
                                ? <Sun size={18} />
                                : <Moon size={18} />
                            }
                        </button>

                        {/* Notifications */}
                        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
                        </button>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                        {/* Avatar + name */}
                        <div className="flex items-center gap-2.5 pl-1">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                                    {user?.fullName}
                                </p>
                                <p className="text-[10px] text-amber-500 font-semibold flex items-center justify-end gap-0.5 mt-0.5">
                                    <Sparkles size={9} /> Premium
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-500/30 overflow-hidden shadow-sm shrink-0">
                                {user?.avatar
                                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                    : user?.fullName?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Page content ── */}
                <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;