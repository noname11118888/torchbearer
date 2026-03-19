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
  { name: 'Thịt đỏ', imageUrl: '🥩', description: 'Red Meat' },
  { name: 'Phô mai', imageUrl: '🧀', description: 'Cheese' },
  { name: 'Hải sản', imageUrl: '🦞', description: 'Seafood' },
  { name: 'Nấm', imageUrl: '🍄', description: 'Mushrooms' }
];

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