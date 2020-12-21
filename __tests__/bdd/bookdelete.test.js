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

const rootURL = 'http://localhost:3000/catalog/books'

describe('Eliminando un libro', () => {

    test('Página principal: Book List', async () => {
        await driver.get(rootURL)
    });

    test('Libro a eliminar no debería de tener copias', async () => {

        const book = await getElementByXPath('/html/body/div/div/div[2]/ul/li[3]/a', driver)
        await book.click()

        const deleteBook = await getElementByXPath('/html/body/div/div/div[2]/p[5]/a', driver)
        await deleteBook.click()

        const response_3 = await getElementByXPath('/html/body/div/div/div[2]/p[5]/strong', driver)
        const actual_3 = await response_3.getText();
        const expected_3 = 'Delete the following copies before attempting to delete this Book.';
        expect(actual_3).toMatch(expected_3);

    });

});
