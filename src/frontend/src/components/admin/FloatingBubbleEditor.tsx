import { useState, useEffect } from 'react';
import { useGetFloatingBubbleConfig, useUpdateFloatingBubbleConfig } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import type { FloatingBubbleConfig } from '../../backend';

export default function FloatingBubbleEditor() {
  const { data: config, isLoading } = useGetFloatingBubbleConfig();
  const updateConfig = useUpdateFloatingBubbleConfig();

  const [formData, setFormData] = useState<FloatingBubbleConfig>({
    backgroundColor: '#FFA500',
    icon: 'phone',
    hotlineNumberOverride: '',
    isEnabled: true,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        backgroundColor: config.backgroundColor,
        icon: config.icon,
        hotlineNumberOverride: config.hotlineNumberOverride || '',
        isEnabled: config.isEnabled,
      });
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync(formData);
      toast.success('Đã lưu cấu hình bubble thành công!');
    } catch (error) {
      console.error('Error saving bubble config:', error);
      toast.error('Lỗi khi lưu cấu hình bubble');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Floating Bubble</CardTitle>
          <CardDescription>
            Tùy chỉnh nút liên hệ nhanh hiển thị ở góc dưới bên trái trang chủ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">Kích hoạt Bubble</Label>
              <p className="text-sm text-muted-foreground">
                Hiển thị nút liên hệ nhanh trên trang chủ
              </p>
            </div>
            <Switch
              id="enabled"
              checked={formData.isEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isEnabled: checked })
              }
            />
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Màu nền</Label>
            <div className="flex items-center space-x-3">
              <Input
                id="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={(e) =>
                  setFormData({ ...formData, backgroundColor: e.target.value })
                }
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.backgroundColor}
                onChange={(e) =>
                  setFormData({ ...formData, backgroundColor: e.target.value })
                }
                placeholder="#FFA500"
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Chọn màu nền cho nút bubble
            </p>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label htmlFor="icon">Biểu tượng</Label>
            <Select
              value={formData.icon}
              onValueChange={(value) =>
                setFormData({ ...formData, icon: value })
              }
            >
              <SelectTrigger id="icon">
                <SelectValue placeholder="Chọn biểu tượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">📞 Điện thoại</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="x">X (Twitter)</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Chọn biểu tượng hiển thị trên nút bubble
            </p>
          </div>

          {/* Hotline Override */}
          <div className="space-y-2">
            <Label htmlFor="hotline">Số hotline tùy chỉnh (tùy chọn)</Label>
            <Input
              id="hotline"
              type="text"
              value={formData.hotlineNumberOverride || ''}
              onChange={(e) =>
                setFormData({ ...formData, hotlineNumberOverride: e.target.value })
              }
              placeholder="Để trống để dùng số từ Head Office"
            />
            <p className="text-sm text-muted-foreground">
              Nếu để trống, sẽ sử dụng số điện thoại từ thông tin Head Office
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Xem trước</Label>
            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center justify-center">
                <button
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: formData.backgroundColor }}
                >
                  <span className="text-2xl">
                    {formData.icon === 'phone' && '📞'}
                    {formData.icon === 'facebook' && 'f'}
                    {formData.icon === 'instagram' && '📷'}
                    {formData.icon === 'x' && '𝕏'}
                    {formData.icon === 'youtube' && '▶'}
                    {formData.icon === 'linkedin' && 'in'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={updateConfig.isPending}
              className="min-w-[120px]"
            >
              {updateConfig.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
