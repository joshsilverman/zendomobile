function getLines(docs) {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	//xhr.open("GET", "http://localhost:3000/tags/get_tags_json");//
	//xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.open("GET", "http://localhost:3000/review/" + docs[0]);
	xhr.setRequestHeader('Content-Type', 'application/json');
	
	xhr.onload = function() {
		//alert(this.responseText);
		data = JSON.parse(this.responseText);
		//alert(data["lines"]);
		//responseXML = (new DOMParser()).parseFromString(this.responseText, "text/xml");
		//var result = this.responseText;
		//alert(typeof(result));
		// var xml = Ti.XML.parseString(result);
		//var xml = Ti.XML.parseString(this.responseText);
		//var resonseXML = (new DOMParser()).parseFromString(this.responseText, "text/xml");
		//alert(resonseXML);
		//var folders = [];
		
		
		// foldersData = eval(this.responseText);		
		// for (i in foldersData) {
			// folderRows.push(createFolderRow(foldersData[i].tag.name));
		// }
		
		processData(data);
	}	
	xhr.send();
}
