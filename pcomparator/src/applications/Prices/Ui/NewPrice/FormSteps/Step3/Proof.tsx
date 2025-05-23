import { Button, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Trans } from "@lingui/react/macro";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TakePicture } from "~/applications/Prices/Ui/NewPrice/FormSteps/Step3/TakePicture";
import useForm from "~/components/Form/useForm";

interface ProofProps {
  onNextStep: (data: any) => void;
  onPrevious: () => void;
}

export const Proof = ({ onNextStep, onPrevious }: ProofProps) => {
  const form = useForm();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [proof, setProof] = useState<string | null>(null);

  return (
    <form.Form
      methods={form.methods}
      onSubmit={(data) => {
        onNextStep({});
      }}
      actions={{
        nextProps: { title: <Trans>Next</Trans>, color: "primary" },
        prevProps: { title: <Trans>Previous</Trans>, onPress: onPrevious },
        wrapper: ModalFooter
      }}
    >
      <ModalBody>
        {/* <File
            name="proof"
            label={<Trans>Proof</Trans>}
            required={t`Please choose a valid proof.`}
            description={<Trans>Both the price tag and the product are visible</Trans>}
          /> */}

        <TakePicture
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onProofTaken={(proof) => setProof(proof)}
          onClose={onClose}
        />

        <Button startContent={<Camera />} onPress={onOpen}>
          <Trans>Take a picture</Trans>
        </Button>

        {proof && <Image src={proof} width={100} height={200} alt="" />}
      </ModalBody>
    </form.Form>
  );
};
