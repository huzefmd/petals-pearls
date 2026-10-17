# Implementation Plan: Ordering System for Petals & Pearls

## Overview
Transition the product catalog from a WhatsApp-redirect model to a fully integrated ordering system with user authentication, cart management, and order persistence using Supabase.

## 1. Database Schema
Create two new tables in Supabase to handle orders and their items.

### `orders` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Unique order ID |
| `user_id` | `uuid` | Foreign Key $\to$ `auth.users.id`, Not Null | The customer who placed the order |
| `total_amount` | `numeric` | Not Null | Total order price |
| `status` | `text` | Default: `'pending'` | `pending`, `confirmed`, `shipped`, `delivered`, `cancelled` |
| `delivery_address` | `text` | Not Null | Full delivery address |
| `delivery_date` | `date` | Not Null | Requested delivery date |
| `delivery_notes` | `text` | Optional | Special instructions for delivery |
| `created_at` | `timestamp` | Default: `now()` | Order placement time |
| `updated_at` | `timestamp` | Default: `now()` | Last update time |

### `order_items` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` | Item unique ID |
| `order_id` | `uuid` | Foreign Key $\to$ `orders.id`, On Delete: `cascade` | Link to parent order |
| `product_id` | `uuid` | Foreign Key $\to$ `products.id` | The product ordered |
| `quantity` | `integer` | Not Null, Default: `1` | Number of units |
| `price_at_time` | `numeric` | Not Null | Price per unit at time of purchase |
| `size` | `text` | Optional | Customization: size (e.g., Medium) |
| `flowers` | `text[]` | Optional | Customization: flower selection |
| `chocolates` | `text[]` | Optional | Customization: chocolate selection |
| `gift_message` | `text` | Optional | Personalized message for this item |

### Row Level Security (RLS)
- **Orders**:
  - `SELECT`: `auth.uid() = user_id` (Users see only their own)
  - `INSERT`: `auth.uid() = user_id` (Users can only create orders for themselves)
  - `UPDATE`: `auth.uid() = user_id` (Users can update pending orders)
  - `Admin`: All operations permitted.
- **Order Items**:
  - `SELECT`: User can see items if they own the parent order.
  - `INSERT`: User can insert items if they own the parent order.
  - `Admin`: All operations permitted.

## 2. Authentication Flow
### Pages & Components
- **`/login`**: Create a new route with a simple email/password form using Supabase Auth.
- **`/signup`**: Create a signup page for new customers.
- **Auth Context**: Implement a global `AuthProvider` or use TanStack Router's context to manage user session state.

### Route Protection
- Use `requireSupabaseAuth` middleware (already existing in `auth-middleware.ts`) for:
  - `/cart`
  - `/checkout`
  - `/orders` (Order history)
- Redirect unauthenticated users to `/login` when accessing these routes.

## 3. Cart Management
### State Management Recommendation: Zustand + LocalStorage
Since the cart needs to persist across refreshes but doesn't necessarily need to be synced across devices immediately (until checkout), Zustand with the `persist` middleware is recommended.

### Customization Handling
The cart state should store items as:
```ts
interface CartItem {
  productId: string;
  quantity: number;
  customizations: {
    size: string;
    flowers: string[];
    chocolates: string[];
    giftMessage: string;
  };
}
```

## 4. Checkout Process
### Sequence
1. **Cart Page (`/cart`)**: Review items, adjust quantities, remove items. Total calculation.
2. **Shipping/Delivery Page (`/checkout`)**: Form to collect:
   - Full Name, Phone Number.
   - Delivery Address.
   - Delivery Date (DatePicker).
   - Delivery Notes.
3. **Confirmation Page (`/checkout/success`)**: Thank you message and order summary.

### Database Write Logic
Use a Supabase **Transaction** (via a RPC function or sequential client calls) to:
1. Insert into `orders` table $\to$ get `order_id`.
2. Map `CartItem`s to `order_items` records and perform a bulk insert using the `order_id`.
3. Clear the local cart state upon success.

## 5. UI/UX Changes
### Navigation (`SiteLayout.tsx`)
- Add a **Cart Icon** with a badge showing the item count in the header.
- Add a **User Profile/Login** link (toggle between "Login" and "My Orders" based on auth state).

### Product Interaction
- **`ProductCard.tsx`**: Add a "Quick Add" button or a link to the product page.
- **`product.$slug.tsx`**: Replace "Order on WhatsApp" (or add alongside it) an "Add to Cart" button that triggers the Zustand store action.

### New Routes (`src/routes/`)
- `login.tsx`
- `signup.tsx`
- `cart.tsx`
- `checkout.tsx`
- `orders.tsx` (User order history)
- `checkout.success.tsx`

## 6. Verification Plan
1. **Auth Test**: Verify a user can sign up, log in, and is redirected to the home page.
2. **Cart Test**: Add multiple products with different customizations; verify local persistence after page reload.
3. **Checkout Test**: Complete the checkout flow and verify:
   - Data is correctly written to `orders` and `order_items` in Supabase.
   - Cart is cleared after order.
4. **History Test**: Log in and verify that the `/orders` page displays the correct previous orders.
5. **RLS Test**: Try to access another user's order ID via URL/API to ensure 403 Forbidden.
