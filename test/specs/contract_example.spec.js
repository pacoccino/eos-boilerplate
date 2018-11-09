const Contract_example = require('../../js/contract_example');

describe('contract_example', () => {

    before(() => {
        this.contract = new Contract_example('example', '5JcY3wrbDZqLDX5fcbd46S1iyUrtx6SfSyPtkJxPiDANaBYHskH');
    });

    it('instance', () => {

        expect(this.contract.contractAccount.account_name).to.eq('example');
        expect(this.contract.contractAccount.keys.privateKey).to.eq('5JcY3wrbDZqLDX5fcbd46S1iyUrtx6SfSyPtkJxPiDANaBYHskH');

    });

    it('getProfile', async () => {

        const profile = await this.contract.getProfile('bob');
        expect(profile).not.to.exist;

    });

    it('setProfile', async () => {

        const account = {
            account_name: 'alice',
            privateKey: '5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW',
        };
        await this.contract.setProfile(account, 'IRLAlice');

        const profile = await this.contract.getProfile('alice');
        expect(profile.user).to.eq('alice');
        expect(profile.firstName).to.eq('IRLAlice');

    });

});