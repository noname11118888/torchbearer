import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2 } from 'lucide-react'; // Assuming we'll need these for managing static data
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PairingFood {
  name: string;
  imageUrl: string; // Using imageUrl for icon/description as per backend type
  description: string;
}

interface PairingFoodSelectionProps {
  selectedPairings: PairingFood[];
  onSelectionChange: (pairings: PairingFood[]) => void;
}

// Initial static data for pairings
let initialStaticPairings: PairingFood[] = [
  { name: 'Thịt đỏ', imageUrl: '🥩', description: 'Red Meat' },
  { name: 'Phô mai', imageUrl: '🧀', description: 'Cheese' },
  { name: 'Hải sản', imageUrl: '🦞', description: 'Seafood' },
  { name: 'Nấm', imageUrl: '🍄', description: 'Mushrooms' }
];

export function PairingFoodSelection({ selectedPairings, onSelectionChange }: PairingFoodSelectionProps) {
  const [staticPairings, setStaticPairings] = useState<PairingFood[]>(initialStaticPairings);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<PairingFood | null>(null);
  const [formData, setFormData] = useState<PairingFood>({ name: '', imageUrl: '', description: '' });

  const handleToggle = (pairing: PairingFood) => {
    const isSelected = selectedPairings.some(p => p.name === pairing.name);
    if (isSelected) {
      onSelectionChange(selectedPairings.filter(p => p.name !== pairing.name));
    } else {
      onSelectionChange([...selectedPairings, pairing]);
    }
  };

  const handleAddOrUpdateStaticItem = () => {
    if (!formData.name.trim() || !formData.imageUrl.trim() || !formData.description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editingItem) {
      // Update existing
      setStaticPairings(prev => prev.map(item =>
        item.name === editingItem.name ? formData : item
      ));
      toast.success('Đã cập nhật kết hợp món ăn');
    } else {
      // Add new
      if (staticPairings.some(item => item.name === formData.name)) {
        toast.error('Tên kết hợp món ăn đã tồn tại');
        return;
      }
      setStaticPairings(prev => [...prev, formData]);
      toast.success('Đã thêm kết hợp món ăn');
    }
    setEditingItem(null);
    setFormData({ name: '', imageUrl: '', description: '' });
  };

  const handleDeleteStaticItem = (name: string) => {
    setStaticPairings(prev => prev.filter(item => item.name !== name));
    onSelectionChange(selectedPairings.filter(p => p.name !== name)); // Also remove from selected if deleted
    toast.success('Đã xóa kết hợp món ăn');
  };

  const handleEditStaticItem = (item: PairingFood) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', imageUrl: '', description: '' });
  };

  const displayList = staticPairings; // Could be paginated or virtualized for very long lists

  return (
    <div className="space-y-2">
      <Label>Kết hợp món ăn / Food Pairing</Label>
      <div className="border rounded-md p-4">
        {displayList.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Chưa có dữ liệu kết hợp món ăn nào.
          </p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-4">
              {displayList.map((pairing) => {
                const isSelected = selectedPairings.some(p => p.name === pairing.name);
                return (
                  <div key={pairing.name} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`pairing-${pairing.name}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(pairing)}
                      />
                      <label
                        htmlFor={`pairing-${pairing.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <span className="text-xl mr-2">{pairing.imageUrl}</span> {pairing.name} ({pairing.description})
                      </label>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditStaticItem(pairing)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowManageDialog(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Quản lý danh sách kết hợp món ăn
        </Button>
      </div>

      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quản lý Kết hợp món ăn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tên (ví dụ: Thịt đỏ)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!!editingItem} // Disable name edit if editing an existing item
              />
              <Input
                placeholder="Icon/Mô tả (ví dụ: 🥩)"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <Input
                placeholder="Mô tả tiếng Anh (ví dụ: Red Meat)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button onClick={handleAddOrUpdateStaticItem}>
                {editingItem ? 'Cập nhật' : 'Thêm'}
              </Button>
              {editingItem && (
                <Button variant="outline" onClick={handleCancelEdit}>Hủy</Button>
              )}
            </div>

            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-2">
                {staticPairings.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="text-xl mr-2">{item.imageUrl}</span> {item.name} ({item.description})
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditStaticItem(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteStaticItem(item.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}