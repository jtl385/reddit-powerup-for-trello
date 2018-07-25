/* global TrelloPowerUp */

const getDataFromUrl = require('./get-data-from-url.js');

var Promise = TrelloPowerUp.Promise;

const REDDIT_ICON = 'https://png.icons8.com/metro/1600/reddit.png';

const cardButtonCallback = (t) => {
  return t.popup({
    'title': 'Reddit',
    'url': 'reddit.html',
  });
};

const isRedditLink = (url) => {
  let regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  
}

TrelloPowerUp.initialize({
  'card-buttons': (t, options) => {
    return [{
      'icon': REDDIT_ICON,
      'text': 'Reddit',
      'callback': cardButtonCallback,
    }];
  },
  
  'attachment-sections': (t, options) => {
    
  },
  
  'attachment-thumbnail': (t, options) => {
    let data, redditTitle, imageUrl, dataUrl;
    
    dataUrl = options.url + '/.json';
    
    return Promise.try(() => {
      return getDataFromUrl(dataUrl);
    })
    .then((data) => {
      redditTitle = data.title;
      imageUrl = data.thumbnail;
    })
    .then(() => {
      return {
        url: options.url,
        title: redditTitle,
        image: {
          url: imageUrl,
          logo: false,
        },
      };
    });
  },
  
});
