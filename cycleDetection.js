let graphComponentsContainer = []
let graphComponents = []


// Check if Graph is Cyclic
const isGraphCyclic = () => {
    const visited = []; // tracks visited nodes
    const dfsVisited = []; 

    for (let i = 0; i < rows; i++) {
        const visitedRow = [];
        const dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (visited[i][j] === false) {
                const response = detectCycle(graphComponents, i, j, visited, dfsVisited);
                if (response === true) {
                    return [i, j];
                }
            }
        }
    }
    return null;
}


// Detect Cycle using DFS
// 1. visited array to keep track of visited nodes
// 2. dfsVisited array to keep track of nodes in the current dfs path
// 3. If we encounter a node that is already in the current dfs path, then there is a cycle
// 4. Backtrack and remove the node from the current dfs path
const detectCycle = (graphComponents, srcr, srcc, visited, dfsVisited) => {
    visited[srcr][srcc] = true; 
    dfsVisited[srcr][srcc] = true;

    const childrens = graphComponents[srcr][srcc];

    for (let index = 0; index < childrens.length; index++) {
        const [crid, ccid] = childrens[index];
        const cridNum = Number(crid);
        const ccidNum = Number(ccid);

        // Check childs
        if (visited[cridNum][ccidNum] === false) {
            const isCyclic = detectCycle(graphComponents, cridNum, ccidNum, visited, dfsVisited);
            if (isCyclic === true) {
                return true;
            }
        }  
        // already visited and in the same dfs path
        // 1 -> 2 -> 3 -> 1
        else if (visited[cridNum][ccidNum] === true && dfsVisited[cridNum][ccidNum] === true) {
            return true
        }
    }
    dfsVisited[srcr][srcc] = false;
    return false

}   