"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScribeGlyph, AnnotationGlyph } from "@/components/icons";
import { createSigilAction } from "./actions";
import { ArrowLeft, GitFork, Loader2, PlusCircle, Sparkles, WandSparkles } from "lucide-react";
import { useTypographicState } from "@/context/typographic-state-context";

const formSchema = z.object({
  query: z.string().min(10, {
    message: "Your query must be at least 10 characters.",
  }),
});

type Annotation = {
  id: number;
  text: string;
  position: { x: number; y: number };
};

export default function Scriptorium() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [sigilContent, setSigilContent] = React.useState<string | null>(null);
  const [annotations, setAnnotations] = React.useState<Annotation[]>([]);
  const { toast } = useToast();
  const { applyState, currentState } = useTypographicState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  React.useEffect(() => {
    if (isLoading) {
      applyState('contextSwitch');
    } else if (sigilContent) {
      applyState('active');
    } else {
      applyState('default');
    }
  }, [isLoading, sigilContent, applyState]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const result = await createSigilAction(values);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      applyState('default');
    } else if (result.success) {
      setSigilContent(result.success);
      setAnnotations([]); // Reset annotations for new sigil
    }
  }

  const parseAndRenderSigil = (content: string) => {
    const htmlContent = content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />")
      .replace(/```([\s\S]*?)```/g, (match, code) => {
        const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<div class="my-4 p-4 bg-black/30 rounded-lg border border-border"><pre class="sigil-glyph text-sm text-accent whitespace-pre-wrap">${safeCode}</pre><button class="mt-2 text-xs text-primary hover:underline" onclick="alert('Simulation feature not implemented.')">Run Simulation</button></div>`;
      })
      .replace(/\b([A-Z_]{4,})\b/g, '<span class="sigil-obelisk text-primary cursor-pointer hover:underline" title="Forge Link">$1</span>');

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="sigil-codex text-foreground/80 leading-relaxed" />;
  };

  const handleAddAnnotation = () => {
    const newAnnotation: Annotation = {
      id: Date.now(),
      text: "Architect's Note",
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    toast({ title: "Annotation added", description: "Your glyph has been placed on the canvas." });
    
    // Demonstrate echo state
    applyState('echo');
    setTimeout(() => applyState('active'), 400);
  };
  
  const handleFork = () => {
    toast({
      title: "Scripture Forked",
      description: "A new branch of knowledge has been created.",
    });
     // Demonstrate sanctuary state
    applyState('sanctuary');
    setTimeout(() => applyState('active'), 1500);
  };

  const resetView = () => {
    setSigilContent(null);
    form.reset();
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <AnimatePresence mode="wait">
        {sigilContent ? (
          <motion.div
            key="canvas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-4xl"
          >
            <Card className="relative w-full border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
              <div className="absolute top-4 left-4">
                  <Button variant="ghost" size="sm" onClick={resetView}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Scribe
                  </Button>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="sigil-obelisk text-2xl tracking-widest text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
                  Living Sigil
                </CardTitle>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleFork}>
                    <GitFork className="mr-2 h-4 w-4" /> Fork Scripture
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAddAnnotation}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Annotate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative p-6 sm:p-8 prose-invert prose-p:text-foreground/80">
                {parseAndRenderSigil(sigilContent)}
                {annotations.map((note) => (
                  <div
                    key={note.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${note.position.x}%`, top: `${note.position.y}%` }}
                    title={note.text}
                  >
                    <AnnotationGlyph className="h-6 w-6 text-yellow-300 drop-shadow-[0_0_6px_#fde047] transition-transform group-hover:scale-125" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl text-center"
          >
            <ScribeGlyph className="mx-auto h-16 w-16 text-primary drop-shadow-[0_0_15px_hsl(var(--primary))] motion-safe:animate-pulse" />
            <h1 className="mt-6 font-headline text-4xl sm:text-5xl font-bold tracking-widest text-primary-foreground sigil-obelisk">
              The Scriptorium Cypher
            </h1>
            <p className="mt-4 text-lg text-foreground/70 sigil-codex">
              Converse with the Scribe. Manifest a Living Sigil from the query of your choosing.
            </p>
            <Card className="mt-8 w-full border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="query"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g., Explain the architecture of this very application..."
                              className="h-12 text-center text-base bg-background/50 border-primary/30 focus:ring-primary sigil-glyph"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 sigil-obelisk"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <WandSparkles className="mr-2 h-4 w-4" />
                      )}
                      Manifest Sigil
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
