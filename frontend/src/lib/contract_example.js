import { Api, JsonRpc, JsSignatureProvider } from 'eosjs';
import { TextDecoder, TextEncoder } from 'text-encoding';

const EOS_ENDPOINT = 'http://localhost:8888';

const rpc = new JsonRpc(EOS_ENDPOINT);

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
    {"name":"alice",  "privateKey":"5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW", "publicKey":"EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv"},
    {"name":"bob",    "privateKey":"5JofWdxYbzV6ipNmEdiaZibVxg9GYMLAFiKEWiYSuz3YEEHJHbb", "publicKey":"EOS8Ke736LWfLfXdw4vFVYGG3Hf5iVDJhdPherwA7P9nuxdKaUfz7"},
    {"name":"charly", "privateKey":"5KTFEy1p9fSAbm1dJaMh5Nd3tDMKtY5k93uYNXxisyKi9RZCJgx", "publicKey":"EOS6EeXqdYC7jmuATwjfY5Lx1RpAYc533xGispe391s1ZTJGa4Bzt"},
];

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

export default {

    accounts,

    async getProfiles() {
        const result = await rpc.get_table_rows({
            "json": true,
            "code": "example",   // contract who owns the table
            "scope": "example",  // scope of the table
            "table": "profiles",    // name of the table as specified by the contract abi
            "limit": 100,
        });

        return result.rows;
    },

    async setProfile(account, { firstName, age }) {

        const api = getApi([account.privateKey]);

        const result = await api.transact({
            actions: [{
                account: "example",
                name: 'setprofile',
                authorization: [{
                    actor: account.account_name,
                    permission: 'active',
                }],
                data: {
                    user: account.account_name,
                    firstName,
                    age,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

        return result;
    },

}