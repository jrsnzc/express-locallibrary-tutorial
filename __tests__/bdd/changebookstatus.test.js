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

const rootURL = 'http://localhost:3000/catalog/bookinstances';

describe('Cambiando el status de un libro', () => {
  test('Página principal: Book Instance List', async () => {
    await driver.get(rootURL);
  });

  // Verificando la actualizacion de status de un libro
  test('Seleccionando un libro para ver sus características', async () => {
    const bookInstance = await getElementByXPath('/html/body/div/div/div[2]/li[5]/a', driver);
    await bookInstance.click();

    const response = await getElementByXPath('/html/body/div/div/div[2]/h1', driver);
    const actual = await response.getText();
    const expected = 'ID: 5f67ed4e95600d1abe808a33';
    expect(actual).toMatch(expected);
  });

  test('Actualizando BookInstance del libro', async () => {
    const UpdatebookInstance = await getElementByXPath('/html/body/div/div/div[2]/p[6]/a', driver);
    await UpdatebookInstance.click();

    const response2 = await getElementByXPath('/html/body/div/div/div[2]/h1', driver);
    const actual2 = await response2.getText();
    const expected2 = 'Update BookInstance';
    expect(actual2).toMatch(expected2);
  });

  test('Cambiando el estado del libro de estado Maintenance a estado Available', async () => {
    const status = await getElementByXPath('/html/body/div/div/div[2]/form/div[4]/select/option[2]', driver);
    await status.click();

    const submit = await getElementByXPath('/html/body/div/div/div[2]/form/button', driver);
    await submit.click();

    const response3 = await getElementByXPath('/html/body/div/div/div[2]/p[3]/span', driver);
    const actual3 = await response3.getText();
    const expected3 = 'Available';
    expect(actual3).toMatch(expected3);
  });
});
