set -o errexit

if [ -n "$1" ];
then
CONTRACT_ACCOUNT=$1
else
CONTRACT_ACCOUNT=example
fi

if [ -n "$2" ];
then
CONTRACT_NAME=$2
else
CONTRACT_NAME=example
fi

TOKEN_SYMBOL=PST
CONTRACT_PRIV=5JKU9mEsvNEzQ7MsGMB8yqVsCXCPhvwiwwt6HgZmJRJGViucVT8
CONTRACT_PUB=EOS8YtHXqYuAvFSGbkSYzxWuRPXPLeWVsjRLEjw1fgQAMYjvLZ66p

yarn cleos wallet import -n default --private-key "$CONTRACT_PRIV"
yarn cleos create account eosio "$CONTRACT_ACCOUNT" "$CONTRACT_PUB" "$CONTRACT_PUB"

yarn contract:deploy "$CONTRACT_NAME" "$CONTRACT_ACCOUNT"

yarn cleos push action eosio.token create '{"issuer":"eosio", "maximum_supply":"1000000000.0000 '"$TOKEN_SYMBOL"'"}' -p eosio.token@active
yarn cleos push action eosio.token issue '[ "'"$CONTRACT_ACCOUNT"'", "1000000000.0000 '"$TOKEN_SYMBOL"'", "" ]' -p eosio
