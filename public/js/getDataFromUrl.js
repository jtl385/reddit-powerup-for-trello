const Promise = TrelloPowerUp.Promise

module.exports = (t, url) => {
  Promise.try(() => {
    var xhr = new XMLHttpRequest();
    var data = {};
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      data = xhr.response;
    };
    xhr.send()
  });
};