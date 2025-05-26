'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Printer, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Status, type MerchantEnrollment } from '@/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { updateMerchant } from '@/fetcher/api-fetcher';
import { toast } from '@/hooks/use-toast';
import { AuthActions } from '@/app/(auth)/utils';

interface BadgeCardDialogProps {
  merchant: MerchantEnrollment;
  onSuccess?: () => void;
}

export default function BadgeCardDialog({ merchant }: BadgeCardDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [printed, setPrinted] = useState(false);
  const { getUserIdFromToken } = AuthActions();

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      
      // Créer un nouveau document PDF aux dimensions d'une carte d'identité standard
      const doc = new jsPDF({
        unit: 'mm',
        format: [86, 55],  // Format standard d'une carte ID/crédit
        orientation: 'landscape'
      });
      
      // ===== RECTO DE LA CARTE (PAGE 1) =====
      doc.setFillColor(255, 255, 255); // Fond blanc
      doc.rect(0, 0, 86, 55, 'F');
      
      // Position des éléments
      const labelX = 43; // Position pour aligner les labels à droite
      const valueX = 44; // Position de départ des valeurs
      const startY = 24; // Position Y de départ
      const lineHeight = 3; // Hauteur entre les lignes
      
      // Configuration du texte
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(50, 50, 50); // Gris foncé
      
      // Fonction pour ajouter un champ avec label et valeur alignés
      const addField = (label, value, lineIndex) => {
        const y = startY + (lineIndex * lineHeight);
        doc.text(`${label}:`, labelX, y, { align: 'right' }); // Aligne les labels à droite
        doc.text(value || '', valueX, y); // La valeur commence après les deux points
      };
      
      // Ajouter les champs
      addField('Nom', merchant?.user?.last_name, 0);
      addField('Prenom', merchant?.user?.first_name, 1);
      addField('Rôle', merchant?.work_position?.name, 2);
      addField('Nationalité', merchant?.nationality?.name, 3);
      addField('Activité', merchant?.activities && merchant.activities.length > 0 ? merchant.activities[0].name : '', 4);
      
      // Date d'expiration
      doc.setFontSize(6);
      doc.text(`Date d'expiration`, 35, 48);
      doc.setFont('helvetica', 'bold');
      doc.text(`10.10.2025`, 38, 51);

      // Définir les paramètres pour la photo de profil
      const photoX = 5.7;
      const photoY = 15.7;
      const photoW = 19.3;
      const photoH = 22.5;
      const photoR = 3; // Rayon des coins arrondis plus léger
      
      // Rect pour la signature - sans bordure
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, 39, 11, 11, 1, 1, 'F');
      
      // Dessiner d'abord le rect arrondi qui servira de masque
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(photoX, photoY, photoW, photoH, photoR, photoR, 'F');
      
      // Essayer de charger et d'ajouter la photo de profil si disponible
      if (merchant?.profile_photo) {
        try {
          // Note: Ceci fonctionne uniquement si l'image est accessible et pas protégée par CORS
          
          // Approche simple: ajouter l'image telle quelle mais dans un contexte limité
          doc.saveGraphicsState(); // Sauvegarder l'état graphique
          
          // Définir un masque de découpage pour l'image avec le rectangle arrondi
          // Nous simulons un clip par un moyen détourné en redessinant le rectangle par-dessus
          
          // 1. Ajout de l'image à sa position normale
          doc.addImage(merchant.profile_photo, 'JPEG', photoX, photoY, photoW, photoH);
          
          // 2. Dessiner une bordure blanche fine autour pour cacher les coins
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(2.5); // Épaisseur réduite pour un effet plus discret
          doc.roundedRect(photoX, photoY, photoW, photoH, photoR, photoR, 'S');
          
          doc.restoreGraphicsState(); // Restaurer l'état graphique
        } catch (e) {
          console.error('Impossible de charger la photo de profil:', e);
        }
      }
      
      // Essayer de charger et d'ajouter la signature si disponible
      if (merchant?.signature_photo) {
        try {
          // Note: Ceci fonctionne uniquement si l'image est accessible et pas protégée par CORS
          doc.addImage(merchant.signature_photo, 'JPEG', 9, 39, 11, 11);
        } catch (e) {
          console.error('Impossible de charger la signature:', e);
        }
      }
      
      // ===== VERSO DE LA CARTE (PAGE 2) =====
      doc.addPage([86, 55], 'landscape');
      doc.setFillColor(255, 255, 255); // Fond blanc
      doc.rect(0, 0, 86, 55, 'F');

      
      
      // Ajouter du contenu au verso si nécessaire
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('', 43, 27.5, { align: 'center' });

      // === Signature du président ===
      // Position et dimensions
      const sigWidth = 11; // mm
      const sigHeight = 11; // mm
      const sigRight = 26; // mm depuis la droite
      const sigBottom = 1; // mm depuis le bas
      const cardWidth = 86;
      const cardHeight = 55;
      const sigX = cardWidth - sigRight - sigWidth;
      const sigY = cardHeight - sigBottom - sigHeight;
      // Fond blanc arrondi
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(sigX, sigY, sigWidth, sigHeight, 2, 2, 'F');
      // Ajout de l'image de signature (base64)
      if (window && window.location) {
        // Charger l'image depuis le dossier public (nécessite une conversion en base64)
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = '/images/president_signature.png';
        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Créer un canvas temporaire pour convertir en base64
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            doc.addImage(dataUrl, 'PNG', sigX, sigY, sigWidth, sigHeight);
            resolve(true);
          };
          img.onerror = reject;
        });
      }

      // Sauvegarder le PDF avec un nom de fichier incluant l'ID du marchand et la date actuelle
      const dateStr = format(new Date(), 'yyyyMMdd-HHmmss');
      doc.save(`badge-${merchant?.id || 'unknown'}-${dateStr}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } 

    try {
      const response = await updateMerchant({
        ...merchant,
        printed: true,
        printed_at: new Date().toISOString(),
        printed_by_id: Number(getUserIdFromToken())
      }, merchant.id);
      if (response?.status === "success") {
        setPrinted(true);
        const { status, message } = response;
        toast({
          title: "Modification Commerçant",
          description: message || "Opération effectuée avec succès",
          variant: status === "error" ? "destructive" : "default",
          className: cn(
            status === "success" && "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800",
            "text-green-600 dark:text-green-400"
          ),
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commerçant:', error);
    }
    finally {
      setIsPrinting(false);
    }

  };

  const toggleSide = () => {
    setShowBack(!showBack);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "dark:text-cyan-400 text-cyan-600",
            "dark:hover:text-cyan-300 hover:text-cyan-700",
            "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/20",
            "bg-gray-50 dark:bg-gray-900/50 space-x-2"
          )}
        >
          <span>View</span> <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-[600px]",
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        "dark:bg-gray-900/95 bg-white/95",
        "backdrop-blur-sm"
      )}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Carte de Badge
          </DialogTitle>
        </DialogHeader>
        
        {/* Card Container */}
        <div className="p-6">
          <div className="relative w-[85mm] h-[54mm] mx-auto">
            <div className={cn(
              "relative w-full h-full transition-all duration-500 preserve-3d",
              showBack ? "rotate-y-180" : ""
            )}>
              {/* Front Side */}
              <div id="card-front" className={cn(
                "absolute inset-0 backface-hidden bg-white rounded-lg overflow-hidden border border-gray-200",
                showBack ? "invisible" : "visible",
                'w-[86mm] h-[55mm]'
              )}>
                <div className="w-[86mm] h-[55mm] relative text-[9px]">
                  <div className='block top-[20mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-800">Nom: {merchant?.user?.last_name}</span>
                  </div>
                  <div className='block top-[23mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-800">Prenom: {merchant?.user?.first_name}</span>
                  </div>
                  <div className='block top-[26mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-800">Rôle: {merchant?.work_position?.name}</span>
                  </div>
                  <div className='block top-[29mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-800">Nationalité: {merchant?.nationality?.name}</span>
                  </div>
                  <div className='block top-[32mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-800">Activité: {merchant?.activities[0]?.name}</span>
                  </div>
                  <div className='block top-[44mm] left-[35mm] absolute text-[7px]'>
                    <span className="font-bold text-gray-800">Date d'expiration</span>
                  </div>
                  <div className='block top-[47mm] left-[38mm] absolute text-[7px] text-black'>
                    <span>10.10.2025</span>
                  </div>
                  <div className='w-[18mm] h-[23mm] bg-gray-200 rounded-md absolute top-[12mm] left-[8mm]'
                  style={{ backgroundImage: `url(${merchant?.profile_photo})`, backgroundSize: 'cover' }}
                  >
                   
                  </div>
                  <div className='w-[11mm] h-[11mm] rounded-md absolute bottom-[7mm] left-[12mm]'>
                   <img src={merchant?.signature_photo} alt="" className='w-full h-full'/>
                  </div>
                </div>

              </div>

              {/* Back Side */}
              <div id="card-back" className={cn(
                "absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-lg overflow-hidden border border-gray-200",
                showBack ? "visible" : "invisible",
                'w-[85.6mm] h-[54mm]'
              )}>
                <div className="relative w-full h-full flex items-center justify-center">
                <div className='w-[11mm] h-[11mm] rounded-md absolute bottom-[1mm] right-[23mm]'>
                   <img src='/images/president_signature.png' alt="" className='w-full h-full'/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter>
          <Button onClick={toggleSide} variant="outline" disabled={isLoading || isPrinting}>
            <RotateCw className="w-4 h-4 mr-2" />
            {showBack ? "Voir Recto" : "Voir Verso"}
          </Button>
          <Button 
            onClick={handlePrint} 
            disabled={isLoading || isPrinting || merchant.printed || printed}
            className="relative"
          >
            {isPrinting ? (
              <>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span className="opacity-0">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
