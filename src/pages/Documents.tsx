import { useState } from 'react';
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

const Documents = () => {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
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
          <h1 className="text-3xl font-bold text-foreground mb-1">Documentos</h1>
          <p className="text-muted-foreground">Gerir os documentos dos seus veículos</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-3">
            <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Veículos</SelectItem>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.brand} {v.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline">
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Procurar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
              <TabsTrigger value="insurance" className="flex-1">Seguro</TabsTrigger>
              <TabsTrigger value="registration" className="flex-1">Registo</TabsTrigger>
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
              <h3 className="text-lg font-semibold mb-2">Ainda não há documentos</h3>
              <p className="text-muted-foreground text-center mb-4">
                Carregue o seu primeiro documento para começar
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Carregar Documento
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
                      Expira: {new Date(doc.expiry_date).toLocaleDateString()}
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
