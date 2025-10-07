import AxeBuilder from "@axe-core/playwright";
import fs from 'fs'
import { createHtmlReport } from 'axe-html-reporter'

import { test,expect } from "@tests/fixtures/test-options";

//the following WCAG are the default from lighthouse
const lightHouseTags:string[] =[ 'wcag2a','wcag2aa']

//define rules for each page, you can disable specific rule by using option in AxeBuilder
const rules:string[] =["accesskeys","aria-allowed-attr","aria-allowed-role","aria-command-name",
    "aria-conditional-attr","aria-deprecated-role","aria-dialog-name","aria-hidden-body",
    "aria-hidden-focus","aria-input-field-name","aria-meter-name","aria-progressbar-name",
    "aria-prohibited-attr","aria-required-attr","aria-required-children","aria-required-parent",
    "aria-roles","aria-text","aria-toggle-field-name","aria-tooltip-name","aria-treeitem-name",
    "aria-valid-attr-value","aria-valid-attr","button-name","bypass","color-contrast",
    "definition-list","dlitem","document-title","duplicate-id-aria","form-field-multiple-labels",
    "frame-title","heading-order","html-has-lang","html-lang-valid","html-xml-lang-mismatch",
    "image-alt","image-redundant-alt","input-button-name","input-image-alt","label",
    "link-in-text-block","link-name","list","listitem","meta-refresh","meta-viewport",
    "object-alt","select-name","skip-link","tabindex","table-duplicate-name","target-size",
    "td-headers-attr","th-has-data-cells","valid-lang","video-caption",
    //"focusable-controls",
    "interactive-element-affordance","logical-tab-order","visual-order-follows-dom",
    "focus-traps","managed-focus","use-landmarks","offscreen-content-hidden",
    "custom-controls-labels","custom-controls-roles","empty-heading","identical-links-same-purpose",
    "landmark-one-main","label-content-name-mismatch","table-fake-caption",
    "td-has-header"
  ]

  test('product listing page', async ({ web, page }, testInfo) => {
    await web.navigateToUrl('https://www.saucedemo.com/')
    await web.webPage.getByRole('textbox', { name: 'Username'}).fill('standard_user')
    await web.webPage.getByRole('textbox', { name: 'Password'}).fill('secret_sauce')
    await web.webPage.getByRole('button', { name: 'Login'}).click()
    await expect(web.webPage.getByText('Swag Labs')).toBeVisible()

    await test.step('Check the accessablity test', async () => {
        const  report  = await new AxeBuilder({page})
        .withTags(lightHouseTags) 
        .withRules(rules)
        .analyze()
        
        //attach the violation output to each test results
        testInfo.attach(testInfo.title,{
            body: JSON.stringify(report.violations, null, 2),
            contentType: 'application/json'
        })

        //create the axe-core html report
        const htmlReport = createHtmlReport({
            results: report,
             options:{
                    projectKey: testInfo.title,
                    doNotCreateReportFile: true
            }
            });

        //write the html report for each page
        write_accesability_output(`${testInfo.title.replaceAll(' ','_')}`, htmlReport)
          
        expect(report.violations).toHaveLength(0)
    })

})

function write_accesability_output(path:string, htmlReport: string){
    
    if (!fs.existsSync('test-results/reports')) {
        fs.mkdirSync('test-results/reports', {
            recursive: true,
        });
    }
    fs.writeFileSync(`test-results/reports/${path}.html`, htmlReport);

}
