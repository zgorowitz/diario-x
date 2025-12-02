import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export const SignIn = () => (
  <ClerkSignIn
    appearance={{
      elements: {
        header: "hidden",
        // Hide email/password form, only show social buttons
        form: "hidden",
        formFieldInput: "hidden",
        formButtonPrimary: "hidden",
        dividerRow: "hidden",
        footer: "hidden",
        footerPage: "hidden",
      },
    }}
  />
);
