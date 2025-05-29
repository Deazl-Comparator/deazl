import { withLinguiPage } from "~/core/withLinguiLayout";
import { auth } from "~/libraries/nextauth/authConfig";
import { HomeView } from "~/views/Home/HomeView";

const HomePage = async () => {
  const session = await auth();

  return <HomeView isLoggedIn={!!session?.user} userName={session?.user?.name} />;
};

export default withLinguiPage(HomePage);
