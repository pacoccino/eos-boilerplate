#include "example.hpp"

/*
Sets the firstName of a user. Adds or edit the existing one.

    The profiles are stored in the contract scope. Only one instance of profile per user.
*/
ACTION example::setprofile(name user, std::string firstName) {

    require_auth( user );

    auto existing_profile = _profiles.find( user.value );

    if(existing_profile != _profiles.end()) {

      _profiles.modify( existing_profile, _self, [&]( auto& rcrd ) {
         rcrd.firstName = firstName;
      });

    } else {

      _profiles.emplace( _self, [&]( auto& rcrd ) {
         rcrd.user      = user;
         rcrd.firstName = firstName;
      });

    }

}

/*
Add a skill for a user.

    Here the skills are stored on the user scope. Each user can have multiple skills.
    The user must have set a firstName first
*/
ACTION example::addskill(name user, std::string skill) {

    require_auth( user );

    skils_table skills( _self, user.value );

    auto existing_profile = _profiles.find( user.value );
    eosio_assert( existing_profile != _profiles.end(), "profile doesnt exist" );

    skills.emplace( _self, [&]( auto& rcrd ) {
        rcrd.key    = skills.available_primary_key();
        rcrd.skill  = skill;
    });

}

EOSIO_DISPATCH( example, (setprofile)(addskill) )