Ti.App.Properties.setBool('active', false);
Ti.App.Properties.setBool('launching', true);
Ti.App.Properties.setBool('foreground', false);
Ti.App.Properties.setBool('notification', false);

Ti.include('authentication.js');
authenticate(Ti.App.Properties.getString('email'), Ti.App.Properties.getString('password'), "start");



// alert(Ti.App.Properties.getString('email'));
// Ti.App.eggList;
// Ti.App.docList;
// Ti.App.recentList;

// Ti.App.Properties.setList('eggList', []);
// Ti.App.Properties.setList('docList', []);
// Ti.App.Properties.setList('recentList', []);
// container = Ti.UI.createWindow({
	// navBarHidden : true,
	// orientationModes : [
		// Titanium.UI.PORTRAIT,
		// Titanium.UI.UPSIDE_PORTRAIT,
		// // Titanium.UI.LANDSCAPE_LEFT,
		// // Titanium.UI.LANDSCAPE_RIGHT
	// ]
// });



// function renderLogin() {
	// // var nav = Titanium.UI.iPhone.createNavigationGroup({
	   // // window : newWin,
	   // // name : "start"
	// // });
// 	
	// // newWin.nav = nav;
	// // container.add(nav);
	// // container.open();
	// newWin.open();
// }

// render();

// this sets the background color of the master
// UIView (when there are no windows/tab groups on it)




// Titanium.UI.setBackgroundColor('#fff');
//  
// // create tab group
// var tabGroup;
//  
// win = Titanium.UI.createWindow({
    // title:'TabViewLogin',
    // tabBarHidden:true,
// });
//  
//  
// var username = Titanium.UI.createTextField({
    // color:'#336699',
    // top:10,
    // left:10,
    // width:300,
    // height:40,
    // hintText:'Username',
    // borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
// });
// win.add(username);
//  
// var password = Titanium.UI.createTextField({
    // color:'#336699',
    // top:60,
    // left:10,
    // width:300,
    // height:40,
    // hintText:'Password',
    // passwordMask:true,
    // borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
// });
// win.add(password);
//  
// var loginBtn = Titanium.UI.createButton({
    // title:'Login',
    // top:110,
    // width:90,
    // height:35,
    // borderRadius:1,
    // font:{fontWeight:'bold',fontSize:14}
// });
// win.add(loginBtn);
// win.open();
//  
// // Titanium.App.addEventListener('logout', function(e) {
    // // win.open();
    // // tabGroup.close();
// // });
// //  
// // loginBtn.addEventListener('click',function(e)
// // {
    // // if ( tabGroup == undefined ) {
    	// // Ti.include('browser.js');
        // // tabGroup = Titanium.UI.createTabGroup();
        // // //
        // // // create base UI tab and root window
        // // //
        // var win1 = Titanium.UI.createWindow({  
            // title:'Tab 1',
            // backgroundColor:'#fff'
        // });
        // var tab1 = Titanium.UI.createTab({  
            // icon:'KS_nav_views.png',
            // title:'Tab 1',
            // window:win1
        // });
//  
        // var label1 = Titanium.UI.createLabel({
            // color:'#999',
            // text:'I am Window 1',
            // font:{fontSize:20,fontFamily:'Helvetica Neue'},
            // textAlign:'center',
            // width:'auto'
        // });
//  
        // win1.add(label1);
//  
        // //
        // // create controls tab and root window
        // //
        // var win2 = Titanium.UI.createWindow({  
            // title:'Tab 2',
            // backgroundColor:'#eee'
        // });
        // var tab2 = Titanium.UI.createTab({  
            // icon:'KS_nav_ui.png',
            // title:'Tab 2',
            // window:win2
        // });
//  
        // var label2 = Titanium.UI.createLabel({
            // color:'#999',
            // text:'I am Window 2',
            // font:{fontSize:20,fontFamily:'Helvetica Neue'},
            // textAlign:'center',
            // width:'auto'
        // });
//  
        // win2.add(label2);
//  
        // var button = Ti.UI.createButton({
            // title: "Logout",
            // style: Ti.UI.iPhone.SystemButtonStyle.DONE
//  
        // });
//  
        // button.addEventListener('click',function(e)
        // {
            // Ti.App.fireEvent('logout');
        // });
//  
        // win1.setRightNavButton(button);     
        // win2.setRightNavButton(button);     
//  
        // //
        // //  add tabs
        // //
        // tabGroup.addTab(tab1);  
        // tabGroup.addTab(tab2);  
// //  
    // // } 
// //  
    // // // open tab group
    // // win.close();
    // // tabGroup.open();
// //  
// // });
// 
// 
// function authenticate(email, password, context, win) {
	// // renderLogin();
	// xhr = Ti.Network.createHTTPClient();
	// xhr.setTimeout(1000000);
	// xhr.onreadystatechange = function() {
		// if (this.readyState == 4) {
			// if (this.status == 200) {
				// alert("200");
				// tabGroup.open();
			// } else {
				// if (context != "start") {
					// alert("Invalid email/password combination.");	
				// } else {
					// alert("400");
					// win.open();
				// }
			// }
		// }
	// };
	// var params = {
		// 'user[email]' : 'jason.urton@gmail.com',
		// 'user[password]' : 'jason123'
	// };
	// xhr.open("POST", serverURL + "/users/sign_in");
	// xhr.send(params);
// }

// win = Ti.UI.createWindow({
	// url:"login.js",
	// navBarHidden : true,
	// backgroundColor : '#dfdacd',
	// orientationModes : [
		// Titanium.UI.PORTRAIT,
		// Titanium.UI.UPSIDE_PORTRAIT
	// ]
// });
// win.open();

// Titanium.App.addEventListener('logout', function(e) {
    // win.open();
    // tabGroup.close();
// });
// 
// Titanium.App.addEventListener('login', function(e) {
	// alert("login!");
    // win.close();
    // tabGroup.open();
// });

