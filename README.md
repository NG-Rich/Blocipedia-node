# Blocipedia

* [Introduction](#introduction)
* [Setup](#setup)
* [Testing](#testing)
* [Usage](#usage)

### Introduction
Blocipedia is a wiki-like clone that allows users to create Markdown wikis. 
An option to upgrade a user's account, provides the user the ability to create private wikis. 
Upgraded accounts also have the ability to add collaborators to view/edit wikis whether or not they have an upgraded account. 

![Landing Page](https://raw.githubusercontent.com/NG-Rich/blocipedia-node/master/src/assets/images/landing.png) <div align=center>Landing Page</div>

![Wikis Page](https://raw.githubusercontent.com/NG-Rich/blocipedia-node/master/src/assets/images/wikis.png) <div align=center>Wikis page listing available wikis to the user</div>

![Upgrade Page](https://raw.githubusercontent.com/NG-Rich/blocipedia-node/master/src/assets/images/upgrade.png) <div align=center>Upgrade page which redirects to Stripe payment screen to complete payment</div>

![Collabs Page](https://raw.githubusercontent.com/NG-Rich/blocipedia-node/master/src/assets/images/collabs.png) <div align=center>Option to add collaborators to a wiki once an account has been upgraded</div>

### Setup
Setup is simple since you just need to run `npm start` (if you have npm installed) and the app is up and running!

### Testing
I've made test specs if you wish to run tests on the app features.  
1. `static_spec.js` which tests the landing page.
2. `user_spec.js` which tests behavior of account creation.
3. `users_spec.js` which tests for user resource.
4. `wikis_spec.js` which tests for the wikis resource.
5. `wiki_spec.js` which tests for behavior of wikis.


All can be run with `npm test spec/(spec_folder)/(test_spec_here.js)`.
(Further specs will be available when features are in progress)

### Usage
Start up the server with `npm start` and you'll be brought to the landing page that allows you get started on creating wikis by signing up.
Afterwards, you'll have an option to either create wikis or upgrade your account from standard to premium in order to create both public and private wikis.
With a premium account, you can edit a wiki to allow the addition of collaborators that can then view and edit your private wikis, regardless of account status.
