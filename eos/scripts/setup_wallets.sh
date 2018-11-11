set -o errexit

FILE=./keys.txt

echo "Keys file" > $FILE

echo "\n" >> $FILE
echo "Producer account" >> $FILE
yarn cleos wallet create --to-console -n eosiomain >> $FILE
yarn cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

echo "\n" >> $FILE

echo "Default account" >> $FILE
yarn cleos wallet create -n default --to-console >> $FILE

# Create alice account
yarn cleos wallet import -n default --private-key 5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW
yarn cleos create account eosio alice EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv

# Create bob account
yarn cleos wallet import -n default --private-key 5JofWdxYbzV6ipNmEdiaZibVxg9GYMLAFiKEWiYSuz3YEEHJHbb
yarn cleos create account eosio bob EOS8Ke736LWfLfXdw4vFVYGG3Hf5iVDJhdPherwA7P9nuxdKaUfz7 EOS8Ke736LWfLfXdw4vFVYGG3Hf5iVDJhdPherwA7P9nuxdKaUfz7

# Create charly account
yarn cleos wallet import -n default --private-key 5KTFEy1p9fSAbm1dJaMh5Nd3tDMKtY5k93uYNXxisyKi9RZCJgx
yarn cleos create account eosio charly EOS6EeXqdYC7jmuATwjfY5Lx1RpAYc533xGispe391s1ZTJGa4Bzt EOS6EeXqdYC7jmuATwjfY5Lx1RpAYc533xGispe391s1ZTJGa4Bzt

yarn account:create eosio.token
yarn cleos set contract eosio.token /contracts/eosio.token -p eosio.token

yarn cleos push action eosio.token create '{"issuer":"eosio", "maximum_supply":"1000000000.0000 EOS"}' -p eosio.token@active
yarn cleos push action eosio.token issue '[ "alice", "100.0000 EOS", "memo" ]' -p eosio

#yarn account:create eosio.system
#yarn cleos set contract eosio.system /contracts/eosio.system -p eosio.system
