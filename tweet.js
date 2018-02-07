const child_process = require( "child_process" );
const fs = require("fs");

const takePicture = ()=>{
  child_process.execSync("ffmpeg -y -loglevel quiet -f video4linux2 -i /dev/video0 -ss 0:0:3 -vframes 1 -vf scale=640:360 output.jpeg");
  return fs.readFileSync("output.jpeg");
}

module.exports = (client, text, callback)=>{
  //const media = takePicture();
  //client.post("media/upload", { media }, function( error, media, response ){
  //  if( error ){
  //    throw error;
  //  }
    client.post(
      "statuses/update", 
      {
        status : text, 
        //media_ids : media.media_id_string 
      }, 
      function( error, tweet, response ){
        if( error ){
          throw error;
        }
        if( callback ){
          callback();
        }
      }
    );
  //}); 
}