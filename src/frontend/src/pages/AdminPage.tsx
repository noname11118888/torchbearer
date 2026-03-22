import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from "./../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveCallerUserProfile, useIsAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldAlert } from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminPage() {
  const navigate = useNavigate();
  const { identity, login, status, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  // Nested component that will only be rendered (and therefore run hooks) after authentication
  function AuthenticatedAdmin() {
    const { data: isAdmin, isLoading: adminCheckLoading } = useIsAdmin();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
    const saveProfile = useSaveCallerUserProfile();
    const [profileName, setProfileName] = useState('');

    const showProfileSetup = !profileLoading && isFetched && userProfile === null;

    const handleSaveProfile = async () => {
      if (!profileName.trim()) return;
      await saveProfile.mutateAsync({
        id: 0n,
        principal: identity!.getPrincipal().toString(),
        name: profileName,
        email: '',
        role: 'admin',
      });
    };

    if (adminCheckLoading || profileLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-xl shadow-lg border border-destructive/20">
            <div className="flex justify-center">
              <div className="p-3 bg-destructive/10 rounded-full">
                <ShieldAlert className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
              <p className="text-muted-foreground">
                You do not have administrative privileges to access this area. 
                Please contact the system administrator if you believe this is an error.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => navigate({ to: '/' })}
              >
                Return to Home
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Retry Access
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* <Dialog open={showProfileSetup} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Thiết lập hồ sơ</DialogTitle>
              <DialogDescription>
                Vui lòng nhập tên của bạn để tiếp tục
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên của bạn</Label>
                <Input
                  id="name"
                  placeholder="Nhập tên..."
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && profileName.trim()) {
                      handleSaveProfile();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={!profileName.trim() || saveProfile.isPending}
                className="w-full"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu hồ sơ'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {!showProfileSetup && <AdminDashboard />} */}
        <AdminDashboard />
      </>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card p-8 rounded-lg shadow-xl text-center space-y-6">
            <div className="flex justify-center">
              <img
                src="/assets/logo.webp"
                alt="Logo"
                // className="h-20 w-20"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin CMS
              </h1>
              <p className="text-foreground/70">
                Đăng nhập để quản lý nội dung website
              </p>
            </div>
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full"
              disabled={status === 'logging-in'}
            >
              {status === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập với Internet Identity'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="w-full"
            >
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <AuthenticatedAdmin />}
    </>
  );
}
