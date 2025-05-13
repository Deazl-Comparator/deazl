import { Button, addToast } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { CopyIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeTabProps {
  shareLink: string;
  onCopyShareLink: () => void;
}

export const QrCodeTab = ({ shareLink, onCopyShareLink }: QrCodeTabProps) => (
  <div className="space-y-5 text-center">
    <h3 className="text-sm font-semibold text-gray-700">QR Code for this shopping list</h3>
    <div className="flex justify-center py-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
        <QRCodeCanvas value={shareLink} size={200} level="H" includeMargin />
      </div>
    </div>
    <p className="text-sm text-gray-600">
      Scan this QR code with a smartphone camera to open the shopping list
    </p>
    <div className="flex justify-center pt-2">
      <Button
        color="primary"
        size="sm"
        startContent={<CopyIcon className="h-4 w-4" />}
        onPress={() => {
          onCopyShareLink();
          addToast({
            title: <Trans>QR Code copied</Trans>,
            description: <Trans>The link has been copied to clipboard</Trans>,
            variant: "solid",
            color: "success"
          });
        }}
      >
        Download QR Code
      </Button>
    </div>
  </div>
);
