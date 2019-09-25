module.exports = (async () => {
    const { runCLI } = require('jest');
    const { argv } = require('yargs');
    // https://github.com/yargs/yargs/blob/master/docs/examples.md

    if (!argv.url) {
        console.error('"--url" is required');
        return;
    }
    process.env.URL = argv.url;
    if (!argv.gu) {
        console.error('Google Email "--gu" is required');
        return;
    }
    process.env.GOOGLE_USER = argv.gu;
    if (!argv.gp) {
        console.error('Google Password "--gp" is required');
        return;
    }
    process.env.GOOGLE_PASSWORD = argv.gp;
    if (!argv.hw) {
        console.error('"--hw" is required');
        return;
    }

    const options = {
        // silent: true,
        runInBand: true,
        verbose: true,
        rootDir: __dirname,
        projects: [__dirname],
        testNamePattern: argv.hw,
    };
    try {
        await runCLI(options, options.projects);
    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
    }
})()