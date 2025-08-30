Guidelines for HangTime

You are an expert in TypeScript, Node.js, Vite, Vue.js, Vue Router, Pinia, VueUse, Vuetify and Firebase with a deep understanding of best practices and performance optimization techniques in these technologies.

Code Style and Structure

- Write concise, maintainable, and technically accurate TypeScript code with relevant examples.
- Use functional and declarative programming patterns for components and composables.
- Classes are acceptable for models and database operations (User, Workout, Activity, Session, GenericDB).
- Favor iteration and modularization to adhere to DRY principles and avoid code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Organize files systematically: each file should contain only related content, such as exported components, subcomponents, helpers, static content, and types.

Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for functions.
- Use PascalCase for class names and interfaces (User, IUser, Workout, IWorkout).
- Use camelCase for variables, functions, and properties.

TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types for their extendability and ability to merge.
- Enums are acceptable for simple constants (ExerciseState, Levels, Theme, Unit) but consider const maps for complex scenarios.
- Use functional components with TypeScript interfaces.
- Implement proper type safety with strict TypeScript configuration.

Syntax and Formatting

- Use the "function" keyword for exported functions, composables, and complex utility functions to benefit from hoisting and clarity.
- Use arrow functions for component methods, event handlers, and simple utility functions.
- Always use the Vue Composition API script setup style.
- Use proper JSDoc comments for classes and complex functions.

UI and Styling

- Use Vuetify for components and styling.
- Follow Material Design principles.
- Use Vuetify's built-in responsive design features.

Performance Optimization

- Leverage VueUse functions where applicable to enhance reactivity and performance.
- Use dynamic imports for route-based code splitting (already implemented in router).
- Implement caching strategies for expensive operations (useExercises, useFitnessExercises).
- Use service worker for offline functionality and caching.
- Optimize images: use WebP format, include size data, implement lazy loading.
- Use font preloading for critical fonts.
- Implement proper bundle analysis with Vite visualizer.

Database and State Management

- Use Pinia for global state management.
- Use GenericDB base class for all Firebase database operations.
- Implement proper offline/online synchronization with Firebase.
- Follow Firebase security best practices.
- Use composables for reusable logic (useBluetooth, usePlayBilling).
- Follow proper error handling patterns for async operations.

Testing and Documentation

- Use Storybook for component documentation and testing.
- Write unit tests with Vitest for composables and utilities.
- Use Playwright for E2E testing of critical user flows.

Key Conventions

- Optimize Web Vitals (LCP, CLS, FID) using tools like Lighthouse or WebPageTest.
- Use proper internationalization with vue-i18n.
- Implement PWA features with service worker and manifest.
- Use proper TypeScript strict mode configuration.
- Follow Vue 3 Composition API best practices.
- Implement an optimized chunking strategy during the Vite build process, such as code splitting, to generate smaller bundle sizes.

Used libraries

- Use @hangtime/grip-connect for Bluetooth device integration.
- Implement Google Maps integration with @googlemaps/js-api-loader.
- Use IRCRA for climbing grade calculations and display.
- Implement analytics tracking with vue-gtag.
- Use @unhead/vue for dynamic head management.
- Leverage vuedraggable for drag-and-drop functionality.
