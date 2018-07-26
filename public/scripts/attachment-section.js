/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const linkTemplate = 
`

`

const isRedditLink = (url) => {
  let regex = /^(?:http(s)?:\/\/)?(www\.)?(reddit)+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  return regex.test(url);
}

t.render(() => {
  t.card('attachments').get('attachments').filter((a) => {
    return isRedditLink(a.url);
  })
  .then((attachments) => {
    attachments.forEach((a) => {
      console.log(a.url);
    });
  })
  .then()
});