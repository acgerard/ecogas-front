import { useEffect, useRef } from 'react';

function noop() {}
export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void >(noop);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}