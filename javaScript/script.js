// Ask the user for favourite artist (input text)

// Ask the user for workout routine (dropdown: light, moderate, intense)

// Search Echonest API for similar artists (http://developer.echonest.com/api/v4/artist/similar?api_key=BQEDTLGZNQGJ0GMQM&name=XXXXXXXXXX)

var app = {};

app.apiKey = 'BQEDTLGZNQGJ0GMQM';
app.apiSimilarArtistsUrl = 'http://developer.echonest.com/api/v4/artist/similar';
app.apiHottestSongsUrl = 'http://developer.echonest.com/api/v4/song/search';
app.apiSongSummaryUrl = 'http://developer.echonest.com/api/v4/song/profile';

//Temporary variables; to delete later
var artist = 'radiohead';
var similarArtistCode = 'AR0L04E1187B9AE90C';
var hotttSong = 'SOFRCWS1373EF8FB58';
//End of temporary variables

// Return list of similar artists
app.getArtists = function() {
	$.ajax({
		url: app.apiSimilarArtistsUrl,
		datatype: 'json',
		method: 'GET',
		data: {
			api_key: app.apiKey,
			name: artist
		}
	}).then(function(artists){
		var artistIDs = [];
		for (i = 0; i < 3; i++) {
			artistIDs.push(artists.response.artists[i].id)
		}
		app.getHotSongs(artistIDs);
	});
};
// Grab artist ID for similar artists


// Search through hottest songs by artist ID
app.getHotSongs = function(artistIDs) {
	var songCalls = artistIDs.map(function(id){
		return $.ajax({
			url: app.apiHottestSongsUrl,
			datatype: 'json',
			method: 'GET',
			data: {
				api_key: app.apiKey,
				artist_id: id,
				sort: 'song_hotttnesss-desc',
				results: '30'
			}
		});
	});
	$.when.apply(null,songCalls)
		.then(function() {
			var songArray = Array.prototype.slice.call(arguments);
			var songIDs = [];
			songArray = songArray.map(function(song) {
				return song[0].response.songs;
			})
			songArray = songArray.map(function(artistSongs) {
				var count = 0;
				return artistSongs.filter( function(song){
					count += 1;
					if(count <= 10 ) {
						return true;
					} else {
						return false;
					}
				})
			})
			songArray = _.flatten(songArray);
			$.each(songArray, function( i,songs) {
				var hotttsong = songs.id;
				songIDs.push(hotttsong);
			})
			console.log(songIDs);
		});
};
// Grab song ID for each song ID


//Search all songs by song ID
app.songCheck = function() {
	$.ajax({
		url: app.apiSongSummaryUrl,
		datatype: 'json',
		method: 'GET',
		data: {
			api_key: app.apiKey,
			id: hotttSong,
			bucket: 'audio_summary'
		}
	}).then(function(songs){
	});
};

// Filter out songs that do not match BPM criteria

// Build a sample playlist for user

// Display playlist in working functionality


app.init = function() {
};

$(function() {
	app.init();
});


// Bonus points:
// - Different workout descriptions
// - Same song filtering