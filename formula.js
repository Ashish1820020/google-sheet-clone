for (let row = 0; row<rows; row++) {
    for (let col = 0; col<cols; col++) {
            const currentCell = document.querySelector(`.cell[rId="${row}"][cId="${col}"]`);
            if(!currentCell) continue;
            currentCell.addEventListener('blur', (event) => {
                const address = addressBar.value
                const [cell, cellProp] = getActiveCellAndCellPropFromCellAddress(address);
                const modifiedValue = cell.innerHTML;

                cellProp.value = modifiedValue;
                console.log(cellProp)

            })
    }
};