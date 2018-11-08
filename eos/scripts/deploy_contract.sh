set -o errexit

if [ -z "$1" ]
then
  echo "please give arguments: contractname owner"
  exit
fi

if [ -z "$2" ]
then
  echo "please give arguments: contractname owner"
  exit
fi

alias cleos='docker-compose run --rm cleos'
alias eosio-cpp='docker-compose run --rm cdt'

CONTRACTPATH="/opt/eosio/bin/contracts"

# compile smart contract to wast and abi files
eosio-cpp -abigen "$CONTRACTPATH/$1/$1.cpp" -o "$CONTRACTPATH/$1/$1.wasm" --contract "$1"

# set (deploy) compiled contract to blockchain
cleos set contract $2 "$CONTRACTPATH/$1/" --permission $2
