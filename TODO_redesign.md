# IMS Frontend Redesign - Master Plan

## Information Gathered

### Current Tech Stack
- React 19 + Vite + MUI v6 + Recharts + Apollo Client + React Router v7
- Dark theme with purple accent (#8e24aa, #6a1b9a, #4a148c)
- Role-based access: Admin, Sales, User

### Current Pages & Components
| File | Current State |
|------|--------------|
| `LandingPage.jsx` | Basic hero + 3 features + CTA + brands + footer |
| `Login.jsx` | Simple centered form, minimal styling |
| `Register.jsx` | Simple centered form, minimal styling |
| `AdminDashboard.jsx` | KPI cards + AreaChart + BarChart + PieChart + LowStock table + Recent Users + Quick Actions |
| `SalesDashboard.jsx` | Target progress + Quick Actions + BarChart + Recent Sales |
| `Dashboard.jsx` (User) | Search + Stats + PieChart + Featured Products + Suppliers Directory |
| `Products.jsx` | Create form + DataGrid table + Edit modal |
| `Sales.jsx` | Create sale form + DataGrid |
| `Purchases.jsx` | Stats card + Recent Purchases table + Create dialog |
| `Suppliers.jsx` | Create form + DataGrid |
| `Users.jsx` | DataGrid with edit/delete/add dialogs |
| `Reports.jsx` | Report export buttons in cards |
| `Analytics.jsx` | Comprehensive charts (already well-designed) |
| `Navbar.jsx` | Simple AppBar with logout |
| `Sidebar.jsx` | Permanent drawer with menu items |
| `Topbar.jsx` | Breadcrumbs + page title + last updated |

### Strengths to Keep
- Purple dark theme is consistent
- Recharts already implemented
- Analytics page is feature-rich
- Apollo GraphQL integration is solid
- Protected routes working

### Weaknesses to Fix
- LandingPage lacks visual impact and content depth
- Login/Register are too plain
- No image slideshows or carousels anywhere
- Hover effects are minimal (only basic translateY)
- Admin dashboard missing deep analytics
- No animated counters, no scroll animations
- Sidebar is static, no collapse, no active indicators
- Navbar lacks notifications, search, profile menu
- Pages feel sparse - need more sections and content
- No loading shimmer beyond SkeletonLoader
- No toast/notification system beyond react-hot-toast

---

## Plan: Complete Redesign

### Phase 1: Foundation & Shared Components

#### 1.1 `theme.js` - Enhanced Theme
- Add extended purple palette (50-900 shades)
- Add success/warning/error color variants
- Typography: h1-h6 overrides with tighter letter-spacing
- MuiButton overrides: border-radius 12px, text-transform none
- MuiCard overrides: border-radius 16px, background rgba(26,26,26,0.95)
- MuiTextField overrides: filled variant styling
- Add backdrop blur support

#### 1.2 `styles/global.css` - Global Animations & Utilities
- Smooth scroll behavior
- Custom scrollbar (purple tinted)
- Keyframe animations: fadeInUp, fadeIn, slideInLeft, pulse, float
- Hover utility classes for cards (lift + glow)
- Gradient text utility
- Glassmorphism utility class

#### 1.3 `styles/layout.css` - Responsive Improvements
- Sidebar collapse state support
- Mobile overlay drawer
- Content area padding adjustments
- Grid breakpoints optimization

#### 1.4 New Shared Components

**`components/ui/AnimatedCounter.jsx`**
- Animated number counting on mount
- Configurable duration, prefix/suffix
- Used in KPI cards

**`components/ui/HoverCard.jsx`**
- Wrapper component with hover effects:
  - scale(1.02) + translateY(-4px)
  - Box-shadow glow with theme.primary.main
  - Border color transition to purple
  - Optional shine/glare effect on hover

**`components/ui/SectionHeader.jsx`**
- Consistent section title with gradient underline
- Optional subtitle
- Used across all pages

**`components/ui/ImageCarousel.jsx`** (Slideshow)
- Auto-playing image carousel with indicators
- Navigation arrows with hover zoom
- Fade or slide transitions
- Pause on hover
- Used on LandingPage hero and Product gallery

**`components/ui/GlowButton.jsx`**
- Button with animated gradient border or glow on hover
- Used for CTAs

**`components/ui/StatCard.jsx`**
- Icon + value + label + trend indicator
- Hover animation
- Background gradient option

**`components/ui/ActivityFeed.jsx`**
- Timeline-style recent activity list
- Avatar, action text, timestamp
- Animated entry on mount

---

### Phase 2: Public Pages (Landing, Auth)

#### 2.1 `pages/LandingPage.jsx` - Complete Overhaul
**New Sections (8 total):**
1. **Hero Slideshow** - 3 auto-rotating slides with background gradients, headline, subtext, CTA buttons. Overlaid particle/dots animation.
2. **Trusted By / Client Logos** - Infinite horizontal scroll marquee of brand names with opacity hover
3. **Feature Grid (6 features)** - 2x3 grid of glassmorphism cards with:
   - Large icons with gradient backgrounds
   - Title, description, "Learn more" link
   - Hover: lift + purple border glow + icon bounce
4. **How It Works** - 3-step process with animated connecting line
   - Step cards with numbered badges
   - Hover: step number pulses
5. **Stats Counter Section** - 4 animated counters (Products Managed, Orders Processed, Active Users, Uptime %) with background parallax
6. **Testimonials Carousel** - Customer quote cards with auto-slide, star ratings, avatar circles
7. **Interactive Demo Preview** - Screenshot/mockup with floating UI elements and "Try Demo" CTA
8. **Footer Redesign** - Multi-column layout with links, newsletter input, social icons, copyright

**UX Improvements:**
- Scroll-triggered fade-in animations for each section
- Navbar becomes sticky with blur background on scroll
- All buttons have hover glow
- Cards have cohesive glassmorphism effect

#### 2.2 `pages/Login.jsx` - Enhanced Design
- Split layout: Left side = illustration/brand slideshow (3 slides), Right side = form
- Form card with glassmorphism backdrop
- Floating labels animation on input focus
- "Remember me" checkbox styled
- Social login buttons (Google, GitHub) - styled placeholders
- "Forgot password" with hover underline animation
- Background: animated gradient mesh (subtle shifting colors)
- Error messages with shake animation
- Success redirect with loader

#### 2.3 `pages/Register.jsx` - Enhanced Design
- Same split layout as Login
- Multi-step form (Step 1: Account, Step 2: Profile, Step 3: Role selection)
- Progress indicator with step circles
- Password strength meter with color transitions
- Terms checkbox with styled link
- Avatar upload placeholder with hover preview
- "Already have account?" link with arrow animation

---

### Phase 3: Dashboard Pages (Admin, Sales, User)

#### 3.1 `pages/AdminDashboard.jsx` - Analytics Powerhouse
**Top Toolbar:**
- Date range picker (Today, Week, Month, Year)
- Refresh button with spin animation
- Export dropdown

**KPI Cards Row (6 cards):**
- Total Revenue | Total Purchases | Net Profit | Total Users | Products | Low Stock
- Each with: Icon in gradient circle, animated counter, trend % with up/down arrow, sparkline mini-chart
- Hover: Card lifts, border glows, sparkline animates

**Charts Row 1:**
- **Main Revenue Chart (8 cols)** - Area + Line combo with gradient fill, tooltips, legend, zoom brush
  - Toggle: Revenue vs Profit vs Purchases
  - Time buckets: Daily/Weekly/Monthly
- **Top Products Doughnut (4 cols)** - Top 5 products by revenue, center shows total, clickable segments

**Charts Row 2:**
- **Sales Trend Bar Chart (6 cols)** - Monthly sales bars with last year comparison (dual color), value labels on bars
- **Inventory Health Gauge (3 cols)** - Radial gauge showing % healthy stock, color zones
- **User Growth Line (3 cols)** - Cumulative user signups over time

**Tables Row:**
- **Recent Sales Table (6 cols)** - Last 10 sales with status badges, clickable rows, hover highlight
- **Low Stock Alerts (3 cols)** - Urgent items with reorder buttons, color-coded by severity
- **Top Suppliers (3 cols)** - Mini table with rating stars

**Quick Actions (now with hover icons):**
- 6 action cards in a row with icon animation on hover

**Recent Activity Feed:**
- Live-feeling timeline of system events
- "User X added Product Y" etc.

#### 3.2 `pages/SalesDashboard.jsx` - Sales-Focused UX
- Daily target circular progress with animation
- Quick Sale modal with product search autocomplete
- Today's sales real-time bar chart
- Sales by hour heatmap-style grid
- Top customers list with avatars
- Payment method breakdown pie chart
- Recent receipts list with download buttons
- Quick product catalog with "Add to Sale" hover buttons

#### 3.3 `pages/Dashboard.jsx` (User Dashboard) - Browse Experience
- Hero search with autocomplete dropdown
- Category filter chips with scroll
- Product grid with masonry-style cards:
  - Image carousel per product (3 images)
  - Hover: Image zoom, quick "View Details" overlay
  - Price badge, stock indicator with pulse if low
- "Recently Viewed" horizontal scroll section
- Supplier spotlight cards with rating and contact
- Recommended products based on category
- News/Announcements banner

---

### Phase 4: Management Pages (CRUD)

#### 4.1 `pages/Products.jsx` - Product Gallery + Table
**View Toggle:** Grid view (default) or List view

**Grid View:**
- Filter sidebar: Categories, Price range, Stock status, Supplier
- Product cards with:
  - Image slideshow (hover to see 2nd image)
  - Name, category chip, price (large), stock badge
  - Hover: Quick actions appear (Edit, Delete, View)
  - Rating stars
- Sort dropdown

**List View:**
- Enhanced DataGrid with:
  - Custom cell renderers (images, progress bars for stock)
  - Row hover: subtle purple left border
  - Bulk actions toolbar
  - Column visibility toggle

**Create/Edit Modal:**
- Multi-tab form: Basic Info, Pricing, Inventory, Images, Supplier
- Image upload preview grid
- Rich text description field

#### 4.2 `pages/Sales.jsx` - Sales Terminal UX
- **Left Panel:** Product catalog with category tabs
  - Product cards with "Add to Cart" on hover
  - Search with instant results
- **Right Panel:** Cart / Checkout
  - Cart items with quantity steppers
  - Customer selector (search users)
  - Discount input with % or KES toggle
 
