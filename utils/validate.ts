import { z } from "zod";

interface ValidPayload {
  idea: string;
}

// Define a validator for a simple object
const payloadValidator = z.object({
  idea: z
    .string()
    .max(100, "Idea can't be more than 100 characters long!")
    .min(3, "Idea can't be less than 3 characters long!"),
});

export const getInputErrors = (payload: any): string[] => {
  try {
    payloadValidator.parse(payload);
    return [];
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.issues.map((x) => x.message);
    }
    throw e;
  }
};

export const isValidPayload = (payload: any): payload is ValidPayload => {
  if (getInputErrors(payload).length == 0) {
    return true;
  }
  return false;
};
