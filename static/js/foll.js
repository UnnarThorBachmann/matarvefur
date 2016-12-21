var google = google || {};

google.appengine = google.appengine || {};

google.appengine.matarapp = google.appengine.matarapp || {};

google.appengine.matarapp.hello = google.appengine.matarapp.hello || {};


google.appengine.matarapp.enableButton = function() {
	var valtakki = document.getElementById("skoda");
	valtakki.addEventListener('click', function(e) {
		var matur = document.getElementById("matarlistiInput");
		console.log(matur);
		gapi.client.matarvefur.food_item_get({'food_item_heiti': matur.value}).execute(function(resp) {
			var node = document.getElementById("food_item");
			while (node.firstChild) {
    			node.removeChild(node.firstChild);
			}
			if (!resp.code) {
				var food_item_div = document.getElementById("food_item");
				var naering_listi = document.createElement('ul');
				naering_listi.setAttribute('class','list-group');
				var naering_item = document.createElement('li');
				naering_item.setAttribute('class','list-group-item');
				naering_item.innerHTML ='<b>'+ resp.heiti+'</b>';
				naering_listi.append(naering_item);
				food_item_div.append(naering_listi);
				for (var property in resp) {
					if (!isNaN(resp[property])) {
					var naering_listi = document.createElement('ul');
					naering_listi.setAttribute('class','list-group');
					var naering_item = document.createElement('li');
					naering_item.setAttribute('class','list-group-item');
					naering_item.innerHTML = property;
					var span = document.createElement('span');
					span.setAttribute('class','badge');
					span.innerHTML = ((resp[property]).toString()).replace('.',',');
					naering_item.append(span);
					naering_listi.append(naering_item);
					food_item_div.append(naering_listi);
					}
				}
			}
			else {
				var food_item_div = document.getElementById("food_item");
				var naering_listi = document.createElement('ul');
				naering_listi.setAttribute('class','list-group');
				var naering_item = document.createElement('li');
				naering_item.setAttribute('class','list-group-item');
				naering_item.innerHTML ='<b>Fannst ekki í gagnagrunni</b>';
				naering_listi.append(naering_item);
				food_item_div.append(naering_listi);
			}
		});
	});
};

google.appengine.matarapp.init = function(apiRoot) {
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			google.appengine.matarapp.enableButton();
		}
	};
	apisToLoad = 1;
	gapi.client.load('matarvefur', 'v1', callback, apiRoot);
};