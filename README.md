# PerksCrowd Frontend

A modern, performant React application for discovering and managing student deals and discounts.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 🔐 Environment

Set the backend origin for auth and API calls:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:5254"
```

`NEXT_PUBLIC_API_URL` is still supported as a fallback for older setups.

## 🛠️ Technology Stack

- **React 19** - Modern React with concurrent features
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Vitest** - Fast unit testing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Shadcn/ui)
│   ├── admin/          # Admin-specific components
│   ├── DealList/       # Deal listing components
│   └── ErrorBoundary/  # Error handling
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## 🔧 Features

- **Deal Discovery**: Browse and search student deals
- **Category & Store Filtering**: Organize deals by categories and stores
- **Admin Dashboard**: Manage deals, categories, and stores
- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Built-in theme switching
- **Performance Optimized**: Code splitting, lazy loading, caching
- **Type Safe**: Full TypeScript coverage
- **Tested**: Comprehensive test suite

## 📖 Documentation

- [Component Documentation](./docs/COMPONENTS.md)
- [Architecture Overview](./docs/README.md)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🎨 Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Husky for git hooks (if configured)

## 🚀 Deployment

The application is optimized for deployment on:

- Vercel
- Netlify
- Static hosting services

Build artifacts are generated in the `dist/` directory.

## 🤝 Contributing

1. Follow the established code patterns
2. Write tests for new features
3. Update documentation as needed
4. Use TypeScript for all new code

## 📄 License

MIT License
