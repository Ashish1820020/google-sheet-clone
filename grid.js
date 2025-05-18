const cols = 26;
const rows = 100;

const addressColCont = document.querySelector(".address-column-cont");
const addressRowCont = document.querySelector(".address-row-cont");
const cellCont = document.querySelector(".cell-cont");
const addressBar = document.querySelector(".address-bar");

for (let row = 1; row<=rows; row++) {
    const colCell = document.createElement("div");
    colCell.innerText = row;
    colCell.setAttribute("class", "address-col");
    addressColCont.appendChild(colCell)
}

for (let col = 0; col<cols; col++) {
    const rowCell = document.createElement("div");
    rowCell.innerText = String.fromCharCode(65 + col);
    rowCell.setAttribute("class", "address-row");
    addressRowCont.appendChild(rowCell)
}

for (let row = 0; row<rows; row++) {
    const rowBar = document.createElement("div");
    rowBar.setAttribute("class", "row-cont");
    for (let col = 0; col<cols; col++) {
        const cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("tabindex", 0);        
        cell.setAttribute("spellcheck", "false");
        cell.setAttribute("rId", row+1);
        cell.setAttribute("cId", col);
        addClickListnerForCell(cell, row, col);
        rowBar.appendChild(cell);
    }
    cellCont.appendChild(rowBar);
};

function addClickListnerForCell (cell, i, j) {
    const colId = i+1;
    const rowId = String.fromCharCode(65+j);
    cell.addEventListener("click", () => {
        addressBar.value = `${rowId}${colId}`
    });
};

const cells = document.querySelectorAll(".cell");
cells[0].click();
cells[0].focus();
