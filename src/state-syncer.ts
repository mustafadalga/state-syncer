import { useEffect, useState } from "react";

type SetValueFunction<Key extends keyof State, State> = (value: State[Key] | NextValueFunction<Key, State>) => void;
type NextValueFunction<Key extends keyof State, State> = (prevValue: State[Key]) => State[Key];
type NextValue<Key extends keyof State, State> = State[Key] | NextValueFunction<Key, State>;

interface Action<Key extends keyof State, State> {
    type: "SET_VALUE";
    payload: {
        key: Key;
        nextValue: NextValue<Key, State>;
    };
}

type Listener<T> = (value: T) => void;
type ArrayKeys<State> = Array<keyof State>

function createInitialListeners<State extends object>(state: State): Record<keyof State, Set<Listener<unknown>>> {
    const keys = Object.keys(state) as ArrayKeys<State>;
    const listenerSets = keys.map(key => [ key, new Set<Listener<unknown>> ]);
    return Object.fromEntries(listenerSets);
}

export function createSlice<State extends Record<string, unknown>>(initialState: State) {
    let globalState = initialState;
    const listeners = createInitialListeners<State>(initialState);

    function reducer<Key extends keyof State>(state: State, action: Action<Key, State>): State {
        switch (action.type) {
            case 'SET_VALUE': {
                const { key, nextValue } = action.payload;
                const value = typeof nextValue === 'function' ? (nextValue as NextValueFunction<Key, State>)(state[key]) : nextValue
                return {
                    ...state,
                    [key]: value
                };
            }
            default:
                return state;
        }
    }

    function dispatch<Key extends keyof State>(action: Action<Key, State>) {
        const prevState = globalState;
        globalState = reducer(globalState, action);
        Object.keys(globalState).forEach(key => {
            if (prevState[key] !== globalState[key]) {
                listeners[key].forEach((listener) => listener(globalState[key]));
            }
        });
    }

    function useGlobalState<Key extends keyof State>(key: Key): [ State[Key], SetValueFunction<Key, State> ] {
        const [ state, setState ] = useState<State[Key]>(globalState[key]);
        const setValue = (nextValue: State[Key] | NextValueFunction<Key, State>) => {
            dispatch({
                type: 'SET_VALUE',
                payload: {
                    key,
                    nextValue
                }
            })
        }

        useEffect(() => {
            const listener = (newValue: unknown) => {
                setState(newValue as State[Key]);
            };
            listeners[key].add(listener);
            return () => {
                listeners[key].delete(listener)
            };
        }, [ key ]);
        return [ state, setValue ]
    }

    return { useGlobalState };
}