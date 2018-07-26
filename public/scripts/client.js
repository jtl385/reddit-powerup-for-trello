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
  $.getJSON(url, (response) => {
    console.log(response);
    if (Array.isArray(response)){
      data = response.
    }
    else{
      throw new Error("Response was not an array");
    }
  });
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
    if (!isRedditLink(options.url)){
      throw t.NotHandled();
    }
    let data, redditTitle, imageUrl, dataUrl;
    
    dataUrl = options.url + '.json';
    
    return Promise.try(() => {
      data = getDataFromUrl(t, dataUrl);
      return data;
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
