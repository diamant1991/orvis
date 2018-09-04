function scrollToElement(el, offset)
{
	if (offset === undefined)
		offset = 0;

	var duration = 600;
	var element = $(el).offset();
	var pos = element.top + offset;
	$('html, body').animate({scrollTop: pos-10}, duration);
}

$(document).ready(function(){
	$('input[type=tel]').mask('+7(999)999-99-99');
	var config = {
			'select':{disable_search_threshold:1000}		
	}
	for (var selector in config) {
		$(selector).chosen(config[selector]);
	}
	var currentAdress;

	var screenWidth = window.innerWidth;
	var screenIsWide;
	function getScreenWide() {
		if (screenWidth < 767) {
			screenIsWide = false;
		} else {
			screenIsWide = true;
		}
	}
	getScreenWide();
	$(window).on('resize', function(){
		screenWidth = window.innerWidth;
		getScreenWide();
	});

	$('body').on('','.menu-item.has-drop',function(e){
		if (!screenIsWide) {
			e.preventDefault();
		}
		var par = $(this).parent();
		if(!par.hasClass('active')){
			$('.menu-item.has-drop').parent().removeClass('active');
			par.addClass('active');
			var drop = $(this).next('.top-sub-menu');
			$('.top-sub-menu').not(drop).fadeOut(200);
			drop.fadeIn(300);
		}
	})
	.on('mouseleave','.top-menu-wrap',function(){
		$('.menu-item').parent().removeClass('active');
		$('.top-sub-menu').fadeOut(200);
	})
	.on('mouseover','.menu-item:not(.has-drop)',function(){
			$('.menu-item').parent().removeClass('active');
			$('.top-sub-menu').fadeOut(200);
	})
	.on('click','#filter-btn-mobile',function(e){
		e.preventDefault();
		var aria = $(this).attr('aria-expanded');
		if (aria == 'true') {
			$(this).attr('aria-expanded', 'false').addClass('collapsed');
			$('#catFilter').attr('aria-expanded', 'true').slideUp('3600');
		} else {
			$(this).attr('aria-expanded', 'true').removeClass('collapsed');
			$('#catFilter').attr('aria-expanded', 'true').slideDown('5000');
		}
	})		
	.on('click','.search-toggle',function(e){
		e.preventDefault();
		$('header').addClass('search-active');
	})
	.on('click',function(event){
		if(!$(event.target).closest(".top-search").length && !$(event.target).closest(".search-toggle").length){
			$('header').removeClass('search-active');
			$('.top-search input[type=text]').focusout();
		}
	})
	.on('click','.clear-input',function(e){
		e.preventDefault();
		if($(window).width()>767){
			$('.top-search input[type=text]').val("");
			$('.clear-input').fadeOut(100);
		}
		else{
			$('header').removeClass('search-active');
		}
	})
	.on('click','.menu-toggle',function(){
		$('html,body').toggleClass('menu-opened');
	})
	.on('click','.add-new-adress',function(e){
		e.preventDefault();
		$(this).hide();
		$('.add-new-form').slideDown('300');
		$('#submitPersonal').html('Добавить')
	})
	.on('click', '.dropdown-select .dropdown-menu a', function(e)
	{
		e.preventDefault();
		$(this).parents('.dropdown-menu').find('a').parent().removeClass('act');
		$(this).parent().addClass('act');
		$(this).parents('.dropdown-select').find('input[type=hidden]').val($(this).data('val'));
		$(this).parents('.dropdown-select').find('[data-toggle="dropdown"]').html($(this).html()).attr('title',$(this).attr('title'));
	})
	.on('click','.add-phone',function(e){
		e.preventDefault();
		$(this).hide();
		$('.additional-phone').show();
	})
	.on('click', '.amount-input .min', function(e)
	{
		e.preventDefault()
	})
	.on('click', '.amount-input .pl', function(e)
	{
		e.preventDefault();
	})
	.on('click','.map-show a',function(e){
		e.preventDefault();
		$(this).find('span').toggle();
		$('.contact-container').toggleClass('map-active');
	})
	.on('click','.hide-row', function(e){
		e.preventDefault();
		$(this).parents('.hidden-row').prev('tr').find('a[data-toggle="collapse"]').trigger('click')
	})
	.on('click',function(e){
		if(!e.target.closest('.personal-adresses')){
			
			$('.personal-adresses').find('.collapse').collapse('hide')
		}
	})
	.on('click','#baskAdd',function(){		
		$(this).html('Перейти в корзину').addClass('active');
		return false;
	})
	.on('click','.remove-row',function(e){
		e.preventDefault();
		currentAdress = $(this).parents('tr');
		$.fancybox({href : '#removeRow'});
	})
	.on('click','.btn-cancel',function(e){
		$.fancybox.close();
	})
	.on('click','.confirm-remove',function(e){
		currentAdress.remove();
		$.fancybox.close();
    })
    .on('click', '#subscribeBtn', function () {
//$('#captcha-order').removeClass('');    
    var email = $("#email_for_subscribe").val();
    //alert(email);
     if(email != 0){
	    if(isValidEmailAddress(email)){ //проверка на валидность email             
        $.ajax({
            url: "/ajax/subscribe.php",
            method: "POST",
            data: {email: email},
            dataType: "json"
        }).done(function (msg) {
			//var googleResponsetoo = jQuery('#captcha-subscribe #g-recaptcha-response').val();
			//var googleResponsetoo = $('#subscribe-form').find('.g-recaptcha-response').val();	
			var googleResponsetoo = grecaptcha.getResponse();
			if (!googleResponsetoo) {
						$('<p style="color:red !important; display" id="errr-sbcrb" class=error-captcha"><span class="glyphicon glyphicon-remove " ></span>Вы не подтвердили, что вы не Робот!</p>" ').insertAfter("#html_element_subscribe");
						//$('#captcha-box').addClass('wibro');
						$('.fancybox-skin').addClass('wibro');
						setTimeout(function () {
							var wibro = jQuery('.fancybox-skin');
								 wibro.removeClass('wibro');
							}, 200);						
						setTimeout(function () {
							var foo = jQuery('#errr-sbcrb');
								foo.fadeOut('slow', function(){
								    $(this).remove();
								});
							}, 2000);
						return false;
			} else {

						if (msg.RESULT=='OK') {
							$('.subscribe-form').append('<div class="success-message">Вы подписались на рассылку</div>')
							setTimeout(function () {
								$.fancybox.close();
							}, 3000);
						} else {
							$('.subscribe-form').prepend('<div id="error-mess-subscribe"class="error-message">Заполните правильно полe</div>');
									/****** Wibro *****/
									$('.fancybox-skin').addClass('wibro');
									setTimeout(function () {
										var wibrotoo = jQuery('.fancybox-skin');
											 wibrotoo.removeClass('wibro');
										}, 200);
									setTimeout(function () {
										var footoo = jQuery('#error-mess-subscribe');
											footoo.fadeOut('slow', function(){
											    $(this).remove();
											});
										}, 2000);
									/*end Wibro*/												
						}														
			}
        }).fail(function (jqXHR, textStatus) {
            $('.subscribe-form').append('<div class="success-message">Извините, подписка временно не работает</div>')
        });
        return false;
        	}else{
			$('.subscribe-form').prepend('<div id="error-mess-subscribe"class="error-message">Заполните правильно полe</div>');
					/****** Wibro *****/
					$('.fancybox-skin').addClass('wibro');
					setTimeout(function () {
						var wibrotoo = jQuery('.fancybox-skin');
							 wibrotoo.removeClass('wibro');
						}, 200);
					setTimeout(function () {
						var footoo = jQuery('#error-mess-subscribe');
							footoo.fadeOut('slow', function(){
							    $(this).remove();
							});
						}, 2000);
					/*end Wibro*/
					return false;	        	
        	}
        }else{
			$('.subscribe-form').prepend('<div id="error-mess-subscribe"class="error-message">Заполните правильно полe</div>');
					/****** Wibro *****/
					$('.fancybox-skin').addClass('wibro');
					setTimeout(function () {
						var wibrotoo = jQuery('.fancybox-skin');
							 wibrotoo.removeClass('wibro');
						}, 200);
					setTimeout(function () {
						var footoo = jQuery('#error-mess-subscribe');
							footoo.fadeOut('slow', function(){
							    $(this).remove();
							});
						}, 2000);
					/*end Wibro*/	
					return false;        
        }
    })
	
    .on('click', '#callbackBtn', function (){
/*if (grecaptcha.getResponse() == ""){
    alert("You can't proceed!");
} else {
    alert("Thank you");
}	*/	
        phone = $("#phone_for_callback").val();
        name = $("#name_for_callback").val();
        if ((phone != 0) || (name !=0)){
	        

				$.ajax({
					url: "/ajax/callback.php",
					method: "POST",
					data: {phone: phone, name: name},
					dataType: "json"
				}).done(function (msg) {
				var googleResponse = $('#callback-form').find('#g-recaptcha-response-1').val();
				//alert(googleResponse);
					if (!googleResponse) {
						$('<p style="color:red !important; display" id="errr" class=error-captcha"><span class="glyphicon glyphicon-remove " ></span>Вы не подтвердили, что вы не Робот!</p>" ').insertAfter("#html_element");
						//$('#captcha-box').addClass('wibro');
						$('.fancybox-skin').addClass('wibro');
						setTimeout(function () {
							var wibro = jQuery('.fancybox-skin');
								 wibro.removeClass('wibro');
							}, 200);						
						setTimeout(function () {
							var foo = jQuery('#errr');
								foo.fadeOut('slow', function(){
								    $(this).remove();
								});
							}, 2000);
						return false;
					} else {			
						if (msg.RESULT=='OK') {
							$('.callback-form').append('<div class="success-message">Спасибо, мы скоро с вами свяжемся</div>')
							setTimeout(function () {
								$.fancybox.close();
							}, 3000);
						} else {
							$('.callback-form').prepend('<div class="error-message">Заполните правильно все поля</div>');
							/****** Wibro *****/
							$('.fancybox-skin').addClass('wibro');
							setTimeout(function () {
								var wibrotoo = jQuery('.fancybox-skin');
									 wibrotoo.removeClass('wibro');
								}, 200);
							setTimeout(function () {
								var footoo = jQuery('.error-message');
									footoo.fadeOut('slow', function(){
									    $(this).remove();
									});
								}, 2000);
							/*end Wibro*/								
						}
					}
				}).fail(function (jqXHR, textStatus) {
					$('.callback-form').append('<div class="success-message">Извините, обратный звонок временно не работает</div>')
				});

        return false;
        }else{
							$('.callback-form').prepend('<div class="error-message">Заполните правильно все поля</div>');
							/****** Wibro *****/
							$('.fancybox-skin').addClass('wibro');
							setTimeout(function () {
								var wibrotoo = jQuery('.fancybox-skin');
									 wibrotoo.removeClass('wibro');
								}, 200);
							setTimeout(function () {
								var footoo = jQuery('.error-message');
									footoo.fadeOut('slow', function(){
									    $(this).remove();
									});
								}, 2000);
							/*end Wibro*/	      
	    return false;  
        }
    })

    .on('click', '#tryBtn', function () {
        order = $("#order_for_try").val();
        name = $("#name_for_try").val();
        phone = $("#phone_for_try").val();
        email = $("#email_for_try").val();
        address = $("#address_for_try").val();
        $.ajax({
            url: "/ajax/try.php",
            method: "POST",
            data: {phone: phone, name: name, order: order, email: email, address: address},
            dataType: "json"
        }).done(function (msg) {
            if (msg.RESULT == 'OK') {
                $('.callback-form').append('<div class="success-message">Спасибо, мы скоро с вами свяжемся</div>')
                setTimeout(function () {
                    $.fancybox.close();
                }, 3000);
            } else {
                $('.callback-form').append('<div class="success-message">Извините, ошибка обратной связи</div>')
            }
        }).fail(function (jqXHR, textStatus) {
            $('.callback-form').append('<div class="success-message">Извините, обратная связь временно не работает</div>')
        });
        return false;
    })
	.on('submit', '#orderBtn', function () {
		var form 	= $(this),
			order 	= $("#order_for_order").val(),
			name 	= $("#name_for_order").val(),
			phone 	= $("#phone_for_order").val();  
			link 	= $("#link_for_order").val();  
		console.log(form);			
        $.ajax({
            url: "/ajax/order.php",
            method: "POST",
            data: {phone: phone, name: name, order: order , link: link},
            dataType: "json"
        }).done(function (msg) {
            if (msg.RESULT == 'OK') {
                form.append('<div class="success-message">Спасибо, мы скоро с вами свяжемся</div>')
                setTimeout(function () {
                    $.fancybox.close();
                }, 3000);
            } else {
                form.append('<div class="success-message">Извините, ошибка обратной связи</div>')
            }
        }).fail(function (jqXHR, textStatus) {
            form.append('<div class="success-message">Извините, обратная связь временно не работает</div>')
        });
        return false;
    });
	
	var video = document.getElementById('brandVideo');
	$('.fancybox').fancybox();
	$('.fancybox-gallery').fancybox({
		padding: 0,
		helpers :{ 
			title : { type : 'over' }
		},
		beforeShow : function() {
			this.title = (this.title ? '' + this.title + '' : '') +  (this.index + 1) + ' / ' + this.group.length;
		} 
	});
	
	$('#video-play').click(function(){
		if(video.paused){
			video.play();
			$('.brand-video').addClass('playing');
		}
		else{
			video.pause();
			$('.brand-video').removeClass('playing');
		}		
	});
	$("#date").mask("99.99.9999");
	
	$('.top-search input[type=text]').keyup(function(){
		if($(this).val().length>0)
			$('.clear-input').fadeIn(100);
		else
			$('.clear-input').fadeOut(100);
	}).focus(function(){
		$('header').addClass('search-active');
	})
	$(".hide-drop").click(function(event){
		$(".dropdown").removeClass("open");
	});

	$(".dropdown-events").on("hide.bs.dropdown", function(e){
		e.preventDefault();
	});

	$(".dropdown").on("show.bs.dropdown", function(e){
		$(".dropdown").removeClass("open");
	});


	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('header').removeClass('search-active');
		}
	});
	$('.personal-adresses input[name="adress"]').change(function(){
		$('.personal-adresses tr').removeClass('checked');		
		$(this).parents('tr').addClass('checked');
	})
	
	if ($('#catFilter').attr('expanded')) $('#catFilter').collapse('hide')
	$(window).resize(function(){
		if ($(window).size()<767){
			$('#catFilter').collapse('hide')
		}
	})
	
	var owlTopSlider = $('#mainSlider');
	owlTopSlider.owlCarousel({ 
		items: 1,
		nav: false,
		loop: true,		
		dots: true,
		//autoWidth:true,
		autoHeight: false,
		mouseDrag: true,
        autoplay: true,
        autoplayTimeout: 10000,
        smartSpeed: 700
	});
  
  	var designSlider = $('#designSlider');
	designSlider.owlCarousel({ 
		items: 1,
		nav: true,
		loop: true,		
		dots: false,
		//autoWidth:true,
		autoHeight: false,
		mouseDrag: true,
        autoplay: true,
        autoplayTimeout: 3000,
        smartSpeed: 700,
        responsive: {
			0: {
                nav: false,
			},
			420: {
				nav: false,
			},
			768: {
				nav: false,
			},
			992: {
				nav: true,
			}
		}
	});
	
	var cardSlider = $('#cardSlider');
	cardSlider.owlCarousel({ 
		items: 1,
		nav: false,
		loop: false,
		dots: true,
		autoHeight: false,
		mouseDrag: true		
	});	
	
	
	var owlGoods = $('#goodsSlider');
	owlGoods.owlCarousel({ 
		items: 4,
		margin: 30,
		nav: true,
		navText: [],
		loop: true,		
		dots: false,
		autoHeight: true,
		mouseDrag: true,
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 700,
        responsive: {
			0: {
				items: 1,
				margin: 0
			},
			420: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});

	var owlGoods = $('#brandSlider');
	owlGoods.owlCarousel({
		items: 4,
		margin: 30,
		nav: true,
		navText: [],
		loop: false,
		dots: false,
		autoHeight: true,
		mouseDrag: true,
		autoplay: true,
		autoplayTimeout: 5000,
		smartSpeed: 700,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			420: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});

	var owlLastGoods = $('#lastGoodsSlider');
	owlLastGoods.owlCarousel({ 
		items: 4,
		margin: 30,
		nav: true,
		navText: [],
		loop: true,		
		dots: false,
		autoHeight: true,
		mouseDrag: true,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			420: {
				items: 2,
			},
			768: {
				items: 3,
			},
			992: {
				items: 4,
			}
		}
	});	
	
	var owlVideos = $('#videosSlider');
	owlVideos.owlCarousel({ 
		items: 3,
		margin: 30,
		nav: true,
		navText: [],
		loop: false,		
		dots: false,
		autoHeight: true,
		mouseDrag: true,
		responsive: {
			0: {
				items: 1,
				margin: 0
			},
			330: {
				items: 2,
			},
			768: {
				items: 3,
			}
		}
	});

	$('.design-bt').click(function(event){
			event.preventDefault();
			$('body').append('<div class="shadow"></div>'); 
			var box = $('.design-popup').fadeToggle('slow', 'linear');
			box.show();
			box.css("left", (($(window).width() - box.outerWidth()) / 2) + $(window).scrollLeft() + "px");
			box.css("top", (($(window).height() - box.outerHeight()) / 2) + $(window).scrollTop() + "px");
	});
	$('.design-popup .close-popup').click(function(event){
		event.preventDefault();
        $('.design-popup').fadeToggle('slow', 'linear');
		$('.shadow').fadeOut('slow', 'linear');
	});
	$('.thanks-popup .close-popup').click(function(event){
		event.preventDefault();
        $('.thanks-popup').fadeToggle('slow', 'linear');
		$('.shadow').fadeOut('slow', 'linear');
	});	
	
        $('.design-slider').slick({
          dots: false,
          auto: true,
          infinite: true,
          speed: 1000,
          slidesToShow: 1,
          autoplay: true,
          pauseOnFocus: false,
          autoplaySpeed: 3000
        });	
	
        $('.work-slider').slick({
          dots: false,
          auto: true,
          infinite: true,
          speed: 1000,
          slidesToShow: 1,
          autoplay: true,
          pauseOnFocus: false,
          autoplaySpeed: 3000
        });
         $('.workers-slider').slick({
          dots: false,
          auto: true,
          infinite: true,
          speed: 1000,
          slidesToShow: 3,
          autoplay: true,
          pauseOnFocus: false,
          autoplaySpeed: 3000
        });       	


   $("#phone").mask("+7 (999) 999-99-99");
   $("#phone_for_callback").mask("+7 (999) 999-99-99");

	$('#announce-preview').collapser({
		mode: 'chars',
		truncate: 150
	});
    
	// Facebook Pixel
	
	if ($('form').is('#ORDER_FORM')) {
		fbq('track', 'InitiateCheckout');
	}
	
	$('#ORDER_CONFIRM_BUTTON').click(function(e){
		fbq('track', 'Purchase', {
			value: 1,
			currency: 'RUB',
		});
	});
	
	$('.add-basket, .buyButton').click(function(e){
		 fbq('track', 'AddToCart', {
			value: 1,
			currency: 'RUB',
		 });
	});
	
	$('#filter-btn-mobile').click();
});