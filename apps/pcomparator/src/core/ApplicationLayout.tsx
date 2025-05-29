import type { ReactNode } from "react";
import { SignButton } from "~/applications/Authentication/Ui/Signin/SignButton/SignButton";
import { DesktopNav } from "~/components/DesktopNav";
import { Footer } from "~/components/Footer/Footer";
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
      <div className="flex">
        {device !== "mobile" && !!session?.user && <DesktopNav />}
        <main className="flex-1">{children}</main>
      </div>
      {device === "mobile" ? <Tabbar isSignedIn={!!session?.user} /> : null}
      {!session?.user && <Footer />}
      <Toast />
    </>
  );
};

export default ApplicationLayout;
