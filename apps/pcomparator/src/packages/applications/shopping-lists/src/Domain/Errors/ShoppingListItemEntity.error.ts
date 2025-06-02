import { DomainError } from "@deazl/shared";

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(`Business rule violated: ${message}`);
  }
}
