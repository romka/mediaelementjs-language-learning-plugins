(function($) {
  $.extend(MediaElementPlayer.prototype, {
    builddictionary: function(player, controls, layers, media) {
      var t = this;

      dictionarylayer = '<div id="mep-dictionary" style="position: absolute; left: ' + t.container[0].clientWidth + 'px;">Dictionary</div>';
      $(dictionarylayer).appendTo(t.container);

      dictionarylayer = t.container.find('#mep-dictionary'),
      t.dictionarylayer = dictionarylayer;

      t.container.on('subtitle_before_update', function(event, cap_number) {
        player.dictionary_unbind();
      });

      t.container.on('subtitle_after_update', function(event, cap_number) {
        player.dictionary_bind(media);
      });
    },

    dictionary_bind: function(media) {
      var t = this;

      $('div#mep-original-subtitles span').hover(
        function () {
          $(this).addClass('hover');
        },
        function () {
          $(this).removeClass('hover');
        }
      );

      $('div#mep-original-subtitles span').click(function() {
        media.pause();
        word = $(this).attr('data-content');
        
        translate(word, 'en', 'ru', t);
      });
    },

    dictionary_unbind: function() {
    	// Unbind all events binded to subtitle words.
      $('div#mep-original-subtitles span').unbind();
    },
  });
})(mejs.$);

function translate(word, sl, tl, t) {
  jQuery.ajax({
      url: 'https://www.googleapis.com/language/translate/v2?key=AIzaSyBzPiFGJW1ByPd64_gEFkuCV4TZSGiIgsc&q&source=' + sl + '&target=' + tl + '&q=' + word,
      success: function(data) {
        translated_word = data['data']['translations'][1]['translatedText'];

        trn = '<div><h2>' + word + '</h2>' + translated_word + '</div>';
        t.dictionarylayer.html(trn);
      }
  });
}