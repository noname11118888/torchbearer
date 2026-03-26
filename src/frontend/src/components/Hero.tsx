import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHeroSection } from '../hooks/useQueries';
import MediaRenderer from './ui/MediaRender';

const Hero = () => {
  const { data: heroData, isLoading } = useGetHeroSection();

  // Media configuration: Priority backend > Default video
  const mediaUrl = heroData?.mediaUrl 
    ? (heroData.mediaUrl.startsWith('http') ? heroData.mediaUrl : `/assets/${heroData.mediaUrl}`)
    : '/assets/720.mp4';

  const title = heroData?.title || 'Mind - Purpose - Benevolence';
  const content = heroData?.content || '#xlife #torchbearer #Tmoment #người cầm đuốc';

  const scrollToSection = (id: string) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            <div className="absolute inset-0 w-full h-full">
              <MediaRenderer
                url={mediaUrl}
                className="w-full h-full"
                objectFit="cover"
                autoPlay={true}
                muted={true}
                loop={true}
                controls={false}
                playsInline={true}
              />
            </div>
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </>
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-3/4 mx-auto bg-white/10" />
              <Skeleton className="h-10 w-2/3 mx-auto bg-white/10" />
              <div className="flex gap-4 justify-center pt-6">
                <Skeleton className="h-14 w-56 bg-white/10" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-semibold max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                {content}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-full"
                  onClick={() => scrollToSection('#products')}
                >
                  Khám phá Rượu vang
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-lg px-10 py-7 text-white hover:bg-white/10 transition-all duration-300 font-medium rounded-full"
                  onClick={() => scrollToSection('#torch-bearer')}
                >
                  Về chúng tôi
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {!isLoading && (
        <button
          onClick={() => scrollToSection('#torch-bearer')}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 transition-transform hover:scale-110 active:scale-95 group"
          aria-label="Scroll down"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest group-hover:text-primary transition-colors">Cuộn xuống</span>
            <ArrowDown className="h-6 w-6 text-primary animate-bounce" />
          </div>
        </button>
      )}
    </section>
  );
};

export default Hero;
