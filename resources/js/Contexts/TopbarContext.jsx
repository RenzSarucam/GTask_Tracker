import { createContext, useContext, useEffect, useState } from 'react';

const TopbarContext = createContext(null);

export function TopbarProvider({ children }) {
    const [actions, setActions] = useState({});

    return (
        <TopbarContext.Provider value={{ actions, setActions }}>{children}</TopbarContext.Provider>
    );
}

export function useTopbarActions() {
    const ctx = useContext(TopbarContext);
    return ctx?.actions ?? {};
}

/**
 * Let a page register interactive topbar controls (search, filter, view
 * toggle, new-task button) from inside its own component body, since the
 * persistent AuthenticatedLayout.layout wrapper is a plain function with no
 * hook access to page state.
 */
export function useRegisterTopbar(config) {
    const ctx = useContext(TopbarContext);

    // Re-registers on every render (functions/values are typically inline
    // at the call site, so identity-based deps would be unreliable). Cheap:
    // it only updates state one level up in AuthenticatedLayout.
    useEffect(() => {
        ctx?.setActions(config);
    });

    useEffect(() => () => ctx?.setActions({}), []);
}
