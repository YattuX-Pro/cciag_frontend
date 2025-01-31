'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Store, Mail, Phone, MapPin, CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { Merchant } from '@/types';
import { cn } from '@/lib/utils';

// Mock data for submitted merchants
const mockSubmittedMerchants : Merchant[] = [
  {
    id: '1',
    businessName: 'Boutique Tech',
    ownerName: 'Mohamed Code',
    email: 'conde@techsolutions.com',
    phone: '+1234567890',
    address: '456 Tech Avenue, Silicon Valley, CA',
    status: 'pending',
    createdAt: '2024-03-25',
    photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    signature: 'https://example.com/signature1.png',
  },
  {
    id: '2',
    businessName: 'Design',
    ownerName: 'Cellou Bah',
    email: 'cellou@test.com',
    phone: '+1987654321',
    address: '789 Kipé',
    status: 'pending',
    createdAt: '2024-03-24',
    photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    signature: 'https://example.com/signature2.png',
  },
  // Add more mock data as needed
];

export default function MerchantReviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredMerchants = mockSubmittedMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (merchantId: string) => {
    // Implement approval logic
    console.log('Approved merchant:', merchantId);
  };

  const handleDeny = (merchantId: string) => {
    // Implement denial logic
    console.log('Denied merchant:', merchantId);
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
        <h1 className={cn(
          "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
          "dark:from-cyan-400 dark:to-cyan-200",
          "from-cyan-600 to-cyan-400"
        )}>
          Dossier des Commerçants
        </h1>
      </div>

      <Card className={cn(
        "dark:bg-gray-900/50 bg-white/50",
        "backdrop-blur-sm",
        "dark:border-cyan-900/20 border-cyan-200/20"
      )}>
        <CardHeader>
          <CardTitle className="dark:text-gray-100 text-gray-900">
            Validation Dossier
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 dark:text-gray-400 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-9",
                  "transition-colors duration-200",
                  "dark:bg-gray-800/50 bg-gray-50",
                  "dark:border-cyan-900/20 border-cyan-200/20",
                  "dark:text-gray-100 text-gray-900",
                  "dark:placeholder-gray-500 placeholder-gray-400"
                )}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={cn(
                "w-[180px]",
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "dark:text-gray-100 text-gray-900"
              )}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className={cn(
                "dark:bg-gray-800 bg-white",
                "dark:border-cyan-900/20 border-cyan-200/20"
              )}>
                <SelectItem value="all">Statut</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="approved">Accepté</SelectItem>
                <SelectItem value="denied">Reffusé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Merchant Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMerchants.map((merchant) => (
              <Card key={merchant.id} className={cn(
                "dark:bg-gray-800/50 bg-gray-50",
                "dark:border-cyan-900/20 border-cyan-200/20",
                "hover:border-cyan-500/50 transition-colors duration-200"
              )}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg dark:text-gray-100 text-gray-900">
                        {merchant.businessName}
                      </h3>
                      <p className="text-sm dark:text-gray-400 text-gray-500">
                        {merchant.ownerName}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn(
                      merchant.status === 'approved' && "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
                      merchant.status === 'denied' && "bg-red-500/10 text-red-500 border-red-500/20",
                      merchant.status === 'pending' && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}>
                      en cours
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={merchant.photo}
                        alt={merchant.businessName}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{merchant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{merchant.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{merchant.address}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/90 hover:bg-primary/10"
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDeny(merchant.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-cyan-500 hover:text-cyan-600 hover:bg-cyan-500/10"
                          onClick={() => handleApprove(merchant.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className={cn(
          "sm:max-w-[600px] md:max-w-[600px] md:h-[700px]",
          "dark:bg-gray-900/50 bg-white/50",
          "backdrop-blur-sm",
          "dark:border-cyan-900/20 border-cyan-200/20",
          "overflow-auto"
        )}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedMerchant && (
            <div className="space-y-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Information du commerçant</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Photo</label>
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                        <img
                          src={selectedMerchant.photo}
                          alt={selectedMerchant.businessName}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Signature</label>
                      <div className="h-32 relative rounded-lg overflow-hidden bg-white">
                        <img
                          src={selectedMerchant.signature}
                          alt="Signature"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Nom</label>
                    <p className="font-medium">{selectedMerchant.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Prénom</label>
                    <p className="font-medium">{selectedMerchant.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Contacts</label>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedMerchant.email}</p>
                      <p className="font-medium">{selectedMerchant.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Address</label>
                    <p className="font-medium">{selectedMerchant.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="border-primary/20"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeny(selectedMerchant.id);
                    setIsDetailOpen(false);
                  }}
                >
                  Refuser
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    handleApprove(selectedMerchant.id);
                    setIsDetailOpen(false);
                  }}
                >
                  Accepter Dossier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}