import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetProductPriceVisibility } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from '@/backend';

interface ProductsProps {
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
}

const Products = ({ products = [], isLoading = false, isError = false, error }: ProductsProps) => {
  const navigate = useNavigate();
  const { data: showPrices = true } = useGetProductPriceVisibility();

  const displayWines = (products || [])
    .filter((p) => p.isDisplay !== false) // Filter only displayed products
    .filter((p) => p.isHighlighted === true) // Filter highlight products
    .map((p) => {
      const imageUrl = Array.isArray(p.imageUrl) && p.imageUrl.length > 0 
        ? p.imageUrl[0] 
        : (typeof p.imageUrl === 'string' ? p.imageUrl : '');
      
      return {
        id: p.id,
        name: p.name || 'Không tên',
        type: p.categories && p.categories.length > 0 ? p.categories[0].name : 'Rượu Vang',
        description: p.description || '',
        image: imageUrl.startsWith('http') ? imageUrl : `/assets/${imageUrl}`,
        price: p.price ?? 0n,
      };
    });

  if (isError) {
    console.error('Error loading products:', error);
  }

  const handleOrderClick = (id: bigint) => {
    navigate({ to: `/ruou-vang/${encodeURIComponent(id.toString())}` });
  };

  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Khám phá những sản phẩm rượu vang đặc biệt của chúng tôi
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayWines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              Chưa có sản phẩm nào. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <div className="fade-in-section relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {displayWines.map((wine, index) => (
                  <CarouselItem key={`${wine.id}-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border-none shadow-md"
                    >
                      <div 
                        className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/50 to-muted cursor-pointer"
                        onClick={() => handleOrderClick(wine.id)}
                      >
                        <img
                          src={wine.image}
                          alt={wine.name}
                          className="w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/wine.jpg';
                          }}
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-2xl line-clamp-1">{wine.name}</CardTitle>
                        <CardDescription className="text-base">{wine.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-foreground/70 mb-4 flex-1 line-clamp-2 text-sm leading-relaxed">
                          {wine.description}
                        </p>
                        {showPrices && wine.price > 0n && (
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-primary font-bold text-lg">
                              {Number(wine.price).toLocaleString('vi-VN')} <span className="text-xs font-normal opacity-70">VNĐ</span>
                            </p>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Nổi bật</Badge>
                          </div>
                        )}
                        <Button
                          onClick={() => handleOrderClick(wine.id)}
                          className="w-full"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-6" />
              <CarouselNext className="-right-6" />
            </Carousel>

            {/* View More Button */}
            <div className="text-center mt-12">
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/ruou-vang' })}
                className="text-primary hover:bg-primary/5 font-semibold"
              >
                Khám phá tất cả sản phẩm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
