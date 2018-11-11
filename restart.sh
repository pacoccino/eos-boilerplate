yarn eos:stop
rm -rf ./eos/data ./eos/wallets
yarn eos:start
./eos/scripts/setup_wallets.sh
./eos/scripts/setup_contract.sh
