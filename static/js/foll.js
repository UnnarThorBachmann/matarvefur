'use strict';

var kommufall = function(t) {
  if (typeof t == "undefined") {
   return 'null';
 }
 else if (isNaN(t)){
 	return 'null';
 }
 else {
    return (t.toString()).replace('.',',');
 }
};

var manudir = {'1': 'Janúar', 
			   '2': 'Febrúar',
			   '3': 'Mars',
			   '4': 'Apríl',
			   '5': 'Maí',
			   '6': 'Júní',
			   '7': 'Júlí',
			   '8': 'Ágúst',
			   '9': 'September',
			   '10': 'Okctóber',
			   '11': 'Nóvember',
			   '12': 'Desember',
			   '01': 'Janúar', 
			   '02': 'Febrúar',
			   '03': 'Mars',
			   '04': 'Apríl',
			   '05': 'Maí',
			   '06': 'Júní',
			   '07': 'Júlí',
			   '08': 'Ágúst',
			   '09': 'September'};
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
    				    nr: 1,
    				    n: 1,
    				    hidden: '',
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

google.appengine.matarapp.enableAnchors = function() {
	var akkerin = document.getElementsByClassName("category");
	for (var i = 0; i < akkerin.length; i++) {
		var item = akkerin[i];
		item.addEventListener('click',function(item){
			return function() {
				var str_arr = item.id.split("-");
				var category = parseInt(str_arr[0]);
				var subcategory = parseInt(str_arr[1]);

				gapi.client.matarvefur.food_items_get({'category': category,
														'subcategory': subcategory}).execute(function(resp) {
				var node = document.getElementById("results");
				while (node.firstChild) {
    				node.removeChild(node.firstChild);
				}
				if (!resp.code && (typeof resp.items != 'undefined')) {
					var ret = "";
					for (var i=0; i < resp.items.length; i++) {
						var item = resp.items[i];
						var hidmidi;
						if (i==0) {
						 hidmidi = '';
						}
						else {
							hidmidi='hidden';
						}
						var template = _.template(naertafla);
    					ret += template({
    					nr: i+1,
    					n: resp.items.length,
    					hidden: hidmidi,
              			heiti: item['heiti'],
              			hitaeiningar: kommufall((37*item['fita'] + 17*item['protein'] + 17*item['kolvetni_alls']).toFixed(0)),
              			fita: kommufall(item['fita']),
              			protein: kommufall(item['protein']),
              			kolesterol: kommufall(item['kolestrol']),
              			kolvetni: kommufall(item['kolvetni_alls']),
              			a_vitamin_rj: kommufall(item['a_vitamin_rj']),
              			c_vitamin: kommufall(item['c_vitamin']),
              			kalk: kommufall(item['kalk']),
              			jarn: kommufall(item['jarn'])
    					}); 
					}
					ret += '<nav aria-label="takkabord"><ul class="pager"><li class="previous"><a href="#" id="prev"><span class="glyphicon glyphicon-triangle-left"></span></a></li><li class="next"><a href="#" id="next"><span class="glyphicon glyphicon-triangle-right"></span></a></li></ul></nav>';
					document.getElementById("results").innerHTML = ret;	
				    var thumbs = document.getElementsByClassName('thumbnail');

					var aftur = document.getElementById('prev');
					aftur.addEventListener('click', function(e) {
				    	var j;
				    	for (var i=0; i < thumbs.length; i++) {
				    		if (!thumbs[i].classList.contains('hidden')) {
				    			j = i
				    			break;
				    		}
				    	}
				    	thumbs[j].classList.add('hidden');
				    	j = j-1
				    	if (j < 0) {
				    		j = thumbs.length-1;
				    	}

				    	thumbs[j].classList.remove('hidden');
				    });

				    var fram = document.getElementById('next');
				    fram.addEventListener('click', function(e) {
				    	var j;
				    	for (var i=0; i < thumbs.length; i++) {
				    		if (!thumbs[i].classList.contains('hidden')) {
				    			j = i
				    			break;
				    		}
				    	}
				    	thumbs[j].classList.add('hidden');
				    	j = (j+1) % thumbs.length;
				    	thumbs[j].classList.remove('hidden');
				    });

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
			};
		}(item));
	}
};

google.appengine.matarapp.enableAnchors2 = function() {
	var flokkar = document.getElementsByClassName('flokkar');
	var uptakki = document.getElementById('up');
	uptakki.addEventListener('click', function(e){
		$('.collapse').collapse('hide');

		var j;
		for (var i = 0; i < flokkar.length; i++) {
			if(!flokkar[i].classList.contains('hidden')) {
				j = i;
			}
		}

		flokkar[j].classList.add('hidden');

		j = (j+1) % flokkar.length;
		flokkar[j].classList.remove('hidden');
	});
	var downtakki = document.getElementById('down');
	downtakki.addEventListener('click', function(e){
		$('.collapse').collapse('hide');


		var j;
		for (var i = 0; i < flokkar.length; i++) {
			if(!flokkar[i].classList.contains('hidden')) {
				j = i;
			}
		}
		flokkar[j].classList.add('hidden');

		j -= 1;
		if (j < 0) {
			j = flokkar.length-1;
		}
		flokkar[j].classList.remove('hidden');
	});


};

google.appengine.matarapp.setHeader = function() {
  var href_str = window.location.href.toString();
  var directories = href_str.split('/');
  var dags = directories[directories.length-1];
  var ymd = dags.split('-');
  if (ymd.length == 3) {
  	var dagur = ymd[2];
  	var manudur = ymd[1];
  	var ar = ymd[0];
  	if (dagur[0]=='0') {
  		dagur = dagur[1];
  	}
  	document.getElementById('dags').innerHTML = dagur + '. '+ manudir[manudur] + ' ' + ar;
  }
};
google.appengine.matarapp.init = function(apiRoot) {
	var apisToLoad;
	var callback = function() {
		if (--apisToLoad == 0) {
			google.appengine.matarapp.setHeader();
			google.appengine.matarapp.enableButton();
			google.appengine.matarapp.enableAnchors();
			google.appengine.matarapp.enableAnchors2();
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