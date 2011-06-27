function getFolders() {
	xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(1000000);
	// xhr.onerror = alert('Could not connect to your account... Please try again in a moment.');
	xhr.open("GET", "http://localhost:3000/tags/get_tags_json");//
	xhr.setRequestHeader('Content-Type', 'text/json');
	xhr.onload = function() {
		foldersData = eval(this.responseText);	
		for (i in foldersData) {
			folderRows.push(createFolderRow(foldersData[i].tag.name, foldersData[i].tag.id));
		}
		render();
	}	
	xhr.send();
}
