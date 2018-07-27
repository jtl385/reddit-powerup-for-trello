/* global TrelloPowerUp Mustache */

const t = TrelloPowerUp.iframe();
const Promise = TrelloPowerUp.Promise;
const REDDIT_ICON = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit.png?1532644760400';
const REDDIT_ICON_COLOR = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit2.png?1532698004806';
const linkTemplate = 
`
<div>
  {{#links}}
  <div class="link">
    <div class="link-icon">
      <img src="{{icon}}"></img>
    </div>
    <div class="link-details">
      <div class="link-details-title">{{title}}</div>
      <div class="link-details-subtitle">{{subtitle}}</div>
      <div class="link-details-text u-quiet">{{text}}</div>
    </div>
  </div>
  {{/links}}
</div>
`

const contentDiv = $('#content');
const maxTextLen = 150;
var firstTime = true;

const isRedditLink = (url) => {
  let regex = /^(?:http(s)?:\/\/)?(www\.)?(reddit)+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  return regex.test(url);
}

const getDataFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    $.getJSON(url, (response) => {
      let data;
      if (Array.isArray(response)){ //it's a post
        data = response[0].data.children[0].data;
        data.typeOfLink = 'post';
        return resolve(data);
      }
      else if (typeof response === 'object'){ //it's a subreddit
        data = response.data;
        data.typeOfLink = 'subreddit';
        return resolve(data);
      }
      else{
        return reject("Response was not valid");
      }
    });
  });
}

t.render(() => {
  if (firstTime){
    contentDiv.html('LOADING...');
    firstTime = false;
  }
  t.card('attachments').get('attachments').filter((a) => {
    return isRedditLink(a.url);
  }) 
  .then((attachments) => {
    Promise.map(attachments, (a) =>{
      let dataUrl = a.url + 'about.json';
      return getDataFromUrl(dataUrl);
    })
    .then((datas) => {
      const links = datas.map((data) => {
        let renderData = {};
        
        if (data.typeOfLink === 'post'){
          renderData.title = data.title;
          renderData.subtitle = data.subreddit_name_prefixed;
          renderData.text= data.selftext.substring(0, maxTextLen);
          if (data.selftext.length > maxTextLen)
            renderData.text += "...";
            
          if (data.thumbnail === 'self' || !data.thumbnail)
            renderData.icon = REDDIT_ICON_COLOR;
          else
            renderData.icon = data.thumbnail;
        }
        else if (data.typeOfLink === 'subreddit'){
          renderData.title = 'reddit.com' + data.url;
          renderData.subtitle = data.title;
          renderData.text = data.public_description.substring(0, maxTextLen);
          if (data.public_description.length > maxTextLen)
            renderData.text += "...";
          
          renderData.icon = REDDIT_ICON_COLOR;
        }
        else
          throw new Error('Type of link was not post or subreddit');
        
        return renderData;
      });
      contentDiv.html(Mustache.render(linkTemplate, { links: links }));
      return t.sizeTo('#content');
    });
  });
});