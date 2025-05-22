import { Trans } from "@lingui/macro";
import Balancer from "react-wrap-balancer";
import { NewPriceButton } from "~/applications/Prices/Ui/NewPrice/NewPriceButton";
import { Searchbar } from "~/applications/Searchbar/Ui/Searchbar";
import { withLinguiPage } from "~/core/withLinguiLayout";
import { auth } from "~/libraries/nextauth/authConfig";

const HomePage = async () => {
  const session = await auth();

  return (
    <main className="relative flex flex-1 w-full flex-col items-center justify-center px-4 py-32">
      {session?.user ? (
        <div className="flex flex-col items-center max-w-2xl w-full">
          <h1 className="text-center font-display mb-6 text-3xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-4xl md:leading-[5rem]">
            <Trans>Hello {session.user.name}</Trans>
          </h1>
          <Searchbar startContent={<NewPriceButton />} />
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-2xl">
          <h1 className="text-center font-display text-5xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]">
            <Balancer>
              <Trans>Deazl Compare prices of many products</Trans>
            </Balancer>
          </h1>
          <p className="mt-6 text-center text-gray-500 dark:text-gray-300 md:text-xl">
            <Balancer>
              <Trans>Deazl is the price comparator for foods, cosmetic and more</Trans>
            </Balancer>
          </p>
        </div>
      )}
    </main>
  );
};

export default withLinguiPage(HomePage);
