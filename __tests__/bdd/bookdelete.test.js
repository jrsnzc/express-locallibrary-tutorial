const { Builder } = require('selenium-webdriver');
const { getElementById, getElementByXPath } = require('./utils');
require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver');
require('geckodriver');

jest.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('firefox').build();
});

afterAll(async () => driver.quit());

const rootURL = 'http://localhost:3000/catalog/books';

describe('Eliminando un libro', () => {
  test('Página principal: Book List', async () => {
    await driver.get(rootURL);
  });

  test('Libro a eliminar no debería de tener copias', async () => {
    const book = await getElementByXPath('/html/body/div/div/div[2]/ul/li[3]/a', driver);
    await book.click();

    const deleteBook = await getElementByXPath('/html/body/div/div/div[2]/p[5]/a', driver);
    await deleteBook.click();

    const response3 = await getElementByXPath('/html/body/div/div/div[2]/p[5]/strong', driver);
    const actual3 = await response3.getText();
    const expected3 = 'Delete the following copies before attempting to delete this Book.';
    expect(actual3).toMatch(expected3);
  });
});
