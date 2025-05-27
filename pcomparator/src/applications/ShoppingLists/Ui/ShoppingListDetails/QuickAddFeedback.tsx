"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { CheckIcon, ShoppingCartIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickAddFeedbackProps {
  isVisible: boolean;
  type: "success" | "error" | "processing";
  message?: string;
  onDismiss?: () => void;
}

export const QuickAddFeedback = ({ isVisible, type, message, onDismiss }: QuickAddFeedbackProps) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldShow(true);
      if (type === "success") {
        const timer = setTimeout(() => {
          setShouldShow(false);
          onDismiss?.();
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setShouldShow(false);
    }
  }, [isVisible, type, onDismiss]);

  if (!shouldShow) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckIcon className="w-4 h-4" />;
      case "error":
        return <XIcon className="w-4 h-4" />;
      case "processing":
        return <ShoppingCartIcon className="w-4 h-4 animate-pulse" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "processing":
        return "primary";
    }
  };

  return (
    <Card
      className={`transition-all duration-300 ${
        shouldShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <CardBody className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Chip color={getColor()} variant="flat" startContent={getIcon()} size="sm">
              {type === "success" && <Trans>Added</Trans>}
              {type === "error" && <Trans>Error</Trans>}
              {type === "processing" && <Trans>Adding...</Trans>}
            </Chip>
            {message && <span className="text-sm text-gray-700 dark:text-gray-300">{message}</span>}
          </div>
          {type === "error" && onDismiss && (
            <Button size="sm" variant="light" isIconOnly onPress={onDismiss}>
              <XIcon className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
