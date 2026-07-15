# Banking System Frontend - Project Structure

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication-specific components
│   ├── common/          # Common/shared components (buttons, forms, modals, etc.)
│   └── layout/          # Layout components (sidebar, navbar, footer, etc.)
├── contexts/            # React Context providers for global state management
├── hooks/               # Custom React hooks
├── pages/               # Page components (route views)
│   ├── auth/           # Authentication pages (login, register, forgot password)
│   ├── user/           # User-facing pages (dashboard, transactions, profile)
│   └── admin/          # Admin pages (customer mgmt, reports, audit logs)
├── routes/              # Routing configuration
├── services/            # API service layer
│   └── api/            # API client and service functions
├── config/              # Configuration files and constants
├── utils/               # Utility functions and helpers
└── assets/              # Static assets (images, icons, etc.)
```

## Installed Dependencies

### Core Dependencies
- **react** (^19.2.7) - Core React library
- **react-dom** (^19.2.7) - React DOM rendering
- **react-router-dom** (^7.18.1) - Client-side routing
- **axios** (^1.18.1) - HTTP client for API requests
- **react-hook-form** (^7.81.0) - Form state management and validation
- **bootstrap** (^5.3.8) - CSS framework for responsive design
- **bootstrap-icons** (^1.13.1) - Icon library

### Dev Dependencies
- **vite** (^8.1.4) - Build tool and dev server
- **@vitejs/plugin-react** (^6.0.3) - React plugin for Vite
- **oxlint** (^1.74.0) - Linting tool

## Environment Configuration

### Environment Files
- `.env` - Default environment variables (committed)
- `.env.development` - Development-specific variables (committed)
- `.env.production` - Production-specific variables (committed)
- `.env.local` - Local overrides (not committed - add to .gitignore)
- `.env.example` - Example configuration template

### Environment Variables
- `VITE_API_BASE_URL` - Backend REST API base URL
  - Development: `http://localhost:8080/api`
  - Production: `https://api.bankingsystem.com/api`

## Vite Configuration

The Vite configuration (`vite.config.js`) includes:
- React plugin integration
- Environment variable prefix: `VITE_`
- Development server port: 3000
- Source map generation for production builds
- Output directory: `dist`

## Usage

### Development
```bash
npm run dev
```
Starts the development server on http://localhost:3000

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist` directory

### Preview
```bash
npm run preview
```
Preview the production build locally

### Lint
```bash
npm run lint
```
Run oxlint to check code quality

## Accessing Environment Variables

In your code, access environment variables using:
```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

## Next Steps

1. Create API client infrastructure (Task 1.2)
2. Implement Context providers (Task 1.3)
3. Set up routing configuration (Task 1.4)
4. Build reusable component library (Task 2.x)
