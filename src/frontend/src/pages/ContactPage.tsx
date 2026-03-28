import { useEffect } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Building2, Map } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetContacts, useGetStockists } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { StockistList } from '../components/StockistList';

export default function ContactPage() {
  const { isFetching } = useActor();
  const { data: contacts, isLoading: loadingContacts } = useGetContacts();
  const { data: stockists, isLoading: loadingStockists } = useGetStockists();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isLoading = loadingContacts || loadingStockists;

  // Only show full-page loading during initial actor initialization
  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-foreground/60">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Địa Điểm Liên Hệ
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Tìm chi nhánh gần bạn nhất để trải nghiệm sản phẩm và dịch vụ của chúng tôi
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {/* Head Office / Main Contacts */}
              {contacts && contacts.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Building2 className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold">Văn phòng & Showroom</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-muted hover:border-primary/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-xl font-bold">
                              {contact.name}
                            </CardTitle>
                            {contact.isHeadOffice && (
                              <Badge variant="default" className="shrink-0">
                                Trụ sở chính
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {contact.address && (
                            <div className="flex items-start space-x-3">
                              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/70">{contact.address}</p>
                            </div>
                          )}

                          {contact.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-sm text-foreground/70 hover:text-primary transition-colors"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          )}

                          {contact.email && (
                            <div className="flex items-center space-x-3">
                              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-foreground/70 hover:text-primary transition-colors"
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}

                          {contact.mapUrl && (
                            <a
                              href={contact.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-sm text-primary font-bold hover:underline mt-4"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Xem bản đồ</span>
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Stockist Regions */}
              {stockists && stockists.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Map className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold">Hệ thống Đại lý phân phối</h2>
                  </div>
                  <StockistList regions={stockists} />
                </section>
              )}

              {!contacts?.length && !stockists?.length && (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                  <p className="text-xl text-foreground/50">Hiện tại chưa có thông tin đại lý.</p>
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
