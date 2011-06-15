var win = Ti.UI.createWindow({
	url:"explore.js",
	navBarHidden : false
});

Ti.include('urbanairship.js');
Ti.include('pushRegistration.js');
UrbanAirship.key='gjah01G_R0O6v1bpPGGVwg';
UrbanAirship.secret ='fy0VM1uWRIumLKgkAs67og';
UrbanAirship.master_secret='yUj9LSpyS7qMYjtiwvmUEA';
UrbanAirship.baseurl = 'https://go.urbanairship.com';

//Query server, check if push notifications are enabled
//If enabled:
//	register();

//If disabled:
//	unregister();

win.open();



