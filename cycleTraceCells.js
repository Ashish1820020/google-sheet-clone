const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const changeBgColor = async (cell, color, time) => {
    cell.style.backgroundColor = color;
    if(time) await delay(time);
}

// Trace Cyclic Path
const traceCyclicPath = async (graphComponents, cycleDetectionResponse) => {
    const [rowId, colId] = cycleDetectionResponse;
    const visited = [];
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

    const response = await detectCycleTracePath(graphComponents, rowId, colId, visited, dfsVisited);
    if (response === true) return true;

    return false;
}

// Detect Cycle and Trace Path using DFS and Animation
const detectCycleTracePath = async (graphComponents, srcr, srcc, visited, dfsVisited) => {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    const childrens = graphComponents[srcr][srcc];
    const currentCell = document.querySelector(`.cell[rId="${srcr}"][cId="${srcc}"]`);

    
    await changeBgColor(currentCell, "lightBlue", 1000);


    for (let index = 0; index < childrens.length; index++) {
        const [crid, ccid] = childrens[index];
        const cridNum = Number(crid);
        const ccidNum = Number(ccid);

        // Check childs
        if (visited[cridNum][ccidNum] === false) {
            const isCyclic = await detectCycleTracePath(graphComponents, cridNum, ccidNum, visited, dfsVisited);
            if (isCyclic === true) {
                await changeBgColor(currentCell, "transparent");
                return true;
            }
        }
        else if (visited[cridNum][ccidNum] === true && dfsVisited[cridNum][ccidNum] === true) {
            const cyclicCell = document.querySelector(`.cell[rId="${cridNum}"][cId="${ccidNum}"]`);

            await changeBgColor(cyclicCell, "lightsalmon", 1000);
            
            await changeBgColor(cyclicCell, "transparent");
            
            await changeBgColor(currentCell, "transparent");

            return true;
        }
    }


    dfsVisited[srcr][srcc] = false;
    return false;
}   