/* global TrelloPowerUp Mustache */

const t = TrelloPowerUp.iframe();
const Promise = TrelloPowerUp.Promise;
const REDDIT_ICON = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit.png?1532644760400';
const REDDIT_ICON_COLOR = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit2.png?1532698004806';
const linkTemplate = 
`
<div>
  {{#links}}
  <a href='{{href}}'>
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
  <a/>
  {{/links}}
</div>
`

const contentDiv = $('#content');
const maxTextLen = 175;
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
    Promise.map(attachments, (a) => {
      // getDataFromUrl works best if link is 'https://www...."
      // if user puts in reddit.com or www.reddit.com, it won't work well
      // so we want to always append 'https://www." before 'reddit.com'
      let i = a.url.indexOf('reddit');
      let dataUrl = "https://www.";
      dataUrl += a.url.substr(i, a.url.length);
      if (dataUrl.charAt(dataUrl.length - 1) !== '/')
        dataUrl += '/';
      dataUrl += 'about.json';
      return getDataFromUrl(dataUrl);
    })
    .then((datas) => {
      const links = datas.map((data) => {
        let renderData = {};
        
        if (data.typeOfLink === 'post'){
          renderData.title = data.title;
          renderData.subtitle = data.subreddit_name_prefixed;
            
          if (data.thumbnail === 'self' || !data.thumbnail){
            renderData.text= data.selftext.substr(0, maxTextLen);
            if (data.selftext.length > maxTextLen){
              renderData.text += "...";
            }
            renderData.icon = REDDIT_ICON_COLOR;
            renderData.text = data.url;
          }
          else{
            renderData.icon = data.thumbnail;
          }
          
          renderData.href = 'https://www.reddit.com' + data.permalink;
        }
        else if (data.typeOfLink === 'subreddit'){
          renderData.title = 'reddit.com' + data.url;
          renderData.subtitle = data.title;
          renderData.text = data.public_description.substr(0, maxTextLen);
          if (data.public_description.length > maxTextLen)
            renderData.text += "...";
          
          renderData.icon = REDDIT_ICON_COLOR;
          renderData.href = 'https://www.reddit.com' + data.url;
        }
        else {
          contentDiv.html('Error loading attachments! Make sure your reddit links are to posts or subreddits (not comments or image urls)');
          throw new Error(`TypeOfLink was not 'post' or 'subreddit', it was '${data.typeOfLink}`);
        }
        
        return renderData;
      });
      contentDiv.html(Mustache.render(linkTemplate, { links: links }));
      return t.sizeTo('#content');
    });
  });
});