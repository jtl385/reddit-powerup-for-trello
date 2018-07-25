module.exports = (t, url) => {
  var xhr = new XMLHttpRequest();
  var data = {};
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (Array.isArray(xhr.response)){
      data = xhr.response[0];
      return data;
    }
    else {
      console.log("Response was not an array");
    }
  };
  xhr.send()
};