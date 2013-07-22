(function($) {

	// NEXT button
	$.extend(MediaElementPlayer.prototype, {
		buildspeedupdown: function(player, controls, layers, media) {
			var 
				t = this,
				speed_up_sown_widget = 
				$('<div class="mejs-small-button mejs-speed-down-button" >' +
					'<div id="button-speed-down">-</div>' +
				'</div>' + 
				
				'<div id="current-speed">1 x</div>' + 
				
				'<div class="mejs-small-button mejs-speed-up-button" >' +
					'<div id="button-speed-up">+</div>' +
				'</div>'
				)
				.appendTo(controls);
				
				current_speed = 1;
				t.current_speed = current_speed;
				
				var
				  speed_down = controls.find('.mejs-speed-down-button'),
				  speed_up = controls.find('.mejs-speed-up-button');
				  current_speed_widget = controls.find('#current-speed');
				  
				t.current_speed_widget = current_speed_widget;
				  
				  
				speed_down
          .bind('mousedown', function (e) {
          	t.change_speed(-0.25);
          });
          
        speed_up
          .bind('mousedown', function (e) {
          	t.change_speed(0.25);
          });
          
          
       t.globalBind('keydown',function (e) {

					if (e.ctrlKey && e.keyCode == 38) {
						e.preventDefault();
						t.change_speed(0.25);
					}
					else if (e.ctrlKey && e.keyCode == 40) {
						e.preventDefault();
						t.change_speed(-0.25);
					}
				});
      
		},
		
		change_speed: function(diff) {
			var t = this;
			
			if ((diff < 0 && t.current_speed > 0.5) || (diff > 0 && t.current_speed < 2)) {
     		t.current_speed += diff;
     		t.media.playbackRate = t.current_speed;
     		current_speed_widget.html(t.current_speed + 'x');

       	// console.log(t.current_speed);
      }

		}
	});
	
})(mejs.$);
