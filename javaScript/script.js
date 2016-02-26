// Ask the user for favourite artist (input text)

// Ask the user for workout routine (dropdown: light, moderate, intense)

// Search Echonest API for similar artists (http://developer.echonest.com/api/v4/artist/similar?api_key=BQEDTLGZNQGJ0GMQM&name=XXXXXXXXXX)

var app = {};

app.apiKey = 'BQEDTLGZNQGJ0GMQM';
app.apiSimilarArtistsUrl = 'http://developer.echonest.com/api/v4/playlist/static';
app.apiHottestSongsUrl = 'http://developer.echonest.com/api/v4/song/search';
app.apiSongSummaryUrl = 'http://developer.echonest.com/api/v4/song/profile';

// Return list of similar artists
app.getArtists = function() {
	$.ajax({
		url: app.apiSimilarArtistsUrl,
		datatype: 'json',
		method: 'GET',
		data: {
			api_key: app.apiKey,
			min_tempo: app.userWorkoutMin,
			max_tempo : app.userWorkoutMax,
			bucket: 'audio_summary',
			bucket : 'song_hotttnesss',
			song_max_hotttnesss: '1',
			sort: 'song_hotttnesss-desc',
			artist: app.userInput,
			type :'artist-radio',
			results: 18
		}

	}).then(function(artists){
		var response = artists;
		app.displayPlaylist(response);
	});
};
// Grab artist ID for similar artists
app.displayPlaylist = function(filteredSongDetails) {
	$('#results').html('');
	var songs = filteredSongDetails.response.songs;
	var songTitle = '';
		$.each(songs, function(i, songDetails){
			var songTitle = $('<h3>').text(songDetails.title);
			var songArtist = $('<h4>').text(songDetails.artist_name);
			var finalSongInfo = $('<div>').addClass('songInfo').append(songTitle, songArtist);
			$('#results').append(finalSongInfo);
			console.log(app.userWorkoutMin);
			if (app.userWorkoutMin == 120) {
			    $('.songInfo').addClass("blue");
			} else if (app.userWorkoutMin == 140) {
			    $('.songInfo').addClass("yellow");
			} else {
			    $('.songInfo').addClass("red");
			}
		});
	};

app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		app.userInput = $('input[type=text]').val();
		app.userWorkoutMin = $('input[type=radio]:checked').val();
		app.userWorkoutMax = parseFloat(app.userWorkoutMin) + parseFloat(20);
		app.getArtists();
	});
};

$(function() {
	$('.workout label').on('click',  function() {
		$('.workout label').removeClass("selected");
		$(this).addClass("selected");
	}); //End of radio button click styles
	app.init();
});


// Bonus points:
// - Different workout descriptions
// - Same song filtering