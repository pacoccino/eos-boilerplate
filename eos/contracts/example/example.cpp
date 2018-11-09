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
    The user must have set a firstName beforehand
*/
ACTION example::addskill(name user, std::string skill) {

    require_auth( user );

    skils_table skills( _self, user.value );

    auto existing_profile = _profiles.find( user.value );
    eosio_assert( existing_profile != _profiles.end(), "profile doesnt exist" );

    bool exist = false;
    for ( auto itr = skills.begin(); itr != skills.end(); itr++ ) {
        if(skill.compare(itr->skill) == 0) {
            exist = true;
            break;
        }
    }
    if(!exist) {

        skills.emplace( _self, [&]( auto& rcrd ) {
            rcrd.key    = skills.available_primary_key();
            rcrd.skill  = skill;
        });

    }
}

/*
Remove a user.
    Only contract owner can do this.
*/
ACTION example::rmprofile(name user) {

    require_auth( _self );
    require_recipient( user ); // is_account ??

    auto existing_profile = _profiles.find( user.value );

    eosio_assert(existing_profile != _profiles.end(), "Profile does not exist");

    _profiles.erase(existing_profile);

}

/*
transfer token
*/

EOSIO_DISPATCH( example, (setprofile)(addskill)(rmprofile) )