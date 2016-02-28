// Ask the user for favourite artist (input text)

// Ask the user for workout routine (dropdown: light, moderate, intense)

// Search Echonest API for similar artists (http://developer.echonest.com/api/v4/artist/similar?api_key=BQEDTLGZNQGJ0GMQM&name=XXXXXXXXXX)

var app = {};

app.apiKey = 'BQEDTLGZNQGJ0GMQM';
app.apiSpotifykey = '1684dbdc859241b88298757a8ee38711'
app.apiPlaylistUrl = 'http://developer.echonest.com/api/v4/playlist/static';
// app.apiHottestSongsUrl = 'http://developer.echonest.com/api/v4/song/search';
app.apiSongSummaryUrl = 'http://developer.echonest.com/api/v4/song/profile';

// Return list of similar artists

app.getArtists = function() {
	$.ajax({
		url: app.apiPlaylistUrl,
		datatype: 'json',
		method: 'GET',
		data: $.param({
			api_key: app.apiKey,
			min_tempo: app.userWorkoutMin,
			max_tempo : app.userWorkoutMax,
            bucket: ['audio_summary','song_hotttnesss','tracks', 'id:spotify'],
			song_max_hotttnesss: '1',
			sort: 'song_hotttnesss-desc',
			artist: app.userInput,
			type :'artist-radio',
			results: 18
		},true)
    // traditional!!

	}).then(function(artists){
		var response = artists;
		app.displayPlaylist(response);
    });
};
// Grab artist ID for similar artists
app.displayPlaylist = function(filteredSongDetails, data) {
    $('#results').html('');
    var songs = filteredSongDetails.response.songs;
    var songTitle = '';
    var songIDs =[];

        $.each(songs, function(i, songDetails){
            if(songDetails.tracks[0] !== undefined) {
            var spotify = songDetails.tracks[0].foreign_id;
            var spotifyID = spotify.toString().replace("spotify:track:", "");
                songIDs.push(spotifyID);
            var logo = $('<img>').attr('src', '../images/logo.svg')
            var song = $('<h3>').text(songDetails.title)
            var songArtist = $('<h4>').text(songDetails.artist_name);
            var songTitle = $('<div>').append(logo, songArtist).addClass('songTitle');
            var finalSongInfo = $('<div>').addClass('songInfo').append(songTitle, song);
                $('#results').append(finalSongInfo);
            }
                if (app.userWorkoutMin == 120) {
                    $('.songTitle').addClass("blue");
                    $('h3').addClass('blueTypo');
                } else if (app.userWorkoutMin == 140) {
                    $('.songTitle').addClass("yellow");
                    $('h3').addClass('yellowTypo');
                } else {
                    $('.songTitle').addClass("red");
                    $('h3').addClass('redTypo');
                }
        });

        songIDs = songIDs.toString().replace("spotify:track:", "");
        console.log(songIDs)
        app.getSpotifyPlayButton(songIDs)
        // app.getPlaylist(songIDs)
}

app.getSpotifyPlayButton = function(songIDs) {
    $('#playlistResult').html('');

    var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:workout:TRACKS" style= frameborder="0" allowtransparency="true"></iframe>';
            // console.log(spotifySon
    var tracks = songIDs;
    console.log(tracks)
    var tembed = embed.replace('TRACKS', tracks);
    // tembed = tembed.replace('PREFEREDTITLE', title);
    var playlist = $("<div class='playlist'>").html(tembed);
    $('#playlistResult').append(playlist);
    app.getPlaylist(tracks);
}

//Get the cover of the album..
// as a design choice, decide not to use them
// app.getPlaylist = function(songIDs) {
//     $.ajax({
//         url: "https://api.spotify.com/v1/tracks",
//         key: app.apiSpotifykey,
//         method: 'GET',
//         data: {
//            ids: songIDs
//             }
//         }).then(function(data) {
//         $.each(data, function(i, coverDetails){
//             // var imageCoverDetails = coverDetails.album.images[0].url;
//             data.tracks.forEach(function(track, i){
//                 var images = track.album.images[0].url;
//                 console.log(images)
//                 var cover = $('<img>').attr('src', images);
//                 $('#results').append(cover)
//             })
//         });
//     });
//  };
           
app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
        $('html, body').animate ({
            scrollTop: $("section#results").offset().top
        },2200);
        
        $(function () {
            $('#backToTop').removeClass('hidden');
        });
        
        var $backToTop = $("#backToTop");
        $backToTop.hide();
        $(window).on('scroll', function() {
          if ($(this).scrollTop() > 100) {
            $backToTop.fadeIn();
          } else {
            $backToTop.fadeOut();
          }
        });
        $backToTop.on('click', function(e) {
          $("html, body").animate({scrollTop: 0}, 500);
        });
		app.userInput = $('input[type=text]').val();
		app.userWorkoutMin = $('input[type=radio]:checked').val();
		app.userWorkoutMax = parseFloat(app.userWorkoutMin) + parseFloat(20);
		app.getArtists();
	});
};

	$('.workout label').on('click',  function() {
		$('.workout label').removeClass("selected");
		$(this).addClass("selected");
	}); //End of radio button click styles
    
    app.init();
    
    $('#moreInfo').click(function(e) {
        e.preventDefault();
        $('.toggleDiv').slideToggle('slow', function(){
            });
    });
    
    var currentWidth = $(window).width();
    if (currentWidth >= 750){
    
    $(window).scroll(function() {
        var distanceFromTop = $(this).scrollTop();
        if (distanceFromTop >= $('#background').height()) {
            $('.playlist').addClass('fixed');
        } else {
            $('.playlist').removeClass('fixed');
        }
    });
        };
    


