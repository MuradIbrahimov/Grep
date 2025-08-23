interface PatternState {
  pattern: string;
  tokens: any[] | null;
  ast: any | null;
  error: string | null;
}

const initialState = {
  pattern: "",
  tokens: null,
  ast: null,
  error: null
};


export const handleTree = (state = initialState, action: any) => {
  switch (action.type) {
    case "UPDATE_PATTERN":
      return {
        ...state,
        pattern: action.payload.pattern,
        tokens: action.payload.tokens,
        ast: action.payload.ast,
        error: action.payload.error
      };
    // Keep your existing cases if any
    default:
      return state;
  }
};

// Update your RootState type to include the pattern state
export interface RootState {
  handleDocument: any; // your existing document state
  pattern: PatternState; // add this line
}
export default handleTree