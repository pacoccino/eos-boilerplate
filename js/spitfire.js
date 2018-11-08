const Eos = require('./eos');

class Spitfire {

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


    async setProfile(account, notif) {

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
                    notif: !!notif,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

    }

    async getKeywords(account_name) {

        const resp = await Eos.api._getTableRows({
            contractName: this.contractAccount.account_name,
            scope: account_name,
            tableName: 'kws',
        });

        return resp.rows.map(row => row.kw);

    }

    async addKeyword(account, keyword) {

        const actions = [
            {
                name: 'addkw',
                data: {
                    user: account.account_name,
                    kw: keyword,
                },
            }
        ];

        await Eos.api._transaction(
            account,
            this.contractAccount.account_name,
            actions
        );
    }

    async getAds(account_name) {

        const resp = await Eos.api._getTableRows({
            contractName: this.contractAccount.account_name,
            scope: account_name,
            tableName: 'ads',
        });

        return resp.rows;

    }

    async createAd(ad) {

        const actions = [
            {
                name: 'createad',
                data: ad,
            }
        ];

        await Eos.api._transaction(
            this.contractAccount,
            this.contractAccount.account_name,
            actions
        );

        await Eos.api.transfer(
            this.contractAccount,
            this.contractAccount.account_name,
            ad.user,
            ad.reward
        );

    }

}

module.exports = Spitfire;