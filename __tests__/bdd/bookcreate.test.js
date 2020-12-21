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

const rootURL = 'http://localhost:3000/catalog/book/create';

describe('Agregando un nuevo libro', () => {
  test('Página principal: Create Book', async () => {
    await driver.get(rootURL);
  });

  test('Verificando número de copias', async () => {
    // Agregando nuevo libro
    const title = await getElementById('title', driver);
    await title.sendKeys('Mi libro favorito');

    const author = await getElementById('author', driver);
    await author.sendKeys('Bova, Ben');

    const summary = await getElementById('summary', driver);
    await summary.sendKeys('Érase una vez un lobo perverso que rondaba por el bosque. Observó a su alrededor con ojos voraces en un bosque muy frondoso, una casita blanca donde vivía una niña muy guapa a quien todos llamaban Caperucita Roja.');

    const isbn = await getElementById('isbn', driver);
    await isbn.sendKeys('99988877712');

    const genre = await getElementByXPath('/html/body/div/div/div[2]/form/div[5]/div/div[1]/label', driver);
    await genre.click();

    const submit = await getElementByXPath('/html/body/div/div/div[2]/form/button', driver);
    await submit.click();
    // Fin. Agregando nuevo libro

    const response = await getElementByXPath('/html/body/div/div/div[2]/div/p', driver);
    const actual = await response.getText();
    const expected = 'There are no copies of this book in the library.';
    expect(actual).toMatch(expected);
  });
});
