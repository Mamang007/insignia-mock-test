import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/context/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/user/")({
  component: UserDashboard,
});

function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card className="bg-primary text-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium opacity-90">
            Current Balance
          </CardTitle>
          <div className="text-4xl font-bold">
            Rp {user?.balance?.toLocaleString() || "0.00"}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button className="h-20 text-lg" variant="outline">
          Top-up
        </Button>
        <Button className="h-20 text-lg" variant="outline">
          Transfer
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Recent Transactions</h3>
        <Card>
          <CardContent className="p-0">
            <div className="p-8 text-center text-gray-500 italic">
              No transactions yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
