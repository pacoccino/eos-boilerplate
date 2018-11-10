const Eos = require('./eos');

class Contract_Example {

    constructor(accountName, privateKey) {
        this.contractAccount = {
            account_name: accountName,
            privateKey: privateKey,
        };
    }

    async getProfile(account_name) {

        return Eos.getTableRow({
            code: this.contractAccount.account_name,   // contract who owns the table
            scope: this.contractAccount.account_name,  // scope of the table
            table: 'profiles',    // name of the table as specified by the contract abi
        }, account_name);

    }

    async getProfileByAge(age) {

        const res = await Eos.rpc.get_table_rows({
            code: this.contractAccount.account_name,   // contract who owns the table
            scope: this.contractAccount.account_name,  // scope of the table
            table: 'profiles',
            limit: 1,
            table_key: 'getbyage',
            lower_bound: age,
            //index_position: 2,
            //key_type: 'i64',
        });

        console.log(res);
        return res.rows[0];
    }

    async setProfile(account, { firstName, age }) {

        await Eos.transaction(
            this.contractAccount.account_name,
            account,
            [{
                name: 'setprofile',
                data: {
                    user: account.account_name,
                    firstName,
                    age,
                },
            }]
        );

    }

    async addSkill(account, skill) {

        await Eos.transaction(
            this.contractAccount.account_name,
            account,
            [{
                name: 'addskill',
                data: {
                    user: account.account_name,
                    skill,
                },
            }]
        );

    }

    async getSkill(account_name, key) {

        const res = await Eos.getTableRow({
            code: this.contractAccount.account_name,
            scope: account_name,
            table: 'skills',
        }, key);

        return res.skill;

    }

    async getSkills(account_name) {

        const res = await Eos.getTableRows({
            code: this.contractAccount.account_name,
            scope: account_name,
            table: 'skills',
        });

        return res.map(row => row.skill);

    }


    async deleteProfile(account_name) {

        await Eos.transaction(
            this.contractAccount.account_name,
            this.contractAccount,
            [{
                name: 'rmprofile',
                data: {
                    user: account_name,
                },
            }]
        );

    }


}

module.exports = Contract_Example;