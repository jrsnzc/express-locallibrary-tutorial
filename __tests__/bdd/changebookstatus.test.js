const { Builder } = require('selenium-webdriver')
const { getElementById, getElementByXPath } = require('./utils')
require('selenium-webdriver/chrome')
require('selenium-webdriver/firefox')
require('chromedriver')
require('geckodriver')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

let driver

beforeAll(async () => {
  driver = await new Builder().forBrowser('firefox').build()
})

afterAll(async () => driver.quit())

const rootURL = 'http://localhost:3000/catalog/bookinstances'

describe('Cambiando el status de un libro', () => {

    test('Página principal: Book Instance List', async () => {
        await driver.get(rootURL)
    });

    //Verificando la actualizacion de status de un libro
    test('Seleccionando un libro para ver sus características', async () => {
        
        const book = await getElementByXPath('/html/body/div/div/div[2]/li[5]/a', driver);
        await book.click();
        
        const response = await getElementByXPath('/html/body/div/div/div[2]/h1', driver)
        const actual = await response.getText();
        const expected = 'ID: 5f67ed4e95600d1abe808a33';
        expect(actual).toMatch(expected); 
    });

    test('Actualizando BookInstance del libro', async () => {

        const UpdatebookInstance = await getElementByXPath('/html/body/div/div/div[2]/p[6]/a', driver);
        await UpdatebookInstance.click();

        const response_2 = await getElementByXPath('/html/body/div/div/div[2]/h1', driver)
        const actual_2 = await response_2.getText();
        const expected_2 = 'Update BookInstance';
        expect(actual_2).toMatch(expected_2);
    
    });

    test('Cambiando el estado del libro de estado Maintenance a estado Available', async () => {

        const status = await getElementById('status', driver);
        await status.sendKeys("Available");

        const submit = await getElementByXPath('/html/body/div/div/div[2]/form/button', driver);
        await submit.click();

        const response_3 = await getElementByXPath('/html/body/div/div/div[2]/p[3]/span', driver)
        const actual_3 = await response_3.getText();
        const expected_3 = 'Available';
        expect(actual_3).toMatch(expected_3);
    });
});
