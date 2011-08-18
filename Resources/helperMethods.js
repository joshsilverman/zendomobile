function replaceAll(txt, replace, with_this) {
  return txt.replace( new RegExp(replace, 'g'), with_this );
}

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}

function checkEmail(email) {
	// alert("Checking email");
	// TODO Regex check here or on server?
}

function checkPassword(password, confirmPassword) {
	// alert("Checking password");
}
