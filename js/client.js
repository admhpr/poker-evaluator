var hands,
  allText;

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
  var lines = [];
  while ( allTextLines.length ) {
    lines.push( allTextLines.shift().split( ',' ) );
  }
  drawOutput( lines );
  return lines;
}

function errorHandler( evt ) {
  if ( evt.target.error.name == "NotReadableError" ) {
    alert( "Cannot read file !" );
  }
}

function drawOutput( lines ) {
  //Clear previous data
  document.getElementById( "output" ).innerHTML = "";
  var table = document.createElement( "table" );
  for ( var i = 0; i < lines.length; i++ ) {
    var row = table.insertRow( -1 );
    row.innerHTML = "<span id='round'>" + "Round" + "</span>";
    for ( var j = 0; j < lines[ i ].length; j++ ) {
      var firstNameCell = row.insertCell( -1 );
      firstNameCell.appendChild( document.createTextNode( lines[ i ][ j ] ) );
    }
  }
  document.getElementById( "output" ).appendChild( table );
}

function readTextFile( file ) {
  var ready = false;
  var rawFile = new XMLHttpRequest();
  rawFile.open( "GET", file, false ); //set async to false
  rawFile.onreadystatechange = function () {
    ready = true;
    if ( rawFile.readyState === 4 ) {
      if ( rawFile.status === 200 || rawFile.status == 0 ) {
        allText = rawFile.responseText;
      }
    }
  }
  rawFile.send( null );
}



//readTextFile( "./hands.csv" );
// console.log( allText );
// hands = processData( allText );
// console.log( hands );
