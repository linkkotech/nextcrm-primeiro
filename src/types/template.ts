/**
 * Template type definition for Digital Templates module
 * Used across listing views, cards, and forms
 */
export interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string; // TemplateType enum: "profile_template" | "content_block"
  createdAt: Date;
  workspaceId?: string | null; // For permission control (null = global template)
}

/**
 * Server Action result types
 */
export interface CreateTemplateResult {
  success?: boolean;
  data?: {
    id: string;
    name: string;
    description?: string | null;
    type: string;
  };
  error?: string;
}

export interface DeleteTemplateResult {
  success?: boolean;
  error?: string;
}

export interface DuplicateTemplateResult {
  success?: boolean;
  data?: {
    id: string;
    name: string;
  };
  error?: string;
}
