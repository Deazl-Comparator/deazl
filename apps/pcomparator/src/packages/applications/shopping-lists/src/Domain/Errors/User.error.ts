import { DomainError } from "@deazl/shared";

export class UserNotAuthenticated extends DomainError {
  constructor() {
    super("User not authenticated");
  }
}
