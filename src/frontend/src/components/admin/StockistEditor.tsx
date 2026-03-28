import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Save, MapPin, Building2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useGetStockists, useAddStockist, useUpdateStockist, useDeleteStockist } from '../../hooks/useQueries';
import type { StockistRegion, ContactLocation } from '@/declarations/backend/backend.did';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function StockistEditor() {
  const { data: stockists, isLoading } = useGetStockists();
  const addStockistMutation = useAddStockist();
  const updateStockistMutation = useUpdateStockist();
  const deleteStockistMutation = useDeleteStockist();

  const [editingStockists, setEditingStockists] = useState<StockistRegion[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockistToDelete, setStockistToDelete] = useState<bigint | null>(null);

  useEffect(() => {
    if (stockists) {
      setEditingStockists(stockists);
    }
  }, [stockists]);

  const handleAddRegion = () => {
    const newRegion: StockistRegion = {
      id: 0n,
      name: 'New Region',
      location: '',
      contact: [],
    };
    setEditingStockists([...editingStockists, newRegion]);
  };

  const handleUpdateRegionField = (index: number, field: keyof StockistRegion, value: string) => {
    const updated = [...editingStockists];
    updated[index] = { ...updated[index], [field]: value };
    setEditingStockists(updated);
  };

  const handleAddContactToRegion = (regionIndex: number) => {
    const updated = [...editingStockists];
    const newContact: ContactLocation = {
      id: 0n,
      name: 'New Stockist Name',
      address: '',
      phone: '',
      email: '',
      mapUrl: '',
      isHeadOffice: false,
    };
    updated[regionIndex] = {
      ...updated[regionIndex],
      contact: [...updated[regionIndex].contact, newContact],
    };
    setEditingStockists(updated);
  };

  const handleUpdateContact = (regionIndex: number, contactIndex: number, field: keyof ContactLocation, value: any) => {
    const updated = [...editingStockists];
    const updatedContacts = [...updated[regionIndex].contact];
    updatedContacts[contactIndex] = { ...updatedContacts[contactIndex], [field]: value };
    updated[regionIndex] = { ...updated[regionIndex], contact: updatedContacts };
    setEditingStockists(updated);
  };

  const handleDeleteContact = (regionIndex: number, contactIndex: number) => {
    const updated = [...editingStockists];
    const updatedContacts = [...updated[regionIndex].contact];
    updatedContacts.splice(contactIndex, 1);
    updated[regionIndex] = { ...updated[regionIndex], contact: updatedContacts };
    setEditingStockists(updated);
  };

  const handleSaveStockist = async (stockist: StockistRegion) => {
    try {
      if (stockist.id === 0n) {
        await addStockistMutation.mutateAsync(stockist);
        toast.success('Đã thêm vùng stockist mới');
      } else {
        await updateStockistMutation.mutateAsync(stockist);
        toast.success('Đã cập nhật vùng stockist');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin');
      console.error(error);
    }
  };

  const openDeleteDialog = (id: bigint) => {
    setStockistToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStockist = async () => {
    if (stockistToDelete === null) return;
    try {
      await deleteStockistMutation.mutateAsync(stockistToDelete);
      toast.success('Đã xóa vùng stockist');
      setDeleteDialogOpen(false);
      setStockistToDelete(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải dữ liệu stockist...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Stockist</h2>
          <p className="text-muted-foreground text-sm">Quản lý danh sách các cửa hàng, đại lý phân phối theo vùng miền.</p>
        </div>
        <Button onClick={handleAddRegion} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm vùng mới
        </Button>
      </div>

      <div className="grid gap-6">
        {editingStockists.map((region, rIndex) => (
          <Card key={rIndex} className="border-2">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1">
                    <Label htmlFor={`region-name-${rIndex}`}>Tên vùng (Region Name)</Label>
                    <Input
                      id={`region-name-${rIndex}`}
                      value={region.name}
                      onChange={(e) => handleUpdateRegionField(rIndex, 'name', e.target.value)}
                      className="font-bold text-lg"
                      placeholder="VD: Tasmania, Victoria, Vietnam..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`region-location-${rIndex}`}>Vị trí (Location)</Label>
                    <Input
                      id={`region-location-${rIndex}`}
                      value={region.location}
                      onChange={(e) => handleUpdateRegionField(rIndex, 'location', e.target.value)}
                      placeholder="VD: Hobart, TAS or Ho Chi Minh City..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleSaveStockist(region)}
                    disabled={addStockistMutation.isPending || updateStockistMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" /> Lưu vùng
                  </Button>
                  {region.id !== 0n && (
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => openDeleteDialog(region.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Danh sách đại lý trong vùng
                </h3>
                <Button variant="secondary" size="sm" onClick={() => handleAddContactToRegion(rIndex)}>
                  <Plus className="h-3 w-3 mr-1" /> Thêm đại lý
                </Button>
              </div>

              {region.contact.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground italic">
                  Chưa có đại lý nào trong vùng này. Nhấn "Thêm đại lý" để bắt đầu.
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {region.contact.map((contact, cIndex) => (
                    <AccordionItem key={cIndex} value={`item-${rIndex}-${cIndex}`} className="border rounded-md px-4 mb-2">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 text-left">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">{contact.name || "Đại lý mới"}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tên đại lý</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => handleUpdateContact(rIndex, cIndex, 'name', e.target.value)}
                              placeholder="VD: Wine Store A"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Số điện thoại</Label>
                            <Input
                              value={contact.phone}
                              onChange={(e) => handleUpdateContact(rIndex, cIndex, 'phone', e.target.value)}
                              placeholder="+61 ..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              value={contact.email}
                              onChange={(e) => handleUpdateContact(rIndex, cIndex, 'email', e.target.value)}
                              placeholder="example@wine.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Google Maps Link</Label>
                            <div className="flex gap-2">
                              <Input
                                value={contact.mapUrl}
                                onChange={(e) => handleUpdateContact(rIndex, cIndex, 'mapUrl', e.target.value)}
                                placeholder="https://goo.gl/maps/..."
                              />
                              {contact.mapUrl && (
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Địa chỉ</Label>
                            <Input
                              value={contact.address}
                              onChange={(e) => handleUpdateContact(rIndex, cIndex, 'address', e.target.value)}
                              placeholder="Số nhà, tên đường, thành phố..."
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteContact(rIndex, cIndex)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Xóa đại lý này
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vùng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa toàn bộ vùng và tất cả các đại lý bên trong. Bạn có chắc chắn muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStockist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa vùng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
