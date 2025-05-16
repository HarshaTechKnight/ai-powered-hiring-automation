
import { LoginForm } from "@/components/auth/login-form";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card"; // Re-add if Card is used around LoginForm

export default function LoginPage() {
  return (
    <>
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Sign In</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </>
  );
}
