const download = document.querySelector('.download');
const upload = document.querySelector('.open');

download.addEventListener('click', (event) => {
    const activeSheetId = document.querySelector('.active-sheet-folder').getAttribute('id')
    const data = {
        cellProps,
        graphComponents
    };
    const dataStr = JSON.stringify(data);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sheet_${activeSheetId+1}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});


upload.addEventListener('click', (event) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const content = event.target.result;
            const data = JSON.parse(content);

            // Create a new sheet to load data into
            addSheetBtn.click(); 

            // Set the cellProps and graphComponents of the new sheet
            cellProps = data.cellProps;
            graphComponents = data.graphComponents;
            cellPropsContainer[cellPropsContainer.length - 1] = cellProps;
            graphComponentsContainer[graphComponentsContainer.length - 1] = graphComponents;

            // Switch to the newly added sheet
            updateSheetUi();
        });
        reader.readAsText(file);
    });

    input.click();
});