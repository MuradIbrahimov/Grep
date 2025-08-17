import type { DocumentState } from "../redux/reducer/handleDocument";
export const addDocument = (document: DocumentState) => ({
    type: 'ADD_DOCUMENT',
    payload: document
});