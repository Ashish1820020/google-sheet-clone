// Constants
const activeColor = "#d1d8e0";
const inactiveColor = "#ecf0f1";

// Cell properties matrix
const cellProps = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        textColor: "#000000",
        bgColor: "#ffffff",
        fontFamily: "monospace",
        fontSize: "14"
    }))
);

// Utility functions
const decodeRowIdAndColIdFromAddressStr = (address) => [
    Number(address.slice(1)),
    address.charCodeAt(0) - 65
];

const getActiveCellAndCellPropFromCellAddress = (address) => {
    const [rId, cId] = decodeRowIdAndColIdFromAddressStr(address);
    const activeCell = document.querySelector(`.cell[rId="${rId}"][cId="${cId}"]`);
    return [activeCell, cellProps[rId][cId]];
};

const updateStyle = (element, condition) => {
    element.style.backgroundColor = condition ? activeColor : inactiveColor;
};

const applyCellStyles = (cell, props) => {
    cell.style.fontWeight = props.bold ? "bold" : "normal";
    cell.style.textDecoration = props.underline ? "underline" : "none";
    cell.style.fontStyle = props.italic ? "italic" : "normal";
    cell.style.fontFamily = props.fontFamily;
    cell.style.fontSize = `${props.fontSize}px`;
    cell.style.color = props.textColor;
    cell.style.backgroundColor = props.bgColor;
    cell.style.textAlign = props.alignment;
};

const updateToolbarStyles = (props) => {
    updateStyle(bold, props.bold);
    updateStyle(italic, props.italic);
    updateStyle(underline, props.underline);
    fontFamily.value = props.fontFamily;
    fontSize.value = props.fontSize;
    textColor.value = props.textColor;
    bgColor.value = props.bgColor;

    Object.entries(alignmentMap).forEach(([key, element]) => {
        updateStyle(element, key === props.alignment);
    });
};

// UI Elements
const allCells = document.querySelectorAll(".cell");
const bold = document.querySelector(".bold");
const italic = document.querySelector(".italic");
const underline = document.querySelector(".underline");
const fontFamily = document.querySelector(".font-family");
const fontSize = document.querySelector(".font-size");
const textColor = document.querySelector(".font-color-input");
const bgColor = document.querySelector(".bg-color-input");
const alignment = document.querySelectorAll(".alignment");
const alignmentMap = {
    left: alignment[0],
    center: alignment[1],
    right: alignment[2],
};

// Event Listeners
const toggleStyle = (key, cssProp, element) => {
    element.addEventListener("click", () => {
        const address = addressBar.value;
        const [cell, prop] = getActiveCellAndCellPropFromCellAddress(address);
        prop[key] = !prop[key];
        cell.style[cssProp] = prop[key] ? key : (cssProp === "fontWeight" ? "normal" : "none");
        updateStyle(element, prop[key]);
    });
};

toggleStyle("bold", "fontWeight", bold);
toggleStyle("italic", "fontStyle", italic);
toggleStyle("underline", "textDecoration", underline);

const bindStyleChange = (element, key, callback) => {
    element.addEventListener("change", (e) => {
        const value = e.target.value;
        const address = addressBar.value;
        const [cell, prop] = getActiveCellAndCellPropFromCellAddress(address);
        prop[key] = value;
        callback(cell, value);
    });
};

bindStyleChange(fontFamily, "fontFamily", (cell, val) => cell.style.fontFamily = val);
bindStyleChange(fontSize, "fontSize", (cell, val) => cell.style.fontSize = `${val}px`);
bindStyleChange(textColor, "textColor", (cell, val) => cell.style.color = val);
bindStyleChange(bgColor, "bgColor", (cell, val) => cell.style.backgroundColor = val);

alignment.forEach((item) => {
    item.addEventListener("click", (e) => {
        const alignValue = e.target.classList[0];
        const address = addressBar.value;
        const [cell, prop] = getActiveCellAndCellPropFromCellAddress(address);
        prop.alignment = alignValue;
        cell.style.textAlign = alignValue;
        updateToolbarStyles(prop);
    });
});

allCells.forEach((cell) => {
    cell.addEventListener("click", () => {
        const address = addressBar.value;
        const [activeCell, props] = getActiveCellAndCellPropFromCellAddress(address);
        applyCellStyles(activeCell, props);
        updateToolbarStyles(props);
    });
});