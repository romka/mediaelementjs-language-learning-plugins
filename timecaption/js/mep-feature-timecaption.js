(function($) {
  dataRead = false;

  $.extend(MediaElementPlayer.prototype, {
    buildtimecaption: function(player, controls, layers, media) {
      var t = this;

      $('<div class="mejs-timeandcaption">'+
          '<span class="mejs-currenttime-caption">' + (player.options.alwaysShowHours ? '00:' : '')
          + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')+ '</span>'+
          '</div>')
          .appendTo(controls);
      
      t.currenttimecaption = t.controls.find('.mejs-currenttime-caption');

      media.addEventListener('timeupdate',function() {
        player.updateTimeAndCaption();
      }, false);
      
      
      // floating block with current time
      if (controls.children().last().find('.mejs-currenttime').length > 0) {
        $(t.options.timeAndDurationSeparator +
          '<span class="mejs-duration">' + 
            (t.options.duration > 0 ? 
              mejs.Utility.secondsToTimeCode(t.options.duration, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25) :
                 ((player.options.alwaysShowHours ? '00:' : '') + (player.options.showTimecodeFrameCount? '00:00:00':'00:00')) 
               ) + 
          '</span>')
          .appendTo(controls.find('.mejs-time'));
      } else {

      // add class to current time
        controls.find('.mejs-currenttime').parent().addClass('mejs-currenttime-container');
      }
      
      t.durationD = t.controls.find('.mejs-duration');

      media.addEventListener('timeupdate',function() {
        player.updateDuration();
      }, false);
    },
    
    updateTimeAndCaption:  function() {
      var t = this;

      if (t.currenttimecaption) {
        time = mejs.Utility.secondsToTimeCode(t.media.currentTime, t.options.alwaysShowHours || t.media.duration > 3600, t.options.showTimecodeFrameCount,  t.options.framesPerSecond || 25);
        
        if (!dataRead && t.tracks[0]['isLoaded']) {
          current_sub = 0;
          total_subs = 0;
            for (track in t.tracks) {
              if (t.tracks[track]['kind'] == 'subtitles' && !dataRead) {
          			dataRead = true;
                total_subs = t.tracks[track]['entries']['text'].length;
              }
            }
        }
        else if (!dataRead && !t.tracks[0]['isLoaded']) {
          current_sub = 0;
          total_subs = 0;
        }
        else {
          for (track in t.tracks) {
            if (t.tracks[track]['kind'] == 'subtitles') {
              for (times in t.tracks[track]['entries']['times']) {
                if (t.media.currentTime >= t.tracks[track]['entries']['times'][times]['start'] && t.media.currentTime <= t.tracks[track]['entries']['times'][times]['stop']) {
                  current_sub = parseInt(times) + 1;
                }
              }
            }
          }
        }

        cap = current_sub + ' / ' + total_subs;
        t.currenttimecaption.html(time + '<br>' + cap);
      }
    },
  });

})(mejs.$);