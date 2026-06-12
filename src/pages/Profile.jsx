import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Calendar, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { updateProfile, updatePassword } from '../store/slices/userSlice';
import { showNotification } from '../store/slices/uiSlice';
import { Card, Button, Input } from '../components/ui';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { updating, passwordUpdating, error, passwordError } = useSelector(state => state.user);

    const [fullName, setFullName] = useState(user?.fullName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile({ fullName }));
        if (!result.error) {
            dispatch(showNotification({ title: 'Profile Updated', message: 'Your profile has been updated successfully.', type: 'success' }));
        } else {
            dispatch(showNotification({ title: 'Update Failed', message: result.payload || 'Something went wrong.', type: 'error' }));
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            dispatch(showNotification({ title: 'Validation Error', message: 'New password must be at least 6 characters.', type: 'error' }));
            return;
        }
        const result = await dispatch(updatePassword({ currentPassword, newPassword }));
        if (!result.error) {
            setCurrentPassword('');
            setNewPassword('');
            dispatch(showNotification({ title: 'Password Updated', message: 'Your password has been changed successfully.', type: 'success' }));
        } else {
            dispatch(showNotification({ title: 'Password Failed', message: result.payload || 'Something went wrong.', type: 'error' }));
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-24">
            <div className="space-y-2 pt-4 sm:pt-6">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-950 dark:text-white">Profile.</h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Manage your account settings and security</p>
            </div>

            {/* Profile Info Card */}
            <Card className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8 text-center sm:text-left">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg shadow-indigo-500/20 shrink-0">
                        {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</h2>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-1 text-slate-500 text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5"><Mail size={14} /><span className="truncate max-w-[180px] sm:max-w-none">{user?.email}</span></span>
                            <span className="hidden sm:inline text-slate-300">·</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} />Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md mx-auto sm:mx-0">
                    <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    <Button type="submit" loading={updating} className="w-full sm:w-auto"><Save size={16} />Save Changes</Button>
                </form>
            </Card>

            {/* Change Password Card */}
            <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0">
                        <Lock size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Security</h2>
                        <p className="text-xs sm:text-sm text-slate-500">Update your password</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md mx-auto sm:mx-0">
                    <div className="relative">
                        <Input label="Current Password" type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        <button type="button" onClick={() => setShowCurrent(o => !o)} className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600">
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="relative">
                        <Input label="New Password" type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                        <button type="button" onClick={() => setShowNew(o => !o)} className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600">
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm font-medium">{passwordError}</p>}
                    <Button type="submit" loading={passwordUpdating} className="w-full sm:w-auto"><Lock size={16} />Update Password</Button>
                </form>
            </Card>
        </div>
    );
};

export default Profile;
