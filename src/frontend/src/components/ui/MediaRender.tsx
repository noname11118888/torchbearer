// MediaRenderer.tsx - Phiên bản tương thích với config hiện tại
import React, { useEffect, useState, useRef } from "react";

// Sử dụng interface thay vì type alias để tránh issues với strict mode
interface MediaRendererProps {
  url: string;
  type?: string;
  className?: string;
  enableHeadDetect?: boolean;
  cacheResults?: boolean;
  lazyLoad?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  objectFit?: "cover" | "contain";
  alt?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Cache cho kết quả detect
const typeCache = new Map();

// Detect bằng URL
const detectTypeFromUrl = (url: string): string => {
  if (!url) return "unknown";
  const lower = url.toLowerCase();

  const imagePattern = /\.(jpeg|jpg|png|gif|webp|avif|bmp|svg)(\?.*)?$/i;
  const videoPattern = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;
  const youtubePattern = /(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i;

  if (imagePattern.test(lower)) return "image";
  if (videoPattern.test(lower)) return "video";
  if (youtubePattern.test(lower)) return "youtube";

  return "unknown";
};

// Detect bằng HEAD request
const detectTypeFromHead = async (
  url: string,
  signal?: AbortSignal,
  timeout = 5000
): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const res = await fetch(url, { 
      method: "HEAD",
      signal: signal || controller.signal,
      mode: "no-cors" as RequestMode
    });
    
    clearTimeout(timeoutId);
    
    const contentType = res.headers.get("content-type");
    if (!contentType) return "unknown";

    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";

    return "unknown";
  } catch (e) {
    return "unknown";
  }
};

// YouTube helper
const getYoutubeEmbed = (url: string): string | null => {
  try {
    let videoId: string | null = null;
    
    if (url.includes("youtu.be")) {
      videoId = url.split("/").pop()?.split("?")[0] || null;
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("/embed/")[1]?.split("?")[0] || null;
    } else if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v");
    }
    
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      autoplay: "0",
      modestbranding: "1",
      rel: "0",
      enablejsapi: "1"
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
};

// Custom hook cho media detection
const useMediaType = (
  url: string,
  typeFromBackend?: string,
  enableHeadDetect: boolean = true,
  cacheResults: boolean = true
) => {
  const [type, setType] = useState<string>(typeFromBackend || "unknown");
  const [loading, setLoading] = useState<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const resolveType = async () => {
      if (typeFromBackend) {
        setType(typeFromBackend);
        setLoading(false);
        return;
      }

      if (cacheResults && typeCache.has(url)) {
        setType(typeCache.get(url));
        setLoading(false);
        return;
      }

      const quickType = detectTypeFromUrl(url);
      if (quickType !== "unknown") {
        setType(quickType);
        if (cacheResults) typeCache.set(url, quickType);
        setLoading(false);
        return;
      }

      if (enableHeadDetect) {
        abortControllerRef.current = new AbortController();
        const headType = await detectTypeFromHead(url, abortControllerRef.current.signal);
        if (isMounted) {
          setType(headType);
          if (cacheResults && headType !== "unknown") typeCache.set(url, headType);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    resolveType();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, typeFromBackend, enableHeadDetect, cacheResults]);

  return { type, loading };
};

// Main Component
const MediaRenderer: React.FC<MediaRendererProps> = ({
  url,
  type: typeFromBackend,
  className = "",
  enableHeadDetect = true,
  cacheResults = true,
  lazyLoad = true,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  playsInline = true,
  objectFit = "cover",
  alt = "Media content",
  onLoad,
  onError,
}) => {
  const [error, setError] = useState<boolean>(false);
  const [mediaLoaded, setMediaLoaded] = useState<boolean>(false);
  
  const { type, loading: typeLoading } = useMediaType(
    url,
    typeFromBackend,
    enableHeadDetect,
    cacheResults
  );
  
  const isLoading = typeLoading || (!error && !mediaLoaded && type !== "unknown" && type !== "youtube");

  useEffect(() => {
    if (type === "image" && !mediaLoaded) {
      const img = new Image();
      img.src = url;
      if (img.complete) {
        handleLoad();
      }
    }
  }, [url, type, mediaLoaded]);

  const handleLoad = () => {
    setMediaLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setMediaLoaded(true);
    if (onError) onError(new Error(`Failed to load media: ${url}`));
  };

  const renderSkeleton = () => (
    <div 
      role="status"
      aria-label="Loading media"
      className={`animate-pulse bg-muted w-full h-full flex items-center justify-center ${className}`}
    >
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const renderError = () => (
    <div 
      role="alert"
      className={`w-full h-full flex items-center justify-center bg-muted text-muted-foreground ${className}`}
    >
      <div className="text-center p-4">
        <p className="text-xs">Không thể tải nội dung</p>
      </div>
    </div>
  );

  if (!url) return null;

  const mediaClassName = `${objectFit === "cover" ? "object-cover" : "object-contain"} ${isLoading ? "hidden" : "block"} ${className}`;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden" role="figure" aria-label="Media renderer">
      {isLoading && renderSkeleton()}
      
      {!error && type === "image" && (
        <img
          src={url}
          alt={alt}
          loading={lazyLoad ? "lazy" : "eager"}
          onLoad={handleLoad}
          onLoadedData={handleLoad}
          onError={handleError}
          className={`w-full h-full ${mediaClassName}`}
        />
      )}
      
      {!error && type === "video" && (
        <video
          src={url}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload="auto"
          onLoadedData={handleLoad}
          onCanPlay={handleLoad}
          onCanPlayThrough={handleLoad}
          onError={handleError}
          className={`w-full h-full ${mediaClassName}`}
        />
      )}
      
      {!error && type === "youtube" && (
        (() => {
          const embedUrl = getYoutubeEmbed(url);
          if (!embedUrl) return renderError();
          
          const youtubeParams = new URLSearchParams({
            autoplay: autoPlay ? "1" : "0",
            mute: muted ? "1" : "0",
            loop: loop ? "1" : "0",
            controls: controls ? "1" : "0",
            modestbranding: "1",
            rel: "0",
          });

          return (
            <iframe
              src={`${embedUrl.split('?')[0]}?${youtubeParams.toString()}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={handleLoad}
              className={mediaClassName}
              frameBorder="0"
            />
          );
        })()
      )}
      
      {(type === "unknown" || error) && renderError()}
    </div>
  );
};

export default MediaRenderer;