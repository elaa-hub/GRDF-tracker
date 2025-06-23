const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('🧪 GRDF Client: Signaler une défaillance', function () {
  this.timeout(60000);
  let driver;

  before(async () => {
    const chromedriverPath = require('chromedriver').path;
    const service = new chrome.ServiceBuilder(chromedriverPath);

    const chromePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
    console.log('🔍 Chrome utilisé :', chromePath);

    if (!fs.existsSync(chromePath)) {
      throw new Error(`❌ Chrome introuvable à : ${chromePath}`);
    }

    const options = new chrome.Options();
    options.setChromeBinaryPath(chromePath);
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--headless=new');
    options.addArguments('--window-size=1920,1080');

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
    try {
      await driver.get('http://grdf-tracker-frontend.s3-website.eu-north-1.amazonaws.com/#/home');

      // ✅ Attente explicite des champs email et mot de passe
      await driver.wait(until.elementLocated(By.css('[formControlName="email"]')), 15000);
      await driver.wait(until.elementLocated(By.css('[formControlName="password"]')), 15000);

      const emailInput = await driver.findElement(By.css('[formControlName="email"]'));
      const passwordInput = await driver.findElement(By.css('[formControlName="password"]'));

      await emailInput.sendKeys('newclient@mail.com');
      await passwordInput.sendKeys('12345');

      const loginButton = await driver.findElement(By.css('button[type="submit"]'));
      await driver.wait(until.elementIsEnabled(loginButton), 10000);
      await loginButton.click();

      // ✅ Attendre la redirection vers l’espace client
      await driver.wait(until.urlContains('/client'), 15000);

      // ✅ Attente explicite du bouton de signalement
      const defaillanceBtn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Signaler une défaillance')]")),
        15000
      );
      await driver.wait(until.elementIsVisible(defaillanceBtn), 10000);
      await driver.executeScript("arguments[0].scrollIntoView(true);", defaillanceBtn);
      await driver.executeScript("arguments[0].click();", defaillanceBtn);

      // ✅ Attendre la page de signalement
      await driver.wait(until.urlContains('/client/report-issue'), 15000);

      const adresseInput = await driver.findElement(By.id('houseAddress'));
      await adresseInput.clear();
      await adresseInput.sendKeys('Rue de la Tour, 75001 Paris');

      const urgenceSelect = await driver.findElement(By.id('urgence'));
      await urgenceSelect.click();
      await driver.findElement(By.xpath("//option[contains(text(),'Non urgente')]")).click();

      const descTextArea = await driver.wait(until.elementLocated(By.id('description')), 10000);
      await driver.wait(until.elementIsVisible(descTextArea), 10000);

      await driver.executeScript(`
      const textarea = document.getElementById('description');
      textarea.value = 'Problème de fuite de gaz détecté';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    `);

      const value = await driver.findElement(By.id('description')).getAttribute('value');
      console.log('📝 Champ description contient :', value);
      expect(value).to.equal('Problème de fuite de gaz détecté');

      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await driver.wait(until.elementIsVisible(submitBtn), 10000);
      await driver.executeScript("arguments[0].click();", submitBtn);

      // ✅ Vérifie la redirection après soumission
      await driver.wait(until.urlContains('/client/demander-technicien'), 20000);
      const currentUrl = await driver.getCurrentUrl();
      console.log("✅ Formulaire soumis avec succès :", currentUrl);
      expect(currentUrl).to.include('/client/demander-technicien');

    } catch (error) {
      const html = await driver.getPageSource();
      fs.writeFileSync(path.resolve(__dirname, '../page-source.html'), html);
      console.error('❌ Test échoué, HTML sauvegardé dans page-source.html');
      throw error;
    }
  });

});
