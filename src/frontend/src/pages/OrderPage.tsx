import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useCart } from '../contexts/CartContext';
import { useGetProducts, useSubmitOrder, useGetProductPriceVisibility, useGetCategories, useGetProductsByCategory } from '../hooks/useQueries';
import * as LucideIcons from 'lucide-react';
import { ArrowLeft, Plus, Minus, ShoppingCart, Phone, MessageCircle, Mail, Wine, Grape, Thermometer, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/ruou-vang/$productId' });
  const productId = decodeURIComponent(params.productId);
  
  const { data: productsData, isLoading } = useGetProducts();
  const { data: showPrices = true } = useGetProductPriceVisibility();
  const { data: categoriesData } = useGetCategories();
  const accessoriesCategory = categoriesData?.find(cat => cat.name.toLowerCase() === 'accessories');
  const { data: accessoriesProductsData } = useGetProductsByCategory(accessoriesCategory?.id || null);
  const { addToCart } = useCart();
  const submitOrder = useSubmitOrder();
  
  const [quantity, setQuantity] = useState(1);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const product = productsData?.find(([id]) => id.toString() === productId)?.[1];
  const relatedProducts = productsData?.filter(([id, p]) => id.toString() !== productId && p.isDisplay !== false).slice(0, 4) || [];

  useEffect(() => {
    if (product && product.isDisplay === false) {
      toast.error('Sản phẩm này hiện không hiển thị');
      navigate({ to: '/ruou-vang' });
    }
    
    if (product) {
      document.title = `${product.name} | Torch Bearer Premium Wine`;
      
      // Update meta description dynamically (limited effectiveness without SSR, but good for some crawlers)
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', product.description.substring(0, 160));
      }
    }
    
    return () => {
      document.title = 'Torch Bearer | Rượu Vang Biodynamic Cao Cấp Từ Tasmania';
    };
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const handleDirectOrder = async () => {
    if (!product) return;
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await submitOrder.mutateAsync({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: [{
          product,
          quantity: BigInt(quantity)
        }],
        note: formData.message
      });

      toast.success('Đơn hàng đã được gửi thành công!');
      setShowOrderDialog(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      navigate({ to: '/' });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Có lỗi xảy ra khi gửi đơn hàng');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-foreground/60">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 min-h-screen bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <h1 className="text-3xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
              <Button onClick={() => navigate({ to: '/ruou-vang' })}>
                Quay lại trang sản phẩm
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const resolveImageUrl = (url: string) => url.startsWith('http') ? url : `/assets/${url}`;

  const productImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.imageUrl)) {
      return product.imageUrl.filter(url => url.trim() !== '').map(resolveImageUrl);
    }
    return product.imageUrl ? [resolveImageUrl(product.imageUrl)] : [];
  }, [product]);

  const totalPrice = Number(product.price) * quantity;

  // Mock data for demonstration - in production, this would come from backend
  const getProductInfoValue = (infoArray: ProductInfo[] | undefined, name: string): string => {
    return infoArray?.find(item => item.name === name)?.value || 'N/A';
  };

  const getFlavorProfileValue = (profileArray: FlavorProfile[] | undefined, name: string): number => {
    return Number(profileArray?.find(item => item.name === name)?.value || 0);
  };

  const flavorProfile = {
    sweetness: getFlavorProfileValue(product.profile, 'sweetness'),
    tannins: getFlavorProfileValue(product.profile, 'tannins'),
    body: getFlavorProfileValue(product.profile, 'body'),
    acidity: getFlavorProfileValue(product.profile, 'acidity'),
    alcohol: getFlavorProfileValue(product.profile, 'alcohol')
  };

  const productInfo = {
    vintage: getProductInfoValue(product.info, 'vintage'),
    grapeVariety: getProductInfoValue(product.info, 'grapeVariety'),
    region: getProductInfoValue(product.info, 'region'),
    capacity: getProductInfoValue(product.info, 'capacity'),
    alcoholContent: getProductInfoValue(product.info, 'alcoholContent'),
    servingTemp: getProductInfoValue(product.info, 'servingTemp')
  };

  const pairings = product.paring || [];
  const mainFlavors = product.tasting || [];

  // Helper to render icon or image
  const renderIconOrImage = (iconSource: string, altText: string, className: string = '') => {
    const isImageUrl = iconSource.startsWith('http') || iconSource.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
    if (isImageUrl) {
      return <img src={resolveImageUrl(iconSource)} alt={altText} className={className} />;
    } else {
      // Assume it's a Lucide icon name if not an image URL
      const IconComponent = LucideIcons[iconSource as keyof typeof LucideIcons];
      if (IconComponent) {
        return <IconComponent className={className} aria-label={altText} />;
      } else {
        // Fallback for actual text or unrecognised icon names
        return <span className={className}>{iconSource}</span>;
      }
    }
  };

  const accessories = accessoriesProductsData?.map(([_, p]) => p) || [];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/ruou-vang' })}
              className="mb-4 text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại sản phẩm
            </Button>
          </div>

          {/* Main Product Section - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Left Column - Media Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-xl group">
                {productImages.length > 1 ? (
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {productImages.map((img, idx) => (
                        <CarouselItem key={idx}>
                          <div className="aspect-[3/4] relative">
                            <img
                              src={img}
                              alt={`${product.name} - ${idx + 1}`}
                              className="w-full h-full object-contain p-8"
                              onError={(e) => { e.currentTarget.src = '/assets/image.png'; }}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Carousel>
                ) : (
                  <img
                    src={productImages[0] || '/assets/image.png'}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => { e.currentTarget.src = '/assets/image.png'; }}
                  />
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="w-20 h-20 bg-muted/30 rounded-lg flex-shrink-0 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/30 transition-colors"
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx}`} 
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Product Description Moved Here */}
              <div className="bg-muted/30 p-6 rounded-lg border border-border/50">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Mô tả sản phẩm / Description</h3>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Product Summary */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-foreground">{product.name}</h1>
                <p className="text-lg text-foreground/60 mb-4">{product.classificationTag?.name || "Premium Tasmanian Wine"}</p>
                
                {/* Classification Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories && product.categories.length > 0 && (
                    product.categories.map((catId) => (
                      <Badge key={catId.id} variant="outline" className="px-3 py-1 text-sm">
                        {catId.name}
                      </Badge>
                    ))
                  )}
                  {product.classificationTag && product.classificationTag.name && (
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-accent/20 text-accent-foreground">
                       {product.classificationTag.value}
                    </Badge>
                  )}
                </div>

                {showPrices && (
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-4xl font-bold text-primary">
                      {Number(product.price).toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xl text-foreground/60">VNĐ</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Flavor Profile Visualization */}
              {product.profile && product.profile.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Wine className="h-5 w-5 text-primary" />
                    Hương vị / Flavor Profile
                  </h3>
                  <div className="space-y-4">
                    {flavorProfile.sweetness > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground/70">Độ ngọt / Sweetness</span>
                          <span className="text-sm font-medium">{flavorProfile.sweetness}%</span>
                        </div>
                        <Progress value={flavorProfile.sweetness} className="h-2" />
                      </div>
                    )}
                    {flavorProfile.tannins > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground/70">Tannin</span>
                          <span className="text-sm font-medium">{flavorProfile.tannins}%</span>
                        </div>
                        <Progress value={flavorProfile.tannins} className="h-2" />
                      </div>
                    )}
                    {flavorProfile.body > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground/70">Độ đậm / Body</span>
                          <span className="text-sm font-medium">{flavorProfile.body}%</span>
                        </div>
                        <Progress value={flavorProfile.body} className="h-2" />
                      </div>
                    )}
                    {flavorProfile.acidity > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground/70">Độ chua / Acidity</span>
                          <span className="text-sm font-medium">{flavorProfile.acidity}%</span>
                        </div>
                        <Progress value={flavorProfile.acidity} className="h-2" />
                      </div>
                    )}
                    {flavorProfile.alcohol > 0 && (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-foreground/70">Nồng độ cồn / Alcohol</span>
                          <span className="text-sm font-medium">{flavorProfile.alcohol}%</span>
                        </div>
                        <Progress value={(flavorProfile.alcohol / 15) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                  <Separator className="mt-6" />
                </div>
              )}

              {/* Product Information Table */}
              {product.info && product.info.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Thông tin sản phẩm / Product Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {productInfo.vintage !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Vintage</p>
                          <p className="font-medium">{productInfo.vintage}</p>
                        </div>
                      </div>
                    )}
                    {productInfo.grapeVariety !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <Grape className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Grape Variety</p>
                          <p className="font-medium">{productInfo.grapeVariety}</p>
                        </div>
                      </div>
                    )}
                    {productInfo.region !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Region</p>
                          <p className="font-medium">{productInfo.region}</p>
                        </div>
                      </div>
                    )}
                    {productInfo.capacity !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <Wine className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Capacity</p>
                          <p className="font-medium">{productInfo.capacity}</p>
                        </div>
                      </div>
                    )}
                    {productInfo.alcoholContent !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <Wine className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Alcohol Content</p>
                          <p className="font-medium">{productInfo.alcoholContent}</p>
                        </div>
                      </div>
                    )}
                    {productInfo.servingTemp !== 'N/A' && (
                      <div className="flex items-start gap-2">
                        <Thermometer className="h-4 w-4 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-foreground/60">Serving Temp</p>
                          <p className="font-medium">{productInfo.servingTemp}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator className="mt-6" />
                </div>
              )}

              {/* Wine Pairing Section */}
              {pairings.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Kết hợp món ăn / Food Pairing</h3>
                  {pairings.length > 4 ? (
                    <Carousel
                      opts={{
                        align: "start",
                        loop: false, // Consider if loop is desired for pairings
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {pairings.map((pairing, idx) => (
                          <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer h-full">
                              <CardContent className="p-4 flex flex-col justify-between h-full">
                                {renderIconOrImage(pairing.imageUrl, pairing.name, "w-12 h-12 object-contain mx-auto mb-2")}
                                <div>
                                  <p className="text-sm font-medium">{pairing.name}</p>
                                  <p className="text-xs text-foreground/60">{pairing.description}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {pairings.map((pairing, idx) => (
                        <Card key={idx} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            {renderIconOrImage(pairing.imageUrl, pairing.name, "w-12 h-12 object-contain mx-auto mb-2")}
                            <p className="text-sm font-medium">{pairing.name}</p>
                            <p className="text-xs text-foreground/60">{pairing.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-6" />
                </div>
              )}

              {/* Main Flavors Section */}
              {mainFlavors.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Hương vị chính / Main Flavors</h3>
                  {mainFlavors.length > 4 ? (
                    <Carousel
                      opts={{
                        align: "start",
                        loop: false, // Consider if loop is desired for flavors
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-4">
                        {mainFlavors.map((flavor, idx) => (
                          <CarouselItem key={idx} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border hover:border-primary transition-colors h-full">
                              {renderIconOrImage(flavor.imageUrl, flavor.name, "h-6 w-6 object-contain flex-shrink-0")}
                              <div className="text-left flex-grow">
                                <p className="text-sm font-medium line-clamp-1">{flavor.name}</p>
                                <p className="text-xs text-foreground/60 line-clamp-1">{flavor.description}</p>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {mainFlavors.map((flavor, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border hover:border-primary transition-colors">
                          {renderIconOrImage(flavor.imageUrl, flavor.name, "h-6 w-6 object-contain")}
                          <div className="text-left">
                            <p className="text-sm font-medium">{flavor.name}</p>
                            <p className="text-xs text-foreground/60">{flavor.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Separator className="mt-6" />
                </div>
              )}

              <Separator />

              {/* Quantity Selector & Actions */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-base mb-3 block">Số lượng / Quantity</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setQuantity(val);
                          }
                        }}
                        className="w-20 text-center text-lg font-semibold"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {showPrices && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg text-foreground/70">Tổng cộng / Total:</span>
                        <span className="text-3xl font-bold text-primary">
                          {totalPrice.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Call-to-Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Thêm vào giỏ hàng / Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      size="lg"
                      onClick={() => setShowOrderDialog(true)}
                    >
                      Đặt hàng ngay / Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support Box */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">Hỗ trợ khách hàng / Customer Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Hotline</p>
                      <p className="text-sm text-foreground/60">+84 904 117 789</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Live Chat</p>
                      <p className="text-sm text-foreground/60">Trò chuyện trực tuyến</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Mail className="mr-2 h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-foreground/60">contact@torchbearerwine.com</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Accessories Section */}
          {accessories.length > 0 && (
            <div className="mb-16">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="accessories" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
                    Phụ kiện đi kèm / Wine Accessories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                      {accessories.map((accessory, idx) => {
                        const accessoryImageUrl = accessory.imageUrl.startsWith('http')
                          ? accessory.imageUrl
                          : `/assets/${accessory.imageUrl}`;
                        
                        return (
                          <Card key={idx} className="hover:shadow-lg transition-shadow">
                            <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                              <img
                                src={accessoryImageUrl}
                                alt={accessory.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/assets/image.png';
                                }}
                              />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">{accessory.name}</h4>
                              {showPrices && (
                                <p className="text-lg font-bold text-primary mb-3">
                                  {Number(accessory.price).toLocaleString('vi-VN')} VNĐ
                                </p>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  addToCart(accessory, 1);
                                  toast.success(`Đã thêm ${accessory.name} vào giỏ hàng`);
                                }}
                              >
                                Thêm vào giỏ
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Sản phẩm liên quan / Related Products</h2>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {relatedProducts.map(([id, relatedProduct]) => {
                    const firstImg = Array.isArray(relatedProduct.imageUrl) && relatedProduct.imageUrl.length > 0 
                      ? relatedProduct.imageUrl[0] 
                      : (typeof relatedProduct.imageUrl === 'string' ? relatedProduct.imageUrl : '');
                      
                    const relatedImageUrl = firstImg.startsWith('http')
                      ? firstImg
                      : `/assets/${firstImg}`;
                    
                    return (
                      <CarouselItem key={id.toString()} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <Card 
                          className="cursor-pointer hover:shadow-xl transition-shadow"
                          onClick={() => navigate({ to: `/ruou-vang/${encodeURIComponent(id.toString())}` })}
                        >
                          <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted">
                            <img
                              src={relatedImageUrl}
                              alt={relatedProduct.name}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/image.png';
                              }}
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                            {relatedProduct.categories && relatedProduct.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {relatedProduct.categories.slice(0, 2).map((catId) => (
                                  <Badge key={catId.id.toString()} variant="outline" className="text-xs">
                                    {catId.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {showPrices && (
                              <p className="text-xl font-bold text-primary mb-3">
                                {Number(relatedProduct.price).toLocaleString('vi-VN')} VNĐ
                              </p>
                            )}
                            <Button variant="outline" size="sm" className="w-full">
                              Xem chi tiết
                            </Button>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin đặt hàng / Order Information</DialogTitle>
            <DialogDescription>
              Vui lòng điền thông tin để hoàn tất đơn hàng
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên / Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại / Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+84 123 456 789"
              />
            </div>
            <div>
              <Label htmlFor="message">Ghi chú / Notes</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Địa chỉ giao hàng, ghi chú thêm về đơn hàng... (tối đa 2000 ký tự)"
                rows={4}
                maxLength={2000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Hủy / Cancel
            </Button>
            <Button onClick={handleDirectOrder} disabled={submitOrder.isPending}>
              {submitOrder.isPending ? 'Đang gửi...' : 'Xác nhận đặt hàng / Confirm Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
