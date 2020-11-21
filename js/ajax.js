(function(window) {

	var ajaxUtils = {};

	ajaxUtils.sendGetRequest = 
	function(url, callback, isJson) {
		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
			handleResponse(request, callback, isJson);
		}

		request.open("GET", url, true)
		request.send(null);
	};

	function handleResponse(request, callback, isJson) {
		if ((request.readyState == 4) && (request.status == 200)) {
			if (isJson) {
				callback(JSON.parse(request.responseText));
			} else {
				callback(request);
			}
		}
	}

	window.ajaxUtils = ajaxUtils;
})(window);