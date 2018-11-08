const Spitfire = require('../../js/spitfire');

describe('spitfire', () => {

    before(() => {
        this.spitfire = new Spitfire('spitfire', '5JcY3wrbDZqLDX5fcbd46S1iyUrtx6SfSyPtkJxPiDANaBYHskH');
    });

    it('instance', () => {

        expect(this.spitfire.contractAccount.account_name).to.eq('spitfire');
        expect(this.spitfire.contractAccount.keys.privateKey).to.eq('5JcY3wrbDZqLDX5fcbd46S1iyUrtx6SfSyPtkJxPiDANaBYHskH');

    });

    it('getProfile', async () => {

        const profile = await this.spitfire.getProfile('bob');
        expect(profile).not.to.exist;

    });

    it('setProfile', async () => {

        const account = {
            account_name: 'alice',
            privateKey: '5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW',
        };
        await this.spitfire.setProfile(account, true);

        const profile = await this.spitfire.getProfile('alice');
        expect(profile.user).to.eq('alice');
        expect(profile.notif).to.eq(1);

    });

});