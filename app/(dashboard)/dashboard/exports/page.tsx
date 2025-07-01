'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, FileSpreadsheet, FileX } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { startExportMerchants, checkExportStatus, downloadExport } from "@/fetcher/api-fetcher";
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ExportStatus {
  status: 'idle' | 'processing' | 'complete' | 'error';
  taskId: string | null;
  progress: string;
  processed: number;
  total: number;
  fileUrl: string;
  filename: string;
}

export default function ExportPage() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    status: 'idle',
    taskId: null,
    progress: '0',
    processed: 0,
    total: 0,
    fileUrl: '',
    filename: ''
  });
  const pollingIntervalRef = useRef<number | null>(null);
  const [successToastShown, setSuccessToastShown] = useState<boolean>(false);
  const [errorToastShown, setErrorToastShown] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  // Tabs removed as requested
  const [filters, setFilters] = useState({
    created_at_start: '',
    created_at_end: '',
    expired_at_start: '',
    expired_at_end: '',
    is_active: '',
    type_adherent: '',
    card_number: '',
    nationality_id: '',
    address: ''
  });

  // Fonction pour convertir le base64 en blob
  const b64toBlob = (b64Data: string, contentType: string = '', sliceSize: number = 512): Blob => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, {type: contentType});
  };
  
  // Fonction pour télécharger le fichier depuis l'API
  const downloadExportFile = async (taskId: string) => {
    try {
      console.log('Démarrage du téléchargement pour le taskId:', taskId);
      
      // Afficher un toast pour informer l'utilisateur que le téléchargement commence
      toast({
        title: "Téléchargement en cours",
        description: "Préparation du fichier Excel, veuillez patienter...",
        variant: "default"
      });
      
      // Utiliser la fonction downloadExport définie dans api-fetcher.ts
      const data = await downloadExport(taskId);
      console.log('Données reçues:', Object.keys(data));
      
      // Vérifier si la réponse contient une erreur
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.file_content) {
        throw new Error('Le contenu du fichier est manquant dans la réponse');
      }
      
      // Convertir le contenu base64 en blob
      const blob = b64toBlob(data.file_content, data.content_type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément a invisible et déclencher le téléchargement
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.filename || 'enrollements_export.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Téléchargement réussi",
        description: "Le fichier a été téléchargé avec succès.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      toast({
        title: "Erreur de téléchargement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive"
      });
    }
  };
  
  // Fonction pour démarrer l'export
  const startExport = async (modelType: 'entreprises' | 'merchant-enrollements') => {
    try {
      // Vérification si le modelType est 'entreprises' - ce type d'export n'est plus disponible
      if (modelType === 'entreprises') {
        toast({
          title: "Service non disponible",
          description: "L'export des entreprises n'est plus disponible.",
          variant: "destructive",
        });
        return;
      }

      // Réinitialiser les flags de toast à chaque nouvel export
      setSuccessToastShown(false);
      setErrorToastShown(false);
      
      // Réinitialiser le statut global
      setStatus('');
      
      // Arrêter tout polling existant avant de démarrer un nouvel export
      stopPolling();
      
      // Navigation to progress tab removed
      
      setExportStatus({
        ...exportStatus,
        status: 'processing',
        progress: '0',
        processed: 0,
        total: 0,
        fileUrl: '',
        filename: ''
      });
      
      // Filtrer les valeurs vides avant d'envoyer à l'API
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      // Appel API pour démarrer l'export
      const response = await startExportMerchants(filteredParams);
      
      if (response.task_id) {
        setExportStatus(prev => ({
          ...prev,
          taskId: response.task_id
        }));
        // Démarrer le polling
        startPolling(response.task_id);
      }
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'export:', error);
      
      // S'assurer d'arrêter tout polling en cours
      stopPolling();
      
      // Ne pas afficher de toast d'erreur si déjà affiché
      if (!errorToastShown) {
        setErrorToastShown(true);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer l'export",
          variant: "destructive",
        });
      }
      
      setExportStatus(prev => ({
        ...prev,
        status: 'error'
      }));
    }
  };
  
  // Fonction pour commencer le polling
  const startPolling = (taskId: string) => {
    // Arrêter tout polling existant
    stopPolling();
    
    // Démarrer un nouveau polling toutes les 2 secondes
    const interval = window.setInterval(() => {
      checkTaskStatus(taskId);
    }, 2000) as unknown as number; // Cast pour compatibilité de type
    
    console.log('Démarrage du polling avec ID:', interval);
    pollingIntervalRef.current = interval;
  };
  
  // Fonction pour arrêter explicitement le polling
  const stopPolling = () => {
    console.log('Arrêt du polling, ID:', pollingIntervalRef.current);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
  
  // Vérifier le statut de l'export
  const checkTaskStatus = async (taskId: string) => {
    try {
      const data = await checkExportStatus(taskId);
      console.log('Statut reçu:', data.status, 'Progress:', data.progress);
      
      // Afficher les données pour débuggage
      console.log('Données complètes de l\'API:', JSON.stringify(data, null, 2));
      
      // Type assertion pour pouvoir accéder aux propriétés supplémentaires renvoyées par l'API
      type ApiResponse = typeof data & {
        error?: string;
        download_url?: string | null;
        file_path?: string | null;
        status: string; // On utilise string pour permettre toutes les variantes de casse (COMPLETED, complete, etc.)
      };
      const apiData = data as ApiResponse;

      // Détection avancée des erreurs - Vérifie à la fois le champ status et error
      const hasError = 
        apiData.status?.toLowerCase() === 'error' || 
        (apiData.error && apiData.error !== '') || 
        (apiData.download_url === null && apiData.file_path === null && Number(apiData.progress) >= 100);
      
      if (hasError) {
        console.log('Erreur détectée dans la réponse API:', apiData.error || 'Erreur inconnue');
        // Arrêter immédiatement le polling
        stopPolling();
        
        setExportStatus(prev => ({
          ...prev,
          status: 'error',
          progress: '100',  // Pour indiquer que le processus est terminé (avec erreur)
          fileUrl: '',
          filename: ''
        }));
        
        setStatus('error');
        
        if (!errorToastShown) {
          setErrorToastShown(true);
          toast({ 
            title: "Erreur", 
            description: apiData.error || "Une erreur est survenue lors de l'export.", 
            variant: "destructive" 
          });
        }
        return;
      }
      
      // Si pas d'erreur, traiter normalement les données
      const dataProgressStr = typeof data.progress === 'string' ? data.progress : '0';
      const dataProcessedStr = typeof data.processed === 'string' ? data.processed : '0';
      const dataTotalStr = typeof data.total === 'string' ? data.total : '0';
      
      const progressValue = parseInt(dataProgressStr) || 0;
      const progressString = progressValue.toString(); // Convertit le nombre en chaîne
      const processedValue = parseInt(dataProcessedStr) || 0;
      const totalValue = parseInt(dataTotalStr) || 0;
      
      console.log(`Progress value: ${progressString} type: ${typeof progressString}`);
      
      // Détecter la URL de téléchargement du fichier - vérifier à la fois file_url et download_url
      const downloadUrl = data.file_url || apiData.download_url || '';
      console.log('URL de téléchargement détectée:', downloadUrl);
      
      // Détecter le nom du fichier à partir de l'URL ou utiliser un nom par défaut
      const filename = data.filename || (
        downloadUrl ? downloadUrl.split('/').pop() || 'export_marchands.xlsx' : 'export_marchands.xlsx'
      );
      
      setExportStatus(prev => ({
        ...prev,
        progress: progressString,
        processed: processedValue,
        total: totalValue,
        status: data.status,
        fileUrl: downloadUrl,
        filename: filename
      }));
      
      console.log(`Mise à jour de la progression: ${progressString}%, Traitement: ${processedValue}/${totalValue}`);
      
      // Vérifier si l'export est terminé (complet) - insensible à la casse
      if (apiData.status?.toLowerCase() === 'complete' || apiData.status?.toUpperCase() === 'COMPLETED') {
        console.log('Export terminé avec statut:', apiData.status, '- Arrêt du polling');
        
        // IMPORTANT: Arrêter immédiatement le polling AVANT de montrer les toasts
        stopPolling();
        
        // Mettre à jour le statut global
        setStatus(apiData.status);
        
        // Afficher les toasts appropriés une seule fois
        if ((apiData.status?.toLowerCase() === 'complete' || apiData.status?.toUpperCase() === 'COMPLETED') && !successToastShown) {
          setSuccessToastShown(true);
          toast({
            title: "Succès",
            description: "Export terminé avec succès. Vous pouvez télécharger le fichier.",
            variant: "default",
          });
        } else if (apiData.status?.toLowerCase() === 'error' && !errorToastShown) {
          setErrorToastShown(true);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'export.",
            variant: "destructive",
          });
        }
      } else {
        // Mettre à jour uniquement si le statut n'est pas terminal
        // Convertir progress en chaîne pour la cohérence des types
        // Utiliser une approche sûre pour la conversion des données
        const dataProgressStr = typeof data.progress === 'string' ? data.progress : '0';
        const dataProcessedStr = typeof data.processed === 'string' ? data.processed : '0';
        const dataTotalStr = typeof data.total === 'string' ? data.total : '0';
        
        // Convertir les valeurs selon leur type dans l'interface
        const progressString = dataProgressStr;
        const processedValue = parseInt(dataProcessedStr) || 0;
        const totalValue = parseInt(dataTotalStr) || 0;
        
        setExportStatus(prev => ({
          ...prev,
          progress: progressString,
          processed: processedValue,
          total: totalValue,
          status: data.status,
          fileUrl: data.file_url || '',
          filename: data.filename || ''
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      
      // Arrêter le polling avant de modifier l'état
      stopPolling();
      
      setExportStatus(prev => ({
        ...prev,
        status: 'error'
      }));
      setStatus('error');
      
      // Afficher un message d'erreur à l'utilisateur seulement s'il n'a pas déjà été affiché
      if (!errorToastShown) {
        setErrorToastShown(true);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier le statut de l'export",
          variant: "destructive",
        });
      }
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    // Convertir "all" en chaîne vide pour le traitement interne
    const processedValue = value === 'all' ? '' : value;
    setFilters(prev => ({ ...prev, [name]: processedValue }));
  };
  
  // Nettoyer le polling à la destruction du composant
  useEffect(() => {
    return () => {
      console.log('Nettoyage du composant - Arrêt du polling, ID:', pollingIntervalRef.current);
      if (pollingIntervalRef.current !== null) {
        window.clearInterval(pollingIntervalRef.current);
        // Pas besoin de pollingIntervalRef.current = null; ici car le composant est détruit
      }
    };
  }, []);

  return (
    <div className="container py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-3xl font-bold mb-8 bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}
      >
        Exporter les données
      </motion.h1>

      <div className="grid gap-6">
        <Card className="border-cyan-200 dark:border-cyan-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-cyan-700 dark:text-cyan-300">Filtres d'exportation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Date range for creation date */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="created_at_start">Date d'inscription - début</Label>
                <Input 
                  id="created_at_start"
                  type="date"
                  value={filters.created_at_start}
                  onChange={(e) => handleFilterChange('created_at_start', e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="created_at_end">Date d'inscription - fin</Label>
                <Input 
                  id="created_at_end"
                  type="date"
                  value={filters.created_at_end}
                  onChange={(e) => handleFilterChange('created_at_end', e.target.value)}
                />
              </div>

              {/* Date range for expiry date */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="expired_at_start">Date d'expiration - début</Label>
                <Input 
                  id="expired_at_start"
                  type="date"
                  value={filters.expired_at_start}
                  onChange={(e) => handleFilterChange('expired_at_start', e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="expired_at_end">Date d'expiration - fin</Label>
                <Input 
                  id="expired_at_end"
                  type="date"
                  value={filters.expired_at_end}
                  onChange={(e) => handleFilterChange('expired_at_end', e.target.value)}
                />
              </div>
              
              {/* Active status */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="is_active">Statut d'activation</Label>
                <Select 
                  value={filters.is_active} 
                  onValueChange={(value) => handleFilterChange('is_active', value)}
                >
                  <SelectTrigger id="is_active">
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">Actif</SelectItem>
                    <SelectItem value="false">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Type adherent */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="type_adherent">Type d'adhérent</Label>
                <Select 
                  value={filters.type_adherent} 
                  onValueChange={(value) => handleFilterChange('type_adherent', value)}
                >
                  <SelectTrigger id="type_adherent">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="PARTICULIER">Particulier</SelectItem>
                    <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Card number */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="card_number">Numéro de carte</Label>
                <Input 
                  id="card_number"
                  type="text"
                  placeholder="Rechercher par numéro"
                  value={filters.card_number}
                  onChange={(e) => handleFilterChange('card_number', e.target.value)}
                />
              </div>

              {/* Adresse - Utilisation du nom approprié pour éviter l'erreur */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address"
                  type="text"
                  placeholder="Recherche par adresse"
                  value={filters.address || ''}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                />
              </div>

              {/* Nationality ID - If you have a dropdown of nationalities */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="nationality_id">Nationalité</Label>
                <Input 
                  id="nationality_id"
                  type="text"
                  placeholder="ID de la nationalité"
                  value={filters.nationality_id}
                  onChange={(e) => handleFilterChange('nationality_id', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-500 dark:text-gray-400">Export des entreprises</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette fonctionnalité n'est plus disponible.
              </p>
              <Button 
                disabled={true}
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <FileX className="h-4 w-4" />
                Non disponible
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-cyan-600 dark:border-cyan-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle>
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>Export des Marchands</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Exportez les données des marchands inscrits en fonction des filtres sélectionnés.
              </p>
              <Button 
                variant="default" 
                className="gap-2 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                onClick={() => startExport('merchant-enrollements')}
                disabled={exportStatus.status === 'processing'}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exporter les Marchands
              </Button>
              
              {/* Barre de progression qui apparaît uniquement pendant l'export */}
              {exportStatus.status === 'processing' && (
                <div className="flex flex-col space-y-4 mt-4 border border-cyan-200 dark:border-cyan-800 p-4 rounded-md">
                  <h3 className="text-lg font-medium">Export en cours...</h3>
                  <div className="relative w-full">
                    <Progress 
                      value={Number(exportStatus.progress)} 
                      className="h-4 bg-cyan-100 dark:bg-cyan-900" 
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-cyan-800 dark:text-cyan-200">
                      {exportStatus.progress}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {exportStatus.processed} sur {exportStatus.total} enregistrements
                  </p>
                </div>
              )}
              
              {/* Message et bouton de téléchargement qui apparaissent quand l'export est terminé - insensible à la casse */}
              {(exportStatus.status?.toLowerCase() === 'complete' || exportStatus.status?.toUpperCase() === 'COMPLETED') && exportStatus.fileUrl && (
                <div className="flex flex-col space-y-4 mt-4 border border-green-200 dark:border-green-800 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <Download className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="text-lg font-medium">Export terminé !</h3>
                  </div>
                  <Button 
                    variant="default" 
                    className="gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                    onClick={() => exportStatus.taskId && downloadExportFile(exportStatus.taskId)}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Télécharger le fichier Excel
                  </Button>
                </div>
              )}
              
              {/* Message d'erreur qui apparaît si l'export échoue */}
              {exportStatus.status === 'error' && (
                <div className="flex flex-col space-y-2 mt-4 border border-red-200 dark:border-red-800 p-4 rounded-md">
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <FileX className="h-4 w-4" />
                    <h3 className="font-medium">Une erreur est survenue</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Impossible de générer le fichier d'export. Veuillez réessayer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
