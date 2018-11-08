global.chai = require('chai');
global.expect = global.chai.expect;

process.on('unhandledRejection', (reason, p) => {

    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    debugger; // eslint-disable-line no-debugger

    process.exit(-1); // eslint-disable-line no-process-exit

});
