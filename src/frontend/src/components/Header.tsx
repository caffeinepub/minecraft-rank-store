import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Shield, ShoppingCart, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export function Header() {
  const { items, toggleCart } = useCart();
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggedIn = !!identity;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Ranks", href: "/ranks" },
    ...(isLoggedIn ? [{ label: "My Orders", href: "/orders" }] : []),
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/generated/minecraft-logo-transparent.dim_300x100.png"
            alt="Minecraft Rank Store"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-body font-medium transition-colors rounded-md ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-md bg-primary/10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {items.length > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                    {items.length}
                  </Badge>
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Admin link - desktop */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex"
            >
              <Link to="/admin" aria-label="Admin panel">
                <Shield className="h-5 w-5 text-rank-elite" />
              </Link>
            </Button>
          )}

          {/* Auth button */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="gap-2 text-muted-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              size="sm"
              className="hidden md:flex gap-2 bg-primary/90 hover:bg-primary text-primary-foreground font-display font-semibold glow-primary"
            >
              <User className="h-4 w-4" />
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                    currentPath === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-1">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="gap-2 w-full justify-start text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn || isInitializing}
                    size="sm"
                    className="w-full gap-2 bg-primary/90 hover:bg-primary text-primary-foreground font-display font-semibold"
                  >
                    <User className="h-4 w-4" />
                    {isLoggingIn ? "Connecting..." : "Login"}
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
