import {} from "@heroui/react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useState } from "react";
import { createPrice } from "~/applications/Prices/Api/createPrice";
import type { Barcode } from "~/applications/Prices/Domain/ValueObjects/Barcode";
import { Currency } from "~/applications/Prices/Domain/ValueObjects/Currency";
import { FormSteps } from "~/applications/Prices/Ui/NewPrice/FormSteps/FormSteps";
import { Modal } from "~/components/Modal/Modal";
import { Stepper } from "~/components/Stepper/Stepper";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
  barcode: Barcode | undefined;
  onSuccessfull: (productName: string) => void;
}

export const NewPriceModal = ({
  isOpen,
  onClose,
  barcode,
  onOpenChange,
  onSuccessfull
}: NewProductModalProps) => {
  const { i18n } = useLingui();
  const [step, setStep] = useState<number>(1);
  const [productData, setProductData] = useState<{ price: number; barcode: string } | {}>({});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      modalProps={{ size: "4xl" }}
      header={
        <Stepper
          steps={[{ label: t(i18n)`Barcode` }, { label: t(i18n)`Price` }, { label: t(i18n)`Location` }]}
          currentStep={step}
        />
      }
      body={
        <FormSteps
          step={step}
          onNextStep={async (data) => {
            setProductData((product) => ({ ...product, ...data }));
            setStep((currentStep) => currentStep + 1);
          }}
          barcode={barcode}
          onLastStep={async (data) => {
            const finalProductData = { ...productData, ...data };

            const product = await createPrice({
              amount: finalProductData.price,
              barcode: finalProductData.barcode,
              currency: Currency.Euro,
              location: finalProductData.location,
              storeName: finalProductData.storeName
            });
            onSuccessfull(product.name);
          }}
          onPrevious={() => setStep((currentStep) => currentStep - 1)}
        />
      }
      isForm
    />
  );
};
