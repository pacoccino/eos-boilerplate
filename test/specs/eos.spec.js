const config = require('../../config');
const Eos = require('../../lib/eos');

describe('Eos', () => {

    it('get api', () => {

        const { getApi, adminApi, rpc } = Eos;

        expect(adminApi.rpc).to.eq(rpc);
        expect(rpc.endpoint).to.eq(config.EOS_ENDPOINT);

        const unsignedApi = getApi();
        expect(unsignedApi.signatureProvider).not.to.exist;

        const signedApi = getApi([config.EOS_PKS]);
        expect(signedApi.signatureProvider).to.exist;
        expect(signedApi.signatureProvider.availableKeys[0]).to.eq('PUB_K1_8YtHXqYuAvFSGbkSYzxWuRPXPLeWVsjRLEjw1fgQAMYjvZub3c');

    });

    it.skip('create account', async () => {

        const account = await Eos.createAccount('bob');

        expect(account.account_name).to.eq('bob');
        expect(account.keys.privateKey).to.exist;
        expect(account.keys.publicKey).to.exist;

    });

    it('rpc infos', async () => {

        const account = await Eos.rpc.get_account('alice');
        console.log(account);
        const accounts = await Eos.rpc.history_get_key_accounts('EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv');
        console.log(accounts);
        const block = await Eos.rpc.get_block(1);
        console.log(block);
        const info = await Eos.rpc.get_info(1);
        console.log(info);
        const balance = await Eos.rpc.get_currency_balance('eosio.token', 'example', 'PST');
        console.log(balance);

        console.log(await Eos.rpc.history_get_actions('alice'));

    });

    // TODO test transaction & getTableRows

});