const Twitter = require( "twitter" );

const client = new Twitter({
  consumer_key: "CONSUMER_KEY",
  consumer_secret: "CONSUMER_SECRET",
  access_token_key: "ACCESS_TOKEN_KEY",
  access_token_secret: "ACCESS_TOKEN_SECRET"
});

client.stream('statuses/filter', {track:'@tweetplaysrc'}, (stream)=>{
  stream.on('error', (error)=>{
    throw error;
  });
  stream.on('data', (tweet)=>{
    console.log(
`
${tweet.user.screen_name} (${tweet.user.location || 'unknown location'}):
${tweet.text}`
);
  });
});