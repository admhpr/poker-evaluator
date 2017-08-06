var config = {
  hand_len: 5,
  space_cards: 3,
  start_pos_values: 0,
  start_pos_suits: 1
};

// poker hand evaluator
hands = [ '8C TS KC 9H 4S', '7D 2S 5D 3S AC', '8C AD 8D AC 9C', '7C 5H 8D TD KS' ];

suits = getData( hands, config.start_pos_suits );
values = eNum( getData( hands, config.start_pos_values ) );
chunkSuits = chunkHands( suits );
chunkValues = chunkHands( values );

console.log( chunkValues );

function getData( hands, start_pos ) {
  var data = [];
  hands.forEach( function ( hand, pos ) {
    for ( i = start_pos; i < hand.length; i += config.space_cards ) {
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
