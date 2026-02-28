import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Package, ShoppingCart, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export function CartDrawer() {
  const { items, removeItem, clearCart, total, isOpen, closeCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col border-l border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1">
              <div className="p-5 space-y-3">
                <AnimatePresence initial={false}>
                  {items.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-display font-semibold text-foreground mb-1">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Browse ranks and add them to your cart
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={closeCart}
                        asChild
                      >
                        <a href="/ranks">Browse Ranks</a>
                      </Button>
                    </motion.div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.rank.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background border"
                        style={{ borderColor: `${item.rank.color}33` }}
                      >
                        {/* Color dot */}
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: item.rank.color,
                            boxShadow: `0 0 8px ${item.rank.color}`,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-display font-bold text-sm truncate"
                            style={{ color: item.rank.color }}
                          >
                            {item.rank.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.rank.perks.length} perks included
                          </p>
                        </div>
                        <span className="font-display font-bold text-sm text-foreground shrink-0">
                          ${item.rank.price.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.rank.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <Separator className="bg-border" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-body">Total</span>
                  <span className="font-display font-black text-2xl text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    closeCart();
                    setCheckoutOpen(true);
                  }}
                  className="w-full font-display font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="w-full text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
