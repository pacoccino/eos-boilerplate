const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { EOS_ENDPOINT, EOS_PKS } = require('../config');
const { TextDecoder, TextEncoder } = require('text-encoding');
const rpc = new JsonRpc(EOS_ENDPOINT, { fetch });
const {Keygen} = require('eosjs-keygen');

function getApi(privateKeys) {

    const params = {
        rpc,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
    };

    if(Array.isArray(privateKeys)) {
        params.signatureProvider = new JsSignatureProvider(privateKeys);
    }

    return new Api(params);

}

const adminApi = getApi(EOS_PKS ? EOS_PKS.split(',') : null);

async function createAccount(account_name) {

    const keys = await Keygen.generateMasterKeys();

    const ownerPrivateKey = keys.privateKeys.owner;
    const ownerPublicKey = keys.publicKeys.owner;

    await adminApi.transact({
        actions: [{
            account: 'eosio',
            name: 'newaccount',
            authorization: [{
                actor: 'eosio',
                permission: 'active',
            }],
            data: {
                creator: 'eosio',
                name: account_name,
                owner: {
                    threshold: 1,
                    keys: [{
                        key: ownerPublicKey,
                        weight: 1
                    }],
                    accounts: [],
                    waits: []
                },
                active: {
                    threshold: 1,
                    keys: [{
                        key: ownerPublicKey,
                        weight: 1
                    }],
                    accounts: [],
                    waits: []
                },
            },
        },
            {
                account: 'eosio',
                name: 'buyrambytes',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    payer: 'eosio',
                    receiver: account_name,
                    bytes: 8192,
                },
            },
            {
                account: 'eosio',
                name: 'delegatebw',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    from: 'eosio',
                    receiver: account_name,
                    stake_net_quantity: '1.0000 SYS',
                    stake_cpu_quantity: '1.0000 SYS',
                    transfer: false,
                }
            }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });

    const account = {
        account_name,
        keys: {
            privateKey: ownerPrivateKey,
            publicKey: ownerPublicKey,
        }
    };

    console.log('account created', account);

    return account;

}

module.exports = {
    rpc,
    adminApi,
    getApi,
    createAccount,
};
