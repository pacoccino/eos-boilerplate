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
            lower_bound: account_name,
            limit: 1,
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

    async addSkill(account, skill) {

        const contractName = this.contractAccount.account_name;
        const userName = account.account_name;

        const api = Eos.getApi([account.privateKey]);

        await api.transact({
            actions: [{
                account: contractName,
                name: 'addskill',
                authorization: [{
                    actor: userName,
                    permission: 'active',
                }],
                data: {
                    user: account.account_name,
                    skill,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

    }

    async getSkill(account_name, key) {

        const resp = await Eos.rpc.get_table_rows({
            json: true,
            code: this.contractAccount.account_name,   // contract who owns the table
            scope: account_name,  // scope of the table
            table: 'skills',
            lower_bound: key,
            limit: 1,
        });

        return resp.rows[0].skill;

    }

    async getSkills(account_name) {

        const resp = await Eos.rpc.get_table_rows({
            json: true,
            code: this.contractAccount.account_name,   // contract who owns the table
            scope: account_name,  // scope of the table
            table: 'skills',
            limit: 100,
        });

        return resp.rows.map(row => row.skill);

    }


    async deleteProfile(account_name) {

        const contractName = this.contractAccount.account_name;

        const api = Eos.adminApi;
        
        await api.transact({
            actions: [{
                account: contractName,
                name: 'rmprofile',
                authorization: [{
                    actor: contractName,
                    permission: 'active',
                }],
                data: {
                    user: account_name,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

    }


}

module.exports = Contract_Example;