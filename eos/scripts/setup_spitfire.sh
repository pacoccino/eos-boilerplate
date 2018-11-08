set -o errexit

if [ -n "$1" ];
then
SPITFIRE_ACCOUNT=$1
else
SPITFIRE_ACCOUNT=spitfire
fi

TOKEN_SYMBOL=PST
SPITFIRE_PRIV=5JKU9mEsvNEzQ7MsGMB8yqVsCXCPhvwiwwt6HgZmJRJGViucVT8
SPITFIRE_PUB=EOS8YtHXqYuAvFSGbkSYzxWuRPXPLeWVsjRLEjw1fgQAMYjvLZ66p

yarn cleos wallet import -n default --private-key "$SPITFIRE_PRIV"
yarn cleos create account eosio "$SPITFIRE_ACCOUNT" "$SPITFIRE_PUB" "$SPITFIRE_PUB"

yarn contract:deploy spitfire "$SPITFIRE_ACCOUNT"

yarn cleos push action eosio.token create '{"issuer":"eosio", "maximum_supply":"1000000000.0000 '"$TOKEN_SYMBOL"'"}' -p eosio.token@active
yarn cleos push action eosio.token issue '[ "'"$SPITFIRE_ACCOUNT"'", "1000000000.0000 '"$TOKEN_SYMBOL"'" ]' -p eosio
