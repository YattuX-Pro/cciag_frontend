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
import type { MerchantEnrollment } from '@/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';
import QRCode from 'react-qr-code';

interface BadgeCardDialogProps {
  merchant: MerchantEnrollment;
  onSuccess?: () => void;
}

export default function BadgeCardDialog({ merchant }: BadgeCardDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const handlePrint = async () => {
    const frontCard = document.getElementById('card-front');
    const backCard = document.getElementById('card-back');
  
    if (!frontCard || !backCard) return;

    try {
      setIsPrinting(true);
      // Créer un nouveau document PDF
      const doc = new jsPDF({
        unit: 'mm',
        format: [85.6, 54],
        orientation: 'landscape'
      });

      // Configuration commune pour html2canvas
      const canvasOptions = {
        scale: 4,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        width: 856, // 85.6mm * 10
        height: 540, // 54mm * 10
        onclone: (clonedDoc) => {
          const elements = clonedDoc.getElementsByClassName('backface-hidden');
          Array.from(elements).forEach((el: HTMLElement) => {
            el.style.backfaceVisibility = 'visible';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
          });
        }
      };

      // Capture et ajout du recto
      const frontCanvas = await html2canvas(frontCard, {
        ...canvasOptions,
        onclone: (clonedDoc) => {
          const front = clonedDoc.getElementById('card-front');
          if (front) {
            front.style.transform = 'none';
            front.style.visibility = 'visible';
            front.style.position = 'static';
            front.style.width = '856px';
            front.style.height = '540px';
          }
        }
      });
      const frontImgData = frontCanvas.toDataURL('image/png', 1.0);
      doc.addImage(frontImgData, 'PNG', 0, 0, 85.6, 54, '', 'FAST');

      // Ajouter une nouvelle page
      doc.addPage([85.6, 54], 'landscape');

      // Capture et ajout du verso
      const backCanvas = await html2canvas(backCard, {
        ...canvasOptions,
        onclone: (clonedDoc) => {
          const back = clonedDoc.getElementById('card-back');
          if (back) {
            back.style.transform = 'none';
            back.style.visibility = 'visible';
            back.style.position = 'static';
            back.style.width = '856px';
            back.style.height = '540px';
          }
        }
      });
      const backImgData = backCanvas.toDataURL('image/png', 1.0);
      doc.addImage(backImgData, 'PNG', 0, 0, 85.6, 54, '', 'FAST');

      // Sauvegarder le PDF
      doc.save(`badge-${merchant?.id}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    } finally {
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
          variant="ghost"
          size="sm"
          className={cn(
            "dark:text-cyan-400 text-cyan-600",
            "dark:hover:text-cyan-300 hover:text-cyan-700",
            "dark:hover:bg-cyan-900/20 hover:bg-cyan-100/20"
          )}
        >
          <Eye className="h-4 w-4" />
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
          <div className="relative w-[85.6mm] h-[54mm] mx-auto">
            <div className={cn(
              "relative w-full h-full transition-all duration-500 preserve-3d",
              showBack ? "rotate-y-180" : ""
            )}>
              {/* Front Side */}
              <div id="card-front" className={cn(
                "absolute inset-0 backface-hidden bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg overflow-hidden",
                showBack ? "invisible" : "visible",
                'w-[85.6mm] h-[54mm]'
              )}>
                
              </div>

              {/* Back Side */}
              <div id="card-back" className={cn(
                "absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-100 to-cyan-300 rounded-lg overflow-hidden",
                showBack ? "visible" : "invisible",
                'w-[85.6mm] h-[54mm]'
              )}>
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
            disabled={isLoading || isPrinting}
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
