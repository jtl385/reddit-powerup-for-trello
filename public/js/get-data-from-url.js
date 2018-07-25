const Promise = TrelloPowerUp.Promise

module.exports = (t, url) => {
  return Promise.try(() => {
    var xhr = new XMLHttpRequest();
    var data = {};
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      data = xhr.response[0];
      return data;
    };
    xhr.send()
  });
};