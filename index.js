const Twitter = require( "twitter" );
const fs = require( "fs" );

const getInstruction = require("./get-instruction.js");
const tweet = require("./tweet.js");
const twitchChatStream = require("./twitch-chat-stream.js")

const POLL_TIME = 2000;
const POLLS_PER_TWEET = 120;
const RUN_COMMAND_TIME = 500;

const client = new Twitter({
  consumer_key: "CONSUMER_KEY",
  consumer_secret: "CONSUMER_SECRET",
  access_token_key: "ACCESS_TOKEN_KEY",
  access_token_secret: "ACCESS_TOKEN_SECRET"
});

const getInstructionCounts = ( instructions )=>{
  const instructionCounts = {
    "↑" : 0,
    "↓" : 0,
    "→" : 0,
    "←" : 0
  };
  instructions.forEach(i=>{
    if( instructionCounts[i] !== undefined ){
      instructionCounts[i] ++;
    }
  });
  return instructionCounts
}

const getWinningInstruction = ( instructionCounts )=>{
  const sorted = Object
    .keys( instructionCounts )
    .sort( (a,b)=>instructionCounts[b]-instructionCounts[a] );
  let nTied = 1
  for( var i = 1; i < sorted.length; i ++ ){
    if( instructionCounts[sorted[i]] < instructionCounts[sorted[0]] ){
      nTied = i;
      break;
    }
  }
  const bestScoring = sorted[ Math.ceil( Math.random() * nTied ) - 1 ];
  if( instructionCounts[ bestScoring ] > 0 ){
    return bestScoring;
  }else{
    return null;
  }
};

const outputInstructions = {
  "↑" : "F",
  "↓" : "B",
  "→" : "R",
  "←" : "L"
};

const dispatch = ( winningInstruction, callback )=>{
  if( winningInstruction ){
    console.log( outputInstructions[ winningInstruction ] );
  }
  if( callback ){
    setTimeout( callback, RUN_COMMAND_TIME );
  }
};

let pollCount = 0;
let winningInstructions = [];
const tweets = [];
const start = ()=>{
  twitchChatStream((message)=>{
    tweets.push( message );
  });
  client.stream('statuses/filter', {track:'@MY_HANDLE'}, (stream)=>{
    stream.on('error', (error)=>{
      throw error;
    });
    stream.on('data', (tweet)=>{
      if( tweet.user.id_str === 'MY_ID' ){
        const instruction = getInstruction( tweet.text );
        if( instruction != null ){
          dispatch( instruction );
        }
      }else{
        tweets.push( tweet.text );
      }
    });
  });
  setInterval(()=>{
    const instructions = tweets
      .splice(0, tweets.length)
      .map( getInstruction )
      .filter( t=>t!=null )
      .reverse();
    const instructionCounts = getInstructionCounts( instructions );
    const winningInstruction = getWinningInstruction( instructionCounts );
    dispatch(
      winningInstruction,
      ()=>{
        if( winningInstruction ){
          winningInstructions.push( winningInstruction );
        }
        pollCount ++;
        let text;
        if( pollCount >= POLLS_PER_TWEET ){
          if( winningInstructions.length === 0 ){
            text = `No movements since last tweet.`;
          }else{
            text = `Movements since last tweet: ${winningInstructions.join("")}`
          }
          tweet( client, text);
          winningInstructions = [];
          pollCount = 0;
        }
      }
    );
  }, POLL_TIME);
};

start();