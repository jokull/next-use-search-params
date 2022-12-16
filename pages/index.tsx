import { z } from 'zod';
import { useSearchParams } from '../src';

export default function Page() {
  const [{ name, num, mobile }, setParam] = useSearchParams({
    name: z.string().default(''),
    num: z.coerce.number().default(1),
    mobile: z.boolean().default(true),
  });
  return (
    <div className="m-12 mx-auto max-w-md">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <strong>name</strong>: <span data-testid="name">{name}</span> is{' '}
          {typeof name}
        </div>
        <div>
          <strong>id</strong>: <span data-testid="id">{num}</span> is{' '}
          {typeof num}
        </div>
        <div>
          <strong>mobile</strong>: {String(mobile)} is {typeof mobile}
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <input
          value={name}
          onChange={({ target }) => {
            setParam('name', target.value);
          }}
          className="rounded-lg border px-2 py-1"
        />
        <button
          className="rounded-lg border px-2 py-1"
          onClick={() => {
            setParam('num', num + 1);
          }}
        >
          Increment id
        </button>
        <button
          className="rounded-lg border px-2 py-1"
          onClick={() => {
            setParam('mobile', !mobile);
          }}
        >
          Flip
        </button>
      </div>
    </div>
  );
}
