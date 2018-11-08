require('dotenv').config();

const configs = {
    'EOS_ENDPOINT': 'http://localhost:8888',
    'EOS_PKS': '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
};

const config = Object.keys(configs)
    .reduce(
        (obj, key) =>
            Object.assign(obj, { [key]: process.env[key] || configs[key] }),
        {}
    );

//console.log(config);

module.exports = config;