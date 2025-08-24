import { test, expect } from '@playwright/test'

const html = `<!DOCTYPE html><html><body>
 <a href=https://example.com>Example</a>
<a href=https://ycombinator.com>yc</a>
<a href=https://google.com>google</a>
<a href=https://yahoo.com>yahoo</a>
</body></html>`;

test("All links are valid", async ({ page, request }) => {
   // await page.setContent(html);
   const links = await page.locator("a").evaluateAll(els => els.map(el => el.href));


   const chunkSize = 3;


   for (let i = 0; i < links.length; i += chunkSize) {
      const chunkLinks = links.slice(i, i + chunkSize);
      console.log('chunkLinks : ',chunkLinks);
      const responses = await Promise.all(chunkLinks.map(url => request.get(url)));
      responses.forEach((response, index) => {
         const url = chunkLinks[index];
         expect(response.ok(), `${url} is broken with status ${response.status()}`).toBe(true);
      });
   }
})