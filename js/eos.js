const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch');                            // node only; not needed in browsers
const { EOS_ENDPOINT, EOS_PKS } = require('../config');
const { TextDecoder, TextEncoder } = require('text-encoding');
const rpc = new JsonRpc(EOS_ENDPOINT, { fetch });
const {Keygen} = require('eosjs-keygen');

function getApi(privateKeys) {

    const abiProvider = {
        async getRawAbi() {
            return {
                accountName: 'eosio',
                abi: '{\n' +
                '   "version": "eosio::abi/1.0",\n' +
                '   "types": [{\n' +
                '      "new_type_name": "account_name",\n' +
                '      "type": "name"\n' +
                '   },{\n' +
                '      "new_type_name": "permission_name",\n' +
                '      "type": "name"\n' +
                '   },{\n' +
                '      "new_type_name": "action_name",\n' +
                '      "type": "name"\n' +
                '   },{\n' +
                '      "new_type_name": "transaction_id_type",\n' +
                '      "type": "checksum256"\n' +
                '   },{\n' +
                '      "new_type_name": "weight_type",\n' +
                '      "type": "uint16"\n' +
                '   }],\n' +
                '   "____comment": "eosio.bios structs: set_account_limits, setpriv, set_global_limits, producer_key, set_producers, require_auth are provided so abi available for deserialization in future.",\n' +
                '   "structs": [{\n' +
                '      "name": "permission_level",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"actor",      "type":"account_name"},\n' +
                '        {"name":"permission", "type":"permission_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "key_weight",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"key",    "type":"public_key"},\n' +
                '        {"name":"weight", "type":"weight_type"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "bidname",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"bidder",  "type":"account_name"},\n' +
                '        {"name":"newname", "type":"account_name"},\n' +
                '        {"name":"bid", "type":"asset"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "permission_level_weight",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"permission", "type":"permission_level"},\n' +
                '        {"name":"weight",     "type":"weight_type"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "wait_weight",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"wait_sec", "type":"uint32"},\n' +
                '        {"name":"weight",   "type":"weight_type"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "authority",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"threshold", "type":"uint32"},\n' +
                '        {"name":"keys",      "type":"key_weight[]"},\n' +
                '        {"name":"accounts",  "type":"permission_level_weight[]"},\n' +
                '        {"name":"waits",     "type":"wait_weight[]"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "newaccount",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"creator", "type":"account_name"},\n' +
                '        {"name":"name",    "type":"account_name"},\n' +
                '        {"name":"owner",   "type":"authority"},\n' +
                '        {"name":"active",  "type":"authority"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "setcode",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",   "type":"account_name"},\n' +
                '        {"name":"vmtype",    "type":"uint8"},\n' +
                '        {"name":"vmversion", "type":"uint8"},\n' +
                '        {"name":"code",      "type":"bytes"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "setabi",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account", "type":"account_name"},\n' +
                '        {"name":"abi",     "type":"bytes"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "updateauth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",    "type":"account_name"},\n' +
                '        {"name":"permission", "type":"permission_name"},\n' +
                '        {"name":"parent",     "type":"permission_name"},\n' +
                '        {"name":"auth",       "type":"authority"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "deleteauth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",    "type":"account_name"},\n' +
                '        {"name":"permission", "type":"permission_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "linkauth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",     "type":"account_name"},\n' +
                '        {"name":"code",        "type":"account_name"},\n' +
                '        {"name":"type",        "type":"action_name"},\n' +
                '        {"name":"requirement", "type":"permission_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "unlinkauth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",     "type":"account_name"},\n' +
                '        {"name":"code",        "type":"account_name"},\n' +
                '        {"name":"type",        "type":"action_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "canceldelay",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"canceling_auth", "type":"permission_level"},\n' +
                '        {"name":"trx_id",         "type":"transaction_id_type"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "onerror",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"sender_id", "type":"uint128"},\n' +
                '        {"name":"sent_trx",  "type":"bytes"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "buyrambytes",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"payer", "type":"account_name"},\n' +
                '         {"name":"receiver", "type":"account_name"},\n' +
                '         {"name":"bytes", "type":"uint32"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "sellram",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"account", "type":"account_name"},\n' +
                '         {"name":"bytes", "type":"uint64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "buyram",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"payer", "type":"account_name"},\n' +
                '         {"name":"receiver", "type":"account_name"},\n' +
                '         {"name":"quant", "type":"asset"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "delegatebw",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"from", "type":"account_name"},\n' +
                '         {"name":"receiver", "type":"account_name"},\n' +
                '         {"name":"stake_net_quantity", "type":"asset"},\n' +
                '         {"name":"stake_cpu_quantity", "type":"asset"},\n' +
                '         {"name":"transfer", "type":"bool"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "undelegatebw",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"from", "type":"account_name"},\n' +
                '         {"name":"receiver", "type":"account_name"},\n' +
                '         {"name":"unstake_net_quantity", "type":"asset"},\n' +
                '         {"name":"unstake_cpu_quantity", "type":"asset"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "refund",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"owner", "type":"account_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "delegated_bandwidth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"from", "type":"account_name"},\n' +
                '         {"name":"to", "type":"account_name"},\n' +
                '         {"name":"net_weight", "type":"asset"},\n' +
                '         {"name":"cpu_weight", "type":"asset"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "user_resources",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"owner", "type":"account_name"},\n' +
                '         {"name":"net_weight", "type":"asset"},\n' +
                '         {"name":"cpu_weight", "type":"asset"},\n' +
                '         {"name":"ram_bytes", "type":"uint64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "total_resources",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"owner", "type":"account_name"},\n' +
                '         {"name":"net_weight", "type":"asset"},\n' +
                '         {"name":"cpu_weight", "type":"asset"},\n' +
                '         {"name":"ram_bytes", "type":"uint64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "refund_request",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"owner", "type":"account_name"},\n' +
                '         {"name":"request_time", "type":"time_point_sec"},\n' +
                '         {"name":"net_amount", "type":"asset"},\n' +
                '         {"name":"cpu_amount", "type":"asset"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "blockchain_parameters",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '\n' +
                '         {"name":"max_block_net_usage",                 "type":"uint64"},\n' +
                '         {"name":"target_block_net_usage_pct",          "type":"uint32"},\n' +
                '         {"name":"max_transaction_net_usage",           "type":"uint32"},\n' +
                '         {"name":"base_per_transaction_net_usage",      "type":"uint32"},\n' +
                '         {"name":"net_usage_leeway",                    "type":"uint32"},\n' +
                '         {"name":"context_free_discount_net_usage_num", "type":"uint32"},\n' +
                '         {"name":"context_free_discount_net_usage_den", "type":"uint32"},\n' +
                '         {"name":"max_block_cpu_usage",                 "type":"uint32"},\n' +
                '         {"name":"target_block_cpu_usage_pct",          "type":"uint32"},\n' +
                '         {"name":"max_transaction_cpu_usage",           "type":"uint32"},\n' +
                '         {"name":"min_transaction_cpu_usage",           "type":"uint32"},\n' +
                '         {"name":"max_transaction_lifetime",            "type":"uint32"},\n' +
                '         {"name":"deferred_trx_expiration_window",      "type":"uint32"},\n' +
                '         {"name":"max_transaction_delay",               "type":"uint32"},\n' +
                '         {"name":"max_inline_action_size",              "type":"uint32"},\n' +
                '         {"name":"max_inline_action_depth",             "type":"uint16"},\n' +
                '         {"name":"max_authority_depth",                 "type":"uint16"}\n' +
                '\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "eosio_global_state",\n' +
                '      "base": "blockchain_parameters",\n' +
                '      "fields": [\n' +
                '         {"name":"max_ram_size",                  "type":"uint64"},\n' +
                '         {"name":"total_ram_bytes_reserved",      "type":"uint64"},\n' +
                '         {"name":"total_ram_stake",               "type":"int64"},\n' +
                '         {"name":"last_producer_schedule_update", "type":"block_timestamp_type"},\n' +
                '         {"name":"last_pervote_bucket_fill",      "type":"uint64"},\n' +
                '         {"name":"pervote_bucket",                "type":"int64"},\n' +
                '         {"name":"perblock_bucket",               "type":"int64"},\n' +
                '         {"name":"total_unpaid_blocks",           "type":"uint32"},\n' +
                '         {"name":"total_activated_stake",         "type":"int64"},\n' +
                '         {"name":"thresh_activated_stake_time",   "type":"uint64"},\n' +
                '         {"name":"last_producer_schedule_size",   "type":"uint16"},\n' +
                '         {"name":"total_producer_vote_weight",    "type":"float64"},\n' +
                '         {"name":"last_name_close",               "type":"block_timestamp_type"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "producer_info",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '         {"name":"owner",           "type":"account_name"},\n' +
                '         {"name":"total_votes",     "type":"float64"},\n' +
                '         {"name":"producer_key",    "type":"public_key"},\n' +
                '         {"name":"is_active",       "type":"bool"},\n' +
                '         {"name":"url",             "type":"string"},\n' +
                '         {"name":"unpaid_blocks",   "type":"uint32"},\n' +
                '         {"name":"last_claim_time", "type":"uint64"},\n' +
                '         {"name":"location",        "type":"uint16"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "regproducer",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"producer",     "type":"account_name"},\n' +
                '        {"name":"producer_key", "type":"public_key"},\n' +
                '        {"name":"url",          "type":"string"},\n' +
                '        {"name":"location",     "type":"uint16"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "unregprod",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"producer",     "type":"account_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "setram",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"max_ram_size",     "type":"uint64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "regproxy",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"proxy",     "type":"account_name"},\n' +
                '        {"name":"isproxy",   "type":"bool"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "voteproducer",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"voter",     "type":"account_name"},\n' +
                '        {"name":"proxy",     "type":"account_name"},\n' +
                '        {"name":"producers", "type":"account_name[]"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "voter_info",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"owner",                "type":"account_name"},\n' +
                '        {"name":"proxy",                "type":"account_name"},\n' +
                '        {"name":"producers",            "type":"account_name[]"},\n' +
                '        {"name":"staked",               "type":"int64"},\n' +
                '        {"name":"last_vote_weight",     "type":"float64"},\n' +
                '        {"name":"proxied_vote_weight",  "type":"float64"},\n' +
                '        {"name":"is_proxy",             "type":"bool"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "claimrewards",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"owner",   "type":"account_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "setpriv",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",    "type":"account_name"},\n' +
                '        {"name":"is_priv",    "type":"int8"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "rmvproducer",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"producer", "type":"account_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "set_account_limits",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"account",    "type":"account_name"},\n' +
                '        {"name":"ram_bytes",  "type":"int64"},\n' +
                '        {"name":"net_weight", "type":"int64"},\n' +
                '        {"name":"cpu_weight", "type":"int64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "set_global_limits",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"cpu_usec_per_period",    "type":"int64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "producer_key",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"producer_name",      "type":"account_name"},\n' +
                '        {"name":"block_signing_key",  "type":"public_key"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "set_producers",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"schedule",   "type":"producer_key[]"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "require_auth",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"from", "type":"account_name"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "setparams",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"params", "type":"blockchain_parameters"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "connector",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"balance", "type":"asset"},\n' +
                '        {"name":"weight", "type":"float64"}\n' +
                '      ]\n' +
                '    },{\n' +
                '      "name": "exchange_state",\n' +
                '      "base": "",\n' +
                '      "fields": [\n' +
                '        {"name":"supply", "type":"asset"},\n' +
                '        {"name":"base", "type":"connector"},\n' +
                '        {"name":"quote", "type":"connector"}\n' +
                '      ]\n' +
                '    }, {\n' +
                '       "name": "namebid_info",\n' +
                '       "base": "",\n' +
                '       "fields": [\n' +
                '          {"name":"newname", "type":"account_name"},\n' +
                '          {"name":"high_bidder", "type":"account_name"},\n' +
                '          {"name":"high_bid", "type":"int64"},\n' +
                '          {"name":"last_bid_time", "type":"uint64"}\n' +
                '       ]\n' +
                '    }\n' +
                '   ],\n' +
                '   "actions": [{\n' +
                '     "name": "newaccount",\n' +
                '     "type": "newaccount",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "setcode",\n' +
                '     "type": "setcode",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "setabi",\n' +
                '     "type": "setabi",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "updateauth",\n' +
                '     "type": "updateauth",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "deleteauth",\n' +
                '     "type": "deleteauth",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "linkauth",\n' +
                '     "type": "linkauth",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "unlinkauth",\n' +
                '     "type": "unlinkauth",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "canceldelay",\n' +
                '     "type": "canceldelay",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '     "name": "onerror",\n' +
                '     "type": "onerror",\n' +
                '     "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "buyrambytes",\n' +
                '      "type": "buyrambytes",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "buyram",\n' +
                '      "type": "buyram",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "sellram",\n' +
                '      "type": "sellram",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "delegatebw",\n' +
                '      "type": "delegatebw",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "undelegatebw",\n' +
                '      "type": "undelegatebw",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "refund",\n' +
                '      "type": "refund",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "regproducer",\n' +
                '      "type": "regproducer",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "setram",\n' +
                '      "type": "setram",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "bidname",\n' +
                '      "type": "bidname",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "unregprod",\n' +
                '      "type": "unregprod",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "regproxy",\n' +
                '      "type": "regproxy",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "voteproducer",\n' +
                '      "type": "voteproducer",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "claimrewards",\n' +
                '      "type": "claimrewards",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "setpriv",\n' +
                '      "type": "setpriv",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "rmvproducer",\n' +
                '      "type": "rmvproducer",\n' +
                '      "ricardian_contract": ""\n' +
                '   },{\n' +
                '      "name": "setalimits",\n' +
                '      "type": "set_account_limits",\n' +
                '      "ricardian_contract": ""\n' +
                '    },{\n' +
                '      "name": "setglimits",\n' +
                '      "type": "set_global_limits",\n' +
                '      "ricardian_contract": ""\n' +
                '    },{\n' +
                '      "name": "setprods",\n' +
                '      "type": "set_producers",\n' +
                '      "ricardian_contract": ""\n' +
                '    },{\n' +
                '      "name": "reqauth",\n' +
                '      "type": "require_auth",\n' +
                '      "ricardian_contract": ""\n' +
                '    },{\n' +
                '      "name": "setparams",\n' +
                '      "type": "setparams",\n' +
                '      "ricardian_contract": ""\n' +
                '    }],\n' +
                '   "tables": [{\n' +
                '      "name": "producers",\n' +
                '      "type": "producer_info",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["owner"],\n' +
                '      "key_types" : ["uint64"]\n' +
                '    },{\n' +
                '      "name": "global",\n' +
                '      "type": "eosio_global_state",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : [],\n' +
                '      "key_types" : []\n' +
                '    },{\n' +
                '      "name": "voters",\n' +
                '      "type": "voter_info",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["owner"],\n' +
                '      "key_types" : ["account_name"]\n' +
                '    },{\n' +
                '      "name": "userres",\n' +
                '      "type": "user_resources",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["owner"],\n' +
                '      "key_types" : ["uint64"]\n' +
                '    },{\n' +
                '      "name": "delband",\n' +
                '      "type": "delegated_bandwidth",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["to"],\n' +
                '      "key_types" : ["uint64"]\n' +
                '    },{\n' +
                '      "name": "rammarket",\n' +
                '      "type": "exchange_state",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["supply"],\n' +
                '      "key_types" : ["uint64"]\n' +
                '    },{\n' +
                '      "name": "refunds",\n' +
                '      "type": "refund_request",\n' +
                '      "index_type": "i64",\n' +
                '      "key_names" : ["owner"],\n' +
                '      "key_types" : ["uint64"]\n' +
                '    },{\n' +
                '       "name": "namebids",\n' +
                '       "type": "namebid_info",\n' +
                '       "index_type": "i64",\n' +
                '       "key_names" : ["newname"],\n' +
                '       "key_types" : ["account_name"]\n' +
                '    }\n' +
                '   ],\n' +
                '   "ricardian_clauses": [],\n' +
                '   "abi_extensions": []\n' +
                '}',
            };
        },
    };

    const params = {
        rpc,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
        //abiProvider,
    };

    if(Array.isArray(privateKeys)) {
        params.signatureProvider = new JsSignatureProvider(privateKeys);
    }

    return new Api(params);

}

