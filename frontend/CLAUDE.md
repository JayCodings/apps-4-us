# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dockerized full-stack starter template for web applications with:
- **Backend**: Laravel with Breeze API authentication (in `../backend/` directory)
- **Frontend**: Next.js with TypeScript and Tailwind CSS (this directory)
- **Infrastructure**: Docker configurations and nginx-proxy setup (in `../etc/` directory)
- Further details in `../CLAUDE.md`

## Package Manager

**IMPORTANT: This project uses Yarn, not npm!**

- Package manager: `yarn@1.22.19`
- Always use `yarn` instead of `npm` for all operations
- Commands:
  - `yarn install` - Install dependencies
  - `yarn add <package>` - Add dependency
  - `yarn add -D <package>` - Add dev dependency
  - `yarn remove <package>` - Remove dependency
  - `yarn dev` - Start development server
  - `yarn build` - Build for production
  - `yarn lint` - Run linter

## Docker Development Setup

The frontend runs in a Docker container with proper user permissions:
- The Dockerfile uses UID/GID passed from the host system
- This prevents permission issues with `node_modules` and `.next` directories
- The container runs as a non-root user matching your host user
- Configuration: `../etc/frontend/Dockerfile.dev`

If you encounter permission issues:
```bash
# From project root
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

## Project Context

This project is a frontend-only web application built with:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- A strong focus on User Experience (UX), modern design, motion, and clean code

Goal: Deliver a performant, elegant, and user-centric interface that feels modern, fluid, and professional.

## Core Principles

### UX Comes First
- Every design or code decision should improve the user experience.
- Loading states, micro-interactions, and error feedback are required.
- Transitions and animations should be subtle but noticeable.

## Code Is Communication
- Write clear, typed, self-explanatory code.
- Use meaningful names — no abbreviations or cryptic variables.
- Prioritize readability over clever tricks or one-liners.

## Consistency Over Creativity
- Follow a consistent design and component structure.
- Stick to Tailwind conventions and naming patterns.
- Avoid inline styles (except for dynamic animations or rare edge cases).

## Performance Awareness
- Use lazy loading, code splitting, and Next.js optimizations.
- Always use next/image and next/link when possible. 
- Avoid unnecessary re-renders and heavy third-party dependencies.

## Agent Rules
You are an experienced NEXT.JS backend developer.
All code suggestions and generations must take these conventions into account.

### Coding Philosophy: LEAN Development

Claude should always code LEAN. LEAN means:

- Write the minimum amount of code needed to achieve clarity and function.
- Avoid unnecessary abstractions, wrappers, or complex patterns unless truly justified.
- Do not create files, folders, or components that don’t have a clear purpose.
- Keep components small, focused, and composable.
- Use built-in features of Next.js, React, and Tailwind before reaching for external libraries.
- Prefer clarity over cleverness — readable, short, and efficient code is the goal.
- Remove dead code, redundant imports, and unused props.
- If something can be expressed cleanly in 5 lines, don’t make it 15.

Claude should:
- Think like a senior frontend engineer optimizing for developer experience and maintainability.
- Strive for elegant simplicity — “Less code, more clarity.”
```tsx
// ❌ Over-engineered:
const Button = ({ label }: { label: string }) => {
    const handleClick = useCallback(() => {
        console.log(label);
    }, [label]);
    return <button onClick={handleClick}>{label}</button>;
};

// ✅ LEAN:
export function Button({ label }: { label: string }) {
    return <button>{label}</button>;
} 
```

### Coding Standards

#### TypeScript
- Always use strict typing (strict: true).
- Avoid any, unknown, or unsafe casts.
- Define clear interfaces and types for props and API responses.
- Use utility types (Pick, Omit, Partial) thoughtfully.

#### Next.js
- Use the App Router (app/ directory). 
- Prefer Server Components for static content; Client Components only when interactivity is needed. 
- Use fetch() in Server Components — never directly in the client. 
- API routes should be located in hook files within the `src/app/hooks/` directory.
- Avoid legacy data-fetching methods like getServerSideProps or getStaticProps.

#### TailwindCSS
- Use utility classes instead of custom CSS files.
- Use @apply only in global styles or the tailwind.config.ts.
- Include smooth transitions and motion for interaction feedback.
```tsx
<button className="transition-all duration-300 hover:scale-105 active:scale-95">
  Click me
