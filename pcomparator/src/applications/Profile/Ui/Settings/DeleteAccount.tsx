"use client";

import { Button, Card, CardBody, CardFooter, CardHeader, useDisclosure } from "@heroui/react";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteAccount } from "~/applications/Profile/Api/deleteAccount";
import useForm from "~/components/Form/useForm";
import { Input } from "~/components/Inputs/Input/Input";
import { Modal } from "~/components/Modal/Modal";
import useDevice from "~/hooks/useDevice";

export const SettingsDeleteAccount = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { i18n } = useLingui();
  const device = useDevice();
  const form = useForm<{ confirm: string }>("confirm");
  const notify = () =>
    toast(<Trans>Account deleted</Trans>, {
      type: "success"
    });
  const { replace } = useRouter();

  return (
    <>
      <Card classNames={{ base: "border border-danger" }}>
        <CardHeader className="p-4">
          <h4 className="text-xl">
            <Trans>Delete Account</Trans>
          </h4>
        </CardHeader>
        <CardBody className="p-4">
          <Trans>
            <p className="text-small md:text-base">
              Permanently remove your Personal Account and all of its contents from the PComparator platform.
              This action is not reversible, so please continue with caution.
            </p>
          </Trans>
        </CardBody>
        <CardFooter className="bg-danger/20 justify-end">
          <Button color="danger" size="lg" onPress={onOpen} fullWidth={device === "mobile"}>
            <Trans>Delete Personal Account</Trans>
          </Button>
        </CardFooter>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        body={
          <form.Form
            methods={form.methods}
            onSubmit={async () => {
              await deleteAccount();
              notify();
              replace("/");
            }}
            actions={{
              nextProps: {
                title: <Trans>I understand, delete my account</Trans>,
                fullWidth: true,
                color: "danger",
                size: "lg",
                isDisabled: !form.watch("confirm")?.match(t(i18n)`delete my account`)
              },
              wrapperProps: { className: "justify-end border-t border-t-default -px-4" }
            }}
          >
            <div className="mt-6 md:mt-0">
              <Input
                label={
                  <span>
                    <Trans>
                      <b>To verify, type</b> <i>delete my account</i>
                      <b> below:</b>
                    </Trans>
                  </span>
                }
                name="confirm"
                placeholder={t(i18n)`delete my account`}
                autoComplete="off"
              />
            </div>
          </form.Form>
        }
        header={
          <p>
            <Trans>Delete Personal Account</Trans>
          </p>
        }
        isForm
      />
    </>
  );
};
