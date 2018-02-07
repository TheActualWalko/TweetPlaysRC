const twitch = require("tmi.js");
let callbackOnMessage;
const client = twitch.client({
  options : {
    //debug : true
  },
  connection : {
    reconnect : true
  },
  identity : {
    username : "TWITCH_CHANNEL",
    password : "PASSWORD",
  },
  channels: ["#TWITCH_CHANNEL"]
});
client.on("connected", ()=>{
  client.on("chat", (channel, userstate, message)=>{
    if( callbackOnMessage ){
      if( message.toLowerCase() === "w" ){
        message = "forward";
      }else if( message.toLowerCase() === "s" ){
        message = "backward";
      }else if( message.toLowerCase() === "a" ){
        message = "left";
      }else if( message.toLowerCase() === "d" ){
        message = "right";
      }
      callbackOnMessage( message );
    }
  });
});
client.connect();
module.exports = (callback)=>{
  callbackOnMessage = callback;
}