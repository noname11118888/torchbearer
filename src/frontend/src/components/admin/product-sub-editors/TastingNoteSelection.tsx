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
  { name: 'Cherry', imageUrl: '🍒', description: 'Anh đào' },
  { name: 'Oak', imageUrl: '🌳', description: 'Gỗ sồi' },
  { name: 'Pepper', imageUrl: '🌶️', description: 'Tiêu' },
  { name: 'Vanilla', imageUrl: '🌼', description: 'Vani' }
];

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