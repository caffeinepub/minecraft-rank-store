import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Rank {
    id: string;
    name: string;
    color: string;
    tier: bigint;
    description: string;
    isActive: boolean;
    perks: Array<string>;
    price: number;
}
export interface Order {
    id: string;
    rankName: string;
    status: string;
    owner: Principal;
    minecraftUsername: string;
    timestamp: bigint;
    rankId: string;
    price: number;
}
export interface UserProfile {
    minecraftUsername: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRank(rank: Rank): Promise<void>;
    deleteRank(rankId: string): Promise<void>;
    getActiveRanks(): Promise<Array<Rank>>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: string): Promise<Order | null>;
    getOrdersByUsername(username: string): Promise<Array<Order>>;
    getRank(rankId: string): Promise<Rank | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(minecraftUsername: string, rankId: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
    updateRank(rank: Rank): Promise<void>;
}
