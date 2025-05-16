import { ValueObject } from "~/applications/Shared/Domain/Core/ValueObject";

interface ProductInformationProps {
  name: string;
  price: number;
  unit: string;
  quantity: number;
  brandName?: string;
  storeName?: string;
  storeLocation?: string;
}

export class ProductInformation extends ValueObject<ProductInformationProps> {
  private constructor(props: ProductInformationProps) {
    super(props);
  }

  public static create(props: ProductInformationProps): ProductInformation {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error("Product name must be at least 2 characters long");
    }

    if (props.price <= 0) {
      throw new Error("Price must be greater than zero");
    }

    return new ProductInformation({
      ...props,
      // Valeurs par défaut
      brandName: props.brandName || "Generic",
      storeName: props.storeName || "My Local Store",
      storeLocation: props.storeLocation || "Default Location"
    });
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }

  get unit(): string {
    return this.props.unit;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get brandName(): string {
    return this.props.brandName!;
  }

  get storeName(): string {
    return this.props.storeName!;
  }

  get storeLocation(): string {
    return this.props.storeLocation!;
  }
}
