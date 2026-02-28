import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, Rank } from "../backend.d";
import {
  useCreateRank,
  useDeleteRank,
  useGetActiveRanks,
  useGetAllOrders,
  useIsCallerAdmin,
  useUpdateOrderStatus,
  useUpdateRank,
} from "../hooks/useQueries";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "completed",
  "cancelled",
  "delivered",
];

const DEFAULT_RANK: Omit<Rank, "id"> = {
  name: "",
  description: "",
  color: "#22c55e",
  tier: BigInt(1),
  price: 9.99,
  perks: [],
  isActive: true,
};

function RankFormModal({
  open,
  onClose,
  editRank,
}: {
  open: boolean;
  onClose: () => void;
  editRank?: Rank | null;
}) {
  const isEdit = !!editRank;
  const [form, setForm] = useState<Rank>(
    editRank ?? { id: crypto.randomUUID(), ...DEFAULT_RANK },
  );
  const [perksInput, setPerksInput] = useState<string>(
    editRank ? editRank.perks.join("\n") : "",
  );

  const createRank = useCreateRank();
  const updateRank = useUpdateRank();

  const isPending = createRank.isPending || updateRank.isPending;

  const handleSave = async () => {
    const perks = perksInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    const rankToSave: Rank = { ...form, perks };

    try {
      if (isEdit) {
        await updateRank.mutateAsync(rankToSave);
        toast.success(`Rank "${rankToSave.name}" updated!`);
      } else {
        await createRank.mutateAsync(rankToSave);
        toast.success(`Rank "${rankToSave.name}" created!`);
      }
      onClose();
    } catch {
      toast.error("Failed to save rank. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            {isEdit ? "Edit Rank" : "Create New Rank"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Modify rank details below."
              : "Fill in the details for the new rank."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-display font-semibold text-sm">Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. VIP"
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-display font-semibold text-sm">
                Price (USD)
              </Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                min={0}
                step={0.01}
                className="bg-background border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-display font-semibold text-sm">
                Tier (sort order)
              </Label>
              <Input
                type="number"
                value={Number(form.tier)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tier: BigInt(Number.parseInt(e.target.value) || 1),
                  }))
                }
                min={1}
                max={10}
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-display font-semibold text-sm">
                Color (hex)
              </Label>
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded-md border border-border shrink-0"
                  style={{ backgroundColor: form.color }}
                />
                <Input
                  value={form.color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                  placeholder="#22c55e"
                  className="bg-background border-input font-mono-code"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-display font-semibold text-sm">
              Description
            </Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe what this rank offers..."
              className="bg-background border-input min-h-[80px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-display font-semibold text-sm">
              Perks{" "}
              <span className="text-muted-foreground font-normal">
                (one per line)
              </span>
            </Label>
            <Textarea
              value={perksInput}
              onChange={(e) => setPerksInput(e.target.value)}
              placeholder={
                "Access to /fly command\n2x XP multiplier\nCustom chat prefix\nExclusive kit"
              }
              className="bg-background border-input min-h-[100px] font-mono-code text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            />
            <Label
              htmlFor="isActive"
              className="font-display font-semibold text-sm cursor-pointer"
            >
              Active (visible in store)
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isPending || !form.name.trim()}
              className="flex-1 font-display font-bold bg-primary text-primary-foreground"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isEdit ? "Save Changes" : "Create Rank"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="font-display font-semibold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrderStatusCell({ order }: { order: Order }) {
  const [editing, setEditing] = useState(false);
  const updateOrderStatus = useUpdateOrderStatus();

  const handleChange = async (status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId: order.id, status });
      toast.success("Order status updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Select defaultValue={order.status} onValueChange={handleChange}>
          <SelectTrigger className="h-8 w-36 bg-background text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="text-sm capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setEditing(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 group text-sm capitalize text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="capitalize">{order.status}</span>
      <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
    </button>
  );
}

