interface TreeNode {
    id: string;
    name: string;
    children: TreeNode[];
}

const handleTree = (state: { nodes: TreeNode[] }, action: { type: string; payload: TreeNode }) => {
    const node = action.payload;

    switch (action.type) {
        case "ADD_NODE":
            return {
                ...state,
                nodes: [...state.nodes, action.payload],
            };
        case "REMOVE_NODE":
            return {
                ...state,
                nodes: state.nodes.filter(node => node.id !== action.payload.id),
            };
        default:
            return state;
    }
}
export default handleTree