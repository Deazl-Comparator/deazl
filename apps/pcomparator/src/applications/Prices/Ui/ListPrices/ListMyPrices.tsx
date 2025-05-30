import { listUserPrices } from "~/applications/Prices/Api/listUserPrices";
import { CardPrice } from "~/applications/Prices/Ui/ListPrices/CardPrice/CardPrice";

export const ListMyPrices = async () => {
  const prices = await listUserPrices();

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
      {prices ? prices.map((price) => <CardPrice key={price.priceId} {...price} />) : <p>No prices</p>}
    </div>
  );
};
