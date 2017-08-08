/***************************************************
              See README.md for details
****************************************************/
var hands = [];
var roundData = [];

/***************************************************
                   Main Function Calls
****************************************************/
function init( hands ) {
  console.log( hands );
  hands.forEach( function ( round ) {
    getRoundData( round );
  } );
  drawOutput( prepDisplay( hands ) );
  outputWinners( roundData );
}
/***************************************************
                   Load CSV file
****************************************************/
function handleFiles( files ) {
  // Check for the various File API support.
  if ( window.FileReader ) {
    // FileReader are supported.
    getAsText( files[ 0 ] );
  } else {
    alert( 'FileReader is not supported in this browser.' );
  }
}

function getAsText( fileToRead ) {
  var reader = new FileReader();
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
  // Read file into memory as UTF-8
  reader.readAsText( fileToRead );
}

function loadHandler( event ) {
  var csv = event.target.result;
  processData( csv );
}

function processData( csv ) {
  var allTextLines = csv.split( /\r\n|\n/ );
  var hands = [];
  while ( allTextLines.length ) {
    hands.push( allTextLines.shift().split( ',' ) );
  }
  hands.splice( -1, 1 );
  init( hands ); // calls main functions
}

function errorHandler( evt ) {
  if ( evt.target.error.name == "NotReadableError" ) {
    alert( "Cannot read file !" );
  }
}

function prepDisplay( arr ) {
  r = /[CHSD]/g;
  // debugger
  var lines = [],
    round = [];
  var counter = 0;
  arr.forEach( function ( round, pos ) {
    round.forEach( function ( value, pos ) {

      value = value.replace( r, function ( match ) {
        if ( match === 'C' ) {
          return '♣';
        } else if ( match === 'H' ) {
          return '♡';
        } else if ( match === 'S' ) {
          return '♠';
        } else {
          return '♢';
        }
      } );
      round.push( value );
    } );
    lines.push( round );
  } );
  for ( i = 0; i < lines.length; i++ ) {
    lines[ i ].shift();
    lines[ i ].shift();
  }
  return lines;
}

function drawOutput( lines ) {
  //Clear previous data
  var output = document.getElementById( "output" );
  output.innerHTML = "";
  output.innerHTML = "<span id='player1'>Player 1</span><span id='player2'>Player 2<span>";
  var table = document.createElement( "table" );
  for ( var i = 0; i < lines.length; i++ ) {
    var row = table.insertRow( -1 );
    row.innerHTML = "<span id='round'>" + `Round ${i + 1}` + "</span>";
    for ( var j = 0; j < lines[ i ].length; j++ ) {
      var firstNameCell = row.insertCell( -1 );
      firstNameCell.appendChild( document.createTextNode( lines[ i ][ j ] ) );
    }
  }
  document.getElementById( "output" ).appendChild( table );
}

