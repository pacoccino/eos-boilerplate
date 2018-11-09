# EOS boilerplate

This repository contains all the necessary tools to setup an EOS dApp environment and also contains a small example smart contract.

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

### Test
 
This will restarts the environment and run automated tests.

```sh
yarn test
```


## Wallet bootstraping

To be able to create accounts, you will need to import the private key of the producer (set in `eos/config/config.ini`)

Then you can create different wallets for your accounts


```
# import producer private key

yarn cleos wallet create --to-console -n eosiomain
yarn cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

# create a wallet for an account

yarn cleos wallet create --to-console -n default
yarn cleos create key --to-console
yarn cleos create key --to-console
yarn cleos wallet import -n default

# create an account

yarn cleos create account eosio testacc pubkey1 pubkey2

# see opened, unlocked wallets and user account

yarn cleos wallet list
yarn cleos wallet list keys
yarn cleos get account testacc

# when you need to reopen

yarn cleos wallet open -n default
yarn cleos wallet unlock -n default
yarn cleos wallet open -n eosiomain
yarn cleos wallet unlock -n eosiomain
```

## Smart contracts


### Creation & deployement
```
# create a new contract

yarn eosio-cpp -n contracts/hello
yarn eosio-cpp -o /opt/eosio/bin/contracts/hello/hello.wast  /opt/eosio/bin/contracts/hello/hello.cpp
yarn eosio-cpp -g /opt/eosio/bin/contracts/hello/hello.abi  /opt/eosio/bin/contracts/hello/hello.cpp
yarn cleos set contract hi /opt/eosio/bin/contracts/hello --permission testacc@active     
yarn cleos push action testacc hi '["testacc"]' -p testacc@active
```

### Create token

```
yarn cleos create account eosio eosio.token pubkey1 pubkey2
yarn cleos set contract eosio.token /contracts/eosio.token -p eosio.token                   
yarn cleos push action eosio.token create '{"issuer":"eosio", "maximum_supply":"1000000000.0000 HAK"}' -p eosio.token@active
yarn cleos push action eosio.token issue '[ "testacc", "100.0000 HAK", "memo" ]' -p eosio
yarn cleos get table eosio.token testacc accounts
```


### Contract deploy

```
# Create an account and deploy contract
yarn account:create addressbook              
yarn contract:deploy addressbook addressbook 
        
# create an account and add to addressbook          
yarn account:create paco
yarn cleos push action addressbook create '["paco", 332233, "Khaled A", "Springfield"]' -p paco

# get the address book data
yarn cleos get table addressbook addressbook records    
```
