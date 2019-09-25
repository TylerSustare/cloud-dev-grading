describe('hw1', () => {
    const puppeteer = require('puppeteer');
    const uuid = require('uuid/v4');
    const { URL, GOOGLE_USER, GOOGLE_PASSWORD } = process.env;

    let grade = 0;
    let maxGrade = 0;
    let browser;
    let page;
    const unique = uuid();

    beforeEach(async () => {
        // browser = await puppeteer.launch({ headless: false, slowMo: 5, timeout: 30000 });
        browser = await puppeteer.launch({ timeout: 20000 });
        page = await browser.newPage();
        await page.goto(URL);
        expect(await page.content()).not.toBe(null);

        /* targetcreatd is a JS event when the browser creates a popup */
        await browser.on('targetcreated', async () => {
            const pageList = await browser.pages();
            const newPage = await pageList[pageList.length - 1];
            await newPage.waitFor(1000);
            await newPage.screenshot({ path: './hw1-02-click-signin-with-google.png' });

            await newPage.waitForSelector(`#identifierId`);
            await newPage.type(`#identifierId`, GOOGLE_USER, { delay: 5 });
            await newPage.screenshot({ path: './hw1-03-signin-with-google-user.png' });
            await newPage.click('#identifierNext');
            await newPage.waitFor(1000);


            await newPage.screenshot({ path: './hw1-04-signin-with-google-password.png' });
            await newPage.waitForSelector(`#password input[type="password"]`);
            await newPage.type(`#password input[type="password"]`, GOOGLE_PASSWORD, { delay: 5 });
            await newPage.waitFor(500);
            await newPage.click('#passwordNext');
        });
    });

    afterEach(async () => {
        await browser.close();
    });

    afterAll(() => console.log(`*** GRADE: ${grade}/${maxGrade} ***`))

    describe('7 Points - Page has required elements', () => {
        test('1 Point - #signed-in-state text container (<p>, <div> etc) element exists + 1', async () => {
            maxGrade += 1;
            element = await page.$('#signed-in-state');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #signout button exists + 1', async () => {
            maxGrade += 1;
            element = await page.$('#signout');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #signin-with-google button exists + 1', async () => {
            maxGrade += 1;
            element = await page.$('#signin-with-google');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #email input element exists + 1', async () => {
            maxGrade += 1;
            element = await page.$('#email');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #password input element exists + 1', async () => {
            maxGrade += 1;
            element = await page.$('#password');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #signup-with-email-and-password button exists', async () => {
            maxGrade += 1;
            element = await page.$('#signup-with-email-and-password');
            expect(element).not.toBeNull();
            grade += 1;
        });

        test('1 Point - #signin-with-email-and-password button exists', async () => {
            maxGrade += 1;
            element = await page.$('#signin-with-email-and-password');
            expect(element).not.toBeNull();
            grade += 1;
        });
    });

    describe('60 Points - Auth tests', () => {
        test('20 Points - Can sign in and out with Google (signInWithPopup Firebase Method)', async () => {
            maxGrade += 20;
            console.log('You need a very insecure test account to run this automated test.');

            let element = await page.$('#signed-in-state');
            let text = await page.evaluate(element => element.textContent, element);
            expect(text).toEqual('Hello, Please sign in');
            await page.screenshot({ path: './hw1-01-initial-page-load.png' });

            await page.click('#signin-with-google');
            // will go to the targetcreated event handler set up in the "beforeEach"
            await page.waitFor(13000); /* wait for popup event to finish */
            await page.screenshot({ path: './hw1-05-post-google-signin.png' });

            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            expect(text).not.toEqual('Hello, Please sign in');
            grade += 15;

            await page.click('#signout');
            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            await page.screenshot({ path: './hw1-06-signed-out.png' });
            expect(text).toEqual('Hello, Please sign in');
            grade += 5;
        }, 30000);

        test('20 Points - Can sign up with email & password & Sign out', async () => {
            maxGrade += 20;
            const password = unique
            const email = `test${unique}@test1234.com`;

            let element = await page.$('#signed-in-state');
            let text = await page.evaluate(element => element.textContent, element);
            expect(text).toEqual('Hello, Please sign in');
            await page.screenshot({ path: './hw1-07-signup-initial-page-load.png' });

            await page.type('#email', email, { delay: 5 });
            await page.type('#password', password, { delay: 5 });
            await page.screenshot({ path: './hw1-08-signup-with-email-password.png' });

            await page.click('#signup-with-email-and-password');
            await page.waitFor(3000); // just in case slow connection
            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            expect(text).not.toEqual('Hello, Please sign in');
            expect(text).toEqual(`Hello, ${email}`);
            await page.screenshot({ path: './hw1-09-signup-with-email-password.png' });
            grade += 15;

            await page.click('#signout');
            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            await page.screenshot({ path: './hw1-10-signed-out.png' });
            expect(text).toEqual('Hello, Please sign in');
            grade += 5;
        }, 10000);

        test('20 Points - Can sign in with email & password created in previous test', async () => {
            maxGrade += 20;
            const password = unique
            const email = `test${unique}@test1234.com`;

            let element = await page.$('#signed-in-state');
            let text = await page.evaluate(element => element.textContent, element);
            expect(text).toEqual('Hello, Please sign in');
            await page.screenshot({ path: './hw1-11-signin-initial-page-load.png' });

            await page.type('#email', email, { delay: 5 });
            await page.type('#password', password, { delay: 5 });
            await page.screenshot({ path: './hw1-12-signin-with-email-password.png' });

            await page.click('#signin-with-email-and-password');
            await page.waitFor(3000); // just in case slow connection
            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            expect(text).not.toEqual('Hello, Please sign in');
            expect(text).toEqual(`Hello, ${email}`);
            await page.screenshot({ path: './hw1-13-signin-with-email-password.png' });
            grade += 15;

            await page.click('#signout');
            element = await page.$('#signed-in-state');
            text = await page.evaluate(element => element.textContent, element);
            await page.screenshot({ path: './hw1-14-signed-out.png' });
            expect(text).toEqual('Hello, Please sign in');
            grade += 5;
        }, 10000);
    })
});