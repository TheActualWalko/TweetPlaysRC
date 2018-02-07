var {FB, FacebookApiException} = require('fb');
FB.setAccessToken('FB_ACCESS_TOKEN');

FB.api('PAGE_ID/live_videos', 'post', (res)=>{
  console.log(res);
});