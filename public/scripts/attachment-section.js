/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

const isRedditLink = (url) => {
  let regex = /^(?:http(s)?:\/\/)?(www\.)?(reddit)+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
  return regex.test(url);
}

t.render(() => {
  t.card('attachments').get('atta
});