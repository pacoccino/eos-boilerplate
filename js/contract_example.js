const Eos = require('./eos');

class Contract_Example {

    constructor(accountName, privateKey) {
        this.contractAccount = {
            account_name: accountName,
            keys: {
                privateKey: privateKey,
                publicKey: '',
            }
        };
    }

    async getProfile(account_name) {

        const resp = await Eos.rpc.get_table_rows({
            json: true,
            code: this.contractAccount.account_name,   // contract who owns the table
            scope: this.contractAccount.account_name,  // scope of the table
            table: 'profiles',    // name of the table as specified by the contract abi
            table_key: account_name,   // name of the table as specified by the contract abi
            limit: 100,
        });

        return resp.rows[0];

    }


    async setProfile(account, firstName) {

        const contractName = this.contractAccount.account_name;
        const userName = account.account_name;

        const api = Eos.getApi([account.privateKey]);

        await api.transact({
            actions: [{
                account: contractName,
                name: 'setprofile',
                authorization: [{
                    actor: userName,
                    permission: 'active',
                }],
                data: {
                    user: account.account_name,
                    firstName,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

    }


}

module.exports = Contract_Example;