module.exports = ( client, sinceID, callback )=>{
  client.get( "statuses/mentions_timeline", { since_id : sinceID }, function(error, tweets, response){
    if( error ){
      throw error;
    }else{
      const maxID = tweets.map( t=>t.id_str )[ 0 ];
      const messages = tweets
        .map( t=>t.text )
        .reverse();
      callback({ messages, maxID });
    }
  });
};