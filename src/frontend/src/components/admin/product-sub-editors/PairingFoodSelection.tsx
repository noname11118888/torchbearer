import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
// No longer importing Plus, Edit, Trash2, etc. as they are not needed for static management
// No longer importing useState, Input, Button, Dialog components for static management
// No longer importing toast as it's not needed for static management

interface PairingFood {
  name: string;
  imageUrl: string; // Using imageUrl for icon/description as per backend type
  description: string;
}

interface PairingFoodSelectionProps {
  selectedPairings: PairingFood[];
  onSelectionChange: (pairings: PairingFood[]) => void;
}

// Static data for pairings
const staticPairings: PairingFood[] = [
  { name: 'Khai vị', imageUrl: '🥗', description: 'Món khai vị' },
  { name: 'Ăn nhẹ', imageUrl: '🍢', description: 'Snack / tapas' },
  { name: 'Phô mai xanh', imageUrl: '🧀', description: 'Blue cheese' },
  { name: 'Đồ nguội', imageUrl: '🥓', description: 'Processed food' },
  { name: 'Phô mai dê', imageUrl: '🍥', description: 'Goat cheese' },
  { name: 'Cá nạc', imageUrl: '🐟', description: 'Lean fish' },
  { name: 'Thịt bò', imageUrl: '🥩', description: 'Beef' },
  { name: 'Thịt cừu', imageUrl: '🍖', description: 'Lamb' },
  { name: 'Phô mai cứng', imageUrl: '🧀', description: 'Hard cheese' },
  { name: 'Phô mai mềm', imageUrl: '🧈', description: 'Soft cheese' },
  { name: 'Thịt nai', imageUrl: '🦌', description: 'Venison' },
  { name: 'Thịt heo', imageUrl: '🐖', description: 'Pork' },
  { name: 'Mỳ ống', imageUrl: '🍝', description: 'Pasta' },
  { name: 'Thịt gia cầm', imageUrl: '🍗', description: 'Poultry' },
  { name: 'Tôm', imageUrl: '🍤', description: 'Shrimp' },

  // NEW (mở rộng)
  { name: 'Cá béo', imageUrl: '🐠', description: 'Fatty fish (salmon, tuna)' },
  { name: 'Hải sản', imageUrl: '🦞', description: 'Seafood' },
  { name: 'Pizza', imageUrl: '🍕', description: 'Pizza' },
  { name: 'Burger', imageUrl: '🍔', description: 'Burger' },
  { name: 'Đồ nướng', imageUrl: '🔥', description: 'Grilled food' },
  { name: 'Rau xanh', imageUrl: '🥬', description: 'Green vegetables' },
  { name: 'Salad', imageUrl: '🥙', description: 'Fresh salad' },
  { name: 'Đồ cay', imageUrl: '🌶️', description: 'Spicy food' },
  { name: 'Món Á', imageUrl: '🍜', description: 'Asian cuisine' },
  { name: 'Món Ý', imageUrl: '🍝', description: 'Italian cuisine' },
  { name: 'Thịt đỏ', imageUrl: '🥩', description: 'Red Meat' }, 
  { name: 'Phô mai', imageUrl: '🧀', description: 'Cheese' }, 
  { name: 'Nấm', imageUrl: '🍄', description: 'Mushrooms' }
];

// const staticPairings: PairingFood[] = [
//   { name: 'Khai vị', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f957.svg', description: 'Món khai vị' },
//   { name: 'Ăn nhẹ', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f362.svg', description: 'Snack / tapas' },
//   { name: 'Phô mai xanh', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f9c0.svg', description: 'Blue cheese' },
//   { name: 'Đồ nguội', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f953.svg', description: 'Processed food' },
//   { name: 'Phô mai dê', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f9c0.svg', description: 'Goat cheese' },
//   { name: 'Cá nạc', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f41f.svg', description: 'Lean fish' },
//   { name: 'Thịt bò', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f969.svg', description: 'Beef' },
//   { name: 'Thịt cừu', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f356.svg', description: 'Lamb' },
//   { name: 'Phô mai cứng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f9c0.svg', description: 'Hard cheese' },
//   { name: 'Phô mai mềm', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f9c8.svg', description: 'Soft cheese' },
//   { name: 'Thịt nai', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f98c.svg', description: 'Venison' },
//   { name: 'Thịt heo', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f416.svg', description: 'Pork' },
//   { name: 'Mỳ ống', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f35d.svg', description: 'Pasta' },
//   { name: 'Thịt gia cầm', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f357.svg', description: 'Poultry' },
//   { name: 'Tôm', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f364.svg', description: 'Shrimp' },
//   { name: 'Cá béo', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f420.svg', description: 'Fatty fish' },
//   { name: 'Hải sản', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f99e.svg', description: 'Seafood' },
//   { name: 'Pizza', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f355.svg', description: 'Pizza' },
//   { name: 'Burger', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f354.svg', description: 'Burger' },
//   { name: 'Đồ nướng', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f525.svg', description: 'Grilled food' },
//   { name: 'Rau xanh', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f96c.svg', description: 'Green vegetables' },
//   { name: 'Salad', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f959.svg', description: 'Fresh salad' },
//   { name: 'Đồ cay', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f336.svg', description: 'Spicy food' },
//   { name: 'Món Á', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f35c.svg', description: 'Asian cuisine' },
//   { name: 'Món Ý', imageUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f35d.svg', description: 'Italian cuisine' }
// ];

export function PairingFoodSelection({ selectedPairings, onSelectionChange }: PairingFoodSelectionProps) {

  const handleToggle = (pairing: PairingFood) => {
    const isSelected = selectedPairings.some(p => p.name === pairing.name);
    if (isSelected) {
      onSelectionChange(selectedPairings.filter(p => p.name !== pairing.name));
    } else {
      onSelectionChange([...selectedPairings, pairing]);
    }
  };

  const displayList = staticPairings;

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
                  <div key={pairing.name} className="flex items-center space-x-2">
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
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}