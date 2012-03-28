Array.prototype.toJson = function() {
	var i, len = this.length, json='';
	for (i=0; i<len; i++) {
		if (i!=0) {
			json += ',';
		}
		json += this[i].toJson ? this[i].toJson() : "'"+this[i]+"'";
	}
	return '['+json+']';
}

$(document).ready(function(){
	app.init();
});

app = {
	
	// Start out with no guests
	guests : {},
	guestList : [],
	MM : mwd.MissManners,
	table : mwd.get('table'),
	dataUrl : '/missmanners/jsonserve.jsp',
		
	init : function() {
		app.initGenderSelector();
		mwd.renderBreak();
		app.initTextBoxes();
		mwd.renderBreak();
		app.initAddButton();
		mwd.renderBreak();
		app.initColorPicker();
		app.initPlacementButton();
		app.initSampleDataButton();
		app.initExplanationButton();
		$(window).resize(function(){
			app.reseatGuests();
		});
	},
	
	// Initialize farbtastic color picker (see http://acko.net/dev/farbtastic).
	initColorPicker : function() {
		app.colorBox = $('#guestColor');
		var colorBox = app.colorBox;
		var initColor = mwd.util.rgbToHex(colorBox.css('background-color'));
		app.colorPicker = $.farbtastic('#colorPicker', function(color){
			app.colorBox.css('background-color', color);
		}).setColor(initColor);
		app.colorPickerContainer = $('#colorPicker').addClass('hidden');
		app.colorBox.click(function() {
			app.colorPickerContainer.toggle('hidden');
		});
	},
	
	// Initialize the gender selectors - two select elements with type image
	initGenderSelector : function() {
		// Get the background color of panel
		var invisibleBorder = {'border' : '2px dashed '+$('#panel').css('background-color')};
		var selectedBorder = {'border' : '2px dashed #952'};
		// Keep track of which is currently selected. Initialize to female
		app.selectedGender = $('#femaleSelector').css(selectedBorder);
		$(['male','female']).each(function(index, gender){
			// Get the male and female selectors
			var selector = $('#'+gender+'Selector');
			selector.css(invisibleBorder);
			selector.click(function(){
				app.selectedGender.blur();
				app.selectedGender.css(invisibleBorder);
				selector.css(selectedBorder);
				app.selectedGender = selector;
			});
		});
		app.selectedGender.click();
	},
	
	// Initialize the name and interest box. Empty boxes should have an italicized text indicating what to enter. 
	initTextBoxes : function() {
		app.nameBox = $('#guestName');
		app.interestBox = $('#guestInterest');
		var nameBox = app.nameBox;
		var interestBox = app.interestBox;
		nameBox.emptyText = 'Enter guest name...';
		interestBox.emptyText = 'Enter guest interest...';

		app.emptyStyle = {'font-style':'italic', 'color' : '#933'};
		app.taintedStyle = {'font-style':'normal', 'color' : '#933'};
		app.errorStyle =  {'font-style':'italic', 'color' : 'red'};

		// Assign all the name box functionalities
		app.inputBoxes = $([nameBox, interestBox]);
		app.inputBoxes.each(function(index, box) {
			box.css('font-style', 'italic');
			box.val(box.emptyText);
			box.tainted = false;
			box.focus(function(){
				if (box.tainted) {
					// The focused box already has text - don't do anything
				} else {
					// The focused box is not tainted - set the default text
					box.css(app.taintedStyle);
					box.val('');
				}
			}).blur(function(){
				box.tainted = (mwd.util.trim(box.val()) !== '');
				if (box.tainted){
					box.css(app.taintedStyle);
				} else {
					box.css(app.emptyStyle);
					box.val(box.emptyText);
				}
			}).change(function(){
				box.tainted = true;
			});
		});
	},
	
	// Initialize the guest add input button behavior
	initAddButton : function() {
		var addGuestButton = $('#guestAdd');
		app.addGuestButton = addGuestButton.click(function(){		
			addGuestButton.blur();
			// Check that name and interest boxes have been tainted, i.e. that name and interests are given
			var proceed = true;
			app.inputBoxes.each(function(index, box) {
				if (!box.tainted) {
					proceed = false;
					box.css(app.errorStyle);
				}
			});

			if (proceed) {
				var guest = app.addGuest({
					name : app.nameBox.val(),
					gender : app.selectedGender.val(),
					interest : app.interestBox.val(),
					color : app.colorPicker.color
				});
				// Clean up the input boxes
				app.inputBoxes.each(function(index, box) {
					box.val(box.emptyText);
					box.css(app.emptyStyle);
					box.tainted = false;
				});		
			}
		});
	},
	
	initSampleDataButton : function() {
		$('#sampleData').click(function(){
			var data = [{
				name : 'Sean Paul', gender : 'male', interests : 'Processes, Flow', color : '#ccf'
			},{
				name : 'Mother Theresa', gender : 'female', interests : 'Soul', color : '#cff'
			},{
				name : 'Madonna', gender : 'female', interests : 'Flow', color : '#def'
			},{
				name : 'Bella Abzug', gender : 'female', interests : 'Processes', color : '#dbe'
			},{
				name : 'Dalai Lama', gender : 'male', interests : 'Soul', color : '#dfe'
			},{
				name : 'Ray Kurtzweil', gender : 'male', interests : 'Flow, Soul', color : '#cde'
			}].reverse();

			$(data).each(function(index, person){
				app.addGuest(person);
			});
		});
	},
	initExplanationButton : function() {
		var button = $('#explanationButton');
		app.explanation = $('#explanation').addClass('hidden');
		button.click(function() {
			app.explanation.toggle('hidden');
			window.setTimeout(app.reseatGuests, 500);
		});
	},
	
	refreshGuestCards : function() {
		var offset = {x:40, y:80};
		var radius = 90;
		var radiusMultiple = radius*2.1; // determines how far from table guests are seated
		var timeout = 200;
		var count = app.guestList.length;
		$(app.guestList).each(function(index, id){
			var guest = app.guests[id];
			var frac = 2*index/count;
			if (guest && !guest.place) {
				guest.beSeated = function(){
					guest.moveTo({
						x : app.table.x + radius + offset.x + Math.cos(Math.PI*frac)*radiusMultiple,
						y : app.table.y + radius + offset.y + Math.sin(Math.PI*frac)*radiusMultiple
					});
					guest.seated = true;
				};
			}
		});
	},
	addGuest : function(data) {
		var guest = new app.MM.Guest(data);
		guest.beforeRemove = app.removeGuest;
		// Add the guest to our data
		//app.guests.push(guest);
		app.guests[guest.id] = guest;
		app.guestList.push(guest.id);
		// Create and insert the card in our guest list
		var card = $('#guestList').prepend(guest.toDom());
		return guest;
	},
	
	initPlacementButton : function() {
		var button = $('#placementButton').click(function(){
			button.blur();
			var data = [];
			$(app.guestList).each(function(index, id){
				var guest = app.guests[id];
				var interestArray = guest.interests.split(',');
				$(interestArray).each(function(i, interest){
					data.push([guest.id, guest.gender, mwd.util.trim(interest)]);					
				});
			});
			var dataString = data.toJson();
			$.ajax({
				contentType : 'text/plain; charset=UTF-8"',
				beforeSend : function(http) {
					http.setRequestHeader("Content-length", dataString.length);
					http.setRequestHeader("Connection", "close");
				},
				cache : false,
				url : app.dataUrl,
				type : 'POST',
				data : dataString,
				complete : function(response) {
					var json = mwd.parseJson(response.responseText);
					if (json && json.answer) {
						app.guestList = json.answer;
						app.seatGuests(200);									
					} else if (json && json.error) {
						//alert(json.error+"\n\nThe guests will be seated in the order they were added.\nTry editing their interests by clicking and then reseat.");
						app.seatGuests(200);		
					} else {
						//alert("Something went wrong. \nThe guests will be seated in the order they were added. \n\nThe server says:\n"+response.responseText);
						app.seatGuests(200);												
					}
				}
			});
		});
	},
 	seatGuests : function(delay) {
		app.refreshGuestCards();
		if(delay) {
			$(app.guestList).each(function(index, id){
				var guest = app.guests[id];
				(guest && window.setTimeout(guest.beSeated, index*delay));
			});
		} else {
			$(app.guestList).each(function(index, id){	
				var guest = app.guests[id];
				(guest && guest.beSeated());
			});
		}
	},
	reseatGuests : function() {
		$(app.guestList).each(function(index, id){
			var guest = app.guests[id];
			(guest ? guest.seated && guest.beSeated() : null);
		});
	},
	removeGuest : function(guest) {
		app.guests[guest.id] = null;
		$(app.guestList).each(function(index, id){
			if (id==guest.id) {
				app.guestList.splice(index, 1);
			}
		});
		if(guest.seated) {
			app.seatGuests(130);
		}
	}
};
