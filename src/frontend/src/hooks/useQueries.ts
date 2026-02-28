import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Rank, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

// ── Read Queries ──────────────────────────────────────────────────────────────

export function useGetActiveRanks() {
  const { actor, isFetching } = useActor();
  return useQuery<Rank[]>({
    queryKey: ["activeRanks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveRanks();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersByUsername(username: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["ordersByUsername", username],
    queryFn: async () => {
      if (!actor || !username) return [];
      return actor.getOrdersByUsername(username);
    },
    enabled: !!actor && !isFetching && !!username,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      minecraftUsername,
      rankId,
    }: {
      minecraftUsername: string;
      rankId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(minecraftUsername, rankId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ordersByUsername"] });
      void queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useCreateRank() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rank: Rank) => {
      if (!actor) throw new Error("Not connected");
      return actor.createRank(rank);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activeRanks"] });
    },
  });
}

export function useUpdateRank() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rank: Rank) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRank(rank);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activeRanks"] });
    },
  });
}

export function useDeleteRank() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rankId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRank(rankId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activeRanks"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      void queryClient.invalidateQueries({ queryKey: ["ordersByUsername"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}
