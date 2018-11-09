#pragma once

#include <eosiolib/asset.hpp>
#include <eosiolib/eosio.hpp>

using namespace eosio;

#include <string>

CONTRACT example : public eosio::contract {
  public:

     using contract::contract;

     example( name self, name code, datastream<const char*> ds ):
                contract( self, code, ds ),
                _profiles( self, self.value ) {}

     ACTION setprofile(name user, std::string firstName);
     ACTION addskill(name user, std::string skill);

  private:

    TABLE profilestruct {
        name         user;
        std::string  firstName;

        auto primary_key() const { return user.value; }
    };
    typedef eosio::multi_index< name("profiles"), profilestruct > profiles_table;

    TABLE skills_struct {
        uint64_t      key;
        std::string   skill;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< name("skills"), skills_struct > skils_table;

    profiles_table _profiles;

};

