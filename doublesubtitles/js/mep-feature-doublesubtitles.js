(function($) {
  $.extend(MediaElementPlayer.prototype, {
    builddoublesubtitles: function(player, controls, layers, media) {
      var t = this;
      
      // Empty placeholder for "tracks" button. It's necessary for core enableTrackButton() function.
      player.captionsButton = $('').appendTo(controls);

			hide_original = '<div id="mep-hide-original-subtitles"><span class="hide">hide</span><span class="show">show original subtitles</span></div>';
      subtitlesoriginal = '<div id="mep-original-subtitles" class="data">original subtitles</div>';
      
      hide_translated = '<div id="mep-hide-translated-subtitles"><span class="hide">hide</span><span class="show">show translated subtitles</span></div>';
      subtitlestranslated = '<div id="mep-translated-subtitles" class="data">translated subtitles</div>'

      subtitleslayer = '<div id="mep-double-subtitles" style="position: absolute; top: ' + t.container[0].clientHeight + 'px;"><div style="position: relative;">' +
        subtitlesoriginal +
        hide_original +
        '</div><div style="position: relative;">' + 
        subtitlestranslated +
        hide_translated +
        '</div>' +
      '</div>';

      $(subtitleslayer).appendTo(t.container);

      media.addEventListener('timeupdate',function(e) {
        player.displayCaptions();
      }, false);

      subtitlesoriginal = t.container.find('#mep-original-subtitles'),
      subtitlestranslated = t.container.find('#mep-translated-subtitles'),
      hide_original = t.container.find('#mep-hide-original-subtitles'),
      hide_translated = t.container.find('#mep-hide-translated-subtitles'),
      t.subtitlesoriginal = subtitlesoriginal;
      t.subtitlestranslated = subtitlestranslated;

      t.current_subtitle = -1;
      
      player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;
      player.loadNextTrack();
      
      
      subtitlesoriginal.width((t.width - 10) + 'px');
      subtitlestranslated.width((t.width - 10) + 'px');
      
      t.is_original_hide = false;
      t.is_translated_hide = false;
      
      hide_original.click(function(e) {
					$('#mep-hide-original-subtitles .hide').toggle();
					$('#mep-hide-original-subtitles .show').toggle();
					t.is_original_hide = !t.is_original_hide;
					$('#mep-original-subtitles span').toggle();
			});
			
			hide_translated.click(function(e) {
					$('#mep-hide-translated-subtitles .hide').toggle();
					$('#mep-hide-translated-subtitles .show').toggle();
					t.is_translated_hide = !t.is_translated_hide;
					$('#mep-translated-subtitles span').toggle();
			});
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
              
              if (t.is_original_hide) {
              	$('#mep-original-subtitles span').toggle();
              }
              
              if (t.is_translated_hide) {
              	$('#mep-translated-subtitles span').toggle();
              }
              
              return; // exit out if one is visible;
            }
          }
        }
      }
    },
  });

})(mejs.$);