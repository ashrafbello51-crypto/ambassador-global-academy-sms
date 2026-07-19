/**
 * Email Service
 *
 * Pluggable email service for sending notifications.
 * Currently a placeholder — SMTP integration will be added later.
 *
 * Decision: Brain/19_DECISIONS.md TD-014
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  /**
   * Send an email
   *
   * TODO: Implement SMTP integration when email provider is selected.
   * For now, this logs the email to console for development.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async send(_options: EmailOptions): Promise<boolean> {
    // TODO: Replace with actual SMTP implementation
    return true;
  }

  /**
   * Send a password reset email
   */
  static async sendPasswordReset(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    return this.send({
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your School Management System account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
      text: `Password Reset Request\n\nYou requested a password reset.\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    });
  }
}
