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
hands = [ '8C 8S 8H 8C TS', '8C TC KC 8C 4C', '2D 3S 4D 5S AC', '2C 2D 8D 4C 4C', '7C 5H 8D TD KS', 'KS QS KC QC KH', 'KS KH KC 8S 7S', 'KS KC 7S 5C 4H', '2C 2H 2S 4C 6C' ];

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
      hand.straight = isStraight( values );
    }
    //isStraight
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
      hand.twoPair = true;
      first_matches === 3 || last_matches == 2 && matches != 4 ? hand.threeOfKind = true : hand.threeOfKind = false;
      if ( ( matches === 3 || matches === 4 ) && ( first_matches != 4 && last_matches != 3 ) ) {
        matches += 1;
      } else {
        hand.twoPair = false;
      } //TODO find two pair; 08/6/17
      //  NOTE: the addition of one accounts for the switch when a new match is found on a two pair
      // last_matches != 3 works as the last int in the array does not get logged as a match.
      // the array must be sorted for this to work.
      console.log( matches );
      hand.matches = matches;
      findHighCard( values );
    }

    function findHighCard( arr ) {
      console.log( arr );
      hand.highCard = arr[ arr.length - 1 ];
    }
    handData.push( hand );
  }

}( hands ) );
