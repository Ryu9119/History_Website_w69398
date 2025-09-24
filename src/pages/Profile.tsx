import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, type User } from '../lib/auth-api';
import { cn } from '../lib/utils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Check authentication
    if (!authApi.isAuthenticated()) {
      navigate('/login?returnTo=/profile');
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (user && headingRef.current) {
      headingRef.current.focus();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // DEV toggles
      if (import.meta.env.DEV) {
        const sp = new URLSearchParams(window.location.search);
        const shouldError = sp.get('error') === '1';
        await new Promise(resolve => setTimeout(resolve, 700));
        if (shouldError) {
          throw new Error('forced-error-profile');
        }
      }

      const currentUser = authApi.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfileData({
          name: currentUser.name,
          email: currentUser.email,
        });
      } else {
        // Try to fetch from API
        const userData = await authApi.me();
        setUser(userData);
        setProfileData({
          name: userData.name,
          email: userData.email,
        });
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update local user data
      if (user) {
        const updatedUser = { ...user, ...profileData, updatedAt: new Date().toISOString() };
        setUser(updatedUser);
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
      }
    } catch {
      toast.error('Cập nhật thông tin thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    
    setUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Đổi mật khẩu thất bại');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-1/3 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-20 w-full bg-card border border-border rounded animate-pulse" />
            <div className="h-20 w-full bg-card border border-border rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-md p-6 text-center">
            <h1 className="text-xl font-semibold text-card-foreground">Đã xảy ra lỗi</h1>
            <p className="text-muted-foreground mt-2">{error}</p>
            <button
              onClick={() => {
                const sp = new URLSearchParams(window.location.search);
                sp.delete('error');
                const url = `${window.location.pathname}?${sp.toString()}`.replace(/\?$/,'');
                window.history.replaceState({}, '', url);
                fetchUserProfile();
              }}
              className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-md p-6 text-center">
            <h1 className="text-xl font-semibold text-card-foreground">Không tìm thấy thông tin người dùng</h1>
            <p className="text-muted-foreground mt-2">Vui lòng đăng nhập lại.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 ref={headingRef} tabIndex={-1} className="sr-only">Trang cá nhân</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Trang cá nhân</h2>
          <p className="text-muted-foreground mt-1">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === 'profile'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors",
              activeTab === 'password'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card border border-border rounded-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Thông tin cá nhân</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
                  >
                    {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-md border border-border hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Họ tên</label>
                  <p className="text-card-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-card-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Ngày tạo</label>
                  <p className="text-card-foreground">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-card border border-border rounded-md p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-card-foreground mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-card-foreground mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
              >
                {updating ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;


