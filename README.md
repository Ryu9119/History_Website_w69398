# 🌟 Thiên Sử Ký - History Website

A comprehensive Vietnamese history education platform built with modern web technologies.

## 🚀 Quickstart

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env` file in the root directory:
```bash
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_PRODUCTS_API_MODE=mock
```

### DEV Testing Toggles
For testing different states, add URL parameters:
- `?error=1` - Force error states
- `?empty=1` - Force empty states  
- `?slow=1` - Force slow loading states

## 🛠 Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Routing**: React Router v6
- **State Management**: React Query + Context API
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript

## 📦 Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript checks
- `npm run lint` - Run ESLint

## 🎯 Features
- **Homepage**: Hero section with featured content
- **E-commerce**: Product catalog with cart and checkout
- **Blog System**: Articles with detail pages
- **Flashcards**: Interactive learning cards
- **Admin Panel**: Content management with CRUD operations
- **Authentication**: Login/register with protected routes
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Code splitting and lazy loading

## 🏗 Architecture
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and API adapters
└── types/         # TypeScript type definitions
```

## 📱 Pages & Routes
- `/` - Homepage with sections overview
- `/products` - Product catalog with filtering
- `/products/:id` - Product detail page
- `/blog` - Blog posts with pagination
- `/blog/:slug` - Blog detail page
- `/flashcards` - Flashcard decks
- `/flashcards/:id` - Flashcard detail/practice
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User authentication
- `/register` - User registration
- `/profile` - User profile management
- `/admin` - Admin dashboard (protected)
- `/chatbot` - AI assistant

## 🔒 Authentication & Authorization
- JWT-based authentication
- Protected routes with automatic redirects
- Role-based access control for admin features
- Session management with auto-logout

## ♿ Accessibility Features
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in modals
- Screen reader announcements
- High contrast support

## 🚀 Performance Optimizations
- Code splitting with React.lazy()
- Component memoization with React.memo()
- Efficient re-render prevention
- Image lazy loading
- Bundle optimization
- Caching strategies

## 📞 Contact
- **Developer**: Long Vu Hai
- **Email**: hailongvu1@gmail.com
- **GitHub**: Ryu9119

## 📝 License
This project is part of a frontend development portfolio. All rights reserved.

---

*Built with ❤️ using modern React ecosystem*