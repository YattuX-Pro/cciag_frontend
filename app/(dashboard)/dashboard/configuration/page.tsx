'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import AddPrefectureDialog from './(dialog)/AddPrefectureDialog';
import AddSubPrefectureDialog from './(dialog)/AddSubPrefectureDialog';
import AddAddressDialog from './(dialog)/AddAddressDialog';
import AddActivityDialog from './(dialog)/AddActivityDialog';
import AddSubActivityDialog from './(dialog)/AddSubActivityDialog';
import AddRegionDialog from './(dialog)/AddRegionDialog';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

// Import column definitions
import { prefectureColumns } from './columns/prefecture-columns';
import { sousPrefectureColumns } from './columns/sous-prefecture-columns';
import { adresseColumns } from './columns/adresse-columns';
import { activiteColumns } from './columns/activite-columns';
import { sousActiviteColumns } from './columns/sous-activite-columns';
import { regionColumns as baseRegionColumns } from './columns/region-columns';
import { workPositionColumns } from './columns/work-position-columns';
import { nationalityColumns } from './columns/nationality-columns';
import { banqueColumns } from './columns/banque-columns';

// Import types from the central types file
import { Prefecture, SubPrefecture, Address, Activity, SubActivity, Region, WorkPosition, Nationality, Banque } from '@/types';

// Import API functions
import { 
  getPrefectures, 
  getSubPrefectures, 
  getAddresses, 
  getActivities, 
  getSubActivities, 
  getRegions,
  getWorkPositions,
  getNationalities,
  getBanques
} from '@/fetcher/api-fetcher';
import AddWorkPositionDialog from './(dialog)/AddWorkPositionDialog';
import AddNationalityDialog from './(dialog)/AddNationalityDialog';
import AddBanqueDialog from './(dialog)/AddBanqueDialog';

export default function ConfigurationPage() {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('banque');

  // Column definitions with actions
  const prefectureColumnsWithActions = [
    ...prefectureColumns.filter(col => col.accessorKey !== 'id'),
    {
      header: "Actions",
      cell: (prefecture) => (
        <div className="flex justify-end space-x-2">
          <AddPrefectureDialog
            prefecture={prefecture}
            isEdit={true}
            onSuccess={loadPrefectures}
            trigger={
              <button
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  "dark:bg-cyan-500/10 bg-cyan-500/20",
                  "dark:text-cyan-400 text-cyan-600",
                  "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                )}
              >
                Modifier
              </button>
            }
          />
        </div>
      ),
      accessorKey: "id",
    },
  ];

  // Data states
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [sousPrefectures, setSousPrefectures] = useState<SubPrefecture[]>([]);
  const [adresses, setAdresses] = useState<Address[]>([]);
  const [activites, setActivites] = useState<Activity[]>([]);
  const [sousActivites, setSousActivites] = useState<SubActivity[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [workPositions, setWorkPositions] = useState<WorkPosition[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [banques, setBanques] = useState<Banque[]>([]);

  // Loading states
  const [loadingPrefectures, setLoadingPrefectures] = useState(false);
  const [loadingSousPrefectures, setLoadingSousPrefectures] = useState(false);
  const [loadingAdresses, setLoadingAdresses] = useState(false);
  const [loadingActivites, setLoadingActivites] = useState(false);
  const [loadingSousActivites, setLoadingSousActivites] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingWorkPositions, setLoadingWorkPositions] = useState(false);
  const [loadingNationalities, setLoadingNationalities] = useState(false);
  const [loadingBanques, setLoadingBanques] = useState(false);

  // Pagination states
  const [prefecturesCount, setPrefecturesCount] = useState(0);
  const [prefecturesNext, setPrefecturesNext] = useState<string | null>(null);
  const [prefecturesPrevious, setPrefecturesPrevious] = useState<string | null>(null);

  const [sousPrefecturesCount, setSousPrefecturesCount] = useState(0);
  const [sousPrefecturesNext, setSousPrefecturesNext] = useState<string | null>(null);
  const [sousPrefecturesPrevious, setSousPrefecturesPrevious] = useState<string | null>(null);

  const [adressesCount, setAdressesCount] = useState(0);
  const [adressesNext, setAdressesNext] = useState<string | null>(null);
  const [adressesPrevious, setAdressesPrevious] = useState<string | null>(null);

  const [activitesCount, setActivitesCount] = useState(0);
  const [activitesNext, setActivitesNext] = useState<string | null>(null);
  const [activitesPrevious, setActivitesPrevious] = useState<string | null>(null);

  const [sousActivitesCount, setSousActivitesCount] = useState(0);
  const [sousActivitesNext, setSousActivitesNext] = useState<string | null>(null);
  const [sousActivitesPrevious, setSousActivitesPrevious] = useState<string | null>(null);

  const [regionsCount, setRegionsCount] = useState(0);
  const [regionsNext, setRegionsNext] = useState<string | null>(null);
  const [regionsPrevious, setRegionsPrevious] = useState<string | null>(null);

  const [workPositionsCount, setWorkPositionsCount] = useState(0);
  const [workPositionsNext, setWorkPositionsNext] = useState<string | null>(null);
  const [workPositionsPrevious, setWorkPositionsPrevious] = useState<string | null>(null);

  const [nationalitiesCount, setNationalitiesCount] = useState(0);
  const [nationalitiesNext, setNationalitiesNext] = useState<string | null>(null);
  const [nationalitiesPrevious, setNationalitiesPrevious] = useState<string | null>(null);

  const [banquesCount, setBanquesCount] = useState(0);
  const [banquesNext, setBanquesNext] = useState<string | null>(null);
  const [banquesPrevious, setBanquesPrevious] = useState<string | null>(null);

  // Load prefectures
const loadPrefectures = async (url?: string) => {
  setLoadingPrefectures(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getPrefectures(params);
    setPrefectures(response.results);
    setPrefecturesNext(response.next);
    setPrefecturesPrevious(response.previous);
    setPrefecturesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les préfectures",
      variant: "destructive",
    });
  } finally {
    setLoadingPrefectures(false);
  }
};

