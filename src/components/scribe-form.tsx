"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSigilAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScribeGlyph } from "./icons";

const formSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters.").max(1000, "Query cannot exceed 1000 characters."),
});

export function ScribeForm({ setSigilContent }: { setSigilContent: (content: string) => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSigilContent("");

    try {
      const result = await createSigilAction(values);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Scribe Error",
          description: result.error,
        });
        return;
      }
      
      if (result.success) {
        setSigilContent(result.success);
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sigil Manifestation Failed",
        description: "A catastrophic error occurred. Please try your query again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg sigil-obelisk text-primary">On-Demand Canvas Generation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Pose your query to the Scribe. A Living Sigil will be generated on the canvas below."
                  className="min-h-[100px] sigil-codex"
                  {...field}
                />
              </FormControl>
              <FormDescription className="sigil-codex">
                The Scribe Agent will analyze your query and generate a brand new Living Sigil.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="sigil-obelisk">
            {isSubmitting ? (
                <>
                    <ScribeGlyph className="mr-2 h-4 w-4 animate-spin" />
                    Forging Sigil...
                </>
            ) : (
                <>
                    <ScribeGlyph className="mr-2 h-4 w-4" />
                    Invoke Scribe
                </>
            )}
        </Button>
      </form>
    </Form>
  );
}
