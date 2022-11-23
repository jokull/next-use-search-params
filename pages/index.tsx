import { z } from 'zod';
import { useSearchParam } from '../src';

export default function Counter() {
  const [num, setNum] = useSearchParam('num', z.number().default(1));

  return (
    <div>
      <pre>{num}</pre>
      <button onClick={() => setNum(num + 1)}>Click me</button>
    </div>
  );
}
