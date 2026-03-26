import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHeroSection, useUpdateHeroSection } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { ImageIcon, Film } from 'lucide-react';
import type { ContentSection } from '@/backend';
import MediaRenderer from '../ui/MediaRender';

export default function HeroEditor() {
  const { data: heroSection, isLoading } = useGetHeroSection();
  const updateHeroMutation = useUpdateHeroSection();

  const [formData, setFormData] = useState<ContentSection>({
    title: '',
    content: '',
    mediaUrl: '',
  });

  // Update form when data is loaded
  useEffect(() => {
    if (heroSection) {
      setFormData(heroSection);
    }
  }, [heroSection]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Lỗi', { description: 'Vui lòng nhập tiêu đề chính.' });
      return;
    }

    try {
      await updateHeroMutation.mutateAsync(formData);
      toast.success('Đã lưu thành công!', {
        description: 'Nội dung Hero section đã được cập nhật.',
      });
    } catch (error) {
      toast.error('Lỗi khi lưu', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const mediaUrl = formData.mediaUrl 
    ? (formData.mediaUrl.startsWith('http') ? formData.mediaUrl : `/assets/${formData.mediaUrl}`)
    : '';

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Card */}
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh sửa Hero Section</CardTitle>
            <CardDescription>
              Cập nhật nội dung và hình ảnh/video chính cho phần hero (Torch Bearer Tasmania)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Tiêu đề chính *</Label>
              <Input
                id="hero-title"
                placeholder="Ví dụ: Vì cuộc sống là những trải nghiệm phi thường"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-content">Taglines / Nội dung phụ</Label>
              <Textarea
                id="hero-content"
                placeholder="Ví dụ: #xlife #torchbearer #Tmoment"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-media">URL Hình ảnh hoặc Video *</Label>
              <div className="flex gap-2">
                <Input
                  id="hero-media"
                  placeholder="Ví dụ: hero-vineyard.jpg hoặc link youtube/video"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ các định dạng ảnh, video MP4 hoặc link YouTube.
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={updateHeroMutation.isPending}
              className="w-full"
              size="lg"
            >
              {updateHeroMutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang lưu...
                </>
              ) : 'Lưu thay đổi'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Xem trước</CardTitle>
            <CardDescription>
              Cách nội dung hiển thị trên trang chủ
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden shadow-inner border bg-muted/30">
              {formData.mediaUrl ? (
                <div className="w-full h-full">
                  <MediaRenderer 
                    url={mediaUrl}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for text preview */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                      {formData.title || 'Tiêu đề chưa nhập'}
                    </h3>
                    <p className="text-sm text-primary-foreground font-medium drop-shadow-sm">
                      {formData.content || 'Taglines chưa nhập'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-sm">Vui lòng nhập URL hình ảnh hoặc video để xem trước</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helpful Tips Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mẹo nhỏ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div className="flex gap-3">
              <div className="mt-1 p-2 bg-primary/10 rounded-lg h-fit">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Đối với hình ảnh</p>
                <p className="text-muted-foreground">Sử dụng ảnh có độ phân giải cao (từ 1920x1080) để hiển thị tốt trên mọi màn hình.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 p-2 bg-primary/10 rounded-lg h-fit">
                <Film className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Đối với video</p>
                <p className="text-muted-foreground">Dán link YouTube hoặc URL video trực tiếp. Video sẽ tự động phát lặp lại không tiếng.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
