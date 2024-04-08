# State Syncer

A simple state management library for React.js applications.


<p align="center">

[![version](https://img.shields.io/npm/v/state-syncer.svg)](https://www.npmjs.com/package/state-syncer)

</p>

## Installation

```sh
npm i state-syncer
```

## Usage

You can create your store like this.

**usePosts.ts**
```ts
import { createSlice } from "state-syncer";

type State = {
    count: number
}


const initialState: State = {
    count: 0,
};

export const { useGlobalState: useCounter } = createSlice(initialState);
```

Then use with relevant components 

**Counter**

```tsx
import { useCounter } from "@/store/useCounter";

export default function Counter() {
    const [ count, setCount ] = useCounter('count');
    return (
        <div>
            <p>Count: {count}</p>
            <div>
                <button onClick={() => setCount(prevValue => prevValue + 1)}>
                    Increment
                </button>

                <button onClick={() => setCount(prevValue => prevValue - 1)}>
                    Decrement
                </button>
            </div>
        </div>
    );
};
```

**Foo**

```tsx
import { useCounter } from "@/store/useCounter";

export default function Foo() {
    const [ count ] = useCounter('count');
    return (
        <p>Counter : {count}</p>
    )
}
```

<br /> 

## License

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/mustafadalga/state-syncer/blob/main/LICENSE)


