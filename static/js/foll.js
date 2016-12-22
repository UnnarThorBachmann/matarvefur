var kommufall = function(t) {
  if (typeof t == "undefined") {
   return '<óskilgreint>';
 }
 else if (isNaN(t)){
 	return '<óskilgreint>';
 }
 else {
    return (t.toString()).replace('.',',');
 }
};
var google = google || {};

google.appengine = google.appengine || {};

google.appengine.matarapp = google.appengine.matarapp || {};

google.appengine.matarapp.hello = google.appengine.matarapp.hello || {};


google.appengine.matarapp.enableButton = function() {
	var valtakki = document.getElementById("skoda");
	valtakki.addEventListener('click', function(e) {
		var matur = document.getElementById("matarlistiInput");
		gapi.client.matarvefur.food_item_get({'food_item_heiti': matur.value}).execute(function(resp) {
			var node = document.getElementById("results");
			while (node.firstChild) {
    			node.removeChild(node.firstChild);
			}
			if (!resp.code) {
				var template = _.template(naertafla);
    			document.getElementById("results").innerHTML = template({
              			heiti: resp['heiti'],
              			hitaeiningar: kommufall((37*resp['fita'] + 17*resp['protein'] + 17*resp['kolvetni_alls']).toFixed(0)),
              			fita: kommufall(resp['fita']),
              			protein: kommufall(resp['protein']),
              			kolesterol: kommufall(resp['kolestrol']),
              			kolvetni: kommufall(resp['kolvetni_alls']),
              			a_vitamin_rj: kommufall(resp['a_vitamin_rj']),
              			c_vitamin: kommufall(resp['c_vitamin']),
              			kalk: kommufall(resp['kalk']),
              			jarn: kommufall(resp['jarn'])
    			}); 
				/*
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
				}*/
			}
			else {
				var res = document.getElementById("results");
				var div_thumb = document.createElement('div');
				div_thumb.setAttribute('class','thumbnail');
				var div = document.createElement('div');
				div.setAttribute('class','caption');
				div.innerHTML='<h4><strong>Fannst ekki</strong></h4>';
				div_thumb.append(div);
				res.append(div_thumb);
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

/*
var flokkar = document.getElementsByClass('flokkar');
for (flokkur in flokkar) {
	flokkur.addEventListener('click', function (e) {
	  return function () {
		$(document).scrollTop("500");
	  }
	});
}*/