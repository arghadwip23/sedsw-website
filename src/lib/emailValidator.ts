// Email validation utilities
export interface EmailValidationResult {
  isValid: boolean;
  message: string;
  details?: string;
}

export class EmailValidator {
  /**
   * Validates if an email address is syntactically valid and plausibly exists
   */
  static async validateEmail(email: string): Promise<EmailValidationResult> {
    try {
      // Basic format validation (RFC 5322 simplified)
      if (!this.isValidEmailFormat(email)) {
        return {
          isValid: false,
          message: "Invalid email format",
          details: "Please enter a valid email address (e.g., name@example.com)"
        };
      }

      // Domain plausibility check placeholder
      if (!this.isValidDomain(email)) {
        return {
          isValid: false,
          message: "Invalid email domain",
          details: "The email domain appears to be invalid"
        };
      }

      // Simulate existence validation (replace with a real service in production)
      const isValid = await this.simulateValidation(email);
      
      if (isValid) {
        return {
          isValid: true,
          message: "Valid email address",
          details: "Email address verified successfully"
        };
      } else {
        return {
          isValid: false,
          message: "Invalid or non-existent email address",
          details: "This email address appears to be invalid or doesn't exist"
        };
      }

    } catch (error) {
      console.error("Email validation error:", error);
      return {
        isValid: false,
        message: "Validation failed",
        details: "Unable to validate email address at this time"
      };
    }
  }

  /**
   * Checks if the email format is valid
   */
  private static isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Basic domain plausibility check
   */
  private static isValidDomain(email: string): boolean {
    const domain = email.split('@')[1];
    // Disallow obviously invalid domains
    if (!domain || domain.startsWith('-') || domain.endsWith('-')) return false;
    if (domain.includes('..')) return false;
    // Allow common TLD patterns (includes .ac.in, .edu, .com, etc.)
    return /\.[a-zA-Z]{2,}$/i.test(domain);
  }

  /**
   * Simulates validation (replace with actual API calls in production)
   */
  private static async simulateValidation(email: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const [localPart] = email.split('@');
      if (localPart.length < 2 || localPart.length > 64) return false;
      const invalidChars = /[<>()[\]\\,;:\s"]/;
      if (invalidChars.test(localPart)) return false;
      if (localPart.includes('..')) return false;
      if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
      return true; // Assume valid for now
    } catch (error) {
      console.error("Email validation simulation error:", error);
      return false;
    }
  }
}
