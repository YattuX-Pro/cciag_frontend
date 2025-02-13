import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { cn } from "@/lib/utils";
  
  interface IFramePdfDialogProps {
    isOpen: boolean;
    onClose: () => void;
    base64Data: string | null;
  }

function IFramePdfDialog({ isOpen, onClose, base64Data }: IFramePdfDialogProps) {
    if (!base64Data) return null;

    const base64Clean = base64Data.split(",")[1] || base64Data;
    const fileType = base64Data.split(";")[0]?.split(":")[1] || "application/pdf";
    const dataUrl = `data:${fileType};base64,${base64Clean}`;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            "sm:max-w-[80vw] sm:h-[80vh]",
            "backdrop-blur-sm",
            "dark:bg-gray-900/95 bg-white/95",
            "dark:border-cyan-900/20 border-cyan-600/20",
            "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold dark:text-gray-100">
              Aperçu du document
            </DialogTitle>
          </DialogHeader>
  
          <div className="w-full h-full min-h-[60vh]">
            <object
              data={dataUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="min-h-[60vh]"
            >
              <iframe
                src={dataUrl}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                className="min-h-[60vh]"
              />
            </object>
          </div>
        </DialogContent>
      </Dialog>
    );
}

export default IFramePdfDialog