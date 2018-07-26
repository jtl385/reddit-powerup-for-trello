/* global TrelloPowerUp Mustache */

const t = TrelloPowerUp.iframe();
const Promise = TrelloPowerUp.Promise;
const REDDIT_ICON = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit.png?1532644760400';
const linkTemplate = 
`
<div class="link">
  <div class="link-icon" background="{{icon}}"></div>
  <div class="link-details">
    <span class="link-details-title">{{title}}</div>
    <div class="link-details-subtitle u-quiet">{{subtitle}}</div>
  </div>
</div>
`

const contentDiv = $('#content');

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
        console.log('in getDataFromUrl');
        console.log(data);
        return resolve(data);
      }
      else if (typeof response === 'object'){ //it's a subreddit
        data = response.data;
        data.typeOfLink = 'subreddit';
        console.log('in getDataFromUrl');
        console.log(data);
        return resolve(data);
      }
      else{
        return reject("Response was not valid");
      }
    });
  });
}

t.render(() => {
  t.card('attachments').get('attachments').filter((a) => {
    return isRedditLink(a.url);
  })
  .then((attachments) => {
    attachments.forEach((a) => {
      let dataUrl = a.url + 'about.json';
      Promise.try(() => {
        return getDataFromUrl(dataUrl);
      })
      .then((data) => {
        let renderData = {
          title: data.title,
        };    
        if (data.typeOfLink === 'post'){
          renderData.subtitle = data.selftext.substring(0, 32);
          if (data.thumbnail ===)
            renderData.icon = data.thumbnail;
          else
            renderData.icon = REDDIT_ICON;
        }
        else if (data.typeOfLink === 'subreddit'){
          renderData.subtitle = data.public_description.substring(0, 32);
          renderData.icon = REDDIT_ICON;
        }
        else
          throw new Error('Type of link was not post or subreddit');
        
        console.log(renderData);
        
        let linkHTML = Mustache.render(linkTemplate, renderData);
        contentDiv.append(linkHTML);
      })
    });
  })
  .then()
});;