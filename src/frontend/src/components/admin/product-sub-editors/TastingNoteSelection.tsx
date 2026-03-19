import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface TastingNote {
  name: string;
  imageUrl: string; // Using imageUrl for icon/description as per backend type
  description: string;
}

interface TastingNoteSelectionProps {
  selectedTastingNotes: TastingNote[];
  onSelectionChange: (tastingNotes: TastingNote[]) => void;
}

// Initial static data for tasting notes
let initialStaticTastingNotes: TastingNote[] = [
  { name: 'Cherry', imageUrl: '🍒', description: 'Anh đào' },
  { name: 'Oak', imageUrl: '🌳', description: 'Gỗ sồi' },
  { name: 'Pepper', imageUrl: '🌶️', description: 'Tiêu' },
  { name: 'Vanilla', imageUrl: '🌼', description: 'Vani' }
];

export function TastingNoteSelection({ selectedTastingNotes, onSelectionChange }: TastingNoteSelectionProps) {
  const [staticTastingNotes, setStaticTastingNotes] = useState<TastingNote[]>(initialStaticTastingNotes);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<TastingNote | null>(null);
  const [formData, setFormData] = useState<TastingNote>({ name: '', imageUrl: '', description: '' });

  const handleToggle = (tasting: TastingNote) => {
    const isSelected = selectedTastingNotes.some(t => t.name === tasting.name);
    if (isSelected) {
      onSelectionChange(selectedTastingNotes.filter(t => t.name !== tasting.name));
    } else {
      onSelectionChange([...selectedTastingNotes, tasting]);
    }
  };

  const handleAddOrUpdateStaticItem = () => {
    if (!formData.name.trim() || !formData.imageUrl.trim() || !formData.description.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (editingItem) {
      // Update existing
      setStaticTastingNotes(prev => prev.map(item =>
        item.name === editingItem.name ? formData : item
      ));
      toast.success('Đã cập nhật hương vị chính');
    } else {
      // Add new
      if (staticTastingNotes.some(item => item.name === formData.name)) {
        toast.error('Tên hương vị chính đã tồn tại');
        return;
      }
      setStaticTastingNotes(prev => [...prev, formData]);
      toast.success('Đã thêm hương vị chính');
    }
    setEditingItem(null);
    setFormData({ name: '', imageUrl: '', description: '' });
  };

  const handleDeleteStaticItem = (name: string) => {
    setStaticTastingNotes(prev => prev.filter(item => item.name !== name));
    onSelectionChange(selectedTastingNotes.filter(t => t.name !== name)); // Also remove from selected if deleted
    toast.success('Đã xóa hương vị chính');
  };

  const handleEditStaticItem = (item: TastingNote) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setFormData({ name: '', imageUrl: '', description: '' });
  };

  const displayList = staticTastingNotes; // Could be paginated or virtualized for very long lists

  return (
    <div className="space-y-2">
      <Label>Hương vị chính / Main Flavors</Label>
      <div className="border rounded-md p-4">
        {displayList.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Chưa có dữ liệu hương vị chính nào.
          </p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-4">
              {displayList.map((tasting) => {
                const isSelected = selectedTastingNotes.some(t => t.name === tasting.name);
                return (
                  <div key={tasting.name} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`tasting-${tasting.name}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(tasting)}
                      />
                      <label
                        htmlFor={`tasting-${tasting.name}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        <span className="text-xl mr-2">{tasting.imageUrl}</span> {tasting.name} ({tasting.description})
                      </label>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleEditStaticItem(tasting)}>
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
          Quản lý danh sách hương vị chính
        </Button>
      </div>

      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quản lý Hương vị chính</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tên (ví dụ: Cherry)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!!editingItem}
              />
              <Input
                placeholder="Icon/Mô tả (ví dụ: 🍒)"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
              <Input
                placeholder="Mô tả tiếng Việt (ví dụ: Anh đào)"
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
                {staticTastingNotes.map(item => (
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