for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const currentCell = document.querySelector(`.cell[rId="${row}"][cId="${col}"]`);
        if (!currentCell) continue;
        currentCell.addEventListener('blur', (event) => {
            const address = addressBar.value
            const [cell, cellProp] = getActiveCellAndCellPropFromCellAddress(address);
            const modifiedValue = cell.innerHTML;
            if (modifiedValue === cellProp.value) return;

            // Remove old formula after P-C relationship change
            cellProp.value = modifiedValue;

            if (cellProp.formula) {
                removeChildFromParent(cellProp.formula);
                cellProp.formula = "";
            }
            updateChildrenCells(cellProp);
        })
    }
};


const formulaBar = document.querySelector('.formula-bar');
formulaBar.addEventListener('keydown', async (event) => {
    let formula = formulaBar.value;
    if (event.key === 'Enter' && formula) {
        const address = addressBar.value;
        const [cell, cellProp] = getActiveCellAndCellPropFromCellAddress(address);

        // Remove old formula after P-C relationship change
        if (cellProp.formula !== formula) {
            removeChildFromParent(cellProp.formula);
        }

        // Add new formula to Graph Components
        addChildToGraphComponents(formula, address);

        const isCyclicResponse = isGraphCyclic()

        if(isCyclicResponse) {
            let trace = confirm("Your formula is cyclic. Do you want to trace the cycle path?") 
            while(trace) {
                await traceCyclicPath(graphComponents, isCyclicResponse);
                trace = confirm("Your formula is cyclic. Do you want to trace the cycle path?") 
            }

            // Remove the recently added formula from Graph Components
            removeChildFromGraphComponent(formula);
            return;
        }

        // Add new formula to P-C relationship
        addClildToParent(formula);

        // Evaluate formula
        const evaluatedValue = evaluateFormula(formula);
        setCellValueAndFormula(evaluatedValue, formula);

        // Update dependent children
        updateChildrenCells(cellProp);
    }
});

// Add Child to Graph Components
const addChildToGraphComponents = (formula, childAddress) => {
    const [childRowId, childColId] = decodeRowIdAndColIdFromAddressStr(childAddress);
    let formulaTokens = formula.split(" ");
    for (const idx in formulaTokens) {
        const token = formulaTokens[idx];
        const currentTokenAscii = token.charCodeAt(0);
        if (currentTokenAscii >= 65 && currentTokenAscii <= 90) {
            const [parentRowId, parentColId] = decodeRowIdAndColIdFromAddressStr(token);
            graphComponents[parentRowId][parentColId].push([childRowId, childColId]);
        }
    };
}

// Remove Child from Graph Components
const removeChildFromGraphComponent = (formula,) => {
    let formulaTokens = formula.split(" ");
    for (const idx in formulaTokens) {
        const token = formulaTokens[idx];
        const currentTokenAscii = token.charCodeAt(0);
        if (currentTokenAscii >= 65 && currentTokenAscii <= 90) {
            const [parentRowId, parentColId] = decodeRowIdAndColIdFromAddressStr(token);
            graphComponents[parentRowId][parentColId].pop();
        }
    };
}

// Add Child to Parent Storages
const addClildToParent = (formula) => {
    const childAddress = addressBar.value;
    let formulaTokens = formula.split(" ");
    for (const idx in formulaTokens) {
        const token = formulaTokens[idx];
        const currentTokenAscii = token.charCodeAt(0);
        if (currentTokenAscii >= 65 && currentTokenAscii <= 90) {
            const [parentCell, parentCellProp] = getActiveCellAndCellPropFromCellAddress(token);
            parentCellProp.children.push(childAddress);}
    };
}

// Remove Child from Parent Storages after formula change
const removeChildFromParent = (oldFormula) => {
    const childAddress = addressBar.value;
    let formulaTokens = oldFormula.split(" ");
    for (const idx in formulaTokens) {
        const token = formulaTokens[idx];
        const currentTokenAscii = token.charCodeAt(0);
        if (currentTokenAscii >= 65 && currentTokenAscii <= 90) {
            const [parentCell, parentCellProp] = getActiveCellAndCellPropFromCellAddress(token);
            const idx = parentCellProp.children.indexOf(childAddress);
            if (idx > -1) {
                parentCellProp.children.splice(idx, 1);
            }
        }
    };
}

// Evaluate space separated formula
const evaluateFormula = (formula) => {
    let formulaTokens = formula.split(" ");
    for (const idx in formulaTokens) {
        const token = formulaTokens[idx];
        const currentTokenAscii = token.charCodeAt(0);
        if (currentTokenAscii >= 65 && currentTokenAscii <= 90) {
            const [cell, cellProp] = getActiveCellAndCellPropFromCellAddress(token);
            formulaTokens[idx] = cellProp.value;
        }
    };
    return String(eval(formulaTokens.join(" ")));
}

// Update all children cells recursively
const updateChildrenCells = (parentCellProp) => {
    for (const idx in parentCellProp.children) {
        const childAddress = parentCellProp.children[idx];
        const [childCell, childCellProp] = getActiveCellAndCellPropFromCellAddress(childAddress);
        const evaluatedValue = evaluateFormula(childCellProp.formula);
        childCell.innerHTML = evaluatedValue;
        childCellProp.value = evaluatedValue;
        updateChildrenCells(childCellProp);
    }
}

// Set Cell formula and calculated value
const setCellValueAndFormula = (evaluatedValue, formula) => {
    const address = addressBar.value;
    const [cell, cellProp] = getActiveCellAndCellPropFromCellAddress(address);
    cell.innerHTML = evaluatedValue;
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}