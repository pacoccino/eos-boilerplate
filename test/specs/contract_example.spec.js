const Contract_example = require('../../lib/contract_example');

describe('contract_example', () => {

    before(() => {
        this.contract = new Contract_example('example', '5JKU9mEsvNEzQ7MsGMB8yqVsCXCPhvwiwwt6HgZmJRJGViucVT8');
        this.aliceAccount = {
            account_name: 'alice',
            privateKey: '5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW',
        };
        this.bobAccount = {
            account_name: 'bob',
            privateKey: '5JofWdxYbzV6ipNmEdiaZibVxg9GYMLAFiKEWiYSuz3YEEHJHbb',
        };
        this.charlyAccount = {
            account_name: 'charly',
            privateKey: '5KTFEy1p9fSAbm1dJaMh5Nd3tDMKtY5k93uYNXxisyKi9RZCJgx',
        };
    });

    it('instance', () => {

        expect(this.contract.contractAccount.account_name).to.eq('example');
        expect(this.contract.contractAccount.privateKey).to.eq('5JKU9mEsvNEzQ7MsGMB8yqVsCXCPhvwiwwt6HgZmJRJGViucVT8');

    });

    it('get & set Profile', async () => {

        const profile = await this.contract.getProfile('unknown');
        expect(profile).not.to.exist;

        await this.contract.setProfile(this.aliceAccount, { firstName: 'IRLAlice', age: 21 });
        await this.contract.setProfile(this.bobAccount, { firstName: 'IRLBob', age: 22 });
        await this.contract.setProfile(this.charlyAccount, { firstName: 'IRLCharly', age: 23 });

        const profileAlice = await this.contract.getProfile('alice');
        expect(profileAlice.user).to.eq('alice');
        expect(profileAlice.firstName).to.eq('IRLAlice');

        const profileBob = await this.contract.getProfile('bob');
        expect(profileBob.user).to.eq('bob');
        expect(profileBob.firstName).to.eq('IRLBob');

        const profileCharly = await this.contract.getProfile('charly');
        expect(profileCharly.user).to.eq('charly');
        expect(profileCharly.firstName).to.eq('IRLCharly');

    });

    it.skip('get by secondary key', async () => {

        await this.contract.setProfile(this.aliceAccount, { firstName: 'IRLAlice', age: 21 });
        await this.contract.setProfile(this.bobAccount, { firstName: 'IRLBob', age: 22 });
        await this.contract.setProfile(this.charlyAccount, { firstName: 'IRLCharly', age: 23 });

        const profileBobeAge = await this.contract.getProfileByAge('22');
        expect(profileBobeAge.user).to.eq('bob');

    });

    it('add & get skill', async () => {

        await this.contract.addSkill(this.aliceAccount, 'cpp');
        await this.contract.addSkill(this.aliceAccount, 'c#');
        await this.contract.addSkill(this.bobAccount, 'js');

        const skillsAlice = await this.contract.getSkills('alice');
        const skillsBob = await this.contract.getSkills('bob');

        expect(skillsAlice.length).to.eq(2);
        expect(skillsBob.length).to.eq(1);
        expect(skillsAlice[0]).to.eq('cpp');

        const skill = await this.contract.getSkill('alice', 1);
        expect(skill).to.eq('c#');

    });

    it('getSkill', async () => {

        const skill = await this.contract.getSkill('alice', 0);
        expect(skill).to.eq('cpp');

    });

    it('delete profile', async () => {

        await this.contract.setProfile(this.charlyAccount, { firstName: 'IRLCharly', age: 21 });
        await this.contract.deleteProfile(this.charlyAccount.account_name);

        const profileCharly = await this.contract.getProfile('charly');
        expect(profileCharly).not.to.exist;

    });

});