# EOS boilerplate

This repository contains all the necessary tools to setup an EOS dApp environment and also contains a small example smart contract.

A description of the behaviour of the smart contract is described in its own code.

### Versions

- eos: `eosio/eos-dev:v1.4.2`
- eos.cdt: `1.3.2`
- eosjs: `20.0.0-beta2`

## EOS node commands

### Run node & wallet manager

Run the blockchain nodes

```sh
# Start
yarn eos:start

# Stop
yarn eos:stop
```

The persistent data is stored in `eos/data` and `eos/wallets`, for the blockchain and the wallet, respectively.

### Automated reboot

This command will setup all the environment. This is very useful when the code of the smart contract is changed and that we want to redeploy everything. 

It starts nodes, create default accounts, deploy contracts and tokens.
 
*Attention, this command destroy all the local environment (accounts, deployed contracts and data)*
```sh
yarn restart
```

### Tools

You can use **cleos** and **eosio-cpp** through yarn.
 
```sh
yarn cleos wallet list
yarn eosio-cpp  -abigen /opt/eosio/bin/contracts/example/example.cpp -o /opt/eosio/bin/contracts/example/example.wasm --contract example
```

### Frontend
 
To start frontend


Go to frontend folder and install the packages

```sh
cd frontend
yarn
```

Run the server

```sh
yarn start
```


### Test
 
This will restarts the environment and run automated tests.

```sh
yarn test
```

## Command shortcuts

### Contract deploy

```
# Create an account and deploy contract
yarn account:create testacc 
             
# Deploy contract
yarn contract:deploy example example 
```
