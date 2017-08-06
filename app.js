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
hands = [ '8C 8S 8H 8C TS', '8C TS KC 8H 4S', '7D 2S 5D 3S AC', '8C AD 8D AC 9C', '7C 5H 8D TD KS' ];

// poker hand evaluator
( function () {

  /***************************************************
                     Prepare Data
  ****************************************************/
  suits = chunkHands( getData( hands, config.start_pos_suits ) );
  values = chunkHands( eNum( getData( hands, config.start_pos_values ) ) );

  console.log( values );
  console.log( suits );
  console.log( findMatches( values[ 0 ] ) );

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
      // TODO 8/5/17 add logic to determine suit create a separate function
    }
    return handValues;
  }

  // enumerates the face cards to make sorting easier //TODO 8/6/17 Ace may cause problems with straights
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
  //isFlush
  function isFlush( arr ) {
    flush = false
    arr.forEach( function ( suit, pos ) {
      if ( pos === arr.length - 1 ) {} else {
        arr[ pos ] === arr[ pos + 1 ] ? flush = true : flush = false;
      }
    } );
    return flush;
  }
  //isStraight
  //findMatches looks at the sorted emnumerated values and then determines how many matches there are
  function findMatches( arr ) {
    var matches = 0,
      lastmatch = 0,
      match = arr[ lastmatch ];

    for ( i = 0; i < arr.length; i++ ) {
      arr[ i ] === match ? matches += 1 : match = arr[ i ];
    }
    if ( matches > 4 ) {
      matches += 1;
    } // the add one accounts for the switch when a new match is found

    return matches;
  }
}( hands ) );
