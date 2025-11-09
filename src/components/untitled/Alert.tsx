import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const Icon = {
      default: Info,
      destructive: XCircle,
      success: CheckCircle2,
      warning: AlertCircle,
    }[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border px-4 py-3 text-sm',
          {
            'border-border bg-background text-foreground': variant === 'default',
            'border-destructive/50 bg-destructive/10 text-destructive': variant === 'destructive',
            'border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-400': variant === 'success',
            'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-400': variant === 'warning',
          },
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          <Icon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };

