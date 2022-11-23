import { z } from 'zod';
import { useSearchParam } from '../src';

export default function Page() {
  const [name, setName] = useSearchParam('name', z.string().default(''));
  const [num, setNum] = useSearchParam('num', z.number().default(1));
  const [nullableId, setNullableId] = useSearchParam(
    'nullableId',
    z.number().nullable().default(1)
  );
  const [mobile, setMobile] = useSearchParam(
    'mobile',
    z.boolean().default(true)
  );
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
        <div>
          <strong>nullableId</strong>:{' '}
          <span data-testid="nullableId">{String(nullableId)}</span> is{' '}
          {typeof nullableId}
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <input
          value={name}
          onChange={({ target }) => {
            setName(target.value);
          }}
          className="rounded-lg border px-2 py-1"
        />
        <button
          className="rounded-lg border px-2 py-1"
          onClick={() => {
            setNum(num + 1);
          }}
        >
          Increment id
        </button>
        <div className="flex gap-4">
          <button
            className="rounded-lg border px-2 py-1"
            onClick={() => {
              setNullableId(
                typeof nullableId === 'number' ? nullableId + 1 : 1
              );
            }}
          >
            Increment nullable id
          </button>
          <button
            className="rounded-lg border px-2 py-1"
            onClick={() => {
              setNullableId(null);
            }}
          >
            Nullify nullableId
          </button>
        </div>
        <button
          className="rounded-lg border px-2 py-1"
          onClick={() => {
            setMobile(!mobile);
          }}
        >
          Flip
        </button>
      </div>
    </div>
  );
}
