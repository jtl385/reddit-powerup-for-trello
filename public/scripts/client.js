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
  return new Promise((resolve, reject) => {
    $.getJSON(url, (response) => {
      let data;
      if (Array.isArray(response)){ //its a post
        data = response[0].data;
        data.typeOfLink = 'post';
        return resolve(data);
      }
      else if (typeof response === 'object'){ //its a subreddit
        data = response.data;
        data.typeOfLink('subreddit');
        return resolve(data);
      }
      else{
        return reject("Response was not valid");
      }
    });
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
    var attachments = options.entries;
    var redditAttachments = attachments.filter((a) => {
      return isRedditLink(a.url);
    });
    
    if (redditAttachments.length > 0) {
      return [{
        claimed: redditAttachments,
        id: 'Reddit',
        title: 'Reddit',
        icon: REDDIT_ICON,
        content: {
          type: 'iframe',
          url: t.signUrl(),
        },
        
      }];
    }
    return [];
  },
  
  'attachment-thumbnail': (t, options) => {
    if (!isRedditLink(options.url)){
      throw t.NotHandled();
    }
    
    let dataUrl = options.url + '.json';
    
    return Promise.try(() => {
      return getDataFromUrl(t, dataUrl);
    })
    .then((data) => {
      if (data.typeOfLink === 'post'){
        return {
          typeOfLink: 'post',
          url: options.url,
          title: data.title,
          image: {
            url: data.thumbnail,
            logo: false,
          },
          author: data.author,
          selftext: data.selftext,
        };
      }
    });
  },
});
