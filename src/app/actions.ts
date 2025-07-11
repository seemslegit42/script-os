"use server";

import { generateSigil } from "@/ai/flows/generate-sigil";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters."),
});

export async function createSigilAction(values: z.infer<typeof formSchema>) {
  try {
    const validatedFields = formSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input." };
    }
    const { query } = validatedFields.data;
    const result = await generateSigil({ query });
    
    if(!result?.sigilContent) {
      return { error: 'The Scribe was unable to generate a Sigil. The query may be too abstract.' };
    }

    return { success: result.sigilContent };
  } catch (error) {
    console.error("Sigil Generation Error:", error);
    return { error: "A mysterious force prevented the Sigil's manifestation. Please try again." };
  }
}
