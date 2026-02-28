import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, User } from "lucide-react";
import { motion } from "motion/react";
import { RankCard } from "../components/RankCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetActiveRanks } from "../hooks/useQueries";

export function RanksPage() {
  const { data: ranks = [], isLoading } = useGetActiveRanks();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  // Sort by tier ascending
  const sortedRanks = [...ranks].sort(
    (a, b) => Number(a.tier) - Number(b.tier),
  );

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <p className="text-xs font-display font-bold uppercase tracking-widest text-primary mb-2">
          Our Packages
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-foreground mb-3">
          Server Ranks
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Unlock exclusive perks, cosmetics, and privileges on our server. All
          ranks are permanent.
        </p>
      </motion.div>

      {/* Login notice */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5"
        >
          <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-display font-semibold text-foreground">
              Login required to purchase
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              You can browse all ranks, but you need to log in to add them to
              your cart and checkout.
            </p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="sm"
            className="shrink-0 font-display font-bold bg-primary text-primary-foreground"
          >
            <User className="mr-2 h-3.5 w-3.5" />
            {isLoggingIn ? "Connecting..." : "Login"}
          </Button>
        </motion.div>
      )}

      {/* Ranks grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {["sk-1", "sk-2", "sk-3", "sk-4"].map((sk) => (
            <div
              key={sk}
              className="rounded-xl border border-border bg-card p-5 space-y-4"
            >
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-24" />
              <div className="space-y-2 mt-4">
                {["p1", "p2", "p3", "p4"].map((p) => (
                  <Skeleton key={p} className="h-4 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : sortedRanks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <p className="font-display font-bold text-xl text-foreground mb-2">
            No ranks available
          </p>
          <p className="text-muted-foreground text-sm max-w-sm">
            Check back soon — new ranks are coming soon to the store.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRanks.map((rank, i) => (
            <RankCard
              key={rank.id}
              rank={rank}
              featured={Number(rank.tier) >= 3}
              delay={i * 0.07}
            />
          ))}
        </div>
      )}
    </main>
  );
}
