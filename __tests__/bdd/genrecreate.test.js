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

const rootURL = 'http://localhost:3000/catalog/genre/create'

describe('Agregando un nuevo género', () => {

  test('Página principal: Create Genre', async () => {
    await driver.get(rootURL)
  });

  test('Creando un nuevo género', async () => {
    
    const generoNuevo = await getElementById('name', driver);
    await generoNuevo.sendKeys("Horror");

    const submit = await getElementByXPath('/html/body/div/div/div[2]/form/button', driver);
    await submit.click();

    const response = await getElementByXPath('/html/body/div/div/div[2]/h1', driver)
    const actual = await response.getText();
    const expected = 'Genre: Horror';
    expect(actual).toMatch(expected);

  });

  test('Verificando el incremento en la cantidad de géneros', async () => {

    const home = await getElementByXPath('/html/body/div/div/div[1]/ul/li[1]/a', driver);
    await home.click();

    const response = await getElementByXPath('/html/body/div/div/div[2]/ul/li[5]', driver)
    const actual = await response.getText();
    const expected = '8';
    expect(actual).toMatch(expected);

  });

});
