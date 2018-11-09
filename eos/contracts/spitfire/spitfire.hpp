#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

#include <string>

CONTRACT spitfire : public eosio::contract {
  public:

     using contract::contract;

     spitfire( name self, name code, datastream<const char*> ds ):
                contract( self, code, ds ),
                _profiles( self, self.value ) {}

     ACTION createad(name user, uint32_t product_id, eosio::asset reward);
     ACTION addkw(name user, std::string kw);
     ACTION setprofile(name user, bool notif);

  private:

    TABLE adstruct {
        uint64_t      key;
        name  user;
        uint32_t      product_id;
        eosio::asset  reward;
        bool          read;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< name("ads"), adstruct > ads_table;

    TABLE kwstruct {
        uint64_t      key;
        std::string   kw;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< name("kws"), kwstruct > kws_table;


    TABLE profilestruct {
        name      user;
        bool      notif;

        auto primary_key() const { return user.value; }
    };
    typedef eosio::multi_index< name("profiles"), profilestruct > profiles_table;

    profiles_table _profiles;

};

