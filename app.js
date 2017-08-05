var config = {
  hand_len: 5,
  space_cards: 3,
  start_pos_values: 0,
  start_pos_suits: 1
};

// poker hand evaluator
hands = [ '8C TS KC 9H 4S', '7D 2S 5D 3S AC', '8C AD 8D AC 9C', '7C 5H 8D TD KS' ];

suits = getData( hands, config.start_pos_suits );
values = getData( hands, config.start_pos_values );
chunkHands( suits );
chunkHands( values );


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
  for ( i = 0; i < cards.length; i += config.hand_len ) {
    var card_hand = cards.slice( i, i + config.hand_len );
    console.log( card_hand );
    // TODO 8/5/17 add logic to determine suit create a separate function
  }
} // looks at the suits and checks for a flush
