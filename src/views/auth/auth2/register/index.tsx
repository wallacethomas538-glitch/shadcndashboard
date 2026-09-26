import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import SocialButtons from "../../authforms/social-buttons";
import { supabase } from "@/lib/supabase";

const BoxedRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate("/");
      return;
    }

    setMessage("Account created. Check your email to confirm your account, then sign in.");
  };

  return (
    <div className="relative overflow-hidden h-screen bg-muted">
      <div className="flex h-full justify-center items-center px-4">
        <Card className="md:w-112.5 w-full border-none shadow-lg p-6">
          <div className="mx-auto w-fit">
            <FullLogo />
          </div>

          <SocialButtons />

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Name*
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                 
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

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
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-normal text-muted-foreground"
                >
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
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-muted-foreground" role="status">
                {message}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-lg"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="flex gap-2 text-base text-muted-foreground font-medium mt-4 items-center justify-center">
            <p>Already have an Account?</p>
            <Link
              to="/auth/auth2/login"
              className="text-primary/80 text-base hover:text-primary font-medium"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BoxedRegister;
