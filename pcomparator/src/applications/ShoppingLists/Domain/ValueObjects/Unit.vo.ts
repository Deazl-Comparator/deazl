import type { z } from "zod";
import { ValueObject } from "~/applications/Shared/Domain/Core/ValueObject";
import type { UnitSchema } from "~/applications/ShoppingLists/Domain/Schemas/ShoppingListItem.schema";

export enum UnitType {
  UNIT = "unit",
  KG = "kg",
  G = "g",
  L = "l",
  ML = "ml",
  PIECE = "piece"
}

export type UnitPayload = z.infer<typeof UnitSchema>;

interface UnitProps {
  value: UnitType;
}

export class Unit extends ValueObject<UnitProps> {
  private constructor(props: UnitProps) {
    super(props);
  }

  public static create(unit: string): Unit {
    if (!Object.values(UnitType).includes(unit as UnitType)) {
      throw new Error(`Invalid unit: ${unit}`);
    }

    return new Unit({ value: unit as UnitType });
  }

  public get value(): UnitType {
    return this.props.value;
  }

  public isWeightUnit(): boolean {
    return this.props.value === UnitType.KG || this.props.value === UnitType.G;
  }

  public isVolumeUnit(): boolean {
    return this.props.value === UnitType.L || this.props.value === UnitType.ML;
  }

  public isCountUnit(): boolean {
    return this.props.value === UnitType.UNIT || this.props.value === UnitType.PIECE;
  }
}
