# `useSearchParams()`

Type-safe search param handling for [Next.js](https://nextjs.org/) using zod.

## Install

```
npm install @jokullsolberg/next-use-search-params
```

## Example usage

```tsx
function Signup() {
  const [{ foo, bar, date }, setSearchParam] = useSearchParams({
    foo: z.string().default(''),
    bar: z.coerce.number().default(1),
    date: z.coerce.date().default(new Date()),
    screen: z.enum(['login', 'signup']).default('login'),
  });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'start',
      }}
    >
      <h2>Signup</h2>
      <input
        value={foo}
        onChange={(event) => setSearchParam('foo', event.target.value)}
      />
      <input
        type="number"
        value={String(bar)}
        onChange={(event) => setSearchParam('bar', event.target.valueAsNumber)}
      />
      <input
        type="date"
        value={date.toISOString().split('T')[0]}
        onChange={(event) =>
          setSearchParam('date', event.target.valueAsDate ?? new Date())
        }
      />
      <p>{date.toISOString()}</p>
      <button onClick={() => setSearchParam('screen', 'login')}>Login</button>
    </div>
  );
}

export default function Page() {
  const [{ screen }, setSearchParam] = useSearchParams({
    screen: z.enum(['login', 'signup']).default('login'),
  });
  return screen === 'login' ? (
    <div>
      Login{' '}
      <button onClick={() => setSearchParam('screen', 'signup')}>Signup</button>
    </div>
  ) : (
    <Signup />
  );
}
```

These components can affect the state by simply routing with `Link` or `router.push` — instead of
prop drilling `onSuccess` handlers into each component to orchestrate transitions.

Default values are required. Let me know if this is annoying.

## Benefits

Keeping state in search params is user friendly and has DX benefits

- State lives in search params, like a poor man's global `Context`.
- Browser back button works and updates state.
- zod is a powerful tool to validate data and type values.
- Default values are not displayed in the URL to keep it clean.
- Because state is global multiple components can bind simultaneously to the same param. This helps
  avoid prop drilling `onSuccess` handlers.

## FAQ

- **URLSearchParams support multiple values for the same key, does this tool too?** No.
- **Values of URLSearchParams are always strings, do I need to zod `preprocess` them?** No. Use the
  new `z.coerce` stuff instead. Internally we call `JSON.stringify` or `Date.toISOString()` to
  marshal back to URL.
- **What happens to unexpected or illegal values?** They are ignored and default values are used
  instead.

## Next.js 13 and SSR

This does not work inside `/app` client components since router is imported from `next/navigation`
now.

SSR will reach for the default values.
