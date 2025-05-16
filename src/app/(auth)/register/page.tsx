
import { RegisterForm } from "@/components/auth/register-form";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <>
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to get started with KarmaHire.
        </CardDescription>
      </CardHeader>
      <RegisterForm />
    </>
  );
}
