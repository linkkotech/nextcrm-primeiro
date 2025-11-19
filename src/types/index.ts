/**
 * Types barrel export
 * 
 * Centralized export for all application types and utility types.
 * This file eliminates the need to import from multiple type files.
 * 
 * Usage examples:
 * ```typescript
 * // Import multiple types from one file
 * import { 
 *   WorkspaceMember,
 *   UnknownData, 
 *   BlockData,
 *   LoadingState 
 * } from '@/types';
 * 
 * // Instead of:
 * import { WorkspaceMember } from '@/types/workspace';
 * import { UnknownData } from '@/types/common';
 * import { BlockData } from '@/types/editor';
 * import { LoadingState } from '@/types/common';
 * ```
 * 
 * ⚠️ Note: next-auth.d.ts is NOT included here as it's a declaration file
 * that extends the NextAuth module types directly.
 */

// ============================================
// COMMON UTILITY TYPES
// ============================================
/**
 * Generic data replacement for 'any'
 * Use when type is unknown (e.g., API responses)
 */
export type {
  UnknownData,
  SerializableValue,
  PrismaSerializable,
  FormDataType,
  ComponentProps,
  SafeAny,
  ApiResponse,
  PaginatedResponse,
  ValidationResult,
  LoadingState,
  AsyncFunction,
  SyncFunction,
  EventHandler,
  NonEmptyArray,
  Nullable,
  Optional,
} from './common';

// ============================================
// WORKSPACE & TEAM TYPES
// ============================================
/**
 * Types for workspace management and team structure
 */
export type {
  WorkspaceMember,
  WorkspaceWithMembers,
  WorkspaceRole,
  InviteFormData,
  TeamMemberProps,
} from './workspace';

/**
 * Administrative team types
 */
export type {
  TeamMember,
} from './team';

/**
 * Team role color mapping for UI
 */
export {
  ROLE_COLORS,
  formatRoleName,
} from './team';

// ============================================
// EDITOR & TEMPLATE TYPES
// ============================================
/**
 * Types for digital template editor and content blocks
 * TEMPORARILY DISABLED - Code moved to _legacy/
 */
// export type {
//   BlockData,
//   CTABlock,
//   HeroBlock,
//   DynamicBlock,
//   EditorProps,
//   BlockListProps,
//   ContentEditorProps,
// } from './editor';
