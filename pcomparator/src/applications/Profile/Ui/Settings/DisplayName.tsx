"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-toastify";
import { updateFullname } from "~/applications/Profile/Api/updateFullname";
import useForm from "~/components/Form/useForm";
import { Input } from "~/components/Inputs/Input/Input";

interface SettingsDisplayNameProps {
  defaultValue: string;
}

export const SettingsDisplayName = ({ defaultValue }: SettingsDisplayNameProps) => {
  const form = useForm<{ fullname: string }>(undefined, { defaultValues: { fullname: defaultValue } });
  const { i18n } = useLingui();
  const notify = () =>
    toast(<Trans>Fullname updated</Trans>, {
      type: "success"
    });

  return (
    <Card>
      <CardHeader className="p-4">
        <h4 className="text-xl">
          <Trans>Display Name</Trans>
        </h4>
      </CardHeader>
      <form.Form
        methods={form.methods}
        onSubmit={async ({ fullname }) => {
          fullname !== defaultValue && (await updateFullname({ name: fullname }));
          notify();
        }}
        actions={{
          nextProps: {
            title: <Trans>Save</Trans>,
            color: "primary"
          },
          wrapper: CardFooter,
          wrapperProps: { className: "justify-end border-t border-t-default" }
        }}
      >
        <CardBody className="p-4">
          <Input
            labelPlacement="outside"
            placeholder=" "
            defaultValue={defaultValue}
            name="fullname"
            description={t(i18n)`Please use 32 characters at maximum.`}
            label={t(i18n)`Please enter your full name, or a display name you are comfortable with.`}
            required={t(i18n)`Invalid display name.`}
          />
        </CardBody>
      </form.Form>
    </Card>
  );
};