/***************************************************
                   Output Winners
****************************************************/
function outputWinners( roundData ) {
  var player1 = 0;
  var player2 = 0;
  var split_pot = 0;
  roundData.forEach( function ( player, pos ) {
    if ( player[ 0 ].rank < player[ 1 ].rank ) {
      player1 += 1;
      displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]}`, pos );
    } else if ( ( player[ 0 ].rank === player[ 1 ].rank ) && ( player[ 0 ].rank != 2 || player[ 0 ].rank != 5 || player[ 0 ].rank != 6 ) && ( player[ 1 ].rank != 2 || player[ 1 ].rank != 5 || player[ 1 ].rank != 6 ) ) {
      // looking for matching ranks and matches i.e pair, three o' kind, two pair, four o' kind, fullhouse
      if ( player[ 0 ].pairMatches[ player[ 0 ].pairMatches.length - 1 ] > player[ 1 ].pairMatches[ player[ 1 ].pairMatches.length - 1 ] ) {
        // looks for higher match
        player1 += 1;
        displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]}, high match of ${player[ 0 ].pairMatches[ player[ 0 ].pairMatches.length - 1 ] }`, pos );
      } else if ( player[ 0 ].pairMatches[ player[ 0 ].pairMatches.length - 1 ] === player[ 1 ].pairMatches[ player[ 1 ].pairMatches.length - 1 ] ) {
        // pairs are equal look at high card
        if ( player[ 0 ].highCard > player[ 1 ].highCard ) {
          player1 += 1;
          displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]}, high card of ${player[0].highCard}`, pos );
        } else if ( ( player[ 0 ].highCard === player[ 1 ].highCard ) && ( player[ 0 ].rank === player[ 1 ].rank ) ) {
          split_pot += 1;
          displayResult( "Split pot", pos );
        } else {
          player2 += 1;
          displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]}, high card of ${player[1].highCard}`, pos );
        }
      } else {
        player2 += 1;
        displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]}, high match of ${player[ 1 ].pairMatches[ player[ 1 ].pairMatches.length - 1 ] }`, pos );
      }
    } else if ( player[ 0 ].rank === player[ 1 ].rank && ( player[ 0 ] === 2 || player[ 0 ] === 5 || player[ 0 ] === 6 ) ) {
      // looking for hands that are the same and non matches i.e flushes, straights and straight flushes
      if ( player[ 0 ].highCard > player[ 1 ].highCard ) {
        player1 += 1;
        displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]}, high card of ${player[0].highCard}`, pos );
      } else if ( player[ 0 ].highCard === player[ 1 ].highCard ) {
        split_pot += 1;
        displayResult( "Split pot", pos );
      } else {
        player2 += 1;
        displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]} and high card of ${player[1].highCard}`, pos );
      }
    } else {
      player2 += 1;
      displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]}`, pos );
    }
    document.getElementById( "player-1" ).innerHTML = "Player 1 wins: " + player1 + "<br>";
    document.getElementById( "player-2" ).innerHTML = "Player 2 wins: " + player2 + "<br>";
    document.getElementById( "split-pot" ).innerHTML = "Split pots: " + split_pot + "<br>";
  } );


}

