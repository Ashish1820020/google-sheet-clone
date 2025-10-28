let ctrlKey;
const selectedCells = [];
const copyCutContainer= [];
const copyBtn = document.querySelector('.copyBtn');
const cutBtn = document.querySelector('.cutBtn');
const pasteBtn = document.querySelector('.pasteBtn');

document.addEventListener('keydown', (event) => {
    ctrlKey = event.ctrlKey || event.metaKey;;
});
document.addEventListener('keyup', (event) => {
    ctrlKey = event.ctrlKey || event.metaKey;;
});


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const cell = document.querySelector(`.cell[rid="${row}"][cid="${col}"]`);
        handleCellRangeSelection(cell);
    }
}

function handleCellRangeSelection(cell) {
    cell.addEventListener('click', (event) => {
        if (!ctrlKey) {
            clearCellSelection();
            return;
        }
        if (selectedCells.length >= 2) {
            clearCellSelection();
            return;
        }
        const rid = Number(cell.getAttribute('rid'));
        const cid = Number(cell.getAttribute('cid'));
        cell.classList.add('selected-cell');
        selectedCells.push([rid, cid]);
    })
}

function clearCellSelection() {
    for (let i = 0; i < selectedCells.length; i++) {
        const [rid, cid] = selectedCells[i];
        const cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
        cell.classList.remove('selected-cell');
    }
    selectedCells.length = 0;
}

// Copy, Cut, Paste Event Listeners
copyBtn.addEventListener('click', (event) => {
    if (selectedCells.length < 2) return;
    copyCutContainer.length = 0;
    const [startCell, endCell] = selectedCells;
    const [startRId, startCId] = startCell;
    const [endRId, endCId] = endCell;

    const rowStart = Math.min(startRId, endRId);
    const rowEnd = Math.max(startRId, endRId);
    const colStart = Math.min(startCId, endCId);
    const colEnd = Math.max(startCId, endCId);

     for (let i = rowStart; i <= rowEnd; i++) {
        const rowArr = [];
        for (let j = colStart; j <= colEnd; j++) {
            rowArr.push(cellProps[i][j]);
        }
        copyCutContainer.push(rowArr);
    }
});

cutBtn.addEventListener('click', (event) => {
    if (selectedCells.length < 2) return;
    copyCutContainer.length = 0;
    const [startCell, endCell] = selectedCells;
    const [startRId, startCId] = startCell;
    const [endRId, endCId] = endCell;

    const rowStart = Math.min(startRId, endRId);
    const rowEnd = Math.max(startRId, endRId);
    const colStart = Math.min(startCId, endCId);
    const colEnd = Math.max(startCId, endCId);

     for (let i = rowStart; i <= rowEnd; i++) {
        const rowArr = [];
        for (let j = colStart; j <= colEnd; j++) {
            const cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            const prop = cellProps[i][j];
            rowArr.push(prop);

            // Reset cell properties
            cellProps[i][j] = {
                ...prop,
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                textColor: "#000000",
                bgColor: "#ffffff",
                fontFamily: "monospace",
                fontSize: "14",
                value: '',
            }
            cell.click();
        }
        copyCutContainer.push(rowArr);
    }
});

pasteBtn.addEventListener('click', (event) => {
    if (copyCutContainer.length < 2) return;

    const address = addressBar.value;
    const [startRId, startColId] = decodeRowIdAndColIdFromAddressStr(address);
    for (let i = 0; i < copyCutContainer.length; i++) {
        for (let j = 0; j < copyCutContainer[i].length; j++) {
            const targetRow = startRId + i;
            const targetCol = startColId + j;
            
            const cell = document.querySelector(`.cell[rid="${targetRow}"][cid="${targetCol}"]`);
            if(!cell) continue;
            
            const prop = copyCutContainer[i][j];

            // Deep clone and remove unwanted fields
            const styleCopy = { 
                ...prop, 
                formula: '',
                children: []
            };

            cellProps[targetRow][targetCol] = styleCopy;

            cell.click();
        }
    }
    const currentSheetIndex = Number(document.querySelector('.active-sheet-folder').getAttribute('id'));
    cellPropsContainer[currentSheetIndex] = cellProps;
});