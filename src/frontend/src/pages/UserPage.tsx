import { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetCallerOrders, useGetProducts } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Package, LogOut, Loader2, Eye, Calendar, Clock, CreditCard } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Order, Product } from '@/backend';

export default function UserPage() {
  const { identity, login, logout } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateProfileMutation = useSaveCallerUserProfile();
  
  const [currentPage, setCurrentPage] = useState(1);
  const { data: ordersData, isLoading: ordersLoading } = useGetCallerOrders(currentPage - 1);
  const { data: productsData } = useGetProducts();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Map products for easy lookup
  const productMap = new Map<bigint, Product>();
  productsData?.forEach(([id, product]) => {
    productMap.set(id, product);
  });

  const getProductInfo = (productId: bigint) => {
    return productMap.get(productId);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
                                <td className="p-3 flex items-center justify-between">
                                  <Badge variant={
                                    'pending' in order.status ? 'outline' : 
                                    'completed' in order.status ? 'default' : 'destructive'
                                  }>
                                    {'pending' in order.status ? 'Đang chờ' : 
                                     'completed' in order.status ? 'Hoàn thành' : 'Đã hủy'}
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setViewDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id.toString()}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về các sản phẩm bạn đã đặt.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày đặt:</span>
                  <span className="text-muted-foreground">{formatDate(selectedOrder.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tổng tiền:</span>
                  <span className="text-primary font-bold">{Number(selectedOrder.totalAmount).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Sản phẩm đã đặt
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const product = getProductInfo(item.productId);
                    return (
                      <div key={idx} className="flex gap-4 items-center p-3 rounded-lg bg-muted/30 border border-border/50">
                        {product?.imageUrl?.[0] ? (
                          <img 
                            src={product.imageUrl[0].startsWith('http') ? product.imageUrl[0] : `/assets/${product.imageUrl[0]}`} 
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover bg-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product?.name || `Sản phẩm #${item.productId.toString()}`}</p>
                          <p className="text-xs text-muted-foreground">Số lượng: {item.quantity.toString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{Number(item.totalPrice).toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedOrder.note && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Ghi chú của bạn:</h4>
                  <div className="p-3 rounded-md bg-muted text-sm italic">
                    "{selectedOrder.note}"
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <Badge variant={
                    'pending' in selectedOrder.status ? 'outline' : 
                    'completed' in selectedOrder.status ? 'default' : 'destructive'
                  }>
                    {'pending' in selectedOrder.status ? 'Đang chờ xử lý' : 
                     'completed' in selectedOrder.status ? 'Đã hoàn thành' : 'Đã hủy'}
                  </Badge>
                </div>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Đóng</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
}
