var config = {
  hand_len: 5,
  space_cards: 3
};

// poker hand evaluator
hands = [ '8C TS KC 9H 4S', '7D 2S 5D 3S AC', '8C AD 8D AC 9C', '7C 5H 8D TD KS' ];

suits = getSuits( hands );
isFlush( suits );

function getSuits( data ) {
  var suits = [];
  hands.forEach( function ( hand, pos ) {
    for ( i = 1; i < hand.length; i += config.space_cards ) {
      suits.push( hand[ i ] );
    }
  } );
  return suits;
} // looks at the suits and checks for a flush

function isFlush( suits ) {

  // looks at the suits in chunks of five or hand length
  for ( i = 0; i < suits.length; i += config.hand_len ) {
    var suit_hand = suits.slice( i, i + config.hand_len );
    console.log( suit_hand );
  }
}