export function AdminPage() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: ranks = [], isLoading: ranksLoading } = useGetActiveRanks();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
  const deleteRank = useDeleteRank();

  const [formOpen, setFormOpen] = useState(false);
  const [editRank, setEditRank] = useState<Rank | null>(null);

  const handleDelete = async (rankId: string, rankName: string) => {
    if (!confirm(`Delete rank "${rankName}"? This cannot be undone.`)) return;
    try {
      await deleteRank.mutateAsync(rankId);
      toast.success(`Rank "${rankName}" deleted`);
    } catch {
      toast.error("Failed to delete rank");
    }
  };

  const openCreate = () => {
    setEditRank(null);
    setFormOpen(true);
  };

  const openEdit = (rank: Rank) => {
    setEditRank(rank);
    setFormOpen(true);
  };

  if (checkingAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-display font-black text-2xl text-foreground mb-2">
          Access Denied
        </h1>
        <p className="text-muted-foreground">
          You don't have admin permissions to access this page.
        </p>
      </main>
    );
  }

  const sortedRanks = [...ranks].sort(
    (a, b) => Number(a.tier) - Number(b.tier),
  );
  const sortedOrders = [...orders].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <Shield className="h-5 w-5 text-rank-elite" />
          <p className="text-xs font-display font-bold uppercase tracking-widest text-rank-elite">
            Admin Panel
          </p>
        </div>
        <h1 className="font-display font-black text-4xl text-foreground">
          Server Management
        </h1>
      </motion.div>

      <Tabs defaultValue="ranks">
        <TabsList className="bg-card border border-border mb-6">
          <TabsTrigger
            value="ranks"
            className="font-display font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Ranks ({ranks.length})
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="font-display font-semibold data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            Orders ({orders.length})
          </TabsTrigger>
        </TabsList>

        {/* ── Ranks Tab ── */}
        <TabsContent value="ranks">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {ranks.length} rank{ranks.length !== 1 ? "s" : ""} configured
            </p>
            <Button
              onClick={openCreate}
              className="font-display font-bold bg-primary text-primary-foreground gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Rank
            </Button>
          </div>

          {ranksLoading ? (
            <div className="space-y-2">
              {["sk-1", "sk-2", "sk-3"].map((sk) => (
                <Skeleton key={sk} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : sortedRanks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="font-display font-semibold text-foreground mb-1">
                No ranks yet
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first rank to get started.
              </p>
              <Button
                onClick={openCreate}
                variant="outline"
                className="font-display font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Rank
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-card hover:bg-card">
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Tier
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Perks
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Active
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRanks.map((rank) => (
                    <TableRow
                      key={rank.id}
                      className="border-border hover:bg-accent/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor: rank.color,
                              boxShadow: `0 0 6px ${rank.color}`,
                            }}
                          />
                          <span
                            className="font-display font-bold"
                            style={{ color: rank.color }}
                          >
                            {rank.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {Number(rank.tier)}
                      </TableCell>
                      <TableCell className="font-display font-bold text-foreground">
                        ${rank.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {rank.perks.length} perks
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rank.isActive ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(rank)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              void handleDelete(rank.id, rank.name)
                            }
                            disabled={deleteRank.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Orders Tab ── */}
        <TabsContent value="orders">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}. Click
              a status to change it.
            </p>
          </div>

          {ordersLoading ? (
            <div className="space-y-2">
              {["sk-1", "sk-2", "sk-3", "sk-4"].map((sk) => (
                <Skeleton key={sk} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <p className="font-display font-semibold text-foreground mb-1">
                No orders yet
              </p>
              <p className="text-sm text-muted-foreground">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-card hover:bg-card">
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Username
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Rank
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Order ID
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Price
                    </TableHead>
                    <TableHead className="font-display font-bold text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-border hover:bg-accent/30"
                    >
                      <TableCell className="font-mono-code text-sm text-foreground font-semibold">
                        {order.minecraftUsername}
                      </TableCell>
                      <TableCell className="font-display font-bold text-foreground">
                        {order.rankName}
                      </TableCell>
                      <TableCell className="font-mono-code text-xs text-muted-foreground max-w-[140px] truncate">
                        {order.id}
                      </TableCell>
                      <TableCell className="font-display font-bold text-foreground">
                        ${order.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusCell order={order} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Rank Form Modal */}
      <RankFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editRank={editRank}
      />
    </main>
  );
}
