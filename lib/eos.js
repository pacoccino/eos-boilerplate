const { Api, JsonRpc, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');
const {Keygen} = require('eosjs-keygen');
const { TextDecoder, TextEncoder } = require('text-encoding');

const { EOS_ENDPOINT, EOS_PKS } = require('../config');

const rpc = new JsonRpc(EOS_ENDPOINT, { fetch });

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

async function transaction(contractName, account, actions) {

    const api = getApi([account.privateKey]);

    const authorization = [{
        actor: account.account_name,
        permission: 'active'
    }];

    const augmentedActions = actions.map(action => Object.assign({}, action, {
        account: contractName,
        authorization,
    }));

    const transactionResult = await api.transact({
        actions: augmentedActions,
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });

    return transactionResult;

}

async function getTableRows({ code, scope, table, limit }, key = null) {
    const params = {
        code, scope, table, limit, json: true,
    };

    if(key) {
        params.limit = 1;
        params.lower_bound = key;
    }

    const resp = await rpc.get_table_rows(params);

    return resp.rows;
}

async function getTableRow(params, key) {

    const rows = await getTableRows(params, key);

    return rows[0];

}

module.exports = {
    rpc,
    adminApi,
    getApi,
    createAccount,
    transaction,
    getTableRows,
    getTableRow,
};
