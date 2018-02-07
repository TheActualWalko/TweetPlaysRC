const getBestIndex = ( str, words )=>{
  let best = Infinity;
  words.forEach( w=>{
    const index = str.indexOf( w );
    if( index >= 0 ){
      best = Math.min( best, index );
    }
  });
  if( best === Infinity ){
    return -1;
  }else{
    return best;
  }
};

module.exports = ( text )=>{
  text = text.toLowerCase();
  const indices = {
    "↑" : getBestIndex( 
      text, 
      [ 
        "forward", 
        "↑", 
        "up", 
        "charge",  
        "advance", 
        "proceed",
        "straight",
        "yolo"
      ]
    ),
    "↓" : getBestIndex( 
      text, 
      [ 
        "backward", 
        "↓", 
        "down", 
        "retreat", 
        "reverse", 
        "back", 
      ]
    ),
    "←" : getBestIndex( 
      text, 
      [ 
        "left", 
        "←", 
        "port", 
        "counter-clockwise", 
        "widdershins",
        "democrat"
      ]
    ),
    "→" : getBestIndex( 
      text, 
      [ 
        "right", 
        "→", 
        "starboard", 
        "clockwise", 
        "counter-widdershins",
        "republican",
        "gop"
      ]
    ),
  };
  return Object
    .keys( indices )
    .filter( a=>(indices[a] >= 0) )
    .sort(( a, b )=>{
      return indices[a] - indices[b]
    })
    [0];
};