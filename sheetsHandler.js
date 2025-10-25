const sheetFolderCont = document.querySelector(".sheet-folder-cont");
const addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", () => {
    let sheetFolder = document.createElement("div");
    sheetFolder.setAttribute("class", "sheet-folder");

    let sheetId = document.querySelectorAll(".sheet-folder").length;

    sheetFolder.setAttribute("id", sheetId++);
    sheetFolder.innerHTML = `<div class="sheet-content">Sheet ${sheetId}</div>`;
    sheetFolderCont.appendChild(sheetFolder);

    createNewSheetCellData();
    createNewSheetGraphComponent();
    manageSheetActiveness(sheetFolder);
    removeSheetFromUiAndData(sheetFolder);

    // Switch to the new sheet
    sheetFolder.click();
});

// Manage Sheet Activeness
function manageSheetActiveness(sheet) {
  sheet.addEventListener("click", () => {
    const activeSheetIndex = Number(sheet.getAttribute("id"));

    // Get all sheets (by class, not tag)
    const allSheets = document.querySelectorAll(".sheet-folder");

    // Remove active class from all
    allSheets.forEach((sh) => {
      sh.classList.remove("active-sheet-folder");
    });

    sheet.classList.add("active-sheet-folder");

    switchSheet(activeSheetIndex);
  });
}

// Switch Sheet
function switchSheet (sheetId) {
    updateSheetDataAndGraphComponent(sheetId);
    updateSheetUi();
};

// Update Sheet Data and Graph Component
function updateSheetDataAndGraphComponent (sheetId) {
    cellProps = cellPropsContainer[sheetId];
    graphComponents = graphComponentsContainer[sheetId];
}

// Update Sheet UI
function updateSheetUi () {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.querySelector(`.cell[rId="${i}"][cId="${j}"]`);
            cell.click();
        }
    }

    // Set first cell as active cell on load
    const firstCell = document.querySelectorAll(".cell")[0];
    firstCell.click();
    firstCell.focus();
}

function removeSheetFromUiAndData(sheet) {
  sheet.addEventListener("contextmenu", (e) => {
    e.preventDefault(); // stop browser context menu

    const allSheets = document.querySelectorAll(".sheet-folder");

    if (allSheets.length === 1) {
      alert("At least one sheet must be present.");
      return;
    }

    const sheetId = Number(sheet.getAttribute("id"));
    const confirmDelete = confirm(`Are you sure you want to delete Sheet ${sheetId + 1}?`);
    if (!confirmDelete) return;

    const isActive = sheet.classList.contains("active-sheet-folder");

    // --- Remove from data ---
    cellPropsContainer.splice(sheetId, 1);
    graphComponentsContainer.splice(sheetId, 1);

    removeAndSwitchSheet(sheet);

    // --- Set active sheet ---
    const newActiveIndex = sheetId > 0 ? sheetId - 1 : 0;


    // --- Update data ---
    if(isActive) {
        cellProps = cellPropsContainer[newActiveIndex];
        graphComponents = graphComponentsContainer[newActiveIndex];
    }
    updateSheetUi();
  });
}

function removeAndSwitchSheet(sheet) {
    const sheetId = Number(sheet.getAttribute("id"));
    const isActive = sheet.classList.contains("active-sheet-folder");
    
    // --- Remove from UI ---
    sheet.remove();
    
    const allSheets = document.querySelectorAll(".sheet-folder");
    // --- Update remaining sheets ---
    allSheets.forEach((sh, i) => {
      sh.setAttribute("id", i);
      sh.innerText = `Sheet ${i + 1}`;
    });

    // --- Set active sheet ---
    const newActiveIndex = sheetId > 0 ? sheetId - 1 : 0;
    const newActiveSheet = allSheets[newActiveIndex];
    if(isActive) newActiveSheet.classList.add("active-sheet-folder");
}

// Create New Sheet Cell Data
function createNewSheetCellData () {
    const cellProps = createCellPropsMatrix(100, 26);
    cellPropsContainer.push(cellProps);
};

// Create New Sheet Graph Component
function createNewSheetGraphComponent () {
    let graphComponents = []
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push([]);
        }
        graphComponents.push(row);
    }
    graphComponentsContainer.push(graphComponents);
}

// Utility functions
function createCellPropsMatrix (rows, cols) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            textColor: "#000000",
            bgColor: "#ffffff",
            fontFamily: "monospace",
            fontSize: "14",
            value: '',
            formula: '',
            children: []
        }))
    );
}