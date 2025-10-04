import { test } from "@tests/fixtures/test-options";

test('Drag and Drop', async ({ web }) => { // Define a test case named 'Drag and Drop' using the 'web' fixture.
    await web.navigateToUrl('https://the-internet.herokuapp.com/drag_and_drop') // Navigate the browser to the specified URL.

    const A = await web.findElement('xpath', "//div[@id='column-a']") // Find the source element (Column A) using XPath.
    const B = await web.findElement('xpath', "//div[@id='column-b']") // Find the target element (Column B) using XPath.

    await A!.dragTo(B!); // Perform the drag-and-drop action, moving element A onto element B.    
})

test('Drag and Drop Using Mouse Hover', async ({ web }) => {
    await web.navigateToUrl('https://the-internet.herokuapp.com/drag_and_drop') // Navigate to the drag and drop test page.

    const A = await web.findElement('xpath', "//div[@id='column-a']") // Locate the source element (Column A).
    const B = await web.findElement('xpath', "//div[@id='column-b']") // Locate the target element (Column B).

    await A!.hover() // Move the mouse pointer over the source element (Column A).
    await web.webPage.mouse.down(); // Press and hold the left mouse button to start the drag operation.
    await B!.hover(); // Move the mouse pointer to the target element (Column B) while still holding the button.
    await web.webPage.mouse.up(); // Release the left mouse button to complete the drop operation.    
})

