import { useParams, useNavigate } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useGetArticleById } from '../hooks/useQueries';
import { ChevronLeft, Calendar, Clock, Share2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ArticleDetailPage() {
  const { id } = useParams({ from: '/cam-nang-ruou-vang/$id' });
  const navigate = useNavigate();
  const articleId = id ? parseInt(id, 10) : null;
  const [scrollProgress, setScrollProgress] = useState(0);

  const { data: article, isLoading, isError, error } = useGetArticleById(articleId);

  // Theo dõi tiến trình cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoBack = () => {
    navigate({ to: '/cam-nang-ruou-vang' });
  };

  const renderContent = (article: any) => {
    if (!article.content || article.content.length === 0) {
      return <p className="text-foreground/60 italic">Không có nội dung chi tiết cho bài viết này.</p>;
    }

    return article.content.map((item: any, index: number) => {
      const elements: React.ReactNode[] = [];

      // Render Title/Heading
      if (item.title) {
        elements.push(
          <h2 key={`${index}-title`} className="text-3xl font-bold text-foreground mt-12 mb-6 leading-tight first:mt-0">
            {item.title}
          </h2>
        );
      }

      // Render Media (Image/Video)
      if (item.mediaUrl) {
        const isVideo = item.mediaType && (item.mediaType.toLowerCase().includes('video') || item.mediaUrl.endsWith('.mp4'));

        if (isVideo) {
          elements.push(
            <div key={`${index}-video`} className="my-10 group">
              <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl">
                <video
                  src={item.mediaUrl}
                  controls
                  className="w-full max-h-[600px]"
                  loading="lazy"
                />
              </div>
              {item.description && (
                <p className="text-sm text-foreground/50 mt-4 text-center italic">
                  {item.description}
                </p>
              )}
            </div>
          );
        } else {
          elements.push(
            <figure key={`${index}-image`} className="my-10 group">
              <div className="relative rounded-2xl overflow-hidden shadow-lg transition-shadow hover:shadow-2xl">
                <img
                  src={item.mediaUrl}
                  alt={item.title || 'Article content'}
                  className="w-full object-cover max-h-[600px] transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              {item.description && (
                <figcaption className="text-sm text-foreground/50 mt-4 text-center italic">
                  — {item.description}
                </figcaption>
              )}
            </figure>
          );
        }
      } 
      
      // Render Description/Paragraph
      if (item.description && !item.mediaUrl) {
        elements.push(
          <p key={`${index}-text`} className="text-lg text-foreground/80 leading-[1.8] mb-6 whitespace-pre-wrap font-serif">
            {item.description}
          </p>
        );
      }

      return elements.length > 0 ? elements : null;
    }).flat();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="flex-grow bg-background relative">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          
          {/* Top Navigation */}
          <div className="max-w-3xl mx-auto mb-12">
            <button
              onClick={handleGoBack}
              className="group inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Cẩm nang rượu vang
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-24 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-xl font-medium text-foreground/40 animate-pulse">Đang chuẩn bị nội dung...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
                <Share2 className="w-8 h-8 rotate-45" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Rất tiếc, có lỗi xảy ra</h2>
              <p className="text-foreground/60 mb-8">{error?.message || 'Không tìm thấy bài viết bạn yêu cầu'}</p>
              <button 
                onClick={handleGoBack}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Quay lại danh sách
              </button>
            </div>
          )}

          {/* Article Content */}
          {!isLoading && !isError && article && (
            <article className="max-w-3xl mx-auto">
              {/* Article Header */}
              <header className="mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-8 leading-[1.1] tracking-tight">
                  {article.title}
                </h1>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/50 py-6 border-y border-border/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(Number(article.publishTime) / 1000000).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5 phút đọc</span>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <button className="p-2 hover:bg-accent rounded-full transition-colors" title="Chia sẻ">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </header>

              {/* Article Body */}
              <div className="article-body prose prose-invert max-w-none">
                {renderContent(article)}
              </div>

              {/* Footer Actions */}
              <footer className="mt-20 pt-12 border-t border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-accent/30 rounded-3xl p-8">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Bạn thấy bài viết này hữu ích?</h3>
                    <p className="text-foreground/60">Đừng quên chia sẻ kiến thức này với bạn bè!</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleGoBack}
                      className="px-6 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Danh sách bài viết
                    </button>
                  </div>
                </div>
              </footer>
            </article>
          )}

          {/* Not Found State */}
          {!isLoading && !isError && !article && (
            <div className="text-center py-24">
              <h2 className="text-3xl font-bold text-foreground/20">404</h2>
              <p className="text-xl text-foreground/40 mt-4 font-serif">Bài viết này dường như đã biến mất vào hư không...</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
