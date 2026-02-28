# Minecraft Rank Store

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A Minecraft rank store website where players can browse and purchase server ranks
- Homepage with store branding, hero section, and featured ranks
- Ranks listing page displaying all available ranks with names, descriptions, prices, and perks/features
- Individual rank cards showing rank tier (e.g. VIP, MVP, Elite, Legend), price, and included perks
- Shopping cart to add ranks and review selections
- Checkout form to collect Minecraft username and payment info (mock/demo checkout flow)
- Admin panel to manage ranks (add, edit, delete ranks with name, description, price, perks list)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Motoko canister to store rank data (id, name, description, price, perks, color/tier), orders (username, rank purchased, timestamp), and admin CRUD for ranks
2. Seed backend with sample ranks: VIP, MVP, Elite, Legend with tiered pricing
3. Frontend: Landing/hero page with store name and call-to-action
4. Frontend: Ranks grid page with rank cards (name, price, perks, buy button)
5. Frontend: Cart sidebar or modal to review selections
6. Frontend: Checkout form (Minecraft username input, confirm purchase)
7. Frontend: Admin page to manage ranks (protected by simple admin check)
8. Navigation: Header with store logo, nav links (Home, Ranks, Cart)
