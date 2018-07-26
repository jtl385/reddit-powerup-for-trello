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
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    console.log("xhr response: " + xhr.response);
    if (Array.isArray(xhr.response)){
      try{ 
        data = xhr.response[0].data.children[0].data;
        return data;
      }
      catch(err){
        throw new Error("Could not get data. Is the url a reddit post?");
      }
    }
    else {
      throw new Error("Response was not an array")
    }
  };
  xhr.send()
};

const getDataFromUrl2 = (t, url) => {
  $.getJSON(url, (response) => {
    console.log("response: " + response);
    return response;
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
      throw t.notHandled();
    }
    let data, redditTitle, imageUrl, dataUrl;
    
    dataUrl = options.url + '/.json';
    
    return Promise.try(() => {
      data = getDataFromUrl2(dataUrl);
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
