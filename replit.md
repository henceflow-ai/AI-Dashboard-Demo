# AI Sales Dashboard

## Overview

This is a modern React-based AI sales automation dashboard built with a full-stack architecture. The application provides a comprehensive interface for managing sales leads, tracking pipeline performance, scheduling meetings, and monitoring AI-driven sales activities. It features a clean, responsive design using shadcn/ui components and includes real-time analytics and automation controls for sales teams.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management and caching
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with CSS variables for theming

### Backend Architecture
- **Express.js** server with TypeScript support
- **RESTful API** design with endpoints for dashboard metrics, leads, meetings, and activities
- **Modular route structure** with centralized error handling middleware
- **Storage abstraction layer** allowing for different database implementations
- **Development-optimized** with Vite integration for hot module replacement

### Data Layer
- **Drizzle ORM** for type-safe database operations and schema management
- **PostgreSQL** as the primary database (configured via Neon serverless)
- **Schema-first approach** with shared TypeScript types between client and server
- **Zod integration** for runtime schema validation and type inference

### Component Organization
- **Atomic design principles** with reusable UI components in `/components/ui/`
- **Feature-based components** in `/components/dashboard/` for business logic
- **Page-level components** for route handling and layout composition
- **Custom hooks** for shared logic like mobile detection and toast notifications

### Styling and Theming
- **CSS Variables** for dynamic theming (light/dark mode support)
- **Responsive design** with mobile-first approach using Tailwind breakpoints
- **shadcn/ui theming system** with customizable color schemes and component variants
- **Consistent design tokens** for spacing, typography, and color usage

### Development Workflow
- **TypeScript strict mode** with comprehensive type checking
- **Path aliases** for clean imports (`@/`, `@shared/`)
- **Hot reload** development server with error overlays
- **Build optimization** with separate client and server bundling

### State Management
- **React Query** for server state with automatic caching and background updates
- **React Context** for theme management and global UI state
- **Local component state** for UI interactions and form handling
- **URL state** managed through Wouter for navigation and deep linking

## External Dependencies

### Database Services
- **Neon Database** - Serverless PostgreSQL hosting with connection pooling
- **connect-pg-simple** - PostgreSQL session store for Express sessions

### UI and Styling
- **Radix UI** - Headless component primitives for accessibility
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library for consistent iconography
- **Recharts** - Chart library for data visualization

### Development Tools
- **ESBuild** - Fast JavaScript bundler for production builds
- **TSX** - TypeScript execution for development server
- **Drizzle Kit** - Database migration and introspection tools

### Form and Validation
- **React Hook Form** - Performance-focused form library
- **Zod** - Schema validation for both client and server
- **@hookform/resolvers** - Integration between React Hook Form and Zod

### Data Fetching
- **TanStack React Query** - Server state management with caching
- **Fetch API** - Native HTTP client for API requests

### Utilities
- **date-fns** - Date manipulation and formatting
- **clsx/twMerge** - Conditional CSS class composition
- **nanoid** - Unique ID generation
- **class-variance-authority** - Type-safe component variant management