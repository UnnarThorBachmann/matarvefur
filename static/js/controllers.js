'use strict';


var matarapp = matarapp || {};

matarapp.controllers = angular.module('matarappControllers', ['ui.bootstrap']);

matarapp.controllers.controller('SkraOgSkodaCtrl',
    function ($scope, $log, oauth2Provider,$cookieStore) {
        if ($cookieStore.get('consumption')) {
            $scope.consumption_days = $cookieStore.get('consumption').split(',');
        }
        else {
            $scope.consumption_days = [];   
        }

        

        $scope.days = [];
        $scope.months_number_dict = {0: 31, 1: 28, 2: 31, 3: 30, 4: 31, 5: 30, 6: 31, 7: 31, 8: 30, 9: 31, 10: 31, 11: 31};
        $scope.days_dict = {0: 'sunnudagur', 1:'mánudagur',2:'þriðjudagur',3:'miðvikudagur',4:'fimmtudagur', 5:'föstudagur',6:'laugardagur'};
        $scope.months_dict = {0: 'janúar', 1: 'febrúar', 2: 'mars', 3:'apríl', 4: 'maí', 5: 'júní', 6:'júlí',7: 'ágúst',8: 'september', 9:'október', 10:'nóvember',11:'desember'};
        $scope.fellaNeyslu = false;
        var d = new Date();
        $scope.currDay = {'vikudagur': $scope.days_dict[d.getDay()],
                          'manudur': $scope.months_dict[d.getMonth()],
                          'currday': true,
                          'manadardagur': d.getDate(),
                           'ar': d.getFullYear(),
        };
        var datestr = (d.getDate() < 10)? '0' + d.getDate().toString(): d.getDate().toString();
        $scope.currDateString = d.getFullYear().toString() + '-'+ (d.getMonth()+1).toString()+ '-' + datestr;

        $scope.compare = function (a,b) {
            if (a.manadardagur < b.manadardagur) {
                return -1;
            }
            else {
                return 1;
            }
        };

        $scope.setMonth = function (datestring) { 
            $scope.currDateString = datestring;
            var d = new Date(datestring);
            var i = d.getDate();
            var j = d.getDay();
            $scope.days = [];
            while (i > 1) {
                j -= 1;
                if (j < 0) {j = 6};
                i -= 1;

                var datestr2 = d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+(d.getMonth()+1).toString()):(d.getMonth()+1).toString()) + '-' + (i < 10? ('0'+i.toString()):i.toString());
                var dayDiv = $.inArray(datestr2.toString(),$scope.consumption_days) === -1 ?{} : {'background-color': '#F0F0F0'}; 

                $scope.days.push({'vikudagur': $scope.days_dict[j],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': i,
                              'currday': false,
                              'dayDiv': dayDiv,
                              'datestring': datestr2,
                              'ar': d.getFullYear()});
            }
            var datestr2 = d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+(d.getMonth()+1).toString()):(d.getMonth()+1).toString()) + '-' + (d.getDate() < 10? ('0'+d.getDate().toString()):d.getDate().toString());
            var dayDiv = $.inArray(datestr2,$scope.consumption_days) === -1 ?{'border-color': 'red'} : {'border-color': 'red', 'background-color': '#F0F0F0'}; 
            $scope.days.push({'vikudagur': $scope.days_dict[d.getDay()],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': d.getDate(),
                              'currday': false,
                              'dayDiv': dayDiv,
                              'datestring': datestr2,
                              'ar': d.getFullYear()
            });

            var i = d.getDate();
            var j = d.getDay();
            while (i < $scope.months_number_dict[d.getMonth()]) {
                j += 1;
                if (j > 6) {j = 0};
                i += 1;
                var datestr2 = d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+((d.getMonth()+1).toString())):(d.getMonth()+1).toString()) + '-' + (i < 10? ('0'+i.toString()):i.toString());
                var dayDiv = $.inArray(datestr2.toString(),$scope.consumption_days) === -1 ?{} : {'background-color': '#F0F0F0'}; 

                $scope.days.push({'vikudagur': $scope.days_dict[j],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': i,
                              'currday': false,
                              'dayDiv': dayDiv,
                              'datestring': datestr2,
                              'ar': d.getFullYear()});
            }
            $scope.days.sort($scope.compare);
            $scope.manudur = {'heiti': $scope.months_dict[d.getMonth()], 
                              'vikur': [],
                              'ar': d.getFullYear()
            };
            var viku_nr = 1
            var vd = [];
            for (var i = 0; i < $scope.days.length; i++) {
                if ($scope.days[i].vikudagur === 'mánudagur') {
                    if (viku_nr === 1) {
                        var left = (100*(7-parseFloat(vd.length))/parseFloat(7)).toString() + '%';
                    }
                    else { var left = '0%';}
                    viku_nr += 1;
                    $scope.manudur.vikur.push({'left': left, 'vd': vd,'right': '0%'});
                    vd = [];
                }
                $scope.days[i].vika = viku_nr;
                vd.push($scope.days[i]);
            }
            var right = (100*(7-parseFloat(vd.length))/parseFloat(7)).toString() + '%';

            $scope.manudur.vikur.push({'left': '0%','vd': vd,'right': right});

        };
        $scope.init = function() {   
           $scope.setMonth($scope.currDateString);
        };
        $scope.changeMonth = function (indicator) {
            var datestring = $scope.currDateString;
            var arfylki = datestring.split('-');
            var manudur = parseInt(arfylki[1]);
            var ar = parseInt(arfylki[0]);
            if (indicator === '+') {
                manudur += 1;
                if (manudur > 12) {
                    manudur = 1;
                    ar += 1;
                };
            }
            else {
               manudur -= 1;
                if (manudur < 1) {
                    manudur = 12;
                    ar -= 1;
                }; 
            }
            var manadarstr = (manudur < 10) ? '0'+ manudur.toString(): manudur.toString(); 
            datestring = ar.toString() + '-' + manadarstr +'-01';
            $scope.setMonth(datestring);
        };
        
    });