</button>
```
- Keep spacing, colors, and typography consistent via theme tokens.

### Dos and Don'ts

#### Do’s

- Use semantic HTML (<section>, <nav>, <main>).
- Build responsive components (flex, grid, aspect-video, etc.).
- Use clsx or cva() for conditional class logic.
- Provide skeletons or spinners for loading states.
- Implement ARIA labels and accessibility best practices. 
- Add subtle motion (e.g., via framer-motion).

#### Don’ts

- No inline CSS or untyped JavaScript.
- No magic numbers (use spacing tokens instead of margin: 17px). 
- Don’t make UI decisions without UX context. 
- Avoid hard-coded colors — use Tailwind variables (bg-primary, text-muted, etc.). 
- No dead code, unused imports, or commented-out logic.

#### Example: Best-Practice UX Component
```tsx
"use client";

import { motion } from "framer-motion";

export function Card({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
```

### File & Component Conventions

- Use **`.tsx`** for all files that contain React components, hooks, or JSX.
- Use **`.ts`** only for:
    - Utility functions (e.g. `lib/utils.ts`)
    - Type definitions (e.g. `types.ts`)
    - Constants or configuration files.
- When creating new components:
    - Name the folder and file **PascalCase**, e.g. `components/ExampleComponent/index.tsx`.
    - Export the component as a named function, not default.
- Avoid mixing logic and JSX in `.ts` files — always separate UI from pure logic.

### Component Design Guidelines
- Each component:
  - Lives in its own folder under components/ComponentName/
  - Has its own index.tsx (+ optional types.ts or style.ts)
  - Is small, functional, and reusable
```tsx
// components/Button/index.tsx
"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 font-medium transition-all duration-300",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
        variant === "secondary" && "bg-gray-100 text-gray-800 hover:bg-gray-200",
        className
      )}
      {...props}
    />
  );
}
````

### UX & UI Standards

- Modern Feel: Soft shadows, rounded corners, vibrant color accents, and smooth transitions. 
- Motion: Every user interaction should have subtle feedback (hover, focus, click, route change). 
- Accessibility: Always include focus states, ARIA attributes, and keyboard navigation. 
- Navigation: Use next/link + useRouter for routing. 
- Feedback: Success, error, and loading states should always be visually distinct.

### Claude: Your Coding Behavior
1. Be meticulous about UX — every component should feel right.
2. Avoid boilerplate, but explain your decisions briefly when unclear.
3. Keep commits and code outputs clean and structured.
4. Use modern React patterns (Hooks, Composition, Headless UI, Zustand, etc.).
5. Code should be readable, extendable, and consistent.

### Recommended Tools & Libraries
| Purpose            | Library                     |
| ------------------ | --------------------------- |
| Animation / Motion | `framer-motion`             |
| State Management   | `zustand` or `jotai`        |
| Class Utilities    | `clsx`, `cva`               |
| UI Components      | ShadCN UI or Radix UI       |
| Icons              | Lucide Icons                |
| Forms & Validation | React Hook Form + Zod       |
| Analytics          | Vercel Analytics or Posthog |

### Summary
Claude, your mission is to produce clean, aesthetic, accessible, and performant frontend code using Next.js, TailwindCSS, and TypeScript.
Every line of code should enhance UX, readability, and scalability.
“Clean Code meets Delightful UX.”

### Further Instructions
- type any is not allowed, use proper types/interfaces
- make sure to create modern, responsive and accessible components with tailwindcss
- make use of animations and transitions and make  sure everything is visually appealing and smooth
- the app must be user-friendly 
