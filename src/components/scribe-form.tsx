
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScribeGlyph } from "./icons";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Props for the ScribeForm component.
 * @property {(payload: FormData) => void} formAction - The server action to execute on form submission.
 * @property {React.RefObject<HTMLFormElement>} formRef - A ref to the form element.
 * @property {boolean} isPending - A boolean indicating if the form submission is currently in progress.
 */
type ScribeFormProps = {
  formAction: (payload: FormData) => void;
  formRef: React.RefObject<HTMLFormElement>;
  isPending: boolean;
};

/**
 * A form component for submitting a query to the Scribe Agent to generate a sigil.
 * @param {ScribeFormProps} props - The component props.
 */
export function ScribeForm({ formAction, formRef, isPending }: ScribeFormProps) {

  return (
    <form action={formAction} ref={formRef}>
      <Card className={cn(
        "bg-card/70 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 transition-all duration-500",
        isPending && "border-accent shadow-accent/20"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sigil-obelisk">
            <ScribeGlyph className="h-6 w-6" />
            <span>Scribe Input</span>
          </CardTitle>
          <CardDescription>
            Provide a query to the Scribe Agent. It will generate a Living Sigil
            tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Label htmlFor="query" className="sr-only">Query</Label>
            <Textarea 
                id="query"
                name="query"
                placeholder="e.g., Explain the Core Protocol in detail." 
                required 
                className="min-h-[100px] sigil-glyph bg-background/50 focus:bg-background/80"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} variant={isPending ? "secondary" : "default"}>
            {isPending ? "Summoning..." : "Generate Sigil"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
