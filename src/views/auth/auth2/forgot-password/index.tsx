import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { supabase } from "@/lib/supabase";

const BoxedForgotpwd = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/auth/auth2/reset-password", });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage(
      "If an account exists for that email, a password reset link has been sent."
    );
  };

  return (
    <div className="relative overflow-hidden h-screen bg-muted">
      <div className="flex h-full justify-center items-center px-4">
        <Card className="md:w-112.5 w-full border-none shadow-lg p-6">
          <div className="mx-auto w-fit">
            <FullLogo />
          </div>

          <p className="text-sm font-normal text-muted-foreground">
            Enter the email address associated with your account and we'll
            send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 w-full mt-6">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-normal text-muted-foreground"
              >
                Email*
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-green-600">
                {message}
              </p>
            )}

            <Button
              className="w-full rounded-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Forgot password"}
            </Button>
          </form>

          <Link
            to="/auth/auth2/login"
            className="mt-4 flex w-full items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Back to Login
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default BoxedForgotpwd;
