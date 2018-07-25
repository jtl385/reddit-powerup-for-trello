/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var REDDIT_ICON = 'https://png.icons8.com/metro/1600/reddit.png';

TrelloPowerUp.initialize({
  'card-buttons': function(t, options){
    return [{
      'icon': REDDIT_ICON,
      'text': 'Reddit',
      'callback': 
    }]
  },
  
});
