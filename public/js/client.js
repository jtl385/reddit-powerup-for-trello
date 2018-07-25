/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

const REDDIT_ICON = 'https://png.icons8.com/metro/1600/reddit.png';

const cardButtonCallback = (t) => {
  return t.popup({
    'title': 'Reddit',
    'url': 'reddit.html',
  });
};

TrelloPowerUp.initialize({
  'card-buttons': (t, options) => {
    return [{
      'icon': REDDIT_ICON,
      'text': 'Reddit',
      'callback': cardButtonCallback,
    }];
  },
  'attachment
  
});
