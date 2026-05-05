const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DIGITS_ONLY_PATTERN = /^\d+$/;

export function isValidEmail(email: string): boolean {
    return EMAIL_PATTERN.test(email);
}
