module.exports = (t, url) => {
  var xhr = new XMLHttpRequest();
  var data = {};
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.onload = () => {
    if (Array.isArray(xhr.response)){
      try{ 
        data = xhr.response[0].data.children[0].data;
        return data;
        }
      catch(err){
        console.log("Error getting json data");
        console.error(err);
      }
    }
    else {
      console.log("Response was not an array");
    }
  };
  xhr.send()
};