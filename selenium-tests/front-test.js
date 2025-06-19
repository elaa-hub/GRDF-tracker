const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runFrontendTest() {
  console.log('🚀 Script started...');

  let options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('🌐 Opening your Angular app...');
    await driver.get('http://localhost:4200');

    console.log('🔍 Checking if GRDF logo is visible...');
    const logo = await driver.findElement(By.css('img.logo'));
    const logoDisplayed = await logo.isDisplayed();
    console.log('Logo displayed:', logoDisplayed);

    console.log('📝 Checking page title...');
    const title = await driver.getTitle();
    console.log('Page Title:', title);

    console.log('✅ Frontend test passed!');
  } catch (error) {
    console.error('❌ Test failed!', error);
    process.exit(1);
  } finally {
    await driver.quit();
    console.log('🚪 Browser closed!  .');
  }
})();
