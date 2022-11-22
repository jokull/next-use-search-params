# `useQueryParam()`

Type-safe query param handling for [Next.js](https://nextjs.org/) using zod.

## Install

```
npm install @jokull/next-use-query-param
```

## Example usage

```tsx
function Counter() {
  const [num, setNum] = useSearchParam("num", z.number().default(1));

  return (
    <div>
      <pre>{num}</pre>
      <button onClick={() => setNum(num + 1)}>Click me</button>
    </div>
  );
}
```

Another example.

```tsx
function Stepper() {
  const [step, setStep] = useSearchParam(
    "step",
    z.enum(["login", "signup", "forgot-password"]).default("signup")
  );

  return (
    <div>
      {step === "login" ? <Login /> : null}
      {step === "signup" ? <Signup /> : null}
      {step === "forgot-password" ? <ForgotPassword /> : null}
    </div>
  );
}
```

These components can affect the state by simply routing with `Link` or `router.push` — instead of
prop drilling `onSuccess` handlers into each component to orchestrate transitions.

Default values are required. Let me know if this is annoying.

## Benefits

Keeping state in search params is user friendly and has DX benefits

- State lives in search params, like a poor man's global `Context`
- Browser back button works and updates state
- zod is a powerful tool to create types

## FAQ

- **URLSearchParams support multiple values for the same key, does this tool too?** No.
- **Values of URLSearchParams are always strings, do I need to zod `preprocess` them?** No. It is
  done by calling `JSON.parse` and `JSON.strinfify` on boolean and number values automatically.
- **What happens to unexpected or illegal values?** They are ignored and default values are used
  instead.

## Next.js 13 and SSR

This does not work inside `/app` client components since router is imported from `next/navigation`
now.

SSR will reach for the default values.
