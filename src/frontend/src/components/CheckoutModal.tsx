import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Loader2, Package, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePlaceOrder } from "../hooks/useQueries";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type CheckoutStep = "form" | "success" | "error";

interface OrderResult {
  orderId: string;
  rankName: string;
  username: string;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { identity, login } = useInternetIdentity();
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<CheckoutStep>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const placeOrder = usePlaceOrder();

  const isLoggedIn = !!identity;

  const handleClose = () => {
    if (step === "success") {
      setStep("form");
      setUsername("");
      setOrderResult(null);
    }
    onClose();
  };

  const handleConfirm = async () => {
    if (!username.trim() || items.length === 0) return;

    try {
      // Process orders sequentially (one per rank in cart)
      const orderIds: string[] = [];
      for (const item of items) {
        const orderId = await placeOrder.mutateAsync({
          minecraftUsername: username.trim(),
          rankId: item.rank.id,
        });
        orderIds.push(orderId);
      }

      setOrderResult({
        orderId: orderIds[0],
        rankName: items.map((i) => i.rank.name).join(", "),
        username: username.trim(),
      });
      clearCart();
      setStep("success");
    } catch {
      setStep("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DialogHeader>
                <DialogTitle className="font-display font-bold text-xl text-foreground">
                  Complete Your Order
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Enter your Minecraft username to receive your rank.
                </DialogDescription>
              </DialogHeader>

              {!isLoggedIn ? (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center space-y-3">
                  <AlertCircle className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-sm font-body text-foreground">
                    You must be logged in to place an order.
                  </p>
                  <Button
                    onClick={login}
                    className="bg-primary text-primary-foreground font-display font-bold"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {/* Order summary */}
                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-widest">
                      Order Summary
                    </p>
                    <div className="rounded-lg bg-background border border-border p-3 space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.rank.id}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{
                                backgroundColor: item.rank.color,
                                boxShadow: `0 0 6px ${item.rank.color}`,
                              }}
                            />
                            <span
                              className="text-sm font-display font-bold"
                              style={{ color: item.rank.color }}
                            >
                              {item.rank.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            ${item.rank.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <Separator className="bg-border" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-body text-muted-foreground">
                          Total
                        </span>
                        <span className="font-display font-black text-foreground">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Username input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="font-display font-semibold text-foreground"
                    >
                      Minecraft Username
                    </Label>
                    <Input
                      id="username"
                      placeholder="YourMinecraftName"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && username.trim()) {
                          void handleConfirm();
                        }
                      }}
                      className="bg-background border-input font-mono-code"
                      autoComplete="off"
                    />
                    <p className="text-xs text-muted-foreground">
                      Make sure this matches your exact in-game username.
                    </p>
                  </div>

                  <Button
                    onClick={handleConfirm}
                    disabled={!username.trim() || placeOrder.isPending}
                    className="w-full font-display font-bold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                  >
                    {placeOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Purchase"
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === "success" && orderResult && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-display font-black text-xl text-foreground mb-2">
                Order Placed!
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your rank{" "}
                <strong className="text-foreground">
                  {orderResult.rankName}
                </strong>{" "}
                will be applied to{" "}
                <strong className="text-primary font-mono-code">
                  {orderResult.username}
                </strong>
              </p>
              <div className="rounded-lg bg-background border border-border p-3 text-left mb-6">
                <p className="text-xs text-muted-foreground mb-1 font-display">
                  Order ID
                </p>
                <p className="font-mono-code text-xs text-foreground break-all">
                  {orderResult.orderId}
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="w-full font-display font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Package className="mr-2 h-4 w-4" />
                View My Orders
              </Button>
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <h3 className="font-display font-black text-xl text-foreground mb-2">
                Order Failed
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Something went wrong placing your order. Please try again.
              </p>
              <Button
                onClick={() => setStep("form")}
                variant="outline"
                className="w-full font-display font-bold"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
