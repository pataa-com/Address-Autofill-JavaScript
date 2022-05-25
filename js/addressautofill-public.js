jQuery(function ($) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
	
	$('body').on('focusin', '#pataacode', function ( ) {
		
		if($(this).val().length==0)
			{
				$('.pataa-examples').show();
				
			}
	});
	$('body').on('click', '.pataa-examples', function ( ) {
		$(this).hide();
	});
	
	$('body').on('keyup', '#pataacode', function ( ) {
		
		var str = $(this).val();
		str = str.replace(/\s/g,'');
		str = str.replace(/[^a-z0-9]/gi, '');		
		//$(this).val(str);
		let pataaCode = $(this).val().charAt(0);
	 	if (pataaCode!='^' && $(this).val().length > 0) {
			
			let value = `^${$(this).val()}`;
			$(this).val(value);
    	 } 
		
		if($(this).val().length<1)
			{
				$('.pataa-examples').show();
			}
		else{
				$('.pataa-examples').hide();
			}
		 if($(this).val().length==0)
		 {
			make_blank();
		 }
		 if($(this).val().length>7)
		 {
			$("#succ-msg").hide();
        	$("#err-msg").hide();
			$("#first-msg").show();
			var element = document.getElementById("pataa-unavailable");
			element.style.display = "none";
			var element = document.getElementById("pataa-available");
			element.style.display = "none";
			var element = document.getElementById("autofill");
			element.style.display = "block";
			var element3 = document.getElementById("main-code");
			element3.classList.remove("succ-msg-sec");
			document.getElementById("err-msg").style.display = "none"; 
			var element3 = document.getElementById("main-code");
			element3.classList.remove("pataa-not-found");
			$("#add_text").html('Autofill');
			$('#autofill_icon').show();
		 }
		 
		 if($(this).val().length<8)
		 {
			
			$('#autofill_icon').hide();
			$("#add_text").html('Add Address');
			
		 }
	});

        $("#pataacode").keypress(function (e) {
            var keyCode = e.keyCode || e.which;
            //Regex for Valid Characters i.e. Alphabets and Numbers.
            var regex = /^[A-Za-z0-9]+$/;
 
            //Validate TextBox value against the Regex.
            var isValid = regex.test(String.fromCharCode(keyCode));
            if (!isValid) {
               }
 
            return isValid;
        });
    
	$("#what-create-pataa").click(function() {
		$('#myModal').modal('hide');
		setTimeout(function() {
			$('#myModal1').modal('show');
		}, 500);
		
	});

	$('body').on('click', '#autofill', function (e) {
		e.preventDefault();
		var pataacode;
		let pataaCode_chk = $('#pataacode').val().charAt(0);
		if(pataaCode_chk==='^')
		{
			pataacode = $('#pataacode').val().slice(1);
		}
		else
		{
			pataacode = $('#pataacode').val();
		}
		var apikey = 'YOUR_API_KEY';
		if(pataacode=="")
		{
			var innerDiv = document.createElement('div');
			document.getElementById("create-pataa-content").appendChild(innerDiv);
			innerDiv.innerHTML = "<create-pataa></create-pataa>";
			var originalDOM="";
			var button = document.querySelector('create-pataa');
			if(button !== null)
			{
			button.addEventListener('createPataaCode', (event) => {
			document.getElementById('pataacode').value = event.detail.toUpperCase();
			document.getElementById('close-btn').click();
			document.getElementById('autofill').click(); 
			$('.pataa-examples').hide();
			});
			}	
			var button1 = document.querySelector('create-pataa');
			
			if(button1 !== null)
			{				
				button1.addEventListener('closeWindow', (event) => {			
				document.getElementById('close-btn').click();
				});
			}
			$('#createPataa').animate({opacity :'1',});
			$('.overlayBox').animate({opacity :'1',}).css({'visibility' :'visible'});
			$('#createPataa').show();
			return false;
		}
		
		if (/^([a-zA-Z0-9]{7,11})$/.test(pataacode)) {
			$.ajax({
					method: "POST",
					url: "https://apiv1.pataa.com/get-pataa",
				
					data: {
						"api_key": apikey,
						"pc": pataacode
					}
				})
				.done(function (response) {
					if (response.status == 200) {
						
						if(response.result.pataa.address2!="")
						{
							var add1 =response.result.pataa.address1+ ", ";
						}
						else{
							var add1 = response.result.pataa.address1;
						}
						if(response.result.pataa.address3!="")
						{
							var add2 =response.result.pataa.address2+ ", ";
						}
						else{
							var add2 = response.result.pataa.address2;
						}
						if(response.result.pataa.address4!="")
						{
							var add3 =response.result.pataa.address3+ ", ";
						}
						else{
							var add3 = response.result.pataa.address3;
						}
						
						let add_1 ="^"+pataacode+", " +add1+  add2 + add3 + response.result.pataa.address4
						add_1 = add_1.replace(/(\s*,?\s*)*$/, "");
						console.log(response);
						$('#billing_first_name').val(response.result.user.first_name);
						$('#billing_last_name').val(response.result.user.last_name);
						$('#billing_address_1').val(add_1);
						$('#billing_address_2').val( add3 + response.result.pataa.address4);
		      $('#billing_country').val(response.result.pataa.country_code).trigger('change');
						$('#billing_city').val(response.result.pataa.city_name);
						$('#billing_state').val(response.result.pataa.state_code).trigger('change');
						$('#billing_postcode').val(response.result.pataa.zipcode);
						$('#billing_phone').val(response.result.user.mobile);
						if(response.result.pataa.country_name=="Unnamed location" && response.result.pataa.state_name=="Unnamed location" )
						   {
						  $("#succ-msg").html('<p>Ship to - '+ response.result.pataa.country_name + '</p>' );
						   }
						else
							{
								$("#succ-msg").html('<p>Ship to - '+ response.result.pataa.city_name + ' - ' + response.result.pataa.zipcode +', '+ response.result.pataa.state_name + ', ' + response.result.pataa.country_name+'</p>' );
							}

						$("#succ-msg").show();
                        $("#err-msg").hide();
						$("#first-msg").hide();
						var element = document.getElementById("pataa-unavailable");
						element.style.display = "none";
						var element = document.getElementById("pataa-available");
						element.style.display = "block";
						var element = document.getElementById("autofill");
						element.style.display = "none";
						var element3 = document.getElementById("main-code");

						element3.classList.add("succ-msg-sec");
						document.getElementById("err-msg").style.display = "none";    
		                        document.getElementById("succ-msg").style.display = "block";	
						
					
					} else if (response.status == 204) {
						$("#succ-msg").hide();
                        $("#err-msg").show();
						$("#first-msg").hide();
						$(".clearInput").show();
						var element = document.getElementById("pataa-unavailable");
						element.style.display = "block";
						var element = document.getElementById("pataa-available");
						element.style.display = "none";
						var element = document.getElementById("autofill");
						element.style.display = "none";
						var element = document.getElementById("main-code");
						element.classList.add("pataa-not-found");
						element.classList.remove("succ-msg-sec");
					}
					else if (response.status == 400) {
						$("#succ-msg").hide();
                        $("#err-msg").show();
						$("#first-msg").hide();
						$(".clearInput").show();
						var element = document.getElementById("pataa-unavailable");
						element.style.display = "block";
						var element = document.getElementById("pataa-available");
						element.style.display = "none";
						var element = document.getElementById("autofill");
						element.style.display = "none";
						var element = document.getElementById("main-code");
						element.classList.add("pataa-not-found");
						element.classList.remove("succ-msg-sec");
					}
					else  {
						$("#succ-msg").hide();
                        $("#err-msg").show();
						$("#first-msg").hide();
						$(".clearInput").show();
						var element = document.getElementById("main-code");
						element.classList.add("pataa-not-found");
						var element = document.getElementById("pataa-unavailable");
						element.style.display = "block";
						var element = document.getElementById("pataa-available");
						element.style.display = "none";
						var element = document.getElementById("autofill");
						element.style.display = "none";
						
					}
				});
		} else {

						$("#succ-msg").hide();
                        $("#err-msg").show();
						$("#first-msg").hide();
						$(".clearInput").show();
						var element = document.getElementById("main-code");
						element.classList.add("pataa-not-found");
						var element = document.getElementById("pataa-unavailable");
						element.style.display = "block";
						var element = document.getElementById("pataa-available");
						element.style.display = "none";
						var element = document.getElementById("autofill");
						element.style.display = "none";
		}

	});
	$(document).ready(function() {
		$('.clearInput').click(function () {
			
			$('#pataacode').val('');
			$(".clearInput").hide();
			$("#err-msg").hide();
			$("#first-msg").show();
			$("#autofill").show();
			var element = document.getElementById("main-code");
			element.classList.remove("pataa-not-found");
			element.classList.add("create-pataas");
			
		});
		
		$('.createPataaBtn').click(function () {
			var innerDiv = document.createElement('div');
			document.getElementById("create-pataa-content").appendChild(innerDiv);
			innerDiv.innerHTML = "<create-pataa></create-pataa>";
			$('#createPataa').animate({opacity :'1',});
			$('.overlayBox').animate({opacity :'1',}).css({'visibility' :'visible'});
			$('#createPataa').show();
			$('#whats-pataa').hide();
			var originalDOM="";
			var button = document.querySelector('create-pataa');
			if(button !== null)
			{
				button.addEventListener('createPataaCode', (event) => {
				let text1 = "^";
				let value = text1.concat(event.detail.toUpperCase());
				document.getElementById('pataacode').value = value;	
				//document.getElementById('pataacode').value = event.detail.toUpperCase();
				document.getElementById('close-btn').click();
				document.getElementById('autofill').click(); 
			});
			}	
			var button1 = document.querySelector('create-pataa');
			
			if(button1 !== null)
			{				
				button1.addEventListener('closeWindow', (event) => {
				document.getElementById('close-btn').click();
				});
			}
		});
		$('#close-btn').click(function () {
			$('#createPataa').animate({opacity :'0',});
			$('.overlayBox').animate({opacity :'0',});
			document.getElementById("create-pataa-content").innerHTML = "";				
			setTimeout(function() {
				$('#createPataa').hide();
				
				$('.overlayBox').css({'visibility' :'hidden'});
			}, 900);
		});

		$('.btn-what-pataa').click(function () {
			$('#whats-pataa').animate({opacity :'1',});
			$('.overlayBox').animate({opacity :'1',}).css({'visibility' :'visible'});
			$('#whats-pataa').show();
		});
		$('#close-btn').click(function () {
			$('#whats-pataa').animate({opacity :'0',});
			$('.overlayBox').animate({opacity :'0',});
			setTimeout(function() {
				$('#whats-pataa').hide();
				$('.overlayBox').css({'visibility' :'hidden'});
			}, 900);
		});
	
	});
		
});



