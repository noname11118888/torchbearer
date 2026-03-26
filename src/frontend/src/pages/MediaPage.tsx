import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Image as ImageIcon, Video } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMediaItems } from '../hooks/useQueries';
import MediaRenderer from '../components/ui/MediaRender';

export default function MediaPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page] = useState(0);
  const { data: mediaItems, isLoading } = useGetMediaItems(page);

  const handlePrevious = () => {
    if (!mediaItems) return;
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleNext = () => {
    if (!mediaItems) return;
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const formatDate = (timestamp: bigint) => {
    if (timestamp === 0n) return 'Không có ngày';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentMedia = mediaItems && mediaItems.length > 0 ? mediaItems[currentIndex] : null;

  const resolveUrl = (url: string) => url.startsWith('http') ? url : `/assets/${url}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Thư Viện Truyền Thông
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Khám phá bộ sưu tập hình ảnh và video về hành trình làm rượu vang của chúng tôi
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden">
                <Skeleton className="w-full h-[500px]" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!mediaItems || mediaItems.length === 0) && (
            <div className="max-w-5xl mx-auto">
              <Card className="p-12 text-center">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Chưa có nội dung</h3>
                <p className="text-foreground/60">
                  Thư viện hình ảnh hiện chưa có nội dung. Vui lòng quay lại sau.
                </p>
              </Card>
            </div>
          )}

          {/* Slideshow */}
          {!isLoading && mediaItems && mediaItems.length > 0 && currentMedia && (
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden shadow-2xl border-none">
                {/* Media Display */}
                <div className="relative bg-muted/30">
                  <div className="aspect-video relative overflow-hidden">
                    <MediaRenderer
                      key={currentMedia.id.toString()}
                      url={resolveUrl(currentMedia.url)}
                      type={currentMedia.mediaType}
                      className="w-full h-full"
                      objectFit="contain"
                      autoPlay={true}
                      muted={true}
                      loop={true}
                      controls={true}
                      alt={currentMedia.caption || 'Media item'}
                    />
                  </div>

                  {/* Navigation Buttons */}
                  {mediaItems.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg rounded-full"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg rounded-full"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                    {currentMedia.mediaType === 'video' ? (
                      <Video className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {currentMedia.mediaType === 'video' ? 'Video' : 'Hình ảnh'}
                    </span>
                  </div>
                </div>

                {/* Media Info */}
                <div className="p-8 space-y-4 bg-card">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                      {currentMedia.caption || 'Không có tiêu đề'}
                    </h2>
                    {currentMedia.description && (
                      <p className="text-foreground/70 text-lg leading-relaxed">
                        {currentMedia.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/50 border-t pt-4">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(currentMedia.uploadTimestamp)}</span>
                  </div>
                </div>

                {/* Slide Indicators */}
                {mediaItems.length > 1 && (
                  <div className="px-6 pb-6 bg-card">
                    <div className="flex items-center justify-center gap-2">
                      {mediaItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'w-10 bg-primary'
                              : 'w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40'
                          }`}
                          aria-label={`Chuyển đến slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Thumbnail Grid */}
              {mediaItems.length > 1 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6 border-l-4 border-primary pl-4">Khám phá thư viện</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaItems.map((item, index) => (
                      <button
                        key={item.id.toString()}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 shadow-md ${
                          index === currentIndex
                            ? 'ring-4 ring-primary ring-offset-4 scale-95 opacity-100'
                            : 'hover:scale-105 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <MediaRenderer
                          url={resolveUrl(item.url)}
                          type={item.mediaType}
                          className="w-full h-full"
                          objectFit="cover"
                          autoPlay={false}
                          controls={false}
                          lazyLoad={true}
                        />
                        {item.mediaType === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Video className="h-8 w-8 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
