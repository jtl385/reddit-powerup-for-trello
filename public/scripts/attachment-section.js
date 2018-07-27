/* global TrelloPowerUp Mustache */

const t = TrelloPowerUp.iframe();
const Promise = TrelloPowerUp.Promise;
const REDDIT_ICON = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit.png?1532644760400';
const REDDIT_ICON_COLOR = 'https://cdn.glitch.com/ade37363-613c-451f-aedf-df761e7d7745%2Freddit2.png?1532698004806';
const linkTemplate = 
`
<div class="link">
  <div class="link-icon">
    <img src="{{icon}}"></img>
  </div>
  <div class="link-details">
    <div class="link-details-title">{{title}}</div>
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
  var linkHTMLs = [];
  t.card('attachments').get('attachments').filter((a) => {
    return isRedditLink(a.url);
  }) 
  .then((attachments) => {
    let links = attachments.map((a) => {
      let dataUrl = a.url + 'about.json';
      Promise.try(() => {
        return getDataFromUrl(dataUrl);
      })
      .then((data) => {
        let renderData = {
          title: data.title,
        };
        
        if (data.typeOfLink === 'post'){
          renderData.subtitle = data.selftext.substring(0,128);
          if (data.selftext.length > 128)
            renderData.subtitle += "...";
            
          if (data.thumbnail === 'self' || !data.thumbnail)
            renderData.icon = REDDIT_ICON_COLOR;
          else
            renderData.icon = data.thumbnail;
        }
        else if (data.typeOfLink === 'subreddit'){
          renderData.subtitle = data.public_description.substring(0, 128);
          if (data.public_description.length > 128)
            renderData.subtitle += "...";
          
          renderData.icon = REDDIT_ICON_COLOR;
        }
        else
          throw new Error('Type of link was not post or subreddit');
        
        console.log(renderData);
        
        contentDiv.append(Mustache.render(linkTemplate, renderData));
        
      })
    });
  })
  .then(() => {
    return t.sizeTo('#content');
  })
});