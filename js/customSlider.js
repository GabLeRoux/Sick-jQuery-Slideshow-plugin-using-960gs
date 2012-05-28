/**
 * by Jacob Gube, edited by Andrea Mezzanotte, tweaked by GabLeRoux
 * http://sixrevisions.com/tutorials/javascript_tutorial/create-a-slick-and-accessible-slideshow-using-jquery/
 * http://www.offcode.it/javascript/slideshow/
 * @ver 0.3
 * @param string slideId : "id" param of main container <div id="slider-1" class="slideshow">
 * @param string slideWidth : Width of main container <div id="slider-1" class="slideshow">
 * @param string slideHeight : Height of main container <div id="slider-1" class="slideshow">
 * @param string|boolean autoplay : If slideshow will start automatically
 * @param integer autoplayInterval : Milliseconds between each slide when autoplay is true
 * @param integer autoplayDelay : Milliseconds before starting autoplay
 * @param string|boolean autoplayShowControls : Show or hide start|stop links
 * @param string leftControlImage : Image for left button
 * @param string|boolean keyboardNav : Enable left and right arrow to navigate
 * @param string|boolean pauseOnHover : Pause when mouse is hover the slider
 */
 var customSlider = function (params)
 {

	// IMPORTANT!!! set this variable in order to refer to "this" inside all callback functions
	var myself = this;
	var init = true;
	this.playerStatus	= "initiated";

	(params.currentPosition != undefined) ? this.currentPosition =  params.currentPosition : this.currentPosition = 0;

	this.slideId 		= params.slideId;
	this.slideWidth 	= params.slideWidth;
	this.slideHeight 	= params.slideHeight;
	this.autoplay 		= params.autoplay;
	this.keyboardNav	= params.keyboardNav;
	this.pauseOnHover	= params.pauseOnHover;

	(params.autoplayDelay != undefined) ? this.autoplayDelay =  params.autoplayDelay : this.autoplayDelay = 0;
	(params.autoplayInterval != undefined) ? this.autoplayInterval =  params.autoplayInterval : this.autoplayInterval = 3000;
	(params.autoplayShowControls != undefined) ? this.autoplayShowControls =  params.autoplayShowControls : thisautoplayShowControls = false;

	(params.leftControlImage != undefined) ? this.leftControlImage =  params.leftControlImage : this.leftControlImage = "./img/control_left.png";
	(params.rightControlImage != undefined) ? this.rightControlImage =  params.rightControlImage : this.rightControlImage = "./img/control_right.png";
	(params.keyboardNav != undefined) ? this.keyboardNav =  params.keyboardNav : this.keyboardNav = false;
	(params.pauseOnHover != undefined) ? this.pauseOnHover =  params.pauseOnHover : this.pauseOnHover = false;
	this.intervalId = 0; //internal variable for interval

/*	
	selector = '#' + this.slideId;
	$(selector).css( {
		'height': this.slideHeight
	});


	selector = '#' + this.slideId + ' .slidesContainer';
	$(selector).css( {
		
		'height': this.slideHeight
	});
*/

	selector = '#' + this.slideId + ' .slide';
	this.slides = $(selector);
	this.numberOfSlides = this.slides.length;

	this.slides
	.wrapAll('<div class="slideInner"></div>')
	// Float left to display horizontally, readjust .slides width
	.css({
		'float' : 'left',
		'height': this.slideHeight
	});

	selector = '#' + this.slideId + ' .slideInner';
	$(selector).css('width', this.slideWidth * this.numberOfSlides);

	$(selector).css('marginLeft',  this.slideWidth*(-this.currentPosition));
	$(selector).css('marginright',  this.slideWidth*(-this.currentPosition));

	selector = '#' + this.slideId;
	$(selector)
	.append('<span class="control leftControl">Précédent</span>')
	.append('<span class="control rightControl">Suivant</span>');


	selector = '#' + this.slideId + ' .leftControl';
	$(selector).css('background-image', 'url('+this.leftControlImage+')');
	selector = '#' + this.slideId + ' .rightControl';
	$(selector).css('background-image', 'url('+this.rightControlImage+')');

	this.manageControls = function( position )
	{

		if(init == true && position == 0)
		{
			selector = '#' + this.slideId + ' .leftControl';
			$(selector).hide();
		}

		// Hide left arrow if position is first slide
		selector = '#' + this.slideId + ' .leftControl';
		if( position==0 )
		{
			$(selector).fadeOut();
		}
		else
		{
			$(selector).fadeIn();
		}

		// Hide right arrow if position is last slide
		selector = '#' + this.slideId + ' .rightControl';
		if(position == this.numberOfSlides-1)
		{
			$(selector).fadeOut();
		}
		else
		{
			$(selector).fadeIn();
		}
	};


	this.rotate = function ()
	{

		if ( this.currentPosition == this.numberOfSlides-1)
		{
			this.currentPosition = 0;
			// Hide / show controls
			this.manageControls(this.currentPosition);
		
			// go back to first slide
			selector = '#' + this.slideId + ' .slideInner';
			$(selector).fadeTo('fast', 0, function()
			{
				$(selector).css('marginLeft',  myself.slideWidth*(-myself.currentPosition) );
				$(selector).fadeTo('fast',1);
			});
		}
		else
		{
			this.showNext('forward');
		}
	}

	this.showNext = function (direction)
	{
		if (direction=='forward' && this.currentPosition == this.numberOfSlides-1)
		{
			myself.rotate;
			this.manageControls( this.currentPosition );
		}
		else if (direction=='backward' && this.currentPosition == 0)
		{
			return false;
		}
		else
		{
			// Determine new position
			this.currentPosition = (direction=='forward')? this.currentPosition+1 : this.currentPosition-1;

			// Hide / show controls
			this.manageControls( this.currentPosition );

			// Move slideInner using margin-left
			selector = '#' + this.slideId + ' .slideInner';
			$(selector).animate(
			{
				'marginLeft' : this.slideWidth*(-this.currentPosition)
			});
		}
	}

	// Remove left arrow on first load
	this.manageControls( this.currentPosition );

	selector = '#' + this.slideId + ' .control';
	
	$(selector).bind('click', function()
	{
		if (!$(this).is(":animated"))
		{
			($(this).hasClass('rightControl')) ? direction='forward' : direction='backward';
			myself.stop(); // if clicked a button then stop autoplay
			myself.showNext(direction);
		}
	});

	this.stop = function()
	{
		clearInterval( this.intervalId );
		this.playerStatus = 'stopped';
	}

	this.start = function()
	{
		if(this.playerStatus != 'running')
		{
			this.intervalId = setInterval( function(){myself.rotate();}, this.autoplayInterval);
			this.playerStatus = 'running';
		}
	}

	//selector = '#' + this.slideId + ' .slideInner';

	//$(selector).mouseenter(myself.stop());

	if ( this.autoplayShowControls )
	{
		selector = '#' + this.slideId;
		$(selector)
		.append('<div class="playcontrol"><span class="startControl">Start</span><span class="stopControl">Stop</span></div>');

		playcontrol = '#' + this.slideId + ' .startControl';
		$(playcontrol).bind('click', function() { myself.start() });

		playcontrol = '#' + this.slideId + ' .stopControl';
		$(playcontrol).bind('click', function() { myself.stop() });
	}

	if ( this.autoplay )
	{
		if ( this.autoplayDelay != 0 ) {
			this.playerStatus = 'waiting for delay to start ('+this.autoplayDelay+'msec)';
			setTimeout( function(){myself.start();}, this.autoplayDelay);
		} else {
			this.start();
		}
	}

	if( this.keyboardNav )
	{
		$(window).keydown(function(event)
		{
			//Left
			if(event.keyCode == '37')
			{
				if (!$(this).is(":animated"))
				{
					direction='backward';
					myself.stop(); // if clicked a button then stop autoplay
					myself.showNext(direction);
				}
			}
			//Right
			if(event.keyCode == '39')
			{
				if (!$(this).is(":animated"))
				{
					direction='forward';
					myself.stop(); // if clicked a button then stop autoplay
					myself.showNext(direction);
				}
			}
		});
	}

        // Pause On Hover (not working atm)
        if(this.pauseOnHover)
        {
        	selector = '#' + this.slideId + ' .slidesContainer';
            $(selector).mouseenter(function(){
                this.paused = true;
                clearInterval(this.intervalId);
                this.intervalId = '';
            }, function(){
                this.paused = false;
                //Restart the timer
                if(this.intervalId == '' && !settings.manualAdvance)
                {
                    this.intervalId = setInterval(function()
                    { 
                    	if ( this.autoplay )
						{
							if ( this.autoplayDelay != 0 ) {
								this.playerStatus = 'waiting for delay to start ('+this.autoplayDelay+'msec)';
								setTimeout( function(){myself.start();}, this.autoplayDelay);
							} else {
								this.start();
							}
						}
					});
                }
            });
        }

	init = false;
}

$(document).ready(function(){

	params = {
		"currentPosition": 0,
		"slideWidth": 960,
		"slideHeight": 265,
		"slideId": "slider-1",
		"autoplay": true,
		"autoplayInterval": 5000,
		"autoplayDelay": 1000,
		"autoplayShowControls": true,
		"keyboardNav": true,
		"pauseOnHover": true,
	};
	slider1 = new customSlider(params);

		params = {
		"currentPosition": 0,
		"slideWidth": 480,
		"slideHeight": 200,
		"slideId": "slider-2",
		"autoplay": true,
		"autoplayInterval": 5000,
		"autoplayDelay": 1000,
		"autoplayShowControls": false,
		"keyboardNav": false,
		"pauseOnHover": true,
	};
	slider2 = new customSlider(params);

	params = {
		"currentPosition": 0,
		"slideWidth": 480,
		"slideHeight": 200,
		"slideId": "slider-3",
		"autoplay": true,
		"autoplayInterval": 5000,
		"autoplayDelay": 1000,
		"autoplayShowControls": false,
		"keyboardNav": false,
		"pauseOnHover": true,
	};
	slider3 = new customSlider(params);
});