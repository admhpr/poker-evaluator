roundData = [];
// data
// hands = processData( allText );
// hands = [
//   [ '8C 8S 8H 8D TS', '8C TC KC 8C 4C' ],
//   [ '2D 3S 4D 5S AC', '2C 2D 8D 4C 4C' ],
//   [ '7C 5H 8D TD KS', 'KS QS KC QC KH' ],
//   [ 'KS KH KC 8S 7S', 'KS KC 7S 5C 4H' ],
//   [ '2C 2H 2S 4C 6C', 'TH KH QH JH AH' ],
//   [ '2C 2H 2S 4C 6C', '2C 2H 2S 4C 6C' ],
//   [ '2C 2H 2S 4C 6C', '2C 2H 2S 4C 7C' ]
// ];

hands = [
  [ '3D 3S 4D 5S AC', '3C 2D 8D 4C 4C' ],
  [ '2C 2H 2S 4C 6C', '2C 2H 2S 4C 7C' ]
];

drawOutput( hands );
hands.forEach( function ( round ) {
  getRoundData( round );
} );

// poker hand evaluator
console.log( roundData );

function displayResult( text ) {
  var ul = document.getElementById( 'resultList' );
  var li = document.createElement( 'li' );
  li.innerHTML = text;
  ul.appendChild( li );
}

roundData.forEach( function ( player ) {

  if ( player[ 0 ].rank < player[ 1 ].rank ) {
    displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]}` );
  } else if ( player[ 0 ].rank === player[ 1 ].rank ) {
    if ( player[ 0 ].highCard > player[ 1 ].highCard ) {
      displayResult( `player 1 wins with a ${ranks[ player[ 0 ].rank ]} and high card of ${player[0].highCard}` );
    } else if ( player[ 0 ].highCard === player[ 1 ].highCard ) {
      displayResult( "Split pot" );
    } else {
      displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]} and high card of ${player[1].highCard}` );
    }
  } else {
    displayResult( `player 2 wins with a ${ranks[ player[ 1 ].rank ]}` );
  }
} );


/***************************************************
                   Prepare Data
****************************************************/

function getRoundData( hands ) {

  suits = chunkHands( getData( hands, config.start_pos_suits ) );
  values = chunkHands( eNum( getData( hands, config.start_pos_values ) ) );
  handData = [];
  //
  // console.log( values );
  // console.log( suits );


  values.forEach( function ( hand, pos ) {
    getHand( suits[ pos ], values[ pos ] );
  } );

  // console.log( handData );

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
  round = [];

  function getHand( suits, values ) {
    var hand = {};
    isFlush( suits );
    /***************************************************
                       Flush
    ****************************************************/
    function isFlush( arr ) {
      arr.forEach( function ( suit, pos ) {
        if ( pos === arr.length - 1 ) {} else {
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
        ( arr[ 3 ] + 1 == arr[ 4 ] || ( arr.toString() === match ) ); //takes care of Ace wrap
    }
    /***************************************************
      Full House, Four O' Kind, Three O' kind, Two Pair
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
        console.log( "not a hand, you might be playing bridge" );
      }

    }
    handData.push( hand );
  }
  roundData.push( handData );
}
