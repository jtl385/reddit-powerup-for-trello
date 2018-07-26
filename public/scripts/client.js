/* global TrelloPowerUp */

const Promise = TrelloPowerUp.Promise;

const REDDIT_ICON = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit.png?1532644760400';

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
          url: t.signUrl('./reddit-attachment-section.html', {
            arg: {},
          }),
        },
        
      }];
    }
    return [];
  },
  
  /*
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
          data: data,
        };
      }
      else if (data.typeOfLink === 'subreddit'){
        return {
          typeOfLink: 'subreddit',
          url: options.url,
          data: data,
        }
      }
    });
  },
  */
});
