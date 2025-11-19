/**
 * Barrel Export for UI Components
 *
 * This file exports all UI components from a single entry point.
 *
 * Usage:
 * import { Button, Card, Dialog } from '@/components/ui'
 *
 * Instead of:
 * import { Button } from '@/components/ui/button'
 * import { Card } from '@/components/ui/card'
 * import { Dialog } from '@/components/ui/dialog'
 */

// ============================================
// FORM COMPONENTS
// ============================================
export * from './button';
export * from './checkbox';
export * from './input';
export * from './label';
export * from './select';
export * from './textarea';
export * from './form';
export * from './switch';
export * from './radio-group';
export * from './slider';
export * from './toggle';
export * from './toggle-group';

// ============================================
// LAYOUT COMPONENTS
// ============================================
export * from './card';
export * from './separator';
export * from './sidebar';
export * from './pagination';

// ============================================
// OVERLAY COMPONENTS
// ============================================
export * from './dialog';
export * from './alert-dialog';
export * from './sheet';
export * from './popover';
export * from './dropdown-menu';
export * from './tooltip';

// ============================================
// FEEDBACK COMPONENTS
// ============================================
export * from './alert';
export * from './badge';
export * from './progress';
export * from './skeleton';

// ============================================
// NAVIGATION COMPONENTS
// ============================================
export * from './tabs';
export * from './accordion';
export * from './breadcrumb';
export * from './command';
export * from './collapsible';

// ============================================
// DATA DISPLAY
// ============================================
export * from './table';
export * from './avatar';

// ============================================
// COLOR PICKER COMPONENTS (UNUSED - DEPENDENCIES NOT INSTALLED)
// ============================================
// Note: These components require 'react-color' which is not installed
// export * from './ColorPickerChrome';
// export * from './ColorPickerInput';
// export * from './ColorPickerNative';
// export * from './ColorPickerRGB';
// export * from './ColorPickerSimple';

// ============================================
// UTILITY & CUSTOM COMPONENTS
// ============================================
export * from './ImageCropDialog';
export * from './ImageMockup';
export * from './iphone-15-pro';
