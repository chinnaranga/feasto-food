import type { z } from 'zod';

/**
 * Inline Zod resolver for React Hook Form.
 * Drop-in replacement for @hookform/resolvers/zod — no extra package required.
 *
 * Typed as `any` on the return so RHF's strict Resolver<TFieldValues> generic
 * is satisfied at every call site without needing the package's own type helpers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zodResolver = (schema: z.ZodTypeAny): any =>
  async (values: Record<string, unknown>) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: Record<string, { message: string; type: string }> = {};

    for (const issue of result.error.issues) {
      const pathKey = issue.path.length > 0 ? issue.path.join('.') : '_root';
      if (!errors[pathKey]) {
        errors[pathKey] = {
          message: issue.message,
          type: issue.code,
        };
      }
    }

    return { values: {}, errors };
  };

export default zodResolver;
