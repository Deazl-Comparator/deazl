"use client";

import { Button } from "@heroui/react";
import { Trans } from "@lingui/macro";
import { signIn } from "next-auth/react";

export const SigninButton = () => (
  <form
    action={async () => {
      await signIn("google");
    }}
  >
    <Button color="primary" variant="flat" type="submit">
      <Trans>Signin</Trans>
    </Button>
  </form>
);
