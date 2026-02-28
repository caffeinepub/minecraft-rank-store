import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  /// ADMIN ACCESS & USER PROFILES ///
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    minecraftUsername : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// RANK MANAGEMENT ///
  public type Rank = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    perks : [Text];
    color : Text;
    tier : Nat;
    isActive : Bool;
  };

  module Rank {
    public func compareByTier(a : Rank, b : Rank) : Order.Order {
      Nat.compare(a.tier, b.tier);
    };

    public func compareByPrice(a : Rank, b : Rank) : Order.Order {
      Float.compare(a.price, b.price);
    };
  };

  let ranks = Map.empty<Text, Rank>();

  public query ({ caller }) func getActiveRanks() : async [Rank] {
    let activeRanks = List.empty<Rank>();
    for (rank in ranks.values()) {
      if (rank.isActive) {
        activeRanks.add(rank);
      };
    };
    activeRanks.toArray().sort(Rank.compareByTier);
  };

  public shared ({ caller }) func createRank(rank : Rank) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create ranks");
    };
    ranks.add(rank.id, rank);
  };

  public shared ({ caller }) func updateRank(rank : Rank) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update ranks");
    };
    ranks.add(rank.id, rank);
  };

  public shared ({ caller }) func deleteRank(rankId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete ranks");
    };
    ranks.remove(rankId);
  };

  public query ({ caller }) func getRank(rankId : Text) : async ?Rank {
    ranks.get(rankId);
  };

  /// ORDER MANAGEMENT ///
  public type Order = {
    id : Text;
    minecraftUsername : Text;
    rankId : Text;
    rankName : Text;
    price : Float;
    timestamp : Int;
    status : Text;
    owner : Principal;
  };

  let orders = Map.empty<Text, Order>();

  public query ({ caller }) func getOrdersByUsername(username : Text) : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    // Users can only view their own orders unless they are admin
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let callerProfile = userProfiles.get(caller);

    let userOrders = List.empty<Order>();
    for (order in orders.values()) {
      if (order.minecraftUsername == username) {
        // Allow if admin OR if the username matches caller's profile
        let canView = isAdmin or (switch (callerProfile) {
          case (?profile) { profile.minecraftUsername == username };
          case (null) { false };
        });

        if (canView) {
          userOrders.add(order);
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };

    userOrders.toArray();
  };

  public shared ({ caller }) func placeOrder(minecraftUsername : Text, rankId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let rank = switch (ranks.get(rankId)) {
      case (null) { Runtime.trap("Rank not found") };
      case (?found) { found };
    };

    let orderId = minecraftUsername.concat("/").concat(orders.size().toText());
    let order : Order = {
      id = orderId;
      minecraftUsername;
      rankId = rank.id;
      rankName = rank.name;
      price = rank.price;
      timestamp = Int.fromNat(orders.size());
      status = "pending";
      owner = caller;
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let order = orders.get(orderId);

    switch (order) {
      case (?foundOrder) {
        // Allow if admin or owner of the order
        if (AccessControl.isAdmin(accessControlState, caller) or foundOrder.owner == caller) {
          ?foundOrder;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?found) { found };
    };

    let updatedOrder : Order = {
      id = order.id;
      minecraftUsername = order.minecraftUsername;
      rankId = order.rankId;
      rankName = order.rankName;
      price = order.price;
      timestamp = order.timestamp;
      status;
      owner = order.owner;
    };

    orders.add(orderId, updatedOrder);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  /// INITIALIZATION ///
  system func preupgrade() {};
  system func postupgrade<system>() {
    seedRanks();
  };

  func seedRanks() {
    let exampleRanks = List.empty<Rank>();

    exampleRanks.add({
      id = "vip";
      name = "VIP";
      description = "Entry-level rank with cool perks";
      price = 4.99;
      perks = ["Colored chat", "Exclusive prefix", "Pet access"];
      color = "cyan";
      tier = 1;
      isActive = true;
    });

    exampleRanks.add({
      id = "mvp";
      name = "MVP";
      description = "Mid-tier rank with bonus features";
      price = 9.99;
      perks = ["VIP perks", "Fly access", "Vanity commands"];
      color = "blue";
      tier = 2;
      isActive = true;
    });

    exampleRanks.add({
      id = "elite";
      name = "Elite";
      description = "High-tier with special privileges";
      price = 19.99;
      perks = ["MVP perks", "Custom cosmetics", "Priority support"];
      color = "purple";
      tier = 3;
      isActive = true;
    });

    exampleRanks.add({
      id = "legend";
      name = "Legend";
      description = "Top-tier premium rank";
      price = 34.99;
      perks = ["Elite perks", "Unique tags", "Exclusive events"];
      color = "gold";
      tier = 4;
      isActive = true;
    });

    for (exampleRank in exampleRanks.values()) {
      ranks.add(exampleRank.id, exampleRank);
    };
  };
};
