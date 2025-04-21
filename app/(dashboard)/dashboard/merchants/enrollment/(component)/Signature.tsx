// Nouveau composant SignatureTest.tsx adapté pour le formulaire
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Signature({
  onChange,
}: {
  onChange?: (data: string | null) => void;
}) {
  const [ready, setReady] = useState(false);
  const [connected, setConnected] = useState(false);
  const [signatureBase64, setSignatureBase64] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number; p: number }[]>(
    []
  );
  const [padResolution, setPadResolution] = useState<{ x: number; y: number }>({
    x: 320,
    y: 160,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/script/STPadServerLib-3.4.0.js";
    script.async = true;
    script.onload = () => {
      if (window.STPadServerLib) {
        window.STPadServerLibCommons =
          window.STPadServerLib.STPadServerLibCommons;
        window.STPadServerLibDefault =
          window.STPadServerLib.STPadServerLibDefault;
        window.STPadServerLibApi = window.STPadServerLib.STPadServerLibApi;

        window.STPadServerLibCommons.handleLogging = (msg: string) =>
          console.log("[STPad]", msg);

        window.STPadServerLibCommons.handleNextSignaturePoint = (
          x: number,
          y: number,
          p: number
        ) => {
          setPoints((prev) => [...prev, { x, y, p }]);
        };

        setReady(true);
        connectToPad();
      }
    };
    document.body.appendChild(script);
    return () => {
      // Safe cleanup: check if the script is still in the document before removing
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const scaleX = canvas.width / padResolution.x;
    const scaleY = canvas.height / padResolution.y;

    const allX = points.map((p) => p.x);
    const allY = points.map((p) => p.y);
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);

    const drawingWidth = (maxX - minX) * scaleX;
    const drawingHeight = (maxY - minY) * scaleY;

    const offsetX = (canvas.width - drawingWidth) / 2 - minX * scaleX;
    const offsetY = (canvas.height - drawingHeight) / 2 - minY * scaleY;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (prev.p > 0 && curr.p > 0) {
        ctx.moveTo(prev.x * scaleX + offsetX, prev.y * scaleY + offsetY);
        ctx.lineTo(curr.x * scaleX + offsetX, curr.y * scaleY + offsetY);
      }
    }

    ctx.stroke();
  }, [points, padResolution]);

  const connectToPad = () => {
    if (!window.STPadServerLibCommons) return;

    try {
      try {
        window.STPadServerLibCommons.destroyConnection?.();
      } catch (e) {}

      window.STPadServerLibCommons.createConnection(
        "wss://local.signotecwebsocket.de:49494",
        () => setConnected(true),
        () => setConnected(false),
        (err) => {
          console.error("[STPad] Erreur de connexion :", err);
          setConnected(false);
          setError("Erreur de connexion à la tablette.");
        }
      );
    } catch (e) {
      console.error("[STPad] Exception WebSocket :", e);
      setError("Exception lors de la tentative de connexion WebSocket.");
    }
  };

  const safeClosePad = async () => {
    try {
      await window.STPadServerLibDefault.closePad();
    } catch (e) {}
  };

  const startSignature = async () => {
    try {
      setIsSigning(true);
      setSignatureBase64(null);
      onChange?.(null);
      setError(null);
      setPoints([]);

      await safeClosePad();

      const openParams = new window.STPadServerLibDefault.Params.openPad(0);
      await window.STPadServerLibDefault.openPad(openParams);

      setPadResolution({ x: 320, y: 160 });

      const startParams =
        new window.STPadServerLibDefault.Params.startSignature();
      startParams.setFieldName("Signature");
      startParams.setCustomText("Merci de signer");
      await window.STPadServerLibDefault.startSignature(startParams);
    } catch (e) {
      console.error("[STPad] Erreur démarrage :", e);
      setError(e?.errorMessage || "Erreur lors du démarrage de la signature.");
      setIsSigning(false);
    }
  };

  const confirmSignature = async () => {
    try {
      await window.STPadServerLibDefault.confirmSignature();

      const imgParams =
        new window.STPadServerLibDefault.Params.getSignatureImage();
      imgParams.setFileType(1);

      const result = await window.STPadServerLibDefault.getSignatureImage(
        imgParams
      );
      const imageData =
        result?.file || result?.imageData || result?.imageBase64;

      if (imageData) {
        const base64 = `data:image/png;base64,${imageData}`;
        setSignatureBase64(base64);
        onChange?.(imageData);
      } else {
        setError("Aucune image de signature n'a été reçue.");
      }
    } catch (e) {
      console.error("[STPad] Erreur confirmation :", e);
      setError("Aucune image de signature n'a été reçue. Merci de réessayer.");
    } finally {
      await window.STPadServerLibDefault.closePad();
      setIsSigning(false);
    }
  };

  const cancelSignature = async () => {
    try {
      await window.STPadServerLibDefault.cancelSignature();
      const closeParams = new window.STPadServerLibDefault.Params.closePad(0)
      await window.STPadServerLibDefault.closePad(closeParams)
    } catch (e) {
      console.error("[STPad] Erreur annulation :", e);
    } finally {
      setSignatureBase64(null);
      onChange?.(null);
      setIsSigning(false);
      setPoints([]);
    }
  };

  return (
    <Card className="shadow border border-cyan-600 bg-cyan-700/20">
      <CardHeader className="flex items-center justify-between bg-cyan-700/50 py-2 rounded-tl-sm rounded-tr-sm">
        <CardTitle className="text-white text-base">
          Signature Électronique
        </CardTitle>
        <Badge
          variant={connected ? "default" : "destructive"}
          className={connected ? "bg-cyan-700" : ""}
        >
          {connected ? "Connecté ✅" : "Non connecté ❌"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2 p-3">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            disabled={!connected || isSigning}
            onClick={startSignature}
            className="bg-cyan-700 hover:bg-cyan-800 text-white disabled:bg-cyan-400 text-sm py-1"
          >
            {isSigning ? "Signature en cours..." : "Démarrer Signature"}
          </Button>
          <Button
            type="button"
            onClick={confirmSignature}
            disabled={!connected || !isSigning}
            className="bg-cyan-700 hover:bg-cyan-800 text-white disabled:bg-cyan-400 text-sm py-1"
          >
            Terminer & Récupérer
          </Button>
          <Button
            type="button"
            onClick={cancelSignature}
            disabled={!connected || !isSigning}
            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 text-sm py-1"
          >
            Annuler
          </Button>
        </div>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="border-2 border-cyan-400 rounded-md bg-white shadow-md"
          ></canvas>
        </div>
      </CardContent>

      {signatureBase64 && (
        <CardFooter className="flex flex-col items-center w-full bg-cyan-800/50 p-2">
          <span className="mb-2 font-medium text-sm text-center w-full text-white">
            Signature capturée :
          </span>
          <div className="bg-white border-2 border-cyan-400 rounded-xl p-2 shadow-md">
            <img
              src={signatureBase64}
              alt="Signature"
              className="max-w-[250px] max-h-[200px] object-contain"
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
