import { Trans, useLingui } from "@lingui/react/macro";
import { Euro } from "lucide-react";
import useForm from "~/components/Form/useForm";
import { Input } from "~/components/Inputs/Input/Input";

interface PriceProps {
  onNextStep: ({ price }: { price: number }) => Promise<void>;
  onPrevious: () => void;
}

export const Price = ({ onNextStep, onPrevious }: PriceProps) => {
  const form = useForm<{ price: string }>();
  const { i18n } = useLingui();

  return (
    <>
      <form.Form
        methods={form.methods}
        onSubmit={async (data) => {
          try {
            await onNextStep({ price: Number(data.price) });
          } catch (error) {
            form.setError("price", { message: "An error occured, please try later." });
          }
        }}
        actions={{
          nextProps: { title: <Trans>Next</Trans>, color: "primary" },
          prevProps: { title: <Trans>Previous</Trans>, onPress: onPrevious }
        }}
      >
        {/* NOTE – Adding this hidden input to fix nextui modal error... */}
        <Input name="empty" className="hidden" hidden />
        <Input
          name="price"
          type="number"
          placeholder="9.99"
          label={<Trans>Price</Trans>}
          endContent={<Euro />}
          required={i18n._("Please enter a valid price.")}
        />
      </form.Form>
    </>
  );
};
