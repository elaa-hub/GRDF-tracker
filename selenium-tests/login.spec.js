const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const path = require('path');

describe('🧪 GRDF Client: Signaler une défaillance', function () {
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
      await driver.quit();
    }
  });

  it('should login and signal a defaillance correctly', async () => {
    await driver.get('http://localhost:4200');
    await driver.findElement(By.name('email')).sendKeys('newclient@mail.com');
    await driver.findElement(By.name('password')).sendKeys('12345');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/client'), 15000);

    const defaillanceBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Signaler une défaillance')]")),
      5000
    );
    await driver.wait(until.elementIsVisible(defaillanceBtn), 15000);
    await driver.wait(until.elementIsEnabled(defaillanceBtn), 15000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", defaillanceBtn);
    await driver.executeScript("arguments[0].click();", defaillanceBtn);

    // Vérifie le changement d'URL
    await driver.wait(until.urlContains('/client/report-issue'), 15000);

    const adresseInput = await driver.findElement(By.id('houseAddress'));
    await adresseInput.clear();
    await adresseInput.sendKeys('Rue de la Tour, 75001 Paris');

    const urgenceSelect = await driver.findElement(By.id('urgence'));
    await urgenceSelect.click();
    await driver.findElement(By.xpath("//option[contains(text(),'Non urgente')]")).click();

    const descTextArea = await driver.wait(until.elementLocated(By.id('description')), 15000);
    await driver.wait(until.elementIsVisible(descTextArea), 15000);
    await driver.wait(until.elementIsEnabled(descTextArea), 15000);

    await driver.executeScript(`
      const textarea = document.getElementById('description');
      textarea.value = 'Problème de fuite de gaz détecté';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    `);

    const value = await driver.findElement(By.id('description')).getAttribute('value');
    console.log('📝 Champ description contient :', value);
    expect(value).to.equal('Problème de fuite de gaz détecté');

    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await driver.wait(until.elementIsVisible(submitBtn), 15000);
    await driver.wait(until.elementIsEnabled(submitBtn), 15000);
    await driver.executeScript("arguments[0].click();", submitBtn);

    try {
      await driver.wait(until.urlContains('/client/demander-technicien'), 30000);
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('/client/demander-technicien');
      console.log("✅ Formulaire soumis avec succès !");
    } catch (error) {
      const currentUrl = await driver.getCurrentUrl();
      console.error("❌ Erreur de soumission. URL actuelle :", currentUrl);
      throw error;
    }
  });
});
