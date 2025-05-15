import type { ReactNode } from "react";
import { SignButton } from "~/applications/Authentication/Ui/Signin/SignButton/SignButton";
import { Header } from "~/components/Header/Header";
import { Toast } from "~/components/Toast/Toast";
import { Tabbar } from "~/core/Tabbar";
import { getDevice } from "~/core/getDevice";
import { auth } from "~/libraries/nextauth/authConfig";

export interface ApplicationLayoutProps {
  children: ReactNode;
}

const ApplicationLayout = async ({ children }: ApplicationLayoutProps) => {
  const device = await getDevice();
  const session = await auth();

  return (
    <>
      <Header rightArea={<SignButton />} />
      {children}
      {device === "mobile" ? <Tabbar isSignedIn={!!session?.user} /> : null}
      <Toast />
    </>
  );
};

export default ApplicationLayout;
