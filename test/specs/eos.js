const config = require('../../config');
const Eos = require('../../js/eos');

describe('Eos', () => {

    it('eos', () => {

        const { getApi, adminApi, rpc } = Eos;

        expect(adminApi.rpc).to.eq(rpc);
        expect(rpc.endpoint).to.eq(config.EOS_ENDPOINT);

        const unsignedApi = getApi();
        expect(unsignedApi.signatureProvider).not.to.exist;

        const signedApi = getApi([config.EOS_PKS]);
        expect(signedApi.signatureProvider).to.exist;
        expect(signedApi.signatureProvider.availableKeys[0]).to.eq('PUB_K1_6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5BoDq63');

    });

    it.skip('create account', async () => {

        const account = await Eos.createAccount('bob');

        expect(account.account_name).to.eq('bob');
        expect(account.keys.privateKey).to.exist;
        expect(account.keys.publicKey).to.exist;

    });

});