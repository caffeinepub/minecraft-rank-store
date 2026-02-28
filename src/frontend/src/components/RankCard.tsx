import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Minus,
  Shield,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { Rank } from "../backend.d";
import { useCart } from "../contexts/CartContext";
import { getBorderGlowStyle } from "../utils/rankColors";

interface RankCardProps {
  rank: Rank;
  featured?: boolean;
  delay?: number;
}

function TierIcon({ tier }: { tier: bigint }) {
  const t = Number(tier);
  if (t >= 4) return <Crown className="h-4 w-4" />;
  if (t === 3) return <Star className="h-4 w-4" />;
  if (t === 2) return <Zap className="h-4 w-4" />;
  return <Shield className="h-4 w-4" />;
}

function TierLabel({ tier }: { tier: bigint }) {
  const t = Number(tier);
  if (t >= 4) return "LEGEND";
  if (t === 3) return "ELITE";
  if (t === 2) return "MVP";
  return "VIP";
}

export function RankCard({ rank, featured = false, delay = 0 }: RankCardProps) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(rank.id);

  const handleCartToggle = () => {
    if (inCart) {
      removeItem(rank.id);
    } else {
      addItem(rank);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative rounded-xl overflow-hidden ${featured ? "ring-2" : ""}`}
      style={featured ? { borderColor: rank.color } : {}}
    >
      {/* Card background */}
      <div
        className="h-full flex flex-col bg-card border rounded-xl overflow-hidden transition-all duration-300"
        style={{
          borderColor: `${rank.color}44`,
          boxShadow: inCart
            ? `0 0 20px ${rank.color}55, 0 0 40px ${rank.color}22`
            : "0 4px 24px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* Colored header strip */}
        <div
          className="px-5 pt-5 pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${rank.color}22 0%, transparent 60%)`,
            borderBottom: `1px solid ${rank.color}33`,
          }}
        >
          {/* Tier badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-display font-bold px-2.5 py-1 rounded-full"
              style={{
                color: rank.color,
                background: `${rank.color}22`,
                border: `1px solid ${rank.color}44`,
              }}
            >
              <TierIcon tier={rank.tier} />
              <TierLabel tier={rank.tier} />
            </span>
            {featured && (
              <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                Popular
              </Badge>
            )}
          </div>

          {/* Rank name */}
          <h3
            className="text-2xl font-display font-extrabold tracking-tight"
            style={{ color: rank.color }}
          >
            {rank.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-display font-black text-foreground">
              ${rank.price.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">USD</span>
          </div>
        </div>

        {/* Description */}
        <div className="px-5 py-4 flex-1 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {rank.description}
          </p>

          {/* Perks list */}
          <ul className="space-y-2 flex-1">
            {rank.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm">
                <Check
                  className="h-4 w-4 mt-0.5 shrink-0"
                  style={{ color: rank.color }}
                />
                <span className="text-foreground/80">{perk}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            onClick={handleCartToggle}
            className="w-full font-display font-bold transition-all duration-200 mt-2"
            style={
              inCart
                ? {
                    background: `${rank.color}22`,
                    borderColor: rank.color,
                    color: rank.color,
                  }
                : {
                    background: rank.color,
                    color: "#0a0a0a",
                    border: "none",
                    boxShadow: `0 0 12px ${rank.color}55`,
                  }
            }
            variant={inCart ? "outline" : "default"}
          >
            {inCart ? (
              <>
                <Minus className="mr-2 h-4 w-4" />
                Remove from Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