// Load sous-prefectures
const loadSousPrefectures = async (url?: string) => {
  setLoadingSousPrefectures(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getSubPrefectures(params);
    setSousPrefectures(response.results);
    setSousPrefecturesNext(response.next);
    setSousPrefecturesPrevious(response.previous);
    setSousPrefecturesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les sous-préfectures",
      variant: "destructive",
    });
  } finally {
    setLoadingSousPrefectures(false);
  }
};

// Load adresses
const loadAdresses = async (url?: string) => {
  setLoadingAdresses(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getAddresses(params);
    setAdresses(response.results);
    setAdressesNext(response.next);
    setAdressesPrevious(response.previous);
    setAdressesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les adresses",
      variant: "destructive",
    });
  } finally {
    setLoadingAdresses(false);
  }
};

// Load activites
const loadActivites = async (url?: string) => {
  setLoadingActivites(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getActivities(params);
    setActivites(response.results);
    setActivitesNext(response.next);
    setActivitesPrevious(response.previous);
    setActivitesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les activités",
      variant: "destructive",
    });
  } finally {
    setLoadingActivites(false);
  }
};

// Load sous-activites
const loadSousActivites = async (url?: string) => {
  setLoadingSousActivites(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getSubActivities(params);
    setSousActivites(response.results);
    setSousActivitesNext(response.next);
    setSousActivitesPrevious(response.previous);
    setSousActivitesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les sous-activités",
      variant: "destructive",
    });
  } finally {
    setLoadingSousActivites(false);
  }
};

// Load regions
const loadRegions = async (url?: string) => {
  setLoadingRegions(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getRegions(params);
    setRegions(response.results);
    setRegionsNext(response.next);
    setRegionsPrevious(response.previous);
    setRegionsCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les régions",
      variant: "destructive",
    });
  } finally {
    setLoadingRegions(false);
  }
};

// Load work positions
const loadWorkPositions = async (url?: string) => {
  setLoadingWorkPositions(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getWorkPositions(params);
    setWorkPositions(response.results);
    setWorkPositionsNext(response.next);
    setWorkPositionsPrevious(response.previous);
    setWorkPositionsCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les postes de travail",
      variant: "destructive",
    });
  } finally {
    setLoadingWorkPositions(false);
  }
};

// Load nationalities
const loadNationalities = async (url?: string) => {
  setLoadingNationalities(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getNationalities(params);
    setNationalities(response.results);
    setNationalitiesNext(response.next);
    setNationalitiesPrevious(response.previous);
    setNationalitiesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les nationalités",
      variant: "destructive",
    });
  } finally {
    setLoadingNationalities(false);
  }
};

