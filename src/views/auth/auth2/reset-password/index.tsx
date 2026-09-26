import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FullLogo from "src/layouts/full/shared/logo/FullLogo";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Your password has been updated successfully.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative overflow-hidden h-screen bg-muted">
      <div className="flex h-full justify-center items-center px-4">
        <Card className="md:w-112.5 w-full border-none shadow-lg p-6">
          <div className="mx-auto w-fit">
            <FullLogo />
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {ready
              ? "Enter your new password below."
              : "Open this page from the password reset email."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 w-full mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!ready || loading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={!ready || loading}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            <Button
              className="w-full rounded-lg"
              type="submit"
              disabled={!ready || loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
