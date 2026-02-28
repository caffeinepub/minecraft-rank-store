import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetOrdersByUsername } from "../hooks/useQueries";

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  if (lower === "completed" || lower === "delivered") {
    return (
      <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
        <CheckCircle className="h-3 w-3" />
        {status}
      </Badge>
    );
  }
  if (lower === "pending" || lower === "processing") {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 gap-1">
        <Clock className="h-3 w-3" />
        {status}
      </Badge>
    );
  }
  if (lower === "failed" || lower === "cancelled" || lower === "canceled") {
    return (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
        <XCircle className="h-3 w-3" />
        {status}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <Package className="h-3 w-3" />
      {status}
    </Badge>
  );
}

function formatTimestamp(ts: bigint): string {
  // ICP timestamps are in nanoseconds
  const ms = Number(ts) / 1_000_000;
  if (Number.isNaN(ms) || ms === 0) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const [searchInput, setSearchInput] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");

  const isLoggedIn = !!identity;

  const {
    data: orders = [],
    isLoading,
    isFetching,
  } = useGetOrdersByUsername(searchedUsername);

  const handleSearch = () => {
    setSearchedUsername(searchInput.trim());
  };

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display font-black text-2xl text-foreground mb-2">
            Login Required
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            You need to log in to view your order history.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="font-display font-bold bg-primary text-primary-foreground glow-primary"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-display font-bold uppercase tracking-widest text-primary mb-2">
          Purchase History
        </p>
        <h1 className="font-display font-black text-4xl text-foreground mb-3">
          My Orders
        </h1>
        <p className="text-muted-foreground">
          Search your orders by Minecraft username.
        </p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8 max-w-md"
      >
        <Input
          placeholder="Enter your Minecraft username..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          className="bg-card border-border font-mono-code"
        />
        <Button
          onClick={handleSearch}
          disabled={!searchInput.trim() || isFetching}
          className="font-display font-semibold bg-primary text-primary-foreground shrink-0"
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Results */}
      {!searchedUsername ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-foreground mb-1">
            Search your orders
          </p>
          <p className="text-sm">
            Enter your Minecraft username above to see your purchase history.
          </p>
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {["sk-1", "sk-2", "sk-3"].map((sk) => (
            <Skeleton key={sk} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display font-bold text-foreground mb-1">
            No orders found
          </p>
          <p className="text-sm text-muted-foreground">
            No orders found for{" "}
            <span className="font-mono-code text-foreground">
              {searchedUsername}
            </span>
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-muted-foreground mb-3">
            Found <strong className="text-foreground">{orders.length}</strong>{" "}
            order{orders.length !== 1 ? "s" : ""} for{" "}
            <span className="font-mono-code text-primary">
              {searchedUsername}
            </span>
          </p>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display font-bold text-foreground">
                      {order.rankName}
                    </p>
                    <p className="text-xs font-mono-code text-muted-foreground mt-0.5 truncate max-w-[180px]">
                      {order.id}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {formatTimestamp(order.timestamp)}
                  </span>
                  <span className="font-display font-bold text-foreground">
                    ${order.price.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-card hover:bg-card">
                  <TableHead className="font-display font-bold text-muted-foreground">
                    Rank
                  </TableHead>
                  <TableHead className="font-display font-bold text-muted-foreground">
                    Order ID
                  </TableHead>
                  <TableHead className="font-display font-bold text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="font-display font-bold text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-display font-bold text-muted-foreground text-right">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-border hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="font-display font-bold text-foreground">
                      {order.rankName}
                    </TableCell>
                    <TableCell className="font-mono-code text-xs text-muted-foreground max-w-[160px] truncate">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatTimestamp(order.timestamp)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-display font-bold text-foreground">
                      ${order.price.toFixed(2)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </main>
  );
}
