import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { Camera, X, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface BarcodeScannerProps {
  onScanned: (barcode: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
  continuous?: boolean;
}

export const BarcodeScanner = ({
  onScanned,
  onClose,
  title = "Scanner un code-barres",
  description = "Positionnez le code-barres dans le cadre",
  continuous = false
}: BarcodeScannerProps) => {
  // Debug des props reçues
  console.log("🔧 BarcodeScanner props:", {
    onScanned: typeof onScanned,
    onClose: typeof onClose,
    title,
    description,
    continuous
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Références stables pour les callbacks
  const onScannedRef = useRef(onScanned);
  const onCloseRef = useRef(onClose);

  // Mettre à jour les références quand les props changent
  useEffect(() => {
    onScannedRef.current = onScanned;
    onCloseRef.current = onClose;
  }, [onScanned, onClose]);

  // Initialiser le code reader
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    startCamera();

    return () => {
      stopScanning();
      stopCamera();
      if (codeReaderRef.current) {
        try {
          codeReaderRef.current.reset();
        } catch (e) {
          console.warn("Erreur lors du reset du scanner:", e);
        }
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API not supported");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
          // Démarrer le scan après que la vidéo soit prête
          setTimeout(() => {
            startScanning();
          }, 1000);
        } catch (playError) {
          console.error("Erreur de lecture vidéo:", playError);
        }
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Erreur accès caméra:", err);
      setHasPermission(false);
      setError(err instanceof Error ? err.message : "Impossible d'accéder à la caméra");
      setIsLoading(false);
    }
  };

  const startScanning = useCallback(() => {
    if (!codeReaderRef.current || !videoRef.current || isScanning) {
      return;
    }

    console.log("🔍 Démarrage du scan...");
    console.log("onScanned disponible:", typeof onScanned);
    setIsScanning(true);

    try {
      codeReaderRef.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        console.log("📱 Callback appelé, result:", result, "error:", error);

        if (result) {
          console.log("🎉 Code-barres détecté:", result.getText());

          // Utiliser les références stables pour éviter les problèmes de closure
          console.log("🔧 Vérification des refs:", {
            onScannedRef: typeof onScannedRef.current,
            onCloseRef: typeof onCloseRef.current
          });

          if (typeof onScannedRef.current === "function") {
            onScannedRef.current(result.getText());
          } else {
            console.error("❌ onScannedRef.current n'est pas une fonction:", typeof onScannedRef.current);
            return;
          }

          if (!continuous) {
            if (typeof onCloseRef.current === "function") {
              onCloseRef.current();
            }
            return;
          }

          // En mode continu, arrêter temporairement et redémarrer
          stopScanning();
          scanTimeoutRef.current = setTimeout(() => {
            startScanning();
          }, 2000);
        }

        if (error && !(error instanceof NotFoundException)) {
          console.error("Erreur de scan:", error);
        }
      });
    } catch (err) {
      console.error("Erreur lors du démarrage du scan:", err);
      setIsScanning(false);
    }
  }, [isScanning, continuous]);

  const stopScanning = () => {
    setIsScanning(false);
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }

    // Arrêter le scan en cours si nécessaire
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
      } catch (e) {
        console.warn("Erreur lors de l'arrêt du scan:", e);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      setStream(null);
    }
  };

  const handleManualInput = () => {
    const barcode = prompt("Entrez le code-barres manuellement:");
    if (barcode?.trim()) {
      console.log("✏️ Saisie manuelle:", barcode.trim());
      if (typeof onScannedRef.current === "function") {
        onScannedRef.current(barcode.trim());
      }
      if (!continuous && typeof onCloseRef.current === "function") {
        onCloseRef.current();
      }
    }
  };

  const simulateScanning = () => {
    const testBarcode = "3017620422003"; // Code-barres Nutella
    console.log("🧪 Test scan simulé:", testBarcode);
    console.log("🧪 onScannedRef type:", typeof onScannedRef.current);

    if (typeof onScannedRef.current === "function") {
      onScannedRef.current(testBarcode);
      if (!continuous && typeof onCloseRef.current === "function") {
        onCloseRef.current();
      }
    } else {
      console.error("❌ onScannedRef.current n'est pas une fonction dans simulateScanning");
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => onCloseRef.current?.()}
      size="full"
      classNames={{
        base: "m-0 max-h-screen",
        wrapper: "w-full h-full",
        backdrop: "bg-black/80"
      }}
    >
      <ModalContent className="h-full flex flex-col">
        <ModalHeader className="flex justify-between items-center bg-black text-white">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <Button isIconOnly variant="light" onPress={() => onCloseRef.current?.()} className="text-white">
            <X className="h-6 w-6" />
          </Button>
        </ModalHeader>

        <ModalBody className="flex-1 p-0 bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                <p>Initialisation de la caméra...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
              <div className="text-center p-6">
                <X className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <p className="text-red-400 mb-4">{error}</p>
                <div className="space-y-3">
                  <Button color="primary" onPress={startCamera} startContent={<Camera className="h-4 w-4" />}>
                    Réessayer
                  </Button>
                  <Button variant="bordered" onPress={handleManualInput} className="text-white border-white">
                    Saisie manuelle
                  </Button>
                </div>
              </div>
            </div>
          )}

          {hasPermission && !error && (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-32 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary-500 opacity-75 animate-pulse" />
                  </div>

                  <p className="text-white text-center mt-4 text-sm bg-black/50 px-3 py-1 rounded">
                    {isScanning ? "🔍 Scan en cours..." : "Alignez le code-barres dans le cadre"}
                  </p>
                </div>
              </div>
            </>
          )}
        </ModalBody>

        <ModalFooter className="bg-black">
          <div className="flex justify-center gap-4 w-full">
            <Button variant="bordered" onPress={handleManualInput} className="text-white border-white">
              Saisie manuelle
            </Button>

            {process.env.NODE_ENV === "development" && (
              <Button color="warning" onPress={simulateScanning} startContent={<Zap className="h-4 w-4" />}>
                Test Scanner
              </Button>
            )}

            {isScanning && (
              <Button color="success" onPress={stopScanning}>
                Arrêter scan
              </Button>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
