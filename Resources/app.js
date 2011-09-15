// Ti.App.Properties.setBool('active', false);
// Ti.App.Properties.setBool('launching', true);
// Ti.App.Properties.setBool('foreground', false);
// Ti.App.Properties.setBool('notification', false);

Ti.include('commonMethods.js');
authenticate(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "start");
// authenticate('jason.urton@gmail.com', 'jason123', "start");
