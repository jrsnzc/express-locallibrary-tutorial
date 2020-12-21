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

const rootURL = 'http://localhost:3000/catalog/author/create';

describe('Agregando un nuevo autor', () => {
  test('Página principal: Create Author', async () => {
    await driver.get(rootURL);
  });

  test('Verificando First Name y Family Name', async () => {
    // Agregando nuevo autor
    const firstName = await getElementById('first_name', driver);
    await firstName.sendKeys('Luis Felipe');

    const familyName = await getElementById('family_name', driver);
    await familyName.sendKeys('Vargas Romero');

    const fechNaci = await getElementById('date_of_birth', driver);
    await fechNaci.sendKeys('1992-02-14');

    const fechDeath = await getElementById('date_of_death', driver);
    await fechDeath.sendKeys('2004-02-14');

    const submit = await getElementByXPath('/html/body/div/div/div[2]/form/button', driver);
    await submit.click();

    const response = await getElementByXPath('/html/body/div/div/div[2]/ul/li[1]', driver);
    const actual = await response.getText();
    const expected = 'First name has non-alphanumeric characters.';
    expect(actual).toMatch(expected);

    const response2 = await getElementByXPath('/html/body/div/div/div[2]/ul/li[2]', driver);
    const actual2 = await response2.getText();
    const expected2 = 'Family name has non-alphanumeric characters.';
    expect(actual2).toMatch(expected2);
  });
});
