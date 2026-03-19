import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
// No longer importing Plus, Edit, Trash2, etc. as they are not needed for static management
// No longer importing useState, Input, Button, Dialog components for static management
// No longer importing toast as it's not needed for static management

interface TastingNote {
  name: string;
  imageUrl: string; // Using imageUrl for icon/description as per backend type
  description: string;
}

interface TastingNoteSelectionProps {
  selectedTastingNotes: TastingNote[];
  onSelectionChange: (tastingNotes: TastingNote[]) => void;
}

// Static data for tasting notes
const staticTastingNotes: TastingNote[] = [
  { name: 'Vải', imageUrl: '🍈', description: 'Trái vải' },
  { name: 'Hoa trắng', imageUrl: '🌼', description: 'Hoa cơm cháy' },
  { name: 'Chanh dây', imageUrl: '🍹', description: 'Passion fruit' },
  { name: 'Chanh cam', imageUrl: '🍋', description: 'Citrus' },
  { name: 'Bưởi', imageUrl: '🍊', description: 'Grapefruit' },
  { name: 'Sàn rừng', imageUrl: '🍂', description: 'Forest floor' },
  { name: 'Nấm', imageUrl: '🍄', description: 'Mushroom' },
  { name: 'Lá nguyệt quế', imageUrl: '🍃', description: 'Bay leaf' },
  { name: 'Hoa hồng', imageUrl: '🌹', description: 'Rose' },
  { name: 'Gia vị nướng', imageUrl: '🌶️', description: 'Baking spices' },
  { name: 'Gỗ sồi', imageUrl: '🌲', description: 'Oak' },
  { name: 'Anh đào', imageUrl: '🍒', description: 'Cherry' },
  { name: 'Nho đen', imageUrl: '🍇', description: 'Blackcurrant' },
  { name: 'Gia vị', imageUrl: '🌶️', description: 'Spice' },
  { name: 'Xuân đào', imageUrl: '🍑', description: 'Nectarine' },
  { name: 'Dâu rừng', imageUrl: '🍓', description: 'Wild strawberry' },
  { name: 'Vanilla', imageUrl: '🌼', description: 'Vani' },
  { name: 'Tuyết tùng', imageUrl: '🌲', description: 'Cedar' },
  { name: 'Táo vàng', imageUrl: '🍏', description: 'Yellow apple' },

  // NEW (mở rộng)
  { name: 'Táo xanh', imageUrl: '🍏', description: 'Green apple' },
  { name: 'Táo đỏ', imageUrl: '🍎', description: 'Red apple' },
  { name: 'Lê', imageUrl: '🍐', description: 'Pear' },
  { name: 'Đào', imageUrl: '🍑', description: 'Peach' },
  { name: 'Mận', imageUrl: '🍑', description: 'Plum' },
  { name: 'Việt quất', imageUrl: '🫐', description: 'Blueberry' },
  { name: 'Mâm xôi', imageUrl: '🍓', description: 'Raspberry' },
  { name: 'Dứa', imageUrl: '🍍', description: 'Pineapple' },
  { name: 'Xoài', imageUrl: '🥭', description: 'Mango' },
  { name: 'Chuối', imageUrl: '🍌', description: 'Banana' },
  { name: 'Mật ong', imageUrl: '🍯', description: 'Honey' },
  { name: 'Caramel', imageUrl: '🍬', description: 'Caramel' },
  { name: 'Socola', imageUrl: '🍫', description: 'Chocolate' },
  { name: 'Cà phê', imageUrl: '☕', description: 'Coffee' },
  { name: 'Thuốc lá', imageUrl: '🚬', description: 'Tobacco' },
  { name: 'Da thuộc', imageUrl: '🧥', description: 'Leather' },
  { name: 'Khoáng chất', imageUrl: '🪨', description: 'Minerality' },
  { name: 'Cherry', imageUrl: '🍒', description: 'Anh đào' }, 
  { name: 'Oak', imageUrl: '🌳', description: 'Gỗ sồi' }, 
  { name: 'Pepper', imageUrl: '🌶️', description: 'Tiêu' },
];



// const staticTastingNotes: TastingNote[] = [
//   { name: 'Vải', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f348.svg', description: 'Trái vải' },
//   { name: 'Hoa trắng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f33c.svg', description: 'Hoa cơm cháy' },
//   { name: 'Chanh dây', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f379.svg', description: 'Passion fruit' },
//   { name: 'Chanh cam', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34b.svg', description: 'Citrus' },
//   { name: 'Bưởi', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34a.svg', description: 'Grapefruit' },
//   { name: 'Sàn rừng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f342.svg', description: 'Forest floor' },
//   { name: 'Nấm', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f344.svg', description: 'Mushroom' },
//   { name: 'Lá nguyệt quế', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f343.svg', description: 'Bay leaf' },
//   { name: 'Hoa hồng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f339.svg', description: 'Rose' },
//   { name: 'Gia vị nướng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f336.svg', description: 'Baking spices' },
//   { name: 'Gỗ sồi', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f332.svg', description: 'Oak' },
//   { name: 'Anh đào', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f352.svg', description: 'Cherry' },
//   { name: 'Nho đen', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f347.svg', description: 'Blackcurrant' },
//   { name: 'Gia vị', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f336.svg', description: 'Spice' },
//   { name: 'Xuân đào', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f351.svg', description: 'Nectarine' },
//   { name: 'Dâu rừng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f353.svg', description: 'Wild strawberry' },
//   { name: 'Vanilla', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f33c.svg', description: 'Vani' },
//   { name: 'Tuyết tùng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f332.svg', description: 'Cedar' },
//   { name: 'Táo vàng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34f.svg', description: 'Yellow apple' },
//   { name: 'Táo đỏ', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34e.svg', description: 'Red apple' },
//   { name: 'Lê', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f350.svg', description: 'Pear' },
//   { name: 'Dứa', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34d.svg', description: 'Pineapple' },
//   { name: 'Xoài', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f96d.svg', description: 'Mango' },
//   { name: 'Chuối', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f34c.svg', description: 'Banana' },
//   { name: 'Mật ong', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f36f.svg', description: 'Honey' },
//   { name: 'Caramel', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f36c.svg', description: 'Caramel' },
//   { name: 'Socola', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f36b.svg', description: 'Chocolate' },
//   { name: 'Cà phê', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/2615.svg', description: 'Coffee' },
//   { name: 'Thuốc lá', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f6ac.svg', description: 'Tobacco' },
//   { name: 'Da thuộc', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f9e5.svg', description: 'Leather' },
//   { name: 'Khoáng chất', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1faa8.svg', description: 'Minerality' }
// ];

export function TastingNoteSelection({ selectedTastingNotes, onSelectionChange }: TastingNoteSelectionProps) {

  const handleToggle = (tasting: TastingNote) => {
    const isSelected = selectedTastingNotes.some(t => t.name === tasting.name);
    if (isSelected) {
      onSelectionChange(selectedTastingNotes.filter(t => t.name !== tasting.name));
    } else {
      onSelectionChange([...selectedTastingNotes, tasting]);
    }
  };

  const displayList = staticTastingNotes;

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
                  <div key={tasting.name} className="flex items-center space-x-2">
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
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}