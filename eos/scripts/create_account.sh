set -o errexit

if [ -n "$1" ]
then
  echo "creating account for $1"
else
  echo "Error: please give an account name"
  exit
fi

yarn cleos create key --to-console > ./temp_account_1
private_key_1="$(cat ./temp_account_1 | head -2 | tail -1 | sed -e 's/Private key: //')"
public_key_1="$(cat ./temp_account_1 | tail -1 | sed -e 's/Public key: //')"

echo "Owner"
echo "Private key: $private_key_1"
echo "Public key: $public_key_1"
yarn cleos wallet import -n default --private-key "$private_key_1"

yarn cleos create account eosio $1 "$public_key_1" "$public_key_1"

rm ./temp_account_1
