#include "spitfire.hpp"

ACTION spitfire::createad(name user, uint32_t product_id, eosio::asset reward) {

    require_auth( _self );
    require_recipient( user );

    //ads_table ads( _self, user );

    auto existing_profile = _profiles.find( user.value );
    eosio_assert( existing_profile != _profiles.end(), "profile doesnt exist" );

    const auto& prof = *existing_profile;
    eosio_assert( prof.notif == true, "profile doesnt accept notifications" );

    _ads.emplace( _self, [&]( auto& rcrd ) {
        rcrd.key         = _ads.available_primary_key();
        rcrd.user        = user;
        rcrd.product_id  = product_id;
        rcrd.reward      = reward;
        rcrd.read        = false;
    });

   //INLINE_ACTION_SENDER(eosio::token, transfer)( N(eosio.token), {{_self,N(eosio.code)}}, {_self, user, reward, std::string("")} );
}

ACTION spitfire::addkw(name user, std::string kw) {

    require_auth( user );

    _kws.emplace( _self, [&]( auto& rcrd ) {
       rcrd.key   = _kws.available_primary_key();
       rcrd.kw    = kw;
    });

}

ACTION spitfire::setprofile(name user, bool notif) {

    require_auth( user );

    auto existing_profile = _profiles.find( user.value );

    if(existing_profile != _profiles.end()) {

      _profiles.modify( existing_profile, _self, [&]( auto& rcrd ) {
         rcrd.notif     = notif;
      });

    } else {

      _profiles.emplace( _self, [&]( auto& rcrd ) {
         rcrd.user      = user;
         rcrd.notif     = notif;
      });

    }

}

EOSIO_DISPATCH( spitfire, (createad)(addkw)(setprofile) )