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
alias eosiocpp='docker-compose run --rm nodeos eosiocpp'

CONTRACTPATH="/opt/eosio/bin/contracts"

# compile smart contract to wast and abi files
(
  eosiocpp -o "$CONTRACTPATH/$1/$1.wast" "$CONTRACTPATH/$1/$1.cpp" &&
  eosiocpp -g "$CONTRACTPATH/$1/$1.abi" "$CONTRACTPATH/$1/$1.cpp"
) &&

# set (deploy) compiled contract to blockchain
cleos set contract $2 "$CONTRACTPATH/$1/" --permission $2
