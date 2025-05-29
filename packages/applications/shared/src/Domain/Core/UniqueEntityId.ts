import { v4 } from "uuid";
import { Identifier } from "~/Domain/Core/Identifier";

export class UniqueEntityID extends Identifier<string> {
  constructor(id?: string) {
    super(id ? id : v4());
  }
}
