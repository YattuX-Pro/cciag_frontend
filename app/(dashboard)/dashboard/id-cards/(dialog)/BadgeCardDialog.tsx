'use client';

import { useEffect, useState } from 'react';
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
import qrcode from 'qrcode-generator';
import { type_adherent } from '@/types/const';

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

  useEffect(()=>{
    console.log(merchant)
  },[])

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
      const labelX = 45; // Position pour aligner les labels à droite (déplacé de 3mm vers la gauche)
      const valueX = 46; // Position de départ des valeurs (déplacé de 3mm vers la gauche)
      const startY = 26; // Position Y de départ (déplacé de 3mm vers le haut)
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
      
      // Ajouter le numéro de carte juste au-dessus du nom
      doc.setFontSize(9); // Légèrement plus grand que le texte standard
      doc.setFont('helvetica', 'bold');
      // Position exactement au-dessus du champ Nom (déplacé vers le haut de 4mm pour correspondre à l'HTML)
      doc.text(`N°:`, labelX, startY - 5, { align: 'right' });
      doc.text(`${merchant?.card_number || ''}`, valueX, startY - 5);
      
      // Remettre la police normale pour les autres champs
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      

      if (merchant?.type_adherent === type_adherent.MEMBRE) {
        addField('Nom', merchant?.user?.last_name, 0);
        addField('Prenom', merchant?.user?.first_name, 1);
        addField('Nationalité', merchant?.nationality?.name, 2);
        addField('Activité', merchant?.activities && merchant.activities.length > 0 ? merchant.activities[0].name : '', 3);
        addField('Adresse', merchant?.address?.name || 'N/A', 4);
        addField('Telephone', merchant?.user?.phone_number || 'N/A', 5);
      }else{
        addField('Raison sociale', merchant?.entreprise?.sigle || merchant?.entreprise?.nom || 'N/A', 0);
        addField('Activité', merchant?.activities && merchant.activities.length > 0 ? merchant.activities[0].name : 'N/A', 1);
        addField('Adresse', merchant?.address?.name || 'N/A', 2);
        addField('Telephone', merchant?.user?.phone_number || 'N/A', 3);
        addField('Representant', merchant?.user?.last_name + ' ' + merchant?.user?.first_name || 'N/A', 4);
        addField('Nationalité', merchant?.nationality?.name || 'N/A', 5);
      }
    
      
      doc.setFontSize(6);
      
      const currentDate = new Date();
      const deliveryDate = new Date(currentDate).toLocaleDateString();
      
      // Positionnement en bas de la carte - un peu plus bas qu'avant
      const bottomY = 53; // Position Y en bas de la carte (valeur augmentée pour descendre)
      
      doc.text(`Délivré le: ${deliveryDate}`, 10, bottomY);
      
      // Date d'expiration sur la même ligne
      doc.text(`Expire le: ${new Date(merchant?.expired_at).toLocaleDateString()}`, 50, bottomY);
      
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
      
      // Ajouter le type d'adhérent en haut à gauche avec couleur verte
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(17, 152, 111); // Couleur verte #11986f
      const typeAdherentText = merchant?.tarification_adhesion?.type_adhesion_display?.toUpperCase();
      doc.text(typeAdherentText, 3, 3 + 3); // Position: 3mm des bords gauche et haut
      
      // Remettre la couleur par défaut
      doc.setTextColor(0, 0, 0);
      
      // Générer un petit code QR pour le card number en bas à droite du verso
      if (merchant?.card_number) {
        try {
          const qr = qrcode(0, 'L');
          qr.addData(String(merchant.card_number));
          qr.make();
          
          // Position du QR code (en bas à droite) - plus petit pour le verso
          const qrSize = 10; // taille réduite en mm
          const qrX = 86 - qrSize - 3; // 3mm de marge à droite
          const qrY = 55 - qrSize - 3; // 3mm de marge en bas
          
          // Convertir le QR code en image base64 avec une densité plus faible
          const qrCodeBase64 = qr.createDataURL(1, 0); // réduit la densité des pixels
          doc.addImage(qrCodeBase64, 'PNG', qrX, qrY, qrSize, qrSize);
        } catch (e) {
          console.error('Erreur lors de la génération du QR code sur le verso:', e);
        }
      }
      
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
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            doc.addImage(dataUrl, 'PNG', sigX, sigY, sigWidth, sigHeight);
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.text('Mamadou BALDE', sigX + (sigWidth / 2), sigY + sigHeight - 1, { align: 'center' }); // Position encore plus haute pour garantir la visibilité
            
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
      // Créer une date d'expiration (par exemple, 1 an à partir d'aujourd'hui)
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      
      // Formater les dates au format YYYY-MM-DD pour Django
      const formatDateForDjango = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const response = await updateMerchant({
        ...merchant,
        printed: true,
        printed_at: formatDateForDjango(new Date()),
        expired_at: formatDateForDjango(expirationDate),
        printed_by_id: Number(getUserIdFromToken())
      }, merchant.id);
      if (response?.status === "success") {
        setPrinted(true);
        const { status, message } = response;
        toast({
          title: "Modification Adhérent",
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
      console.error('Erreur lors de la mise à jour de l\'adhérent:', error);
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
                  <div className='block top-[16mm] left-[35mm] absolute'>
                    <span className="font-bold text-gray-900 text-[13px]">N°: {merchant?.card_number}</span>
                  </div>
                  {merchant?.type_adherent === type_adherent.MEMBRE ? (
                    <>
                      <div className='block top-[24mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Nom: {merchant?.user?.last_name}</span>
                      </div>
                      <div className='block top-[27mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Prenom: {merchant?.user?.first_name}</span>
                      </div>
                      <div className='block top-[30mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Nationalité: {merchant?.nationality?.name}</span>
                      </div>
                      <div className='block top-[33mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Secteur d'activité: {merchant?.activities && merchant.activities.length > 0 ? merchant.activities[0].name : ''}</span>
                      </div>
                      <div className='block top-[36mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Adresse: {merchant?.address?.name || ''}</span>
                      </div>
                      <div className='block top-[39mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Telephone: {merchant?.user?.phone_number || ''}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='block top-[24mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Raison sociale: {merchant?.entreprise?.nom || ''}</span>
                      </div>
                      <div className='block top-[27mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Secteur d'activité: {merchant?.activities && merchant.activities.length > 0 ? merchant.activities[0].name : ''}</span>
                      </div>
                      <div className='block top-[30mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Adresse: {merchant?.address?.name || ''}</span>
                      </div>
                      <div className='block top-[33mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Telephone: {merchant?.user?.phone_number || ''}</span>
                      </div>
                      <div className='block top-[36mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Nom du representant: {merchant?.user?.last_name || ''}</span>
                      </div>
                      <div className='block top-[39mm] left-[35mm] absolute'>
                        <span className="font-bold text-gray-800">Nationalité: {merchant?.nationality?.name || ''}</span>
                      </div>
                    </>
                  )}
                  {/* Dates en bas de la carte - position ajustée plus bas */}
                  <div className='block bottom-[2mm] left-[10mm] absolute text-[7px]'>
                    <span className="font-bold text-gray-800">Délivré le: {format(new Date(), 'yyyy-MM-dd')}</span>
                  </div>
                  
                  <div className='block bottom-[2mm] left-[50mm] absolute text-[7px]'>
                    <span className="font-bold text-gray-800">Expire le: {new Date(merchant?.expired_at).toLocaleDateString()}</span>
                  </div>
                  
                  <div className='w-[18mm] h-[23mm] bg-gray-200 rounded-md absolute top-[12mm] left-[8mm]'
                  style={{ backgroundImage: `url(${merchant?.profile_photo})`, backgroundSize: 'cover' }}
                  >
                   
                  </div>
                  <div className='absolute bottom-[7mm] left-[12mm] w-[11mm]'>
                    <div className='w-[11mm] h-[11mm] rounded-md'>
                      <img src={merchant?.signature_photo} alt="Signature de l'adhérent" className='w-full h-full'/>
                    </div>
                  </div>
                </div>

              </div>

              {/* Back Side */}
              <div id="card-back" className={cn(
                "absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-lg overflow-hidden border border-gray-200",
                showBack ? "visible" : "invisible",
                'w-[85.6mm] h-[54mm]'
              )}>
                {/* Contenu du verso */}
                <div className="w-full h-full relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Verso de la carte</p>
                  </div>
                  
                  {/* Code QR en bas à droite du verso - plus petit */}
                  {merchant?.card_number && (
                    <div className='w-[10mm] h-[10mm] absolute bottom-[3mm] right-[3mm]'>
                      <img 
                        src={(() => {
                          try {
                            const qr = qrcode(0, 'L');
                            qr.addData(String(merchant.card_number));
                            qr.make();
                            return qr.createDataURL(1, 0);
                          } catch(e) {
                            console.error("Erreur lors de la création du QR code", e);
                            return '';
                          }
                        })()} 
                        alt="QR Code" 
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  
                  {/* Signature du président */}
                  <div className='absolute bottom-[1mm] right-[26mm] w-[11mm]'>
                    <div className='w-[11mm] h-[11mm] rounded-md'>
                      <img src='/images/president_signature.png' alt="Signature du président" className='w-full h-full'/>
                    </div>
                    <div className='text-center text-[7px] mt-1 font-bold'>
                      Mamadou BALDE
                    </div>
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
