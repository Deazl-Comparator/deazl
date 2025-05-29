import type { Barcode } from "~/applications/Prices/Domain/ValueObjects/Barcode";
import { TypeBarcode } from "~/applications/Prices/Ui/NewPrice/FormSteps/Step1/TypeBarcode";
import { Price } from "~/applications/Prices/Ui/NewPrice/FormSteps/Step2/Price";
import { Location } from "~/applications/Prices/Ui/NewPrice/FormSteps/Step4/Location";

interface FormStepsProps {
  step: number;
  barcode: Barcode | undefined;
  onNextStep: (data: any) => Promise<void>;
  onLastStep: (data: any) => Promise<void>;
  // onCheckBarcode: (barcode: string) => Promise<Product>;
  onPrevious: () => void;
}

export const FormSteps = ({ step, onNextStep, barcode, onPrevious, onLastStep }: FormStepsProps) => {
  switch (step) {
    case 1:
      return <TypeBarcode onNextStep={onNextStep} barcode={barcode} />;
    case 2:
      return <Price onNextStep={onNextStep} onPrevious={onPrevious} />;
    case 3:
      return <Location onNextStep={onLastStep} onPrevious={onPrevious} />;
    // case 3:
    //   return <Proof onNextStep={onLastStep} onPrevious={onPrevious} />;
  }
};
