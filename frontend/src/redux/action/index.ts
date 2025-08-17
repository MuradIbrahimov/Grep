import type { DocumentState } from "../reducer/handleDocument";
export const addDocument = (document: DocumentState) => ({
    type: 'ADD_DOCUMENT',
    payload: document
});