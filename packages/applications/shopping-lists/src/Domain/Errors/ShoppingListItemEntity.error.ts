import { DomainError } from "~/Shared/Domain/Core/DomainError";

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(`Business rule violated: ${message}`);
  }
}
