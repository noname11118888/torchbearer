import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Building2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { StockistRegion, ContactLocation } from '@/declarations/backend/backend.did';

interface StockistListProps {
  regions: StockistRegion[];
}

const ContactInfo: React.FC<{ icon: React.ReactNode; text: string; href?: string }> = ({ icon, text, href }) => {
  if (!text) return null;
  
  const content = (
    <div className="flex items-start space-x-3 group">
      <div className="text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-sm text-foreground/70 group-hover:text-foreground transition-colors break-words">
        {text}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? "_blank" : undefined} rel={href.startsWith('http') ? "noopener noreferrer" : undefined}>
        {content}
      </a>
    );
  }

  return content;
};

const StockistCard: React.FC<{ contact: ContactLocation }> = ({ contact }) => {
  return (
    <Card className="overflow-hidden border-none bg-muted/30 hover:bg-muted/50 transition-colors shadow-none">
      <CardContent className="p-4 space-y-3">
        <h4 className="font-bold text-base flex items-center gap-2 text-foreground">
          <Building2 className="h-4 w-4 text-primary" />
          {contact.name}
        </h4>
        
        <div className="grid gap-2">
          <ContactInfo 
            icon={<MapPin className="h-4 w-4" />} 
            text={contact.address} 
          />
          <ContactInfo 
            icon={<Phone className="h-4 w-4" />} 
            text={contact.phone} 
            href={`tel:${contact.phone}`}
          />
          <ContactInfo 
            icon={<Mail className="h-4 w-4" />} 
            text={contact.email} 
            href={`mailto:${contact.email}`}
          />
          
          {contact.mapUrl && (
            <div className="pt-1">
              <ContactInfo 
                icon={<ExternalLink className="h-4 w-4" />} 
                text="Xem trên bản đồ" 
                href={contact.mapUrl}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const StockistList: React.FC<StockistListProps> = ({ regions }) => {
  if (!regions || regions.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {regions.map((region) => (
          <AccordionItem 
            key={Number(region.id)} 
            value={`region-${region.id}`}
            className="border rounded-xl bg-card overflow-hidden px-2 md:px-4"
          >
            <AccordionTrigger className="hover:no-underline py-6 group">
              <div className="flex flex-col items-start text-left space-y-1">
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
                  {region.name}
                  <Badge variant="outline" className="text-xs font-normal">
                    {region.contact.length} địa điểm
                  </Badge>
                </h3>
                {region.location && (
                  <p className="text-sm text-foreground/50 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {region.location}
                  </p>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {region.contact.map((contact, idx) => (
                  <StockistCard key={idx} contact={contact} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Helper Badge component since it's used above
const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}>
    {children}
  </span>
);
