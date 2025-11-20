/**
 * Library utilities barrel export
 * 
 * Central export file for all library utilities, database clients, and helper functions.
 * 
 * ⚠️ IMPORTANT: Server Actions are NOT exported here!
 * 
 * Server Actions must be imported directly:
 * @example
 * import { createWorkspace } from '@/lib/actions/workspace.actions';
 * 
 * Why? Server Actions require the "use server" directive and barrel exports 
 * can interfere with proper tree-shaking and module resolution.
 * 
 * @example
 * // Utilities
 * import { cn, prisma, serialize } from '@/lib';
 * 
 * // Auth (Supabase clients)
 * import { createClient, createServerClient } from '@/lib';
 * 
 * // Validation
 * import { validateWorkspaceAccess } from '@/lib';
 */

// ============================================
// CORE UTILITIES
// ============================================
/**
 * Utility function to merge class names with Tailwind CSS
 * Uses clsx for conditional classes and tailwind-merge for conflict resolution
 */
export { cn } from './utils';

// ============================================
// DATABASE
// ============================================
/**
 * Prisma Client singleton instance
 * Prevents connection leaks in development via globalThis pattern
 * 
 * @example
 * const user = await prisma.user.findUnique({ where: { id: 'user-1' } });
 */
export { prisma } from './prisma';

// ============================================
// SERIALIZATION
// ============================================
/**
 * Serialization utilities for converting Prisma objects to JSON-compatible format
 * Handles non-serializable types like Decimal, BigInt, and Date objects
 * 
 * @example
 * const plan = await prisma.plan.findUnique({ where: { id: 'plan-1' } });
 * const serialized = serializePlan(plan);
 */
export {
  serializePlan,
  serializePlans,
  serializeDecimal,
  serializeDate,
} from './serialize';

// ============================================
// AUTHENTICATION & SUPABASE
// ============================================
/**
 * Supabase client utilities for both client and server environments
 * 
 * @example
 * // Client-side
 * const { data, error } = await createClient().auth.getUser();
 * 
 * // Server-side
 * const { data, error } = await createServerClient().auth.getUser();
 */
export {
  createClient,
  createServerClient,
  createMiddlewareClient,
} from './supabase/index';

// ============================================
// VALIDATION & WORKSPACE
// ============================================
/**
 * Workspace validation and authorization utilities
 * 
 * @example
 * const hasAccess = await validateWorkspaceMembership(userId, workspaceId);
 */
export { validateWorkspaceMembership } from './workspace-validation';

/**
 * Session utilities for extracting and validating user sessions
 * 
 * @example
 * const session = await getAuthSession();
 */
export { getAuthSession } from './session';

// ============================================
// UTILITIES
// ============================================
/**
 * Plan formatting utilities for displaying pricing and billing information
 * 
 * @example
 * const formatted = formatPrice(plan.price);
 */
export {
  formatBillingCycle,
  formatPrice,
  formatOperationMode,
  getOperationModeBadgeColor,
  formatSubscriptionType,
  formatFeatures,
} from './plan-formatters';

/**
 * Stripe utilities for payment processing
 * 
 * @example
 * const stripe = createStripeInstance();
 */
export * from './stripe';

// ============================================
// MIDDLEWARE & HOOKS
// ============================================
/**
 * Prisma middleware for cross-cutting concerns (logging, soft deletes, etc.)
 */
export { setupSoftDeleteMiddleware } from './prisma-middleware';

// ============================================
// NAVIGATION UTILITIES
// ============================================
/**
 * Navigation helper functions
 * Extract active module from pathname for contextual sidebar navigation
 * 
 * @example
 * const activeModule = getActiveModuleFromPath(pathname);
 * // Returns: "crm" | "ai-agents" | "dashboard" | null
 */
export { getActiveModuleFromPath } from './navigation-utils';