// Load banques
const loadBanques = async (url?: string) => {
  setLoadingBanques(true);
  try {
    const params = url
      ? { url }
      : { search: searchTerm ? searchTerm : "" };
    
    const response = await getBanques(params);
    setBanques(response.results);
    setBanquesNext(response.next);
    setBanquesPrevious(response.previous);
    setBanquesCount(response.count);
  } catch (err) {
    console.error(err);
    toast({
      title: "Erreur",
      description: "Impossible de charger les banques",
      variant: "destructive",
    });
  } finally {
    setLoadingBanques(false);
  }
};

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'prefecture':
        loadPrefectures();
        break;
      case 'sous-prefecture':
        loadSousPrefectures();
        break;
      case 'adresse':
        loadAdresses();
        break;
      case 'activite':
        loadActivites();
        break;
      case 'sous-activite':
        loadSousActivites();
        break;
      case 'region':
        loadRegions();
        break;
      case 'work-position':
        loadWorkPositions();
        break;
      case 'nationality':
        loadNationalities();
        break;
      case 'banque':
        loadBanques();
        break;
    }
  }, [activeTab, searchTerm]);

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="space-y-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn(
          "absolute top-0 -right-4 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob",
          "dark:bg-cyan-800/30 bg-cyan-600/30"
        )} />
        <div className={cn(
          "absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000",
          "dark:bg-cyan-700/30 bg-cyan-500/30"
        )} />
      </div>

      {/* Page Title */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
            "dark:from-cyan-400 dark:to-cyan-200",
            "from-cyan-600 to-cyan-400"
          )}
        >
          Configuration
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={cn(
          "backdrop-blur-sm",
          "dark:bg-gray-900/50 bg-white/50",
          "dark:border-cyan-900/20 border-cyan-200/20"
        )}>
          <CardContent className="pt-6">
            <Tabs 
              defaultValue="banque" 
              className="space-y-4"
              onValueChange={(value) => {
                setActiveTab(value);
                setSearchTerm('');
              }}
            >
              <div className="w-full overflow-auto">
                <TabsList className="bg-muted/20 dark:bg-muted/50 w-full justify-start md:justify-center">
                  <motion.div 
                    className="flex min-w-max"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TabsTrigger value="region" className="flex-1">Région</TabsTrigger>
                    <TabsTrigger value="prefecture" className="flex-1">Préfecture</TabsTrigger>
                    <TabsTrigger value="sous-prefecture" className="flex-1">Sous-préfecture</TabsTrigger>
                    <TabsTrigger value="adresse" className="flex-1">Adresse</TabsTrigger>
                    <TabsTrigger value="activite" className="flex-1">Activité</TabsTrigger>
                    <TabsTrigger value="sous-activite" className="flex-1">Sous-activité</TabsTrigger>
                    <TabsTrigger value="work-position" className="flex-1">Poste de travail</TabsTrigger>
                    <TabsTrigger value="nationality" className="flex-1">Nationalité</TabsTrigger>
                    <TabsTrigger value="banque" className="flex-1">Banque</TabsTrigger>
                  </motion.div>
                </TabsList>
              </div>

              {/* Prefecture Tab */}
              <TabsContent value="prefecture">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des préfectures</CardTitle>
                      <AddPrefectureDialog 
                        onSuccess={loadPrefectures}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une préfecture
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des préfectures..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={prefectures} 
                        columns={prefectureColumns} 
                        loading={loadingPrefectures}
                        pagination={{
                          count: sousPrefecturesCount,
                          next: sousPrefecturesNext,
                          previous: sousPrefecturesPrevious,
                          onPageChange: loadSousPrefectures,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Sous-Prefecture Tab */}
              <TabsContent value="sous-prefecture">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des sous-préfectures</CardTitle>
                      <AddSubPrefectureDialog 
                        onSuccess={loadSousPrefectures}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une sous-préfecture
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des sous-préfectures..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable
                        data={sousPrefectures}
                        columns={sousPrefectureColumns.map(column => {
                          if (column.header === 'Actions') {
                            return {
                              ...column,
                              cell: (subPrefecture) => (
                                <div className="flex justify-end space-x-2">
                                  <AddSubPrefectureDialog
                                    subPrefecture={subPrefecture}
                                    isEdit={true}
                                    onSuccess={loadSousPrefectures}
                                    trigger={
                                      <button
                                        className={cn(
                                          "px-2 py-1 rounded text-xs",
                                          "dark:bg-cyan-500/10 bg-cyan-500/20",
                                          "dark:text-cyan-400 text-cyan-600",
                                          "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                        )}
                                      >
                                        Modifier
                                      </button>
                                    }
                                  />
                                </div>
                              )
                            };
                          }
                          return column;
                        })}
                        loading={loadingSousPrefectures}
                      />
                     
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Adresse Tab */}
              <TabsContent value="adresse">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des adresses</CardTitle>
                      <AddAddressDialog 
                        onSuccess={loadAdresses}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une adresse
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des adresses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={adresses} 
                        columns={adresseColumns.map(column => {
                            if (column.header === 'Actions') {
                              return {
                                ...column,
                                cell: (adresse) => (
                                  <div className="flex justify-end space-x-2">
                                    <AddAddressDialog
                                      address={adresse}
                                      isEdit={true}
                                      onSuccess={loadAdresses}
                                      trigger={
                                        <button
                                          className={cn(
                                            "px-2 py-1 rounded text-xs",
                                            "dark:bg-cyan-500/10 bg-cyan-500/20",
                                            "dark:text-cyan-400 text-cyan-600",
                                            "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                          )}
                                        >
                                          Modifier
                                        </button>
                                      }
                                    />
                                  </div>
                                ),
                              };
                            }
                            return column;
                          })} 
                        loading={loadingAdresses}
                        pagination={{
                          count: adressesCount,
                          next: adressesNext,
                          previous: adressesPrevious,
                          onPageChange: loadAdresses,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Activite Tab */}
              <TabsContent value="activite">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des activités</CardTitle>
                      <AddActivityDialog 
                        onSuccess={loadActivites}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une activité
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des activités..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={activites} 
                        columns={activiteColumns.map(column => {
                            if (column.header === 'Actions') {
                              return {
                                ...column,
                                cell: (activity) => (
                                  <div className="flex justify-end space-x-2">
                                    <AddActivityDialog
                                      activity={activity}
                                      isEdit={true}
                                      onSuccess={loadActivites}
                                      trigger={
                                        <button
                                          className={cn(
                                            "px-2 py-1 rounded text-xs",
                                            "dark:bg-cyan-500/10 bg-cyan-500/20",
                                            "dark:text-cyan-400 text-cyan-600",
                                            "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                          )}
                                        >
                                          Modifier
                                        </button>
                                      }
                                    />
                                  </div>
                                )
                              };
                            }
                            return column;
                          })} 
                        loading={loadingActivites}
                        pagination={{
                          count: activitesCount,
                          next: activitesNext,
                          previous: activitesPrevious,
                          onPageChange: loadActivites,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Sous-Activite Tab */}
              <TabsContent value="sous-activite">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des sous-activités</CardTitle>
                      <AddSubActivityDialog 
                        onSuccess={loadSousActivites}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une sous-activité
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des sous-activités..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={sousActivites} 
                        columns={sousActiviteColumns.map(column => {
                          if (column.header === 'Actions') {
                            return {
                              ...column,
                              cell: (sousActivite) => (
                                <div className="flex justify-end space-x-2">
                                  <AddSubActivityDialog
                                    subActivity={sousActivite}
                                    isEdit={true}
                                    onSuccess={loadSousActivites}
                                    trigger={
                                      <button
                                        className={cn(
                                          "px-2 py-1 rounded text-xs",
                                          "dark:bg-cyan-500/10 bg-cyan-500/20",
                                          "dark:text-cyan-400 text-cyan-600",
                                          "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                        )}
                                      >
                                        Modifier
                                      </button>
                                    }
                                  />
                                </div>
                              )
                            };
                          }
                          return column;
                        })} 
                        loading={loadingSousActivites}
                        pagination={{
                          count: sousActivitesCount,
                          next: sousActivitesNext,
                          previous: sousActivitesPrevious,
                          onPageChange: loadSousActivites,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Region Tab */}
              <TabsContent value="region">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des régions</CardTitle>
                      <AddRegionDialog 
                        onSuccess={loadRegions}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une région
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des régions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={regions} 
                        columns={baseRegionColumns.map(column => {
                          if (column.header === 'Actions') {
                            return {
                              ...column,
                              cell: (region) => (
                                <div className="flex justify-end space-x-2">
                                  <AddRegionDialog
                                    region={region}
                                    isEdit={true}
                                    onSuccess={loadRegions}
                                    trigger={
                                      <button
                                        className={cn(
                                          "px-2 py-1 rounded text-xs",
                                          "dark:bg-cyan-500/10 bg-cyan-500/20",
                                          "dark:text-cyan-400 text-cyan-600",
                                          "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                        )}
                                      >
                                        Modifier
                                      </button>
                                    }
                                  />
                                </div>
                              )
                            };
                          }
                          return column;
                        })} 
                        loading={loadingRegions}
                        pagination={{
                          count: regionsCount,
                          next: regionsNext,
                          previous: regionsPrevious,
                          onPageChange: loadRegions,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Work Position Tab */}
              <TabsContent value="work-position">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des postes de travail</CardTitle>
                      <AddWorkPositionDialog 
                        onSuccess={loadWorkPositions}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter un poste de travail
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des postes de travail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={workPositions} 
                        columns={workPositionColumns.map(column => {
                            if (column.header === 'Actions') {
                              return {
                                ...column,
                                cell: (workPosition) => (
                                  <div className="flex justify-end space-x-2">
                                    <AddWorkPositionDialog
                                      workPosition={workPosition}
                                      isEdit={true}
                                      onSuccess={loadWorkPositions}
                                      trigger={
                                        <button
                                          className={cn(
                                            "px-2 py-1 rounded text-xs",
                                            "dark:bg-cyan-500/10 bg-cyan-500/20",
                                            "dark:text-cyan-400 text-cyan-600",
                                            "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                          )}
                                        >
                                          Modifier
                                        </button>
                                      }
                                    />
                                  </div>
                                )
                              };
                            }
                            return column;
                          })}  
                        loading={loadingWorkPositions}
                        pagination={{
                          count: workPositionsCount,
                          next: workPositionsNext,
                          previous: workPositionsPrevious,
                          onPageChange: loadWorkPositions,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Nationality Tab */}
              <TabsContent value="nationality">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des nationalités</CardTitle>
                      <AddNationalityDialog 
                        onSuccess={loadNationalities}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une nationalité
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des nationalités..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={nationalities} 
                        columns={nationalityColumns.map(column => {
                            if (column.header === 'Actions') {
                              return {
                                ...column,
                                cell: (nationality) => (
                                  <div className="flex justify-end space-x-2">
                                    <AddNationalityDialog
                                      nationality={nationality}
                                      isEdit={true}
                                      onSuccess={loadNationalities}
                                      trigger={
                                        <button
                                          className={cn(
                                            "px-2 py-1 rounded text-xs",
                                            "dark:bg-cyan-500/10 bg-cyan-500/20",
                                            "dark:text-cyan-400 text-cyan-600",
                                            "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                          )}
                                        >
                                          Modifier
                                        </button>
                                      }
                                    />
                                  </div>
                                )
                              };
                            }
                            return column;
                          })}  
                        loading={loadingNationalities}
                        pagination={{
                          count: nationalitiesCount,
                          next: nationalitiesNext,
                          previous: nationalitiesPrevious,
                          onPageChange: loadNationalities,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Banque Tab */}
              <TabsContent value="banque">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Card className="dark:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Liste des banques</CardTitle>
                      <AddBanqueDialog 
                        onSuccess={loadBanques}
                        trigger={
                          <Button className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Ajouter une banque
                          </Button>
                        }
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                          <Search
                            className={cn(
                              "absolute left-3 top-3 h-4 w-4",
                              "dark:text-cyan-400 text-cyan-600"
                            )}
                          />
                          <Input
                            placeholder="Rechercher des banques..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={cn(
                              "pl-9 transition-colors duration-200",
                              "dark:bg-gray-800/50 bg-gray-50",
                              "dark:border-cyan-900/20 border-cyan-200/20",
                              "dark:focus:border-cyan-500 focus:border-cyan-600",
                              "dark:focus:ring-cyan-500 focus:ring-cyan-600",
                              "dark:placeholder-gray-400 placeholder:text-gray-500",
                              "dark:text-gray-100 text-gray-900"
                            )}
                          />
                        </div>
                      </div>
                      <DataTable 
                        data={banques} 
                        columns={banqueColumns.filter(col => col.accessorKey !== 'id').concat([
                          {
                            header: "Actions",
                            cell: (banque) => (
                              <div className="flex justify-end space-x-2">
                                <AddBanqueDialog
                                  banque={banque}
                                  isEdit={true}
                                  onSuccess={loadBanques}
                                  trigger={
                                    <button
                                      className={cn(
                                        "px-2 py-1 rounded text-xs",
                                        "dark:bg-cyan-500/10 bg-cyan-500/20",
                                        "dark:text-cyan-400 text-cyan-600",
                                        "hover:bg-cyan-500/30 dark:hover:bg-cyan-500/20"
                                      )}
                                    >
                                      Modifier
                                    </button>
                                  }
                                />
                              </div>
                            ),
                            accessorKey: "id",
                          },
                        ])}
                        loading={loadingBanques}
                        pagination={{
                          count: banquesCount,
                          next: banquesNext,
                          previous: banquesPrevious,
                          onPageChange: loadBanques,
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
