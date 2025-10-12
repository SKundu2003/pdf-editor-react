import WebViewer from '@pdftron/webviewer';

export const setupTextEditing = (instance: any, mode: string, handleTextEdit: any) => {
    const { Core, UI } = instance;
    const { documentViewer } = Core;

    // Enable text editing
    if (mode === 'text') {
        UI.enableFeatures([UI.Feature.TextSelection]);
        UI.setToolMode('TextSelect');

        // Enable content editing mode
        const contentEditManager = documentViewer.getContentEditManager();
        contentEditManager.enableContentEdit();

        // Add double-click handler for text editing
        const handler = (e: MouseEvent) => {
            if (mode !== 'text') return;

            const windowCoordinates = {
                x: e.clientX,
                y: e.clientY,
            };

            const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
            const page = displayMode.getSelectedPages(windowCoordinates, windowCoordinates);

            if (page.first !== null) {
                const pageNumber = page.first;
                const pageCoordinates = displayMode.windowToPage(windowCoordinates, pageNumber);

                contentEditManager.startContentEdit(pageCoordinates, pageNumber);
            }
        };

        document.addEventListener('dblclick', handler);
        return () => document.removeEventListener('dblclick', handler);
    }
};

export const handleTextEditOperation = async (
    instance: any,
    oldText: string,
    newText: string,
    pageNumber: number
): Promise<boolean> => {
    const { Core } = instance;
    const { documentViewer } = Core;

    try {
        const contentEditManager = documentViewer.getContentEditManager();
        const quads = await documentViewer.getTextQuads(pageNumber, oldText);

        if (quads && quads.length > 0) {
            const firstQuad = quads[0];
            await contentEditManager.replaceText({
                start: { x: firstQuad.x1, y: firstQuad.y1, pageNumber },
                end: { x: firstQuad.x3, y: firstQuad.y3, pageNumber },
                text: newText
            });

            // Wait for the operation to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error during text edit operation:', error);
        return false;
    }
};
