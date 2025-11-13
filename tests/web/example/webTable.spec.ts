import { test, expect } from '@playwright/test';
import { logInfo } from '@src/utils/report/Logger';

test('Read all data from table', async ({ page }) => {
    //navigate to URL
    //Locate Table
    //Find number of rows in table
    //Traverse rows
    //Find number of column in each row
    //Traverse columns & print values

    await page.goto('https://the-internet.herokuapp.com/tables')
    const rows = await page.locator("//*[@id='table1']").locator("tbody").locator("tr");
    const columnHeader = await page.locator("//*[@id='table1']").locator("thead").locator("tr").locator("th");
    const columnHeaderCount = await columnHeader.count();
    const headerText = [];
    for (let i = 0; i < columnHeaderCount; i++) {
        headerText.push(await columnHeader.nth(i).textContent());
    }
    logInfo(`Header Text: ${headerText.join('|')}`);


    const count = await rows.count();
    logInfo(`Number of rows in table: ${count}`);
    for (let i = 0; i < count; i++) {
        const columns = rows.nth(i).locator("td");
        const columnCount = await columns.count();
        logInfo(`Number of columns in row ${i + 1}: ${columnCount}`);
        const rowData = [];
        for (let j = 0; j < columnCount; j++) {
            const cellText = await columns.nth(j).textContent();
            rowData.push(cellText);
        }
        logInfo(`Row ${i + 1}: ${rowData.join('|')}`);
    }
})