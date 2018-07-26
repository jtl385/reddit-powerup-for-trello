/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

const REDDIT_ICON = 'https://png.icons8.com/metro/1600/reddit.png';

const cardButtonCallback = (t) => {
  return t.popup({
    'title': 'Reddit',
    'url': 'reddit.html',
  });
};

const isRedditLink = (url) => {
  let regex = /^(?:http(s)?:\/\/)?(www\.)?(reddit)+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  return regex.test(url);
}

const getDataFromUrl = (t, url) => {
  var xhr = new XMLHttpRequest();
  var data = {};
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (Array.isArray(xhr.response)){
      try{ 
        data = xhr.response[0].data.children[0].data;
        return data;
        }
      catch(err){
        console.log("Error getting json data");
        console.error(err);
      }
    }
    else {
      console.log("Response was not an array");
    }
  };
  xhr.send()
};

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
    if (!isRedditLink(options.url)){
      throw t.notHandled();
    }
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
