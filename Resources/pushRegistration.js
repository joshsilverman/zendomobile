function register() {
  	Ti.Network.registerForPushNotifications({
    	types: [
      	Ti.Network.NOTIFICATION_TYPE_BADGE,
      	Ti.Network.NOTIFICATION_TYPE_ALERT,
      	Ti.Network.NOTIFICATION_TYPE_SOUND
    	],
    	success:function(e) {
      	var deviceToken = e.deviceToken;
      	Ti.API.info('successfully registered for apple device token with '+e.deviceToken);
      	var params = {
        	tags: ['version'+Ti.App.getVersion()],
        	alias: alias.value
      	};
      	UrbanAirship.register(params, function(data) {
        	Ti.API.debug("registerUrban success: " + JSON.stringify(data));
      	}, function(errorregistration) {
        	Ti.API.warn("Couldn't register for Urban Airship");
      	});
    	},
    	error:function(e) {
      	Ti.API.warn("push notifications disabled: "+e);
    	},
    	callback:function(e) {
      	var a = Ti.UI.createAlertDialog({
        	title:'New Message',
        	message:e.data.alert
      	});
      	a.show();
    	}
  	});  
  	Ti.API.info('registered urban airship');
};
 

function unregister() {
  	UrbanAirship.unregister(function(data) {
    	Ti.UI.createAlertDialog({
      	title:'Successfully unregistered',
      	message: JSON.stringify(data)
    	}).show();
  	}, function(errorregistration) {
    	Ti.API.warn("Couldn't unregister for Urban Airship");
  	});
};
