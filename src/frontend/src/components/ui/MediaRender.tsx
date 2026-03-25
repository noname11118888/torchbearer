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
  controls?: boolean;
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
    } else if (url.includes("youtube.com")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v");
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("/embed/")[1]?.split("?")[0] || null;
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
  controls = true,
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
  
  const isLoading = typeLoading || (!error && !mediaLoaded && type !== "unknown");

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
      className={`animate-pulse bg-gray-200 w-full h-64 rounded-2xl ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderError = () => (
    <div 
      role="alert"
      className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-500"
    >
      <div className="text-center">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Unable to load media</p>
        <button
          onClick={() => {
            setError(false);
            setMediaLoaded(false);
          }}
          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!url) return null;

  const mediaClassName = `w-full rounded-2xl ${isLoading ? "hidden" : "block"} ${className}`;

  return (
    <div className="relative w-full" role="figure" aria-label="Media renderer">
      {isLoading && renderSkeleton()}
      
      {!error && type === "image" && (
        <img
          src={url}
          alt={alt}
          loading={lazyLoad ? "lazy" : "eager"}
          onLoad={handleLoad}
          onError={handleError}
          className={mediaClassName}
        />
      )}
      
      {!error && type === "video" && (
        <video
          src={url}
          controls={controls}
          autoPlay={autoPlay}
          preload="metadata"
          onLoadedData={handleLoad}
          onError={handleError}
          className={mediaClassName}
        />
      )}
      
      {!error && type === "youtube" && (
        (() => {
          const embedUrl = getYoutubeEmbed(url);
          if (!embedUrl) return renderError();
          return (
            <iframe
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleLoad}
              className={mediaClassName}
            />
          );
        })()
      )}
      
      {(type === "unknown" || error) && renderError()}
    </div>
  );
};

export default MediaRenderer;