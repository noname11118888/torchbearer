import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetCallerOrders } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Package, LogOut, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function UserPage() {
  const { identity, login, logout } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateProfileMutation = useSaveCallerUserProfile();
  
  const [currentPage, setCurrentPage] = useState(1);
  const { data: ordersData, isLoading: ordersLoading } = useGetCallerOrders(currentPage - 1);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Sync state with profile data when loaded
  useState(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    updateProfileMutation.mutate({
      ...profile,
      name,
      email,
    });
  };

  if (!identity) {
    return (
      <>
        <Header />
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md text-center p-8">
            <User className="w-16 h-16 mx-auto mb-4 text-primary opacity-20" />
            <h1 className="text-2xl font-bold mb-2">Tài khoản người dùng</h1>
            <p className="text-muted-foreground mb-6">Vui lòng đăng nhập để xem thông tin cá nhân và đơn hàng của bạn.</p>
            <Button onClick={login} size="lg" className="w-full">
              Đăng nhập
            </Button>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Xin chào, {profile?.name || 'Người dùng'}!</h1>
              <p className="text-muted-foreground">Quản lý hồ sơ và theo dõi đơn hàng của bạn.</p>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Đơn hàng của tôi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Hồ sơ cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin liên lạc của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="Nhập tên của bạn"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="yourname@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Principal ID</Label>
                        <code className="p-2 bg-muted rounded text-xs break-all">
                          {identity.getPrincipal().toString()}
                        </code>
                      </div>
                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu thay đổi
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                  <CardDescription>Danh sách các đơn hàng bạn đã gửi.</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                    </div>
                  ) : !ordersData || ordersData.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
                      <Button variant="link" onClick={() => window.location.href='/ruou-vang'}>
                        Mua sắm ngay
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-md border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-3 text-left">Mã đơn</th>
                              <th className="p-3 text-left">Ngày đặt</th>
                              <th className="p-3 text-left">Tổng tiền</th>
                              <th className="p-3 text-left">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordersData.map((order) => (
                              <tr key={order.id.toString()} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="p-3 font-medium">#{order.id.toString()}</td>
                                <td className="p-3">{new Date(Number(order.timestamp) / 1000000).toLocaleDateString('vi-VN')}</td>
                                <td className="p-3">{Number(order.totalAmount).toLocaleString('vi-VN')} VNĐ</td>
                                <td className="p-3">
                                  <Badge variant={
                                    'pending' in order.status ? 'outline' : 
                                    'completed' in order.status ? 'default' : 'destructive'
                                  }>
                                    {'pending' in order.status ? 'Đang chờ' : 
                                     'completed' in order.status ? 'Hoàn thành' : 'Đã hủy'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Pagination placeholder */}
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => p - 1)}
                        >
                          Trước
                        </Button>
                        <span className="flex items-center px-4 text-sm font-medium">
                          Trang {currentPage}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={ordersData.length < 10}
                          onClick={() => setCurrentPage(p => p + 1)}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
