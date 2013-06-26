(function($) {
  $.extend(MediaElementPlayer.prototype, {
    builddoublesubtitles: function(player, controls, layers, media) {
      var t = this;
      
      // Empty placeholder for "tracks" button. It's necessary for core enableTrackButton() function.
      player.captionsButton = $('').appendTo(controls);

      subtitlesoriginal = '<div id="mep-original-subtitles">original subtitles</div>';
      subtitlestranslated = '<div id="mep-translated-subtitles">translated subtitles</div>'

      subtitleslayer = '<div id="mep-double-subtitles" style="position: absolute; top: ' + t.container[0].clientHeight + 'px;">' +
        subtitlesoriginal +
        subtitlestranslated +
      '</div>';

      $(subtitleslayer).appendTo(t.container);

      media.addEventListener('timeupdate',function(e) {
        player.displayCaptions();
      }, false);

      subtitlesoriginal = t.container.find('#mep-original-subtitles'),
      subtitlestranslated = t.container.find('#mep-translated-subtitles'),
      t.subtitlesoriginal = subtitlesoriginal;
      t.subtitlestranslated = subtitlestranslated;

      t.current_subtitle = -1;
      
      player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;
      player.loadNextTrack();
    },

    displayCaptions: function() {

      if (typeof this.tracks == 'undefined')
        return;

      var
        t = this,
        i,
        originaltrack = t.tracks[0];
        translatedtrack = t.tracks[1];

      if (originaltrack != null && originaltrack.isLoaded) {
        for (i = 0; i < originaltrack.entries.times.length; i++) {
          if (t.media.currentTime >= originaltrack.entries.times[i].start && t.media.currentTime <= originaltrack.entries.times[i].stop) {
            if (i != t.current_subtitle) {
              t.current_subtitle = i;

              // fire event
              t.container.trigger('subtitle_before_update', t.current_subtitle);

              originaltext = originaltrack.entries.text[i];
              arr = originaltext.split(' ');
              for (i in arr) {
                arr[i] = '<span class="word-to-translate" data-content="' + arr[i] + '">' + arr[i] + '</span>';
              }
              originaltext = arr.join(' ');
              
              translatedtext = translatedtrack.entries.text[i];
              arr = translatedtext.split(' ');
              for (i in arr) {
                arr[i] = '<span class="word-to-translate" data-content="' + arr[i] + '">' + arr[i] + '</span>';
              }
              translatedtext = arr.join(' ');
              
              t.subtitlesoriginal.html(originaltext);
              t.subtitlestranslated.html(translatedtext);
              
              // fire event
              t.container.trigger('subtitle_after_update', t.current_subtitle);
              
              return; // exit out if one is visible;
            }
          }
        }
      }
    },
  });

})(mejs.$);