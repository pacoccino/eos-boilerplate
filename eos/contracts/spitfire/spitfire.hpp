#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>
#include <eosio.token/eosio.token.hpp>

#include <string>

class spitfire : public eosio::contract {
  public:

     spitfire( account_name self ):contract(self){}

     void createad(account_name user, uint32_t product_id, eosio::asset reward);
     void addkw(account_name user, std::string kw);
     void setprofile(account_name user, bool notif);

  private:

    /// @abi table ads
    struct ad {
        uint64_t      key;
        account_name  user;
        uint32_t      product_id;
        eosio::asset  reward;
        bool          read;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< N(ads), ad > ads_table;

    /// @abi table kws
    struct kw {
        uint64_t      key;
        std::string   kw;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< N(kws), kw > kws_table;

    /// @abi table profiles
    struct profile {
        account_name      user;
        bool              notif;

        account_name primary_key() const { return user; }
    };
    typedef eosio::multi_index< N(profiles), profile > profiles_table;

};

