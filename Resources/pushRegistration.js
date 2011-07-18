function register() {
	alert("About to register!");
  	Ti.Network.registerForPushNotifications({
    	types : [
      		Ti.Network.NOTIFICATION_TYPE_BADGE,
      		Ti.Network.NOTIFICATION_TYPE_ALERT,
      		Ti.Network.NOTIFICATION_TYPE_SOUND
    	],
    	success : function(e) {
      		var deviceToken = e.deviceToken;
      		Ti.API.info( 'Successfully registered for apple device token with ' + e.deviceToken );
      		alert( 'Successfully registered for apple device token with ' + deviceToken );
	      	var params = {
	        	tags : [ 'Version' + Ti.App.getVersion() ],
	        	alias : alias.value
	      	};
    	},
    	error : function(e) {
    		alert("Error!");
      		Ti.API.warn("Push notifications disabled: "+e);
    	},
    	callback : function(e) {
    		alert("Yoooooo bro!");
      		var a = Ti.UI.createAlertDialog({
        		title : 'New Message',
        		message : e.data.alert
      		});
      		a.show();
    	}
  	});
};
 

// function unregister() {
  	// UrbanAirship.unregister(function(data) {
    	// Ti.UI.createAlertDialog({
      	// title:'Successfully unregistered',
      	// message: JSON.stringify(data)
    	// }).show();
  	// }, function(errorregistration) {
    	// Ti.API.warn("Couldn't unregister for Urban Airship");
  	// });
// };
