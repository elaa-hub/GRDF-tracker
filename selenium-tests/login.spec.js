const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const path = require('path');

describe('  🧪 GRDF Client: Signaler une défaillance', function () {
  this.timeout(60000);

  let driver;

  before(async () => {
    const chromedriverPath = require('chromedriver').path;
    const service = new chrome.ServiceBuilder(chromedriverPath);

    const options = new chrome.Options();
    options.setChromeBinaryPath('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();
  });
  after(async () => {
    if (driver) {
      await driver.sleep(5000);
      await driver.quit();
    }
  });
  it('should login and signal a defaillance correctly', async () => {
    await driver.get('http://localhost:4200');
    await driver.findElement(By.name('email')).sendKeys('newclient@mail.com');
    await driver.findElement(By.name('password')).sendKeys('12345');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/client'), 5000);

    const defaillanceBtn = await driver.findElement(By.xpath("//button[contains(text(),'Signaler une défaillance')]"));
    await defaillanceBtn.click();

    await driver.wait(until.urlContains('/client/report-issue'), 5000);

    const adresseInput = await driver.findElement(By.id('houseAddress'));
    await adresseInput.clear();
    await adresseInput.sendKeys('Rue de la Tour, 75001 Paris');

    const urgenceSelect = await driver.findElement(By.id('urgence'));
    await urgenceSelect.click();
    await driver.findElement(By.xpath("//option[contains(text(),'Non urgente')]")).click();

    const descTextArea = await driver.findElement(By.id('description'));
    await descTextArea.sendKeys('Problème de fuite de gaz détecté');

    const submitBtn = await driver.findElement(By.css('button[type=\"submit\"]'));
    await submitBtn.click();

    await driver.wait(until.urlContains('/client/demander-technicien'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/client/demander-technicien');
  });
});