function displayResult( text, pos ) {
  pos += 1;
  var p = document.createElement( 'p' )
  var ul = document.getElementById( 'resultList' );
  var li = document.createElement( 'li' );
  p.innerHTML = "Round " + pos;
  li.innerHTML = text;
  ul.appendChild( p );
  ul.appendChild( li );
}
/***************************************************
                   Prepare Data
****************************************************/
function getRoundData( hands ) {
  suits = chunkHands( getData( hands, config.start_pos_suits ) );
  values = chunkHands( eNum( getData( hands, config.start_pos_values ) ) );
  handData = [];
  values.forEach( function ( hand, pos ) {
    getHand( suits[ pos ], values[ pos ] );
  } );

  function getData( hands, start_pos ) {
    var data = [];
    hands.forEach( function ( hand, pos ) {
      for ( i = start_pos; i < hand.length; i += config.step ) {
        data.push( hand[ i ] );
      }
    } );
    return data;
  } // separates suits from their values

  // looks at the suits in chunks that are the hand length
  function chunkHands( cards ) {
    handValues = [];
    for ( i = 0; i < cards.length; i += config.hand_len ) {
      var card_hand = cards.slice( i, i + config.hand_len );
      card_hand.sort( ( a, b ) => a - b );
      handValues.push( card_hand );
    }
    return handValues;
  }
  // enumerates the face cards to make sorting easier
  function eNum( values ) {
    r = /[AKQJT]/g;
    num = [];
    values.forEach( function ( value ) {
      value = value.replace( r, function ( match ) {
        if ( match === 'A' ) {
          return 14;
        } else if ( match === 'K' ) {
          return 13;
        } else if ( match === 'Q' ) {
          return 12;
        } else if ( match === 'J' ) {
          return 11;
        } else {
          return 10;
        }
      } );
      num.push( value );
    } );
    return num;
  }
  /***************************************************
                     Finding Rank
  ****************************************************/

  function getHand( suits, values ) {
    var hand = {};
    isFlush( suits );
    /***************************************************
                       Flush
    ****************************************************/
    function isFlush( arr ) {
      arr.forEach( function ( suit, pos ) {
        if ( pos === arr.length - 1 ) {
          arr[ pos ] === arr[ pos + 1 ] ? hand.flush = true : hand.flush = false;
        }
      } );
      hand.straight = isStraight( values );
    }
    /***************************************************
                      Straight
    ****************************************************/
    function isStraight( arr ) {
      findMatches( values );
      match = arr.toString();
      var arr = arr.map( function ( x ) {
        return parseInt( x, 10 );
      } );
      return ( arr[ 0 ] + 1 == arr[ 1 ] ) &&
        ( arr[ 1 ] + 1 == arr[ 2 ] ) &&
        ( arr[ 2 ] + 1 == arr[ 3 ] ) &&
        ( arr[ 3 ] + 1 == arr[ 4 ] || ( arr[ arr.length - 1 ].toString() === "14" ) ); //takes care of Ace wrap
    }
    /***************************************************
      Full House, Four O' Kind, Three O' kind, Two Pair, Pair
    ****************************************************/
    //findMatches looks at the sorted emnumerated values and then determines how many matches there are
    function findMatches( arr ) {
      var matches = 0,
        last_matches = 0,
        first_matches = 0,
        diffHand = false,
        match = arr[ 0 ];
      hand.pairMatches = [];
      arr = arr.sort( ( a, b ) => a - b ); // this is unnecessary given the data but makes the code reuseable

      for ( i = 0; i < arr.length; i++ ) {
        if ( arr[ i ] === match ) {
          hand.pairMatches.push( arr[ i ] );
          matches += 1;
          if ( diffHand ) {
            last_matches += 1;
          } else {
            first_matches += 1;
          }
        } else {
          match = arr[ i ], diffHand = true;
        }
      }
      hand.twoPair = true; // sets default to true
      first_matches === 3 || last_matches == 2 && matches != 4 ? hand.threeOfKind = true : hand.threeOfKind = false;
      if ( ( matches === 3 || matches === 4 ) && ( first_matches != 4 && last_matches != 3 ) ) {
        matches += 1;
      } else {
        hand.twoPair = false;
      }
      //  NOTE: the addition of one accounts for the switch when a new match is found on a two pair
      // last_matches != 3 works as the last int in the array does not get logged as a match.
      // the array must be sorted for this to work.
      hand.matches = matches;
      findHighCard( values );
    }
    /***************************************************
                       High Card
    ****************************************************/
    function findHighCard( arr ) {
      hand.highCard = arr[ arr.length - 1 ];
    }
    getRank( hand );
    /***************************************************
                       Get Rank
    ****************************************************/
    function getRank( obj ) {
      if ( obj.flush && obj.straight && obj.highCard === "14" ) {
        obj.rank = 1;
      } else if ( obj.flush && obj.straight ) {
        obj.rank = 2;
      } else if ( obj.matches === 4 && !obj.twoPair ) {
        obj.rank = 3;
      } else if ( obj.matches === 5 ) {
        obj.rank = 4;
      } else if ( obj.flush ) {
        obj.rank = 5;
      } else if ( obj.straight ) {
        obj.rank = 6;
      } else if ( obj.threeOfKind ) {
        obj.rank = 7;
      } else if ( obj.twoPair ) {
        obj.rank = 8;
      } else if ( obj.matches === 2 ) {
        obj.rank = 9;
      } else if ( obj.matches === 1 ) {
        obj.rank = 10;
      } else {
        alert( "not a hand, you might be playing bridge" );
      }

    }
    /***************************************************
                       Adds Data For Each Hand
    ****************************************************/
    handData.push( hand );
  }
  /***********************************************************
   Adds Hands in sets of Two to Represent a Round of Heads Up
  ************************************************************/
  roundData.push( handData );

}
