require('dotenv').config();

const configs = {
    'EOS_ENDPOINT': 'http://localhost:8888',
    'EOS_PKS': '5JKU9mEsvNEzQ7MsGMB8yqVsCXCPhvwiwwt6HgZmJRJGViucVT8',
};

const config = Object.keys(configs)
    .reduce(
        (obj, key) =>
            Object.assign(obj, { [key]: process.env[key] || configs[key] }),
        {}
    );

//console.log(config);

module.exports = config;