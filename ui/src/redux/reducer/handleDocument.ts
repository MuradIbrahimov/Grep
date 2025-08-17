interface DocumentState{
    id:string
    name:string
    content:string
}

const initialState: DocumentState[] = [];

const documentSlice = (state = initialState, action: { type: string; payload: DocumentState }) => {
    switch (action.type) {
        case 'ADD_DOCUMENT':
            return [...state, action.payload];
        case 'REMOVE_DOCUMENT':
            return state.filter(doc => doc.id !== action.payload.id);
        default:
            return state;
    }
};