const adminApi = getApi(EOS_PKS ? EOS_PKS.split(',') : null);

async function createAccount(account_name) {

    const keys = await Keygen.generateMasterKeys();

    const ownerPrivateKey = keys.privateKeys.owner;
    const ownerPublicKey = keys.publicKeys.owner;

    await adminApi.transact({
        actions: [{
            account: 'eosio',
            name: 'newaccount',
            authorization: [{
                actor: 'eosio',
                permission: 'active',
            }],
            data: {
                creator: 'eosio',
                name: account_name,
                owner: {
                    threshold: 1,
                    keys: [{
                        key: ownerPublicKey,
                        weight: 1
                    }],
                    accounts: [],
                    waits: []
                },
                active: {
                    threshold: 1,
                    keys: [{
                        key: ownerPublicKey,
                        weight: 1
                    }],
                    accounts: [],
                    waits: []
                },
            },
        },
            {
                account: 'eosio',
                name: 'buyrambytes',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    payer: 'eosio',
                    receiver: account_name,
                    bytes: 8192,
                },
            },
            {
                account: 'eosio',
                name: 'delegatebw',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    from: 'eosio',
                    receiver: account_name,
                    stake_net_quantity: '1.0000 SYS',
                    stake_cpu_quantity: '1.0000 SYS',
                    transfer: false,
                }
            }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });

    const account = {
        account_name,
        keys: {
            privateKey: ownerPrivateKey,
            publicKey: ownerPublicKey,
        }
    };

    console.log('account created', account);

    return account;

}

module.exports = {
    rpc,
    adminApi,
    getApi,
    createAccount,
};
