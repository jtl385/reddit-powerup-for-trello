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
          height: 230,
        },
        
      }];
    }
    return [];
  },
});
