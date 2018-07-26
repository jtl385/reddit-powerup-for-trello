/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const linkTemplate = 
`

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
      });
    });
  })
  .then()
});