matarapp.controllers.controller('TolfraediCtrl', function ($scope,$cookieStore,$timeout, $log, oauth2Provider) {   
    $scope.init = function () {
        $(function() {$( "#datepicker1" ).datepicker({
                monthNames: [ "Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember" ],
                dayNamesMin: [ "Su", "Má", "Þr", "Mi", "Fi", "Fö", "La" ],
                dateFormat: 'yy-mm-dd'  
            })
        });
        $(function() {$( "#datepicker2" ).datepicker({
                monthNames: [ "Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember" ],
                dayNamesMin: [ "Su", "Má", "Þr", "Mi", "Fi", "Fö", "La" ],
                dateFormat: 'yy-mm-dd'    
            })
        });
        
    };   
    $scope.consumptionDays = {};
    $scope.showStats = false;
    $scope.faeduefnaheiti = ["a_vitamin_rj", "alfa_tokoferol", "alkohol", "b1_vitamin", "b2_vitamin", "b6_vitamin", "b_12_vitamin", "beta_karotin", "c_vitamin", "cis_einomettadar_fitusyrur", "cis_fjolomettadar_fitu_n_3_langar", "cis_fjolomettadar_fitusyrur", "d_vitamin", "e_vitamin_alfa_tj", "fita", "fluor", "folat_alls", "fosfor", "Hitaeiningar", "jarn", "jod", "kalium", "kalk", "kolestrol", "kolvetni_alls", "kopar", "magnesium", "mangan", "mettadar_fitusyrur", "natrium", "niasin", "niasin_jafngildi", "protein", "retinol", "selen", "sink", "steinefni_alls", "sykrur", "trans_fitusyrur", "trefjaefni", "vatn", "vidbaettur_sykur", "cis_fjolomettadar_fitusyrur_n_3", "cis_fjolomettadar_fitusyrur_n_6"];
    $scope.dagaheiti = [];
    $scope.nyttEfni = function () {
        var validEfni = document.getElementById('efnalisti').value;
        $scope.labelsData = [];
        $scope.gildin = [];
        for (var l in $scope.consumptionDays) {
                $scope.labelsData.push(l);
                var gildi = $scope.consumptionDays[l][validEfni];
                if (typeof gildi === 'undefined') {
                    $scope.gildin.push(0);
                }
                else {
                    $scope.gildin.push(gildi);
                }
                
                
        }
        
        $scope.barChartData =  {
                type: 'bar',
                data: {
                    labels: $scope.labelsData,
                    datasets: [{
                        label: validEfni,
                        data: $scope.gildin,       
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            };
        
        $scope.barChart.destroy();
        $scope.ctx = document.getElementById('sulurit').getContext('2d');
        $scope.barChart = new Chart($scope.ctx, $scope.barChartData);

    };
    $scope.nyrDagur = function () {
        var validEfni = document.getElementById('dagalisti').value;
        $scope.labelsData2 = [];
        $scope.gildin2 = [];
        var index = 0;
        for (var j in $scope.dagaheiti) {
            if ($scope.dagaheiti[j] === validEfni) {
                index = j;
                break;
            }        
        }
        var dags = $scope.consumptionDays[$scope.dagaheiti[index]];
        $scope.gildin2 = [dags['Fitueiningar'],dags['Proteineiningar'],dags['Kolvetniseiningar']];
        $scope.pieChartData = {
                type: 'pie',
                data: {
                    labels: [
                        "Fita",
                        "Prótein",
                        "Kolvetni"
                    ],
                    datasets: [
                    {
                        data: $scope.gildin2,
                        backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                        hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                        ]
                    }]
                }
            };
        $scope.pieChart.destroy();
        $scope.ctx2 = document.getElementById('kokurit').getContext('2d');
        $scope.pieChart = new Chart($scope.ctx2, $scope.pieChartData);
    };
    $scope.renderStatistics = function () {
            //Kokurit
            $scope.labelsData = [];
            $scope.gildin = []
            for (var l in $scope.consumptionDays) {
                $scope.labelsData.push(l);
                $scope.gildin.push($scope.consumptionDays[l]['Hitaeiningar']);
                
            }
            
            $scope.ctx = document.getElementById("sulurit");
            $scope.barChartData =  {
                type: 'bar',
                data: {
                    labels: $scope.labelsData,
                    datasets: [{
                        label: 'Hitaeiningar',
                        data: $scope.gildin,       
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            };
            $scope.barChart = new Chart($scope.ctx, $scope.barChartData);
            
            //Sulurit
            $scope.labelsData2 = [];
            $scope.gildin2 = []

            var dags = $scope.consumptionDays[$scope.dagaheiti[0]];
            $scope.gildin2 = [dags['Fitueiningar'],dags['Proteineiningar'],dags['Kolvetniseiningar']];
            $scope.ctx2 = document.getElementById("kokurit");
            $scope.pieChartData = {
                type: 'pie',
                data: {
                    labels: [
                        "Fita",
                        "Prótein",
                        "Kolvetni"
                    ],
                    datasets: [
                    {
                        data: $scope.gildin2,
                        backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                        hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                        ]
                    }]
                }
            };
            $scope.pieChart = new Chart($scope.ctx2, $scope.pieChartData);
           
            
    };
    $scope.reikna = function () {
        $scope.showStats = false;
        $scope.consumptionDays = {};
        var d1 = document.getElementById('datepicker1').value;
        var d2 = document.getElementById('datepicker2').value;
        if (d1 === '' ) {
            $scope.alertMessageFun('warning','Verður að velja fyrri dagsetningu.');
            $timeout($scope.removeAlertMessageFun,3000);
        }
        else if (d1 != '' && d2 != '') {
            var date1 = new Date(d1);
            var date2 = new Date(d2);
            
            if (date2 < date1) {
                $scope.alertMessageFun('warning','Fyrir dagsetningin verður að vera lægri.');
                $timeout($scope.removeAlertMessageFun,3000);
                return
            }
            else {
                gapi.client.matarvefur.get_food({
                    'user_email': $cookieStore.get('user_email'),
                    'dags1': d1,
                    'dags2': d2}).execute(function(resp) {           
                    if (!resp.code) {
                        $scope.$apply(function() {
                            if ((typeof resp.items === 'undefined') || resp.items.length === 0) {
                                var consumption = resp.items;
                                $scope.alertMessageFun('info','Engin neysla skráð.');
                                $timeout($scope.removeAlertMessageFun,3000);
                                return
                            }
                            else {
                                $scope.showStats = true;
                                for (var i in resp.items) {
                                    var magn = resp.items[i].size;
                                    var dagsetning = resp.items[i].dagsetning;
                                    if (!($scope.consumptionDays.hasOwnProperty(dagsetning))) {
                                        $scope.consumptionDays[dagsetning] = {}
                                        $scope.dagaheiti.push(dagsetning);
                                    }
                                    for (var property in resp.items[i].fooditemForm) {
                                        if (typeof resp.items[i].fooditemForm[property] === 'string') {
                                            continue;
                                        }

                                        if (!$scope.consumptionDays[dagsetning].hasOwnProperty(property)) {
                                            $scope.consumptionDays[dagsetning][property] = magn/100*resp.items[i].fooditemForm[property];
                                        }
                                        else {
                                            $scope.consumptionDays[dagsetning][property] += magn/100*resp.items[i].fooditemForm[property];
                                        }
                                    }
                                }
                                for (var item in $scope.consumptionDays) {
                                  $scope.consumptionDays[item]['Hitaeiningar'] = 4*$scope.consumptionDays[item]['protein']+4*$scope.consumptionDays[item]['kolvetni_alls']+9*$scope.consumptionDays[item]['fita'];
                                   $scope.consumptionDays[item]['Fitueiningar'] = 9*$scope.consumptionDays[item]['fita'];
                                   $scope.consumptionDays[item]['Fitueiningar'] = 9*$scope.consumptionDays[item]['fita'];
                                   $scope.consumptionDays[item]['Proteineiningar'] = 4*$scope.consumptionDays[item]['protein'];
                                   $scope.consumptionDays[item]['Kolvetniseiningar'] = 4*$scope.consumptionDays[item]['kolvetni_alls'];

                                }   
                                $scope.renderStatistics();
                            }
                            
                        
                        });
                    }
                    else {
                        console.log('error');
                    }
                });
            }
        }
        else {
           $scope.alertMessageFun('warning','Skil ekki.');
            $timeout($scope.removeAlertMessageFun,3000) 
        }

    };
    
});
matarapp.controllers.controller('SkraCtrl',
    function ($scope,$timeout, $cookieStore,$routeParams,oauth2Provider,foodItemsCache) {
    
    $scope.matartegundir = foodItemsCache.matartegundir; 
    $scope.matarflokkar = foodItemsCache.matarflokkar;
    $scope.matarflokkar_dict = foodItemsCache.matarflokkar_dict;
    $scope.mal = foodItemsCache.mal;
    $scope.miniFoodItems = [];

    $scope.searchedItems =[];
    $scope.fellt = false;
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
    $scope.neysluflokkun = {
        'Morgunmatur': [],
        'Morgunsnarl': [],
        'Hadegismatur': [],
        'Miðdegissnarl': [],
        'Kvoldmatur': [],
        'Kvoldsnarl': [],
        'Hitaeiningamagn': 0,
        'Fitueiningamagn': 0,
        'Proteineiningamagn': 0,
        'Kolvetniseiningamagn': 0
    };

    $scope.params = {};
    $scope.filterItem = {"nafn":"-1", "c1": -1, "c2": -1},
    $scope.showScaleButton = true;
    $scope.mini_items_searched = [];
    $scope.flokkahlekkir = document.getElementsByClassName('flokkar');
    $scope.init = function() {
        $scope.neyslaDagsins = [];

        $scope.dags = $routeParams.dags.slice(1,$routeParams.dags.length);
        $scope.datestring = $scope.dags;
        $scope.selectedSkammtur;
        var dags_array = $scope.dags.split('-');
    
        $scope.dagsetning = dags_array[2] +'. ' + manudir[dags_array[1]]+ ', ' + dags_array[0];
        $scope.nrVisible = 0;
        $scope.nrVisibleSearchedItem = 0;
        $scope.neyslaLoading();
        $scope.neysluflokkun = {
            'Morgunmatur': [],
            'Morgunsnarl': [],
            'Hadegismatur': [],
            'Middegissnarl': [],
            'Kvoldmatur': [],
            'Kvoldsnarl': [],
            'Hitaeiningamagn': 0,
            'Fitueiningamagn': 0,
            'Proteineiningamagn': 0,
            'Kolvetniseiningamagn': 0
        };
        if (gapi.client.matarvefur) {
            
            gapi.client.matarvefur.get_food({
                'user_email': $cookieStore.get('user_email'),
                'dags1': $scope.datestring,
                'dags2': $scope.datestring}).execute(function(resp) {           
                if (!resp.code) {
                    var timiDagsDict = {'Morgunmatur': 'Morgunmatur',
                            'Morgunsnarl': 'Morgunsnarl',
                            'Hadegismatur': 'Hádegismatur',
                            'Middegissnarl': 'Miðdegissnarl',
                            'Kvoldmatur': 'Kvöldmatur',
                            'Kvoldsnarl': 'Kvöldsnarl'
                    };
                    if (resp.items) {
                        $scope.$apply(function() {
                            for (var i = 0; i < resp.items.length; i++) {
                                var item = {};
                                item["index"] = $scope.neyslaDagsins.length;
                                item["nafn"] = resp.items[i].fooditemForm.heiti;
                                //item["nr"] = item.nr;
                                item["value"] = resp.items[i].size;
                                item["mal"] = timiDagsDict[resp.items[i].mal];
                                $scope.neyslaDagsins.push(item);   
                            }
                        });

                    }
                
                }
            });
            
        }


    };
    $scope.searchCat = function(c1,c2) {
        var c1 = parseInt($scope.matarflokkar_dict[c1]);
        var c2 = parseInt($scope.matarflokkar_dict[c2]);
        $scope.mini_items_searched = [];
        for (var i = 0; i < foodItemsCache.miniFoodItems.length; i++) {
            var item = foodItemsCache.miniFoodItems[i];
            item.value = 100;
        
            if (item.c1 === c1 && item.c2 === c2) {
                $scope.mini_items_searched.push(item);
            }
        }        
    };
    $scope.finnaNafn = function() {
        var nafn = document.getElementById("matarlistiInput").value;
        $scope.mini_items_searched = [];

        for (var i = 0; i < foodItemsCache.miniFoodItems.length; i++) {
            var item = foodItemsCache.miniFoodItems[i];
    
            item.value = 100;
            if (item["nafn"] === nafn) {
                $scope.mini_items_searched.push(item);
            }
        }      
    };
    $scope.velja = function(item) {

        var item_c = {};
        item_c["index"] = $scope.neyslaDagsins.length;
        item_c["nafn"] = item.nafn;
        item_c["nr"] = item.nr;
        item_c["value"] = item.value;
        item_c["mal"] = (item.mal) ? item.mal: "Morgunmatur";
        $scope.neyslaDagsins.push(item_c);
    };
    $scope.eyda = function(item) {
        var index = item.index;
        var l = $scope.neyslaDagsins.length;

        for (var i = index+1; i < l; i++) {
            $scope.neyslaDagsins[i].index -= 1;
        }

        $scope.neyslaDagsins.splice(index,1);

        
    };
    $scope.vista = function() {
        var timiDagsDict = {'Morgunmatur': 'Morgunmatur',
                            'Morgunsnarl': 'Morgunsnarl',
                            'Hádegismatur': 'Hadegismatur',
                            'Miðdegissnarl': 'Middegissnarl',
                            'Kvöldmatur': 'Kvoldmatur',
                            'Kvöldsnarl': 'Kvoldsnarl'
        };
        
        $scope.vistaLoading();
        if (gapi.client.matarvefur) {
            var push_items = [{'heiti': 'SKYR','size': 30,'mal': 'Morgunmatur'}];
            for (var i = 0; i < $scope.neyslaDagsins.length; i++) {
                var item = {};
                item.heiti = $scope.neyslaDagsins[i].nafn;
                item.size = $scope.neyslaDagsins[i].value;
                item.mal = timiDagsDict[$scope.neyslaDagsins[i].mal];
                push_items.push(item);
            }
            var temp = $cookieStore.get('consumption')
            temp += $scope.datestring;
            temp += ",";
            $cookieStore.put('consumption',temp);
            gapi.client.matarvefur.put_foods({'user_email': $cookieStore.get('user_email'),
                'dags': $scope.datestring,
                'items': JSON.stringify(push_items)}).execute(function(resp) {
                 //$scope.$apply(function () {    
                    if (!resp.code) {
                        $timeout($scope.removeAlertMessageFun,2000); 
                    }
                    else {
                         $scope.alertMessageFun('danger', 'Mistókst að skrá fæðu.');      
                    }
                //});
            });   
            $scope.finishedVistaLoading();
            
        }
    };

    /*
    $scope.collapse = function (nr) {
        $('#fl'+ nr.toString()).collapse('toggle');
    };
    $scope.isVisible = function(nr) {
        return (nr === $scope.nrVisible);
    };
    $scope.isVisibleSearched = function(nr) {
        return (nr === $scope.nrVisibleSearchedItem);
    };
    $scope.fletta = function (indicator) {
        if (indicator === '+') {
            $scope.nrVisible += 1;
            if ($scope.nrVisible > 16) {
                $scope.nrVisible = 0;
            }       
        }
        else {
            $scope.nrVisible -= 1;
            if ($scope.nrVisible < 0) {
                $scope.nrVisible = 16;
            } 
        }
    };
    $scope.finnaMat = function () {
        var matur = document.getElementById("matarlistiInput").value;
        $scope.searchedItems = [];
        $scope.searchLoading();
        gapi.client.matarvefur.food_item_get({'food_item_heiti': matur}).execute(function(resp) {
            $scope.$apply(function () {
                if (!resp.code) {
                    $scope.finishedLoading();
                    $scope.searchedItems.push(resp);  
                }
                else {
                  $scope.finishedLoading();
                  $scope.alertMessageFun('danger', 'Fannst ekki');  
                  
                }
            });
        });
        $timeout($scope.removeAlertMessageFun,3000);
    };
    $scope.fella = function () {
        $scope.fellt = !$scope.fellt;
    };
    $scope.finnaFlokka = function (c1,c2) {
       $scope.searchedItems = [];
       $scope.loadingFlokkar(); 
       if (gapi.client.matarvefur) { 
            gapi.client.matarvefur.food_items_get({'category': c1,
                                              'subcategory': c2}).execute(function(resp) {
                $scope.$apply(function () {
                    if (!resp.code) {
                        $scope.searchedItems = resp.items;  
                        $scope.finishedLoadingFlokkar();
                    }
                    else {

                    }
                });
            });
        }
    };
    $scope.flettaSearched = function(indicator) {
        if (indicator === '+') {
            $scope.nrVisibleSearchedItem += 1;
            if ($scope.nrVisibleSearchedItem >= $scope.searchedItems.length) {
                $scope.nrVisibleSearchedItem = 0;
            }
        }
        else {
            $scope.nrVisibleSearchedItem -= 1;
            if ($scope.nrVisibleSearchedItem < 0) {
                $scope.nrVisibleSearchedItem = $scope.searchedItems.length-1;
            }

        }
    };
    $scope.velja = function (heiti) {
        var magn = document.getElementById('magn').value;
        var timiDagsDict = {'Morgunmatur': 'Morgunmatur',
                            'Morgunsnarl': 'Morgunsnarl',
                            'Hádegismatur': 'Hadegismatur',
                            'Miðdegissnarl': 'Middegissnarl',
                            'Kvöldmatur': 'Kvoldmatur',
                            'Kvöldsnarl': 'Kvoldsnarl'
        };

                            
        magn = magn.replace(',','.');
        if (isNaN(magn) || parseFloat(magn) <= 0) {
            $scope.alertMessageFun('danger', 'Magn verður að vera jákvæð tala.');      
            $timeout($scope.removeAlertMessageFun,3000);
        }
        else {
            var timiDags = timiDagsDict[document.getElementById('timiDags').value];
            $scope.veljaLoading();
            gapi.client.matarvefur.put_food({'size': magn,
                'user_email': $cookieStore.get('user_email'),
                'food_item_heiti': heiti,
                'mal': timiDags,
                'dags': $scope.datestring}).execute(function(resp) {
                 $scope.$apply(function () {    
                    if (!resp.code) {
                        $scope.neysluflokkun[resp.mal].push({
                            'heiti':resp.fooditemForm.heiti,
                            'orka': (9*parseFloat(resp.fooditemForm.fita)+ 4*parseFloat(resp.fooditemForm.protein)+4*parseFloat(resp.fooditemForm.kolvetni_alls))*resp.size/100,
                            'magn': resp.size,
                            'fita': resp.fooditemForm.fita,
                            'protein': resp.fooditemForm.protein,
                            'kolvetni': resp.fooditemForm.kolvetni_all     
                        });
                        $scope.neysluflokkun[resp.mal]['Fitueiningamagn'] += 9*parseFloat(resp.fooditemForm.fita)*resp.size/100;
                        $scope.neysluflokkun[resp.mal]['Proteineiningamagn'] += 4*parseFloat(resp.fooditemForm.protein)*resp.size/100;
                        $scope.neysluflokkun[resp.mal]['Kolvetniseiningamagn'] += 4*parseFloat(resp.fooditemForm.kolvetni_alls)*resp.size/100;
                        $scope.neysluflokkun[resp.mal]['Hitaeiningamagn'] += $scope.neysluflokkun['Fitueiningamagn'];
                        $scope.neysluflokkun[resp.mal]['Hitaeiningamagn'] += $scope.neysluflokkun['Proteineiningamagn'];
                        $scope.neysluflokkun[resp.mal]['Hitaeiningamagn'] += $scope.neysluflokkun['Kolvetniseiningamagn'];
                        $scope.alertMessageFun('success', 'Fæða skráð.');      
                        var temp = $cookieStore.get('consumption')
                        temp += $scope.datestring;
                        temp += ",";
                        $cookieStore.put('consumption',temp);
                        //$scope.consumption_days.push($scope.datestring); 


                        $timeout($scope.removeAlertMessageFun,2000); 
                    }
                    else {
                         $scope.alertMessageFun('danger', 'Mistókst að skrá fæðu.');      
                        $timeout($scope.removeAlertMessageFun,2000); 
                    }
                });
            });   
            $scope.finishedVeljaLoading();
            
        }

    };
    $scope.neysla = function () {

        $scope.neyslaLoading();
        $scope.neysluflokkun = {
            'Morgunmatur': [],
            'Morgunsnarl': [],
            'Hadegismatur': [],
            'Middegissnarl': [],
            'Kvoldmatur': [],
            'Kvoldsnarl': [],
            'Hitaeiningamagn': 0,
            'Fitueiningamagn': 0,
            'Proteineiningamagn': 0,
            'Kolvetniseiningamagn': 0
        };
        gapi.client.matarvefur.get_food({
            'user_email': $cookieStore.get('user_email'),
            'dags1': $scope.datestring,
            'dags2': $scope.datestring}).execute(function(resp) {           
                if (!resp.code) {
                    
                    $scope.$apply(function() {
                        var consumption = resp.items;
                        if (consumption && consumption.length > 0) {
                            $scope.showScaleButton = false; 
                        
                            for (var i = 0; i < consumption.length; i++) {
                                var item = consumption[i];
                                $scope.neysluflokkun[item.mal].push(
                                {'heiti':item.fooditemForm.heiti,
                                    'orka': (9*parseFloat(item.fooditemForm.fita)+ 4*parseFloat(item.fooditemForm.protein)+9*parseFloat(item.fooditemForm.kolvetni_alls))*item.size/100,
                                    'magn': item.size,
                                    'fita': item.fooditemForm.fita,
                                    'protein': item.fooditemForm.protein,
                                    'kolvetni': item.fooditemForm.kolvetni_all     
                                    }
                                );
                                $scope.neysluflokkun['Fitueiningamagn'] += 9*parseFloat(item.fooditemForm.fita)*item.size/100;
                                $scope.neysluflokkun['Proteineiningamagn'] += 4*parseFloat(item.fooditemForm.protein)*item.size/100;
                                $scope.neysluflokkun['Kolvetniseiningamagn'] += 4*parseFloat(item.fooditemForm.kolvetni_alls)*item.size/100;
                            }
                            $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Fitueiningamagn'];
                            $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Proteineiningamagn'];
                            $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Kolvetniseiningamagn'];
                            $scope.fellaNeyslu = true;
                        }
                        else {
                            $scope.alertMessageFun('info','Ekkert hefur verið srkáð');
                            $timeout($scope.removeAlertMessageFun,2000);
                            $scope.showScaleButton = true; 
                            return 
                        }   

                    });
                }
                else {
                    console.log('error');
                }
            });
        
        $scope.finishedNeyslaLoading();
        
    };
    */
});
/*
matarapp.controllers.controller('MinFaeduTegundCtrl', function ($scope, $timeout,$location, oauth2Provider) {
    $scope.minFaedutegundValin = {};
    $scope.foodKeys = { 'heiti': {'nafn': 'Heiti', 
                                    'isTala': false}
                        'name': 'Enskt-heiti',
                        'ediblePortion': 'Ætur-hluti',
                        'foodGroup1': 'Fæðuflokkur',
                        'foodGroup2': 'Undirflokkur',
                        'protein': 'Prótein',
                        'fita': 'Fita',
                        'mettadar_fitusyrur': 'Mettaðar-fitusýrur',
                        'cis_einomettadar_fitusyrur': 'cis-Einómettaðar-fitusýrur',
                        'cis_fjolomettadar_fitusyrur': 'cis-Fjölómettaðar-fitusýrur',
                        'cis_fjolomettadar_fitu_n_3_langar': 'cis-Fjölómettaðar-fitu-n-3-langar',
                        'trans_fitusyrur': 'trans-Fitusýrur',
                        'kolestrol':'Kólesteról',
                        'kolvetni_alls': 'Kolvetni-alls',
                        'sykrur':'Sykrur',
                        'vidbaettur_sykur': 'Viðbættur-sykur',
                        'trefjaefni': 'Trefjaefni',
                        'alkohol': 'Alkóhól ' ,
                        'steinefni_alls': 'Steinefni-alls',
                        'vatn': 'Vatn',
                        'a_vitamin_rj': 'A-vítamín-RJ',
                        'retinol': 'Retinol',
                        'beta_karotin': 'Beta-karótín',
                        'd_vitamin': 'D-vítamín',
                        'e_vitamin_alfa_tj': 'E-vítamín-alfa-TJ',
                        'alfa_tokoferol': 'Alfa-tókóferol',
                        'b1_vitamin': 'B1-vítamín',
                        'b2_vitamin': 'B2-vítamín',
                        'niasin_jafngildi': 'Níasín-jafngildi',
                        'niasin': 'Níasín',
                        'b6_vitamin': 'B6-vítamín',
                        'folat_alls': 'Fólat-alls',
                        'b_12_vitamin': 'B-12-vítamín',
                        'c_vitamin': 'C-vítamín',
                        'kalk': 'Kalk',
                        'fosfor': 'Fosfór',
                        'magnesium': 'Magnesíum',
                        'natrium': 'Natríum',
                        'kalium': 'Kalíum',
                        'jarn': 'Járn',
                        'sink': 'Sink',
                        'kopar': 'Kopar',
                        'jod': 'Joð',
                        'mangan': 'Mangan',
                        'selen': 'Selen',
                        'fluor': 'Flúor',
                        'cis_fjolomettadar_fitusyrur_n_6': 'cis-Fjölóm-fitus-n-6',
                        'cis_fjolomettadar_fitusyrur_n_3': 'cis-Fjölóm-fitus-n-3'
    };
    $scope.skra = function () {
        for (var key in $scope.foodKeys) {
            console.log(document.getElementById(key).value);
        }
    };

});
*/
matarapp.controllers.controller('RootCtrl', function ($cookieStore,$scope, $timeout,$location,oauth2Provider) {

    $scope.alertStatus = 'warning';
    $scope.alerting = false;
    $scope.alertMessage = '';
    $scope.user_name = '';
    $scope.user_email = '';
    $scope.minarFaedutegundir = [];

    $scope.isActive = function (viewLocation) {

        return viewLocation === $location.path();
    };

    $scope.getSignedInState = function () {
        
        var kaka = $cookieStore.get('signedin');
        return (oauth2Provider.signedIn || !(typeof kaka === 'undefined'));//|| $cookies.get('signedin') === 'true');
    };

    $scope.signIn = function () {
        oauth2Provider.signIn(function () {
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    if (!resp.code) {
                        oauth2Provider.user = resp.name;

                        $scope.alertMessageFun('info','Augnablik');
                        oauth2Provider.signedIn = true;
                        $cookieStore.put('signedin','true');
                        $scope.user_name = resp.name;
                        $scope.user_email = resp.email;
                        $cookieStore.put('user_email',resp.email);

                        $cookieStore.put('user_name',resp.name);
                        $scope.alertMessageFun('success','Velkomin(n), '+ $scope.user_name +' !')
                        $timeout($scope.removeAlertMessageFun,3000);
                        if (gapi.client.matarvefur) {
                            gapi.client.matarvefur.create_user_if_not_exists({'user_name': $cookieStore.get('user_name'),'user_email':$cookieStore.get('user_email')}).execute(function(resp) {
                                if (!resp.code) {
                                    var cd_temp = '';
                                    for (var i = 0; i < resp.consumption_days.length; i++) {
                                        cd_temp += resp.consumption_days[i];
                                        cd_temp += ',';
                                    }

                                    $cookieStore.put('consumption',cd_temp);
                                }
                                else {
                            
                                }
                            }); 
                        }  
                    }
                    else {
                        $scope.alertMessageFun('danger','Innskráning mistókst.');
                        $timeout($scope.removeAlertMessageFun,3000)   
                    }
                });
                
            });//end of client function call.
        });// end of oauth function call
        
                           
    };// end of method

    $scope.initSignInButton = function () {
        gapi.signin.render('signInButton', {
            'callback': function () {
                jQuery('#signInButton button').attr('disabled', 'true').css('cursor', 'default');
                if (gapi.auth.getToken() && gapi.auth.getToken().access_token) {
                    $scope.$apply(function () {
                        oauth2Provider.signedIn = true;
                    });
                }
            },
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': oauth2Provider.SCOPES
        });
    };

    $scope.signOut = function () {
        
        oauth2Provider.signOut();
        $cookieStore.remove('signedin');
        $cookieStore.remove('user_email');
        $cookieStore.remove('user_name');
        $cookieStore.remove('consumption');
        $location.path('/');
        $scope.alertMessageFun('success','Þú ert útskráður ' + $scope.user_name + '.')
        $timeout($scope.removeAlertMessageFun,3000);
        $scope.user_name = '';
        $scope.user_email = '';
    };

    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };
    $scope.searchLoading = function () {
        angular.element($('#skoda').button('loading'));
    };
    $scope.loadingFlokkar = function () {
        angular.element($('.flokkar2').button('loading'));
    };
    $scope.finishedLoading = function () {
        angular.element($('#skoda').button('reset'));
    };
    $scope.finishedLoadingFlokkar = function () {
        angular.element($('.flokkar2').button('reset'));
    };
    $scope.vistaLoading = function () {
        angular.element($('#vista').button('loading'));
    };
    $scope.finishedVistaLoading = function () {
        angular.element($('#vista').button('reset'));
    };
    $scope.neyslaLoading = function () {
        angular.element($('#neysluflokkun').button('loading'));
    };
    $scope.finishedNeyslaLoading = function () {
        angular.element($('#neysluflokkun').button('reset'));
    };
    
    $scope.alertMessageFun = function(status,warning) {
        $scope.alertClass = status;
        $scope.alerting = true;
        $scope.alertMessage = warning;
        
    };
    $scope.removeAlertMessageFun = function () {
        $scope.alertClass = status;
        $scope.alerting = false;
    }
    $scope.getAlertState = function () {
        return $scope.alerting;
    }

});
