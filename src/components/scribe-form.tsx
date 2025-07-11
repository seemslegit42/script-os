
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScribeGlyph } from "./icons";
import { Label } from "./ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Summoning..." : "Generate Sigil"}
    </Button>
  );
}

type ScribeFormProps = {
  formAction: (payload: FormData) => void;
};

export function ScribeForm({ formAction }: ScribeFormProps) {

  return (
    <form action={formAction}>
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 sigil-obelisk">
            <ScribeGlyph className="h-6 w-6" />
            <span>Scribe Input</span>
          </CardTitle>
          <CardDescription className="sigil-codex">
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
                className="min-h-[100px] sigil-glyph"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
