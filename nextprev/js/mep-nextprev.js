(function($) {
	
	$.extend(mejs.MepDefaults, {
		nextText: 'Next [Ctrl + right arrow]',
		prevText: 'Prev [Ctrl + left arrow]',
		repeatText: 'Repeat [Space]'
	});

	
	// NEXT button
	$.extend(MediaElementPlayer.prototype, {
		buildnext: function(player, controls, layers, media) {
			var 
				t = this,
				button_next = 
				$('<div class="mejs-small-button mejs-next-button" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.nextText + '" aria-label="' + t.options.nextText + '"></button>' +
				'</div>')
				.appendTo(controls)
				.click(function(e) {
					e.preventDefault();
				
					t.nextCaption();
					
					return false;
				});
				
				t.globalBind('keydown',function (e) {
					if (e.ctrlKey && e.keyCode == 39) {
						t.nextCaption();
					}
				});

				t.repeatCurrent = false;

		},
		
		buildprev: function(player, controls, layers, media) {
			var 
				t = this,
				button_prev = 
				$('<div class="mejs-small-button mejs-prev-button" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.prevText + '" aria-label="' + t.options.prevText + '"></button>' +
				'</div>')
				.appendTo(controls)
				.click(function(e) {
					e.preventDefault();
				
					t.prevCaption();
					
					return false;
				});
				
				t.globalBind('keydown',function (e) {
					if (e.ctrlKey && e.keyCode == 37) {
						t.prevCaption();
					}
				});

		},
		
		buildrepeat: function(player, controls, layers, media) {
			var 
				t = this,
				button_repeat = 
				$('<div class="mejs-small-button mejs-repeat-button repeat-off" >' +
					'<button type="button" aria-controls="' + t.id + '" title="' + t.options.repeatText + '" aria-label="' + t.options.repeatText + '"></button>' +
				'</div>')
				.appendTo(controls)
				.click(function(e) {
					t.repeatBlock(e);
				});
				
				t.media.addEventListener('timeupdate', function(e) {
	        if (t.repeatCurrent) {
	        	// console.log('repeat ON ' + t.repeatable_subtitle);
	        	var ct = t.media.currentTime;
	        	if (ct > player.tracks[0]['entries']['times'][t.repeatable_subtitle]['stop']) {
	        		t.media.setCurrentTime(player.tracks[0]['entries']['times'][t.repeatable_subtitle]['start']);
	        	}
	        	//console.log('current time = ' + ct + '; stop time = ' + player.tracks[0]['entries']['times'][t.repeatable_subtitle]['stop']);
	        }
	      }, false);
	      
	      t.globalBind('keydown',function (e) {
					if (e.keyCode == 32) {
						t.repeatBlock(e);
					}
				});
				
				t.button_repeat = button_repeat;

		},
		
		repeatBlock: function(e) {
			var t = this;
			e.preventDefault();
				
			t.repeatCurrent = !t.repeatCurrent;
					
			if (t.repeatCurrent) {
				var cs = t.current_subtitle;
				t.repeatable_subtitle = cs;
				t.button_repeat.removeClass('repeat-off').addClass('repeat-on');
				t.markAsRepeatable(t.repeatable_subtitle);
			}
			else {
				t.button_repeat.removeClass('repeat-on').addClass('repeat-off');
				t.unmarkAsRepeatable(t.repeatable_subtitle);
			}
			
			//console.log('Repeat ' + t.repeatCurrent);
			
			return false;
		},
		
		markAsRepeatable: function(num) {
			// $('#ps-' + t.repeatable_subtitle).addClass('repeated');
			$('#ps-' + num).html('R');
		}, 
		
		unmarkAsRepeatable: function(num) {
			// $('#ps-' + t.repeatable_subtitle).removeClass('repeated');
			$('#ps-' + num).html('');
		}, 
		
		nextCaption: function(e) {

      var t = this;
      var cs = t.current_subtitle;
      
      //console.log(t.subtitle_blocks);
    
      
      //console.log('current track ' + t.current_subtitle + ', current start time ' + player.tracks[track]['entries']['times'][t.current_subtitle]['start']);
      //console.log('current time ' + t.media.currentTime);
      //console.log('next track ' + (t.current_subtitle + 1) + ', next start time ' + player.tracks[track]['entries']['times'][t.current_subtitle + 1]['start']);
      
      if (cs + 1 < player.tracks[0]['entries']['times'].length) {
 	    	//console.log('*****************');
	      //console.log('Next');
	      //console.log('New subtitle ' + (cs + 1));
	      //console.log('New time ' + player.tracks[subtitles]['entries']['times'][cs + 1]['start']);

      	t.media.setCurrentTime(player.tracks[0]['entries']['times'][cs + 1]['start']);
      	//console.log('Time had to be set to ' + player.tracks[subtitles]['entries']['times'][cs + 1]['start']);
      	if (t.repeatCurrent) {
      		t.unmarkAsRepeatable(t.repeatable_subtitle);
      		t.repeatable_subtitle++;
      		t.markAsRepeatable(t.repeatable_subtitle);
      	}
      }
      else {
      	console.log('last subtitle');
      }
      //t.current_subtitle++;

    },
    
    prevCaption: function(e) {

      var t = this;
      var cs = t.current_subtitle;
      var ct = t.media.currentTime;
    
    	//console.log('*****************');
      //console.log('Prev');
      //console.log('current track ' + t.current_subtitle + ', current start time ' + player.tracks[track]['entries']['times'][t.current_subtitle]['start']);
      //console.log('current time ' + t.media.currentTime);
      //console.log('prev track ' + (t.current_subtitle + -1) + ', prev start time ' + player.tracks[track]['entries']['times'][t.current_subtitle - 1]['start']);
      
      if (ct > player.tracks[0]['entries']['times'][cs]['start'] + 1) {
      	// if more then 1 second left from the beginning of current block, then go to the beginning of current block, else - go to the previous block.
 	    	//console.log('*****************');
	      //console.log('Prev current');
	      //console.log('New subtitle ' + cs);
	      //console.log('New time ' + player.tracks[subtitles]['entries']['times'][cs]['start']);

      	t.media.setCurrentTime(player.tracks[0]['entries']['times'][cs]['start']);
      	
      	//console.log('Time had to be set to ' + player.tracks[subtitles]['entries']['times'][cs]['start'] + ', set to ' + t.media.currentTime);
      }
      else if (t.current_subtitle - 1 > -1) {
 	    	//console.log('*****************');
	      //console.log('Prev prev');
	      //console.log('New subtitle ' + (cs - 1));
	      //console.log('New time ' + player.tracks[subtitles]['entries']['times'][cs - 1]['start']);


      	t.media.setCurrentTime(player.tracks[0]['entries']['times'][cs - 1]['start']);
      	
      	//console.log('Time had to be set to ' + player.tracks[subtitles]['entries']['times'][cs]['start'] + ', set to ' + t.media.currentTime);
      	
      	if (t.repeatCurrent) {
      		t.unmarkAsRepeatable(t.repeatable_subtitle);
      		t.repeatable_subtitle--;
      		t.markAsRepeatable(t.repeatable_subtitle);
      	}
      }
      //else {
      //	console.log('first subtitle');
      //}
      //t.current_subtitle--;

    },
	});
	
})(mejs.$);
