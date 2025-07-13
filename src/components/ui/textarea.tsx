
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * A custom Textarea component that extends the standard HTML textarea element.
 * It includes default styling from the design system and auto-resizes its height
 * based on the content.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, onChange, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (combinedRef.current) {
        combinedRef.current.style.height = 'auto'; // Reset height to recalculate
        combinedRef.current.style.height = `${combinedRef.current.scrollHeight}px`;
      }
      if (onChange) {
        onChange(event);
      }
    };

    React.useEffect(() => {
        if (combinedRef.current) {
            combinedRef.current.style.height = 'auto';
            combinedRef.current.style.height = `${combinedRef.current.scrollHeight}px`;
        }
    }, [props.value, combinedRef]);


    return (
      <textarea
        className={cn(
          'flex min-h-[40px] max-h-48 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-y-auto',
          className
        )}
        ref={combinedRef}
        onChange={handleInput}
        rows={1}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
