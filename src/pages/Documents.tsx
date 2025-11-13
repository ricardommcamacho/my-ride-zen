import { useState, useRef } from 'react';
import { FileText, Search, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/hooks/useVehicles';
import { useDocuments } from '@/hooks/useDocuments';
import BottomNav from '@/components/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/localization';
import { formatDateFromISO } from '@/lib/utils';

const Documents = () => {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement document upload logic
      toast({
        title: t('documents.uploadInDevelopment'),
        description: t('documents.filesSelected', { count: files.length }),
      });
    }
  };
  
  const { documents, loading: documentsLoading } = useDocuments(
    selectedVehicleId === 'all' ? undefined : selectedVehicleId
  );

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (vehiclesLoading || documentsLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-1">{t('documents.title')}</h1>
          <p className="text-muted-foreground">{t('documents.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('documents.allVehicles')}</SelectItem>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.brand} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              size="icon" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('documents.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">{t('documents.all')}</TabsTrigger>
              <TabsTrigger value="insurance" className="flex-1">{t('documents.insurance')}</TabsTrigger>
              <TabsTrigger value="registration" className="flex-1">{t('documents.registration')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('documents.noDocuments')}</h3>
              <p className="text-muted-foreground text-center mb-4">
                {t('documents.uploadFirst')}
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                {t('documents.uploadButton')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-semibold text-sm mb-1 truncate">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {doc.vehicles?.brand} {doc.vehicles?.model}
                  </p>
                  {doc.expiry_date && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('documents.expires')}: {formatDateFromISO(doc.expiry_date)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Documents;
