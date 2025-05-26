"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { toast } from "react-toastify";
import { updatePhoneNumber } from "~/applications/Profile/Api/updatePhoneNumber";
import useForm from "~/components/Form/useForm";
import Phone from "~/components/Inputs/Phone/Phone";

interface SettingsPhoneNumberProps {
  defaultValue?: string;
}

export const SettingsPhoneNumber = ({ defaultValue }: SettingsPhoneNumberProps) => {
  const form = useForm<{ phone: string }>(undefined, { defaultValues: { phone: defaultValue } });
  const { i18n } = useLingui();
  const notify = () =>
    toast(<Trans>Phone number updated</Trans>, {
      type: "success"
    });

  return (
    <>
      <Card>
        <CardHeader className="p-4">
          <h4 className="text-xl">
            <Trans>Phone Number</Trans>
          </h4>
        </CardHeader>
        <form.Form
          methods={form.methods}
          onSubmit={async ({ phone }) => {
            phone !== defaultValue && (await updatePhoneNumber({ phone }));
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
            <Phone
              placeholder=" "
              defaultValue={defaultValue}
              name="phone"
              description={t(i18n)`Please use 32 characters at maximum.`}
              label={t(i18n)`Enter a phone number to receive important service updates by SMS.`}
              required={t(i18n)`Invalid phone number.`}
            />
          </CardBody>
        </form.Form>
      </Card>
    </>
  );
};
