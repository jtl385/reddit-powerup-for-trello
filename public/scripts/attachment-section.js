/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const linkTemplate = 
`
<div class="link">
  <div class="link-icon"></div>
  <div class="link-details">
    <span class="link-details-title">{{t</div>
  </div>

</div>


`

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
        return resolve(data);
      }
      else if (typeof response === 'object'){ //it's a subreddit
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

t.render(() => {
  t.card('attachments').get('attachments').filter((a) => {
    return isRedditLink(a.url);
  })
  .then((attachments) => {
    attachments.forEach((a) => {
      let dataUrl = a.url + '.json';
      Promise.try(() => {
        return getDataFromUrl(dataUrl);
      })
      .then((data) => {
        
      })
    });
  })
  .then()
});