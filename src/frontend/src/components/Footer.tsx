import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/minecraft-logo-transparent.dim_300x100.png"
              alt="Rank Store"
              className="h-8 w-auto"
            />
          </div>
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <p>
              © {year}. Built with{" "}
              <Heart className="inline h-3.5 w-3.5 text-destructive fill-destructive" />{" "}
              using{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <a
              href="/ranks"
              className="hover:text-foreground transition-colors"
            >
              Ranks
            </a>
            <a
              href="/orders"
              className="hover:text-foreground transition-colors"
            >
              Orders
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
