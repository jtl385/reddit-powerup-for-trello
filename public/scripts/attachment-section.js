/* global TrelloPowerUp Mustache */

const t = TrelloPowerUp.iframe();
const Promise = TrelloPowerUp.Promise;
const linkTemplate = 
`
<div class="link">
  <div class="link-icon"></div>
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

const getDataFromUrl = (t, url) => {
  return new Promise((resolve, reject) => {
    $.getJSON(url, (response) => {
      let data;
      if (Array.isArray(response)){ //it's a post
        data = response[0].data;
        data.typeOfLink = 'post';
        console
 log('its a post!');       return resolve(data);
      }
      else if (typeof response === 'object'){ //it's a subreddit
        data = response.data;
        data.typeOfLink = 'subreddit';

        console.log('its a subreddit!');        return resolve(data);
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
      let dataUrl = a.url + '.json';
      Promise.try(() => {
        console.log('getting data from url');
        return getDataFromUrl(dt, dtaUrl);
      })
      .then((data) => {
        let renderData;
        console.log('getting render data');
        
        renderData.title = data.title;
        renderData.url = 'reddit.com' + data.permalink;
        if (data.typeOfLink === 'post')
          renderData.subtitle = '';
        else if (data.typeOfLink === 'subreddit')
          renderData.subtitle = '';
        else
          throw new Error('Type of link was not post or subreddit');
        
        let linkHTML = Mustache.render(linkTemplate, renderData);
        contentDiv.append(linkHTML);
      })
    });
  })
  .then()
});;