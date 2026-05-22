import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-primary">Insignia Wallet</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link to={isAdmin ? "/admin" : "/user"}>Go to Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
