/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from 'next/router';
import { z } from 'zod';

export function isZodType(
  t: z.ZodTypeAny,
  type: z.ZodFirstPartyTypeKind
): boolean {
  if (t._def?.typeName === type) {
    return true;
  }
  if (
    t._def?.typeName === z.ZodFirstPartyTypeKind.ZodEffects &&
    (t as z.ZodEffects<any>)._def.effect.type === 'refinement'
  ) {
    return isZodType((t as z.ZodEffects<any>).innerType(), type);
  }
  if (t._def?.innerType) {
    return isZodType(t._def?.innerType, type);
  }
  return false;
}

export function withoutTransform(t: z.ZodTypeAny): z.ZodTypeAny {
  if (t._def?.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
    return withoutTransform((t as z.ZodEffects<any>).innerType());
  }
  return t;
}

function validateParam<T extends z.ZodDefault<z.ZodTypeAny>>(
  schema: T,
  parameter: string | null
): z.infer<T> {
  let processed;
  if (
    (isZodType(schema, z.ZodFirstPartyTypeKind.ZodNumber) ||
      isZodType(schema, z.ZodFirstPartyTypeKind.ZodBoolean)) &&
    parameter &&
    typeof parameter === 'string'
  ) {
    processed = z.preprocess<typeof schema>((x) => {
      try {
        return JSON.parse(x as string);
      } catch {
        return x;
      }
    }, schema);
  } else {
    processed = schema;
  }
  try {
    const parsed: z.infer<T> = processed.parse(parameter);
    return parsed;
  } catch (error) {
    return schema._def.defaultValue();
  }
}

/**
 * Follow and update URL type safe search parameters
 *
 * @param key - The name of the search param key to track and modify
 * @param schema - The Zod schema, must have a `.default(value)`
 * @returns The `value` and `setValue` just like `useState` does
 *
 * @example Using search param to flip between page sections
 * ```tsx
 * function Stepper() {
 *   const [step, setStep] = useSearchParam(
 *     "step",
 *     z.enum(["login", "signup"]).default("signup")
 *   );
 *   return (step === "login" ? <Login /> : <Signup />);
 * }
 * ```
 */
export function useSearchParam<T extends z.ZodDefault<z.ZodTypeAny>>(
  key: string,
  schema: T
): [z.infer<T>, (newValue: z.infer<T>) => void] {
  const router = useRouter();

  let searchParams: URLSearchParams;

  if (router.isReady && router.asPath.includes('?')) {
    searchParams = new URLSearchParams(router.asPath.split('?', 2).at(1));
  } else {
    searchParams = new URLSearchParams();
  }

  const value = validateParam(
    schema,
    searchParams.has(key) ? searchParams.get(key) : schema._def.defaultValue()
  );

  function setValue(newValue: z.infer<T>) {
    const newSearchParams = new URLSearchParams(searchParams);
    const validated = validateParam(schema, newValue);
    const stringified =
      isZodType(schema, z.ZodFirstPartyTypeKind.ZodNumber) ||
      isZodType(schema, z.ZodFirstPartyTypeKind.ZodBoolean)
        ? JSON.stringify(validated)
        : newValue;

    if (newValue === schema._def.defaultValue()) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, stringified);
    }
    void router.push(`${router.pathname}?${newSearchParams.toString()}`);
  }

  return [value, setValue];
}
