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
yarn cleos wallet import -n default --private-key 5Kcu8cbdyjTXD5e1QsRLmX6JYqGMC9mSRsFgDwKPk48j4MmPyBW
yarn cleos create account eosio alice EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv EOS7yHr8Hd55v4GVs6QTMrAiK3x1g89sMRMgkxvTw4TrrSzExmTdv

yarn account:create eosio.token
yarn cleos set contract eosio.token /contracts/eosio.token -p eosio.token

#yarn account:create eosio.system
#yarn cleos set contract eosio.system /contracts/eosio.system -p eosio.system
