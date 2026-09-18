import { createContext, useContext, useEffect, useState } from 'react';

// Split into two contexts on purpose. useRegisterTopbar (called by pages)
// only needs the setter — if it consumed the same context that carries the
// `actions` value, calling setActions would change that context's value,
// re-render every consumer (including the page itself), whose effect would
// call setActions again: an infinite render loop.
const TopbarActionsContext = createContext({});
const TopbarSetterContext = createContext(null);

export function TopbarProvider({ children }) {
    const [actions, setActions] = useState({});

    return (
        <TopbarSetterContext.Provider value={setActions}>
            <TopbarActionsContext.Provider value={actions}>
                {children}
            </TopbarActionsContext.Provider>
        </TopbarSetterContext.Provider>
    );
}

export function useTopbarActions() {
    return useContext(TopbarActionsContext);
}

/**
 * Let a page register interactive topbar controls (search, filter, view
 * toggle, new-task button) from inside its own component body, since the
 * persistent AuthenticatedLayout.layout wrapper is a plain function with no
 * hook access to page state.
 */
export function useRegisterTopbar(config) {
    const setActions = useContext(TopbarSetterContext);

    // Re-registers on every render (functions/values are typically inline
    // at the call site, so identity-based deps would be unreliable). Safe
    // here because the setter's identity is stable, so this page itself
    // never re-renders as a result.
    useEffect(() => {
        setActions?.(config);
    });

    useEffect(() => () => setActions?.({}), [setActions]);
}
