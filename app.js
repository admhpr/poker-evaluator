// set data variables
var config = {
  hand_len: 5,
  step: 3,
  start_pos_values: 0,
  start_pos_suits: 1
};

var ranks = {
  0: "Five of a kind", // incase wild jokers are added
  1: "Royal flush",
  2: "Staight flush",
  3: "Four of a kind",
  4: "Full House",
  5: "Flush",
  6: "Straight",
  7: "Three of a kind",
  8: "Two pair", //TODO
  9: "Pair",
  10: "High card"
};

// data
hands = [ '8C 8S 8H 8C TS', '8C TC KC 8C 4C', '7D 2S 5D 3S AC', '8C AD 8D AC 9C', '7C 5H 8D TD KS' ];

// poker hand evaluator
( function () {
  /***************************************************
                     Prepare Data
  ****************************************************/
  suits = chunkHands( getData( hands, config.start_pos_suits ) );
  values = chunkHands( eNum( getData( hands, config.start_pos_values ) ) );
  handData = [];

  console.log( values );
  console.log( suits );
  console.log( values.length );

  values.forEach( function ( hand, pos ) {
    getHand( suits[ pos ], values[ pos ] );
  } );

  console.log( handData );

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
    //isFlush
    function isFlush( arr ) {
      arr.forEach( function ( suit, pos ) {
        if ( pos === arr.length - 1 ) {} else {
          arr[ pos ] === arr[ pos + 1 ] ? hand.flush = true : hand.flush = false;
        }
      } );
      isStraight( values );
    }
    //isStraight
    function isStraight( arr ) {
      hand.straight = ( arr[ 0 ] + 1 == arr[ 1 ] || ( arr[ 0 ] == 1 && arr[ 4 ] == 13 ) ) &&
        ( arr[ 1 ] + 1 == arr[ 2 ] ) &&
        ( arr[ 2 ] + 1 == arr[ 3 ] ) &&
        ( arr[ 3 ] + 1 == arr[ 4 ] );
      findMatches( values );
    }
    //findMatches looks at the sorted emnumerated values and then determines how many matches there are
    function findMatches( arr ) {
      var matches = 0,
        last_matches = 0,
        first_matches = 0,
        diffHand = false,
        match = arr[ 0 ];

      arr = arr.sort( ( a, b ) => a - b ); // this is unnecessary given the data but makes the code reuseable

      for ( i = 0; i < arr.length; i++ ) {
        if ( arr[ i ] === match ) {
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
      if ( matches === 4 && ( first_matches != 4 && last_matches != 3 ) ) {
        matches += 1;
      } //TODO find two pair; 08/6/17
      //  NOTE: the addition of one accounts for the switch when a new match is found on a two pair
      // last_matches != 3 works as the last int in the array does not get logged as a match.
      // the array must be sorted for this to work.
      hand.matches = matches;
      findHighCard( values );
    }

    function findHighCard( arr ) {
      hand.highCard = arr[ arr.length - 1 ];
    }
    handData.push( hand );
  }

}( hands ) );
