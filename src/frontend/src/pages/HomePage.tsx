import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Shield,
  Star,
  Sword,
} from "lucide-react";
import { motion } from "motion/react";
import { RankCard } from "../components/RankCard";
import { useGetActiveRanks } from "../hooks/useQueries";

const FEATURE_ITEMS = [
  {
    icon: Sword,
    title: "Instant Activation",
    description: "Rank applied within minutes of purchase on our server.",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "Powered by blockchain-grade Internet Identity auth.",
  },
  {
    icon: Star,
    title: "Exclusive Perks",
    description: "Unique commands, cosmetics, and priority queue access.",
  },
  {
    icon: Crown,
    title: "Lifetime Access",
    description: "Your rank never expires — play at your own pace.",
  },
];

export function HomePage() {
  const { data: ranks = [], isLoading } = useGetActiveRanks();

  // Show top 4 by tier descending
  const featuredRanks = [...ranks]
    .sort((a, b) => Number(b.tier) - Number(a.tier))
    .slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
        </div>

        {/* Scanlines overlay */}
        <div className="absolute inset-0 z-0 scanlines opacity-30" />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-primary mb-4 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              Server is ONLINE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4"
            >
              Upgrade Your
              <br />
              <span className="text-primary text-glow-green">Minecraft</span>
              <br />
              Experience
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
            >
              Choose a rank and unlock exclusive perks on our server. Instant
              activation, lifetime access.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="font-display font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-base glow-primary px-6"
              >
                <Link to="/ranks">
                  Browse Ranks
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-display font-bold gap-2 text-base border-border/70 hover:border-primary/50"
              >
                <Link to="/orders">My Orders</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Ranks */}
      <section className="py-8 pb-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-widest text-primary mb-2">
              Available Ranks
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground">
              Choose Your Rank
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start md:self-auto font-display font-semibold gap-2"
          >
            <Link to="/ranks">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        ) : featuredRanks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-display font-semibold">
              No ranks available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRanks.map((rank, i) => (
              <RankCard
                key={rank.id}
                rank={rank}
                featured={Number(rank.tier) >= 3}
                delay={i * 0.08}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
