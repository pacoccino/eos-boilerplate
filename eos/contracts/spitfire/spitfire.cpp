#include "spitfire.hpp"

void spitfire::createad(account_name user, uint32_t product_id, eosio::asset reward) {

    require_auth( _self );
    require_recipient( user );

    ads_table ads( _self, user );

    profiles_table profiles( _self, _self );
    auto existing_profile = profiles.find( user );
    eosio_assert( existing_profile != profiles.end(), "profile doesnt exist" );
    const auto& prof = *existing_profile;
    eosio_assert( prof.notif == true, "profile doesnt accept notifications" );

    ads.emplace( _self, [&]( auto& rcrd ) {
        rcrd.key         = ads.available_primary_key();
        rcrd.user        = user;
        rcrd.product_id  = product_id;
        rcrd.reward      = reward;
        rcrd.read        = false;
    });

   //INLINE_ACTION_SENDER(eosio::token, transfer)( N(eosio.token), {{_self,N(eosio.code)}}, {_self, user, reward, std::string("")} );
}

void spitfire::addkw(account_name user, std::string kw) {

    require_auth( user );

    kws_table kws( _self, user );

    kws.emplace( _self, [&]( auto& rcrd ) {
       rcrd.key   = kws.available_primary_key();
       rcrd.kw    = kw;
    });

}

void spitfire::setprofile(account_name user, bool notif) {

    require_auth( user );

    profiles_table profiles( _self, _self );
    auto existing_profile = profiles.find( user );

    if(existing_profile != profiles.end()) {

      profiles.modify( existing_profile, 0, [&]( auto& rcrd ) {
         rcrd.notif     = notif;
      });

    } else {

      profiles.emplace( _self, [&]( auto& rcrd ) {
         rcrd.user      = user;
         rcrd.notif     = notif;
      });

    }

}

EOSIO_ABI( spitfire, (createad)(addkw)(setprofile) )
