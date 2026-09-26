import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import SocialButtons from "../../authforms/social-buttons";
import { supabase } from "@/lib/supabase";

const BoxedLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent px-4">
      <Card className="w-full max-w-md border-none shadow-lg p-6">
        <div className="mx-auto w-fit">
          <FullLogo />
        </div>

        <SocialButtons />

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-normal text-muted-foreground">
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-normal text-muted-foreground">
                Password*
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Checkbox id="remember" className="cursor-pointer" />
                <Label
                  htmlFor="remember"
                  className="text-muted-foreground font-normal cursor-pointer leading-0"
                >
                  Remember this device
                </Label>
              </div>

              <Link
                to="/auth/auth2/forgot-password"
                className="text-sm font-medium hover:underline underline-offset-4 transition-all"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-lg"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="flex gap-2 text-base font-medium mt-4 items-center justify-center">
          <p className="text-muted-foreground">New to VektorFlow?</p>
          <Link
            to="/auth/auth2/register"
            className="text-primary/80 hover:text-primary text-sm font-medium"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default BoxedLogin;
