// Ask the user for favourite artist (input text)

// Ask the user for workout routine (dropdown: light, moderate, intense)

// Search Echonest API for similar artists (http://developer.echonest.com/api/v4/artist/similar?api_key=BQEDTLGZNQGJ0GMQM&name=XXXXXXXXXX)

var app = {};

app.apiKey = 'BQEDTLGZNQGJ0GMQM';
app.apiSimilarArtistsUrl = 'http://developer.echonest.com/api/v4/artist/similar';
app.apiHottestSongsPart1 = 'http://developer.echonest.com/api/v4/song/search?';
app.apiHottestSongsPart2 = '&sort=song_hotttnesss-desc&results=30';



app.getArtists = function() {
	$.ajax({
		url: app.apiSimilarArtistsUrl,
		datatype: 'json',
		method: 'GET',
		data: {
			api_key: app.apiKey,
			name: 'radiohead'
		}
	}).then(function(artists){
		console.log(artists);
	});
};


// Return list of top songs by similar artists

// Grab artist ID for similar artists

// Search through hottest songs by artist ID and return BPM http://developer.echonest.com/api/v4/song/search?api_key=BQEDTLGZNQGJ0GMQM&artist_id=XXXXXXXXXXXXXX&sort=song_hotttnesss-desc&results=30

// Filter out songs that do not match BPM criteria

// Build a sample playlist for user

// Display playlist in working functionality


app.init = function() {
	app.getArtists();
};

$(function() {
	app.init();
});


// Bonus points:
// - Different workout descriptions
// - Same song filtering