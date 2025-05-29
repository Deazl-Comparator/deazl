import { DomainError } from "~/Shared/Domain/Core/DomainError";

export class UserNotAuthenticated extends DomainError {
  constructor() {
    super("User not authenticated");
  }
}
