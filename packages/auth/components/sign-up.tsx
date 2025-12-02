import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const SignUp = () => (
  <ClerkSignUp
    appearance={{
      elements: {
        // header: "hidden",
        // // Hide email/password form, only show social buttons
        // form: "hidden",
        // formFieldInput: "hidden",
        // formButtonPrimary: "hidden",
        // dividerRow: "hidden",
        // footer: "hidden",
        // footerPage: "hidden",
      },
    }}
  />
);
