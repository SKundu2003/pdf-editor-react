import { useRef, useCallback } from 'react';

export const useAnnotationState = () => {
    const originalTextMap = useRef<Map<string, string>>(new Map());
    const editModeEnabled = useRef<boolean>(false);

    const storeOriginalText = useCallback((id: string, text: string) => {
        originalTextMap.current.set(id, text);
    }, []);

    const getOriginalText = useCallback((id: string) => {
        return originalTextMap.current.get(id);
    }, []);

    const setEditMode = useCallback((enabled: boolean) => {
        editModeEnabled.current = enabled;
    }, []);

    return {
        storeOriginalText,
        getOriginalText,
        setEditMode,
        isEditModeEnabled: () => editModeEnabled.current
    };
};
