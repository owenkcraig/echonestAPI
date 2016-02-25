// Ask the user for favourite artist (input text)

// Ask the user for workout routine (dropdown: light, moderate, intense)

// Search Echonest API for similar artists (http://developer.echonest.com/api/v4/artist/similar?api_key=BQEDTLGZNQGJ0GMQM&name=XXXXXXXXXX)

var app = {};

app.apiKey = 'BQEDTLGZNQGJ0GMQM';
app.apiSimilarArtistsUrl = 'http://developer.echonest.com/api/v4/artist/similar';
app.apiHottestSongsUrl = 'http://developer.echonest.com/api/v4/song/search';
app.apiSongSummaryUrl = 'http://developer.echonest.com/api/v4/song/profile';


//Temporary variables; to delete later
// var artist = 'radiohead';
// var userWorkout = 120;

//End of temporary variables

// Return list of similar artists
app.getArtists = function() {
	$.ajax({
		url: app.apiSimilarArtistsUrl,
		datatype: 'json',
		method: 'GET',
		data: {
			api_key: app.apiKey,
			name: app.userInput
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
				results: '4'
			}
		});
	});
	// Grab song ID for each song ID
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
			app.songCheck(songIDs);
		});
};


//Search all songs by song ID
app.songCheck = function(songIDs) {
	var songDetails = songIDs.map(function(id){
		return $.ajax({
			url: app.apiSongSummaryUrl,
			datatype: 'json',
			method: 'GET',
			data: {
				api_key: app.apiKey,
				id: id,
				bucket: 'audio_summary'
			}
		});
	});
	$.when.apply(null,songDetails)
		.then(function() {
			var songDetails = Array.prototype.slice.call(arguments);	
			var filteredSongDetails = [];
			$.each(songDetails, function( i,songBPMs) {
				if(songDetails[i][0].response.songs[0].audio_summary.tempo >= app.userWorkout &&
					songDetails[i][0].response.songs[0].audio_summary.tempo <= app.userWorkout + 20){
					filteredSongDetails.push(songDetails[i][0].response.songs[0])
				}
			})
			filteredSongDetails = songDetails.filter(function(song) {
				// console.log(song)
				return song[0].response.songs[0].audio_summary.tempo >= app.userWorkout;
			});
			filteredSongDetails = app.shuffle(filteredSongDetails);
			filteredSongDetails = filteredSongDetails.map(function(song) {
				return song[0].response.songs[0];
			})
			app.displayPlaylist(filteredSongDetails);
		});

	app.displayPlaylist = function(filteredSongDetails) {
		// console.log(filteredSongDetails[0].artist_name);
		// console.log(filteredSongDetails);
			var songTitle = '';
			var songArtist = '';
		$.each(filteredSongDetails, function(i, songDetails){
			var songTitle = $('<h3>').text(songDetails.title);
			var songArtist = $('<h3>').text(songDetails.artist_name);
			var finalSongInfo = $('<div>').addClass('songInfo').append(songTitle, songArtist);
			$('#results').append(finalSongInfo);
		});
	}
};

// Filter out songs that do not match BPM criteria

// Build a sample playlist for user

// Display playlist in working functionality

app.shuffle = function(songDetails) {
	var m = songDetails.length, t, i;

	// While there remain elements to shuffle…
				  while (m) {

				    // Pick a remaining element…
				    i = Math.floor(Math.random() * m--);

				    // And swap it with the current element.
				    t = songDetails[m];
				    songDetails[m] = songDetails[i];
				    songDetails[i] = t;
				  }

				  return songDetails;
				};

app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		app.userInput = $('input[type=text]').val();
		app.userWorkout = $('input[type=radio]:checked').val()
		app.getArtists();
	});
};

$(function() {
	app.init();
});


// Bonus points:
// - Different workout descriptions
// - Same song filtering