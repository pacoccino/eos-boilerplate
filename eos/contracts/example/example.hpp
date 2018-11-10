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

     ACTION setprofile(name user, std::string firstName, uint64_t age);
     ACTION addskill(name user, std::string skill);
     ACTION rmprofile(name user);
     ACTION notify(name user, std::string msg);

  private:

    void send_summary(name user, std::string message);

    TABLE profilestruct {
        name         user;
        std::string  firstName;
        uint64_t     age;

        // primary key
        auto primary_key() const { return user.value; }

        // secondary key, only supports uint64_t, uint128_t, uint256_t, double or long double
        uint64_t get_by_age() const { return age; }
    };
    typedef eosio::multi_index< name("profiles"), profilestruct, indexed_by< name("getbyage"), const_mem_fun<profilestruct, uint64_t, &profilestruct::get_by_age>> > profiles_table;

    TABLE skills_struct {
        uint64_t      key;
        std::string   skill;

        uint64_t primary_key() const { return key; }
    };
    typedef eosio::multi_index< name("skills"), skills_struct > skils_table;

    profiles_table _profiles;

};

