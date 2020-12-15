const { By, until } = require('selenium-webdriver')

const waitUntilTime = 20000

async function getElementByClassName(className, driver) {
  const el = await driver.wait(
    until.elementLocated(By.className(className)),
    waitUntilTime
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

async function getElementById(id, driver) {
  const el = await driver.wait(
    until.elementLocated(By.id(id)),
    waitUntilTime
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

async function getElementByXPath(xpath, driver) {
  const el = await driver.wait(
    until.elementLocated(By.xpath(xpath)),
    waitUntilTime
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

async function querySelector(selector, driver) {
  const el = await driver.wait(
    until.elementLocated(By.css(selector)),
    waitUntilTime
  )
  return await driver.wait(until.elementIsVisible(el), waitUntilTime)
}

module.exports = {
  getElementByClassName,
  getElementById,
  getElementByXPath,
  querySelector
}