'use strict';


var matarapp = matarapp || {};

matarapp.controllers = angular.module('matarappControllers', ['ui.bootstrap']);

matarapp.controllers.controller('SkraOgSkodaCtrl',
    function ($scope, $log, oauth2Provider) {
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
                $scope.days.push({'vikudagur': $scope.days_dict[j],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': i,
                              'currday': false,
                              'datestring': d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+(d.getMonth()+1).toString()):(d.getMonth()+1).toString()) + '-' + (i < 10? ('0'+i.toString()):i.toString()),
                              'ar': d.getFullYear()});
            }

            $scope.days.push({'vikudagur': $scope.days_dict[d.getDay()],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': d.getDate(),
                              'currday': false,
                              'datestring': d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+(d.getMonth()+1).toString()):(d.getMonth()+1).toString()) + '-' + (d.getDate() < 10? ('0'+d.getDate().toString()):d.getDate().toString()),
                              'ar': d.getFullYear()
            });

            var i = d.getDate();
            var j = d.getDay();
            while (i < $scope.months_number_dict[d.getMonth()]) {
                j += 1;
                if (j > 6) {j = 0};
                i += 1;
                $scope.days.push({'vikudagur': $scope.days_dict[j],
                              'manudur': $scope.months_dict[d.getMonth()],
                              'manadardagur': i,
                              'currday': false,
                              'datestring': d.getFullYear().toString()+ '-' + (d.getMonth() < 9?('0'+((d.getMonth()+1).toString())):(d.getMonth()+1).toString()) + '-' + (i < 10? ('0'+i.toString()):i.toString()),
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

matarapp.controllers.controller('TolfraediCtrl', function ($scope, $log, oauth2Provider) {   
 $scope.init = function () {
    $(function() {$( "#datepicker1" ).datepicker({
        monthNames: [ "Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember" ],
          dayNamesMin: [ "Su", "Má", "Þr", "Mi", "Fi", "Fö", "La" ]  
        })
    });
    $(function() {$( "#datepicker2" ).datepicker({
        monthNames: [ "Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember" ],
          dayNamesMin: [ "Su", "Má", "Þr", "Mi", "Fi", "Fö", "La" ]  
        })
    });
 };   


});
matarapp.controllers.controller('SkraCtrl',
    function ($scope,$timeout, $cookieStore,$routeParams,oauth2Provider) {
    var dags = $routeParams.dags;
    dags = dags.slice(1,dags.length);
    $scope.datestring = dags;
    var dags_array = dags.split('-');
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
    $scope.dagsetning = dags_array[2] +'. ' + manudir[dags_array[1]]+ ', ' + dags_array[0];
    $scope.nrVisible = 0;
    $scope.nrVisibleSearchedItem = 0;
    $scope.matartegundir = ['AB - MJÓLK','AB - MJÓLK, létt','ABT - MJÓLK, hrein',
                            "ABT - MJÓLK, með berjum og múslí",
                            "ABT - MJÓLK, með múslí",
                            "ABT-mjólk, m jarðarb, múslí, fitu- og sykurskert",
                            "ABT-mjólk, m áv, berjum og múslí, fituskert",
                            "ANANAS, hrár",
                            "ANANAS, niðursoðinn",
                            "ANANASSAFI, hreinn",
                            "APPELSÍNUR",
                            "APPELSÍNUSAFI, hreinn",
                            "APPELSÍNUÞYKKNI",
                            "APRÍKÓSUR",
                            "APRÍKÓSUR, niðursoðnar",
                            "APRÍKÓSUR, þurrkaðar",
                            "AVÓKADÓ",
                            "AVÓKADÓMAUK",
                            "AÐALBLÁBER",
                            "AÐALBLÁBERJASAFT",
                            "AÐALBLÁBERJASULTA",
                            "BAKA, grænmetisbaka",
                            "BAKA, með nautakjöti",
                            "BAKA, með rækjum og beikoni",
                            "BAKA, ostabaka með grænmeti",
                            "BAKA, ostabaka, m/ skinku",
                            "BAKA, ostabaka, m/ spergilkáli",
                            "BAKA, saltfiskbaka",
                            "BANANAR",
                            "BAUNABÚÐINGUR",
                            "BAUNASPÍRUR, sojabauna-, hrár",
                            "BAUNIR, grænar, hráar",
                            "BAUNIR, grænar, hráar, frystar",
                            "BAUNIR, grænar, niðursoðnar",
                            "BAUNIR, gular, soðnar",
                            "BAUNIR, gular, þurrkaðar",
                            "BAUNIR, hvítar, niðursoðnar, í tómatsósu",
                            "BAUNIR, hvítar, þurrkaðar",
                            "BAUNIR, kjúklingabaunir, soðnar",
                            "BAUNIR, linsubaunir, soðnar",
                            "BAUNIR, linsubaunir, þurrkaðar",
                            "BAUNIR, rauðar nýrnab., þurrkaðar",
                            "BAUNIR, rauðar nýrnabaunir, soðnar",
                            "BAUNIR, sojabaunir, soðnar",
                            "BAUNIR, sojabaunir, þurrkaðar",
                            "BAUTAR, með nautahakki",
                            "BEIKON, hrátt",
                            "BEIKON, steikt",
                            "BENECOL, með ávöxtum, sykurskert",
                            "BEYGLUR",
                            "BIRKIFRÆ",
                            "BIXIMATUR, steiktur",
                            "BJÓR, 3,8% alkóhól af rúmmáli",
                            "BJÓR, 4,5% alkóhól af rúmmáli",
                            "BJÓR, 5% alkóhól af rúmmáli",
                            "BJÓR, 5,6% alkóhól af rúmmáli",
                            "BJÓR, Lite, 4,4% alkóhól af rúmmáli",
                            "BJÓR, sykurskertur",
                            "BJÓR, án alkóhóls",
                            "BLAÐLAUKUR, hrár",
                            "BLEIKJA, eldisbleikja, hrá",
                            "BLEIKJA, reykt",
                            "BLEIKJA, vatnableikja, hrá",
                            "BLÁBER, innflutt",
                            "BLÁBER, íslensk",
                            "BLÁLANGA, hrá",
                            "BLÓMKÁL, hrátt",
                            "BLÓMKÁL, soðið",
                            "BLÓÐMÖR, soðinn",
                            "BLÓÐMÖR, soðinn, súrsaður",
                            "BORÐSMJÖRLÍKI, 40% fita, Sólblóma",
                            "BORÐSMJÖRLÍKI, 40% fita, meðaltal",
                            "BORÐSMJÖRLÍKI, 40%, Lätta",
                            "BORÐSMJÖRLÍKI, 40%, Lína og Smyrill",
                            "BORÐSMJÖRLÍKI, 65% fita, Sólblóma",
                            "BORÐSMJÖRLÍKI, 80% fita, fiskfita",
                            "BORÐSMJÖRLÍKI, 80% fita, jurtafita",
                            "BORÐSMJÖRLÍKI, Bertolli",
                            "BORÐSMJÖRLÍKI, Flora proactive",
                            "BORÐSMJÖRLÍKI, Plús-3",
                            "BORÐSMJÖRLÍKI, Smyrill",
                            "BORÐSMJÖRLÍKI, Smyrja",
                            "BRAUÐ, Heimilisbrauð, Myllan",
                            "BRAUÐ, byggbrauð",
                            "BRAUÐ, byggbrauð, Eyrarbrauð",
                            "BRAUÐ, dökk hveitibrauð",
                            "BRAUÐ, döðlubrauð",
                            "BRAUÐ, fittybrauð",
                            "BRAUÐ, fjölkornabrauð",
                            "BRAUÐ, franskbrauð",
                            "BRAUÐ, hafrabrauð",
                            "BRAUÐ, hamborgarabrauð",
                            "BRAUÐ, heilhveitibrauð",
                            "BRAUÐ, hvítlauksbrauð",
                            "BRAUÐ, maltbrauð",
                            "BRAUÐ, pylsubrauð",
                            "BRAUÐ, pólarbrauð, Extrem",
                            "BRAUÐ, rúgbrauð, danskt",
                            "BRAUÐ, rúgbrauð, seytt",
                            "BRAUÐ, sigtibrauð",
                            "BRAUÐ, sojabrauð",
                            "BRAUÐ, speltbrauð",
                            "BRAUÐ, sólkjarnabrauð",
                            "BRAUÐ, trefjaríkt, með hveitiklíði, 7,5% trefjar",
                            "BRAUÐ, ítölsk, Ciabatta",
                            "BRAUÐ, ítölsk, meðalsamsetn.",
                            "BRAUÐ, ítölsk, tómatbrauð",
                            "BRAUÐ, ítölsk, ólífubrauð",
                            "BRAUÐSAMLOKA, Subway, með grænmeti, kjöti og osti, án sósu",
                            "BRAUÐSAMLOKA, með grænmeti, eggi og majonesi",
                            "BRAUÐSAMLOKA, með hangikjöti og baunasalati",
                            "BRAUÐSAMLOKA, með roastbeef, lauk og majonesi",
                            "BRAUÐSAMLOKA, með rækjusalati",
                            "BRAUÐSAMLOKA, með skinku, osti og majonesi",
                            "BRAUÐSTANGIR, frá pítsustöðum",
                            "BRAUÐTERTA, m. rækjusalati",
                            "BRAUÐTERTA, m. skinku og osti",
                            "BRENNIVÍN",
                            "BRINGUKOLLAR, soðnir, súrsaðir",
                            "BRJÓSTSYKUR",
                            "BRJÓSTSYKUR, fylltur",
                            "BRODDMJÓLK, þynnt",
                            "BRÚNKAKA (formkaka)",
                            "BRÚNTERTA (brún lagkaka)",
                            "BURRITO, hveititortilla m. fyllingu",
                            "BYGG, afhýtt",
                            "BYGG, afhýtt, soðið",
                            "BYGGHÝÐISMJÖL",
                            "BYGGMJÖL",
                            "BÆTIEFNI, B-vítamín, BioMega",
                            "BÆTIEFNI, B-vítamín, Líf hf",
                            "BÆTIEFNI, B-vítamín, Lýsi hf.",
                            "BÆTIEFNI, C-vítamín, 0,5 g",
                            "BÆTIEFNI, C-vítamín, 1 g",
                            "BÆTIEFNI, C-vítamín, 100 mg",
                            "BÆTIEFNI, D-vítamín, 10 ug",
                            "BÆTIEFNI, E-vítamín, 200 ae=134mg",
                            "BÆTIEFNI, E-vítamín, 200 mg",
                            "BÆTIEFNI, E-vítamín, 500 ae=336mg",
                            "BÆTIEFNI, E-vítamín, 500 mg",
                            "BÆTIEFNI, Heilsutvenna, fjölvítamínhylki",
                            "BÆTIEFNI, Magnamín",
                            "BÆTIEFNI, S3 Sportþrenna, fjölvítamíntafla",
                            "BÆTIEFNI, beta-karótín, 9 mg",
                            "BÆTIEFNI, fjölvítamvökvi, Frískamín",
                            "BÆTIEFNI, fjölvítamín, Fjörafl",
                            "BÆTIEFNI, fjölvítamín, Vitamineral",
                            "BÆTIEFNI, fjölvítamín, Vítamínus",
                            "BÆTIEFNI, fjölvítamín, Vítaplús",
                            "BÆTIEFNI, fjölvítamín, án A og D vítamína, Táp",
                            "BÆTIEFNI, fjölvítamín, án AD, Lýsi",
                            "BÆTIEFNI, fólasín, 400 ug",
                            "BÆTIEFNI, hákarlalýsisperlur",
                            "BÆTIEFNI, jurtaolía, Udo olía 3-6-9",
                            "BÆTIEFNI, járntöflur 20 mg, með C-vítamíni",
                            "BÆTIEFNI, járntöflur, 100 mg",
                            "BÆTIEFNI, kalktöflur, 400 mg",
                            "BÆTIEFNI, kalktöflur, 500 mg",
                            "BÆTIEFNI, lúðulýsisperlur",
                            "BÆTIEFNI, lýsi og liðamín, liðamíntafla",
                            "BÆTIEFNI, omega-3 hylki, 1000 mg",
                            "BÆTIEFNI, omega-3 hylki, 280 mg",
                            "BÆTIEFNI, omega-3 hylki,1000mg+D",
                            "BÆTIEFNI, omega-3, hylki, 500 mg",
                            "BÆTIEFNI, selen, 50 ug",
                            "BÆTIEFNI, þorskalýsisperlur",
                            "BÍÓMJÓLK, m vanillu, sykurskert",
                            "BÍÓMJÓLK, ávaxta-",
                            "BÓKHVEITI",
                            "BÚÐINGSDUFT",
                            "DILL, þurrkað",
                            "DREITILL, mjólkurdrykkur, D vítamínbættur",
                            "DUFT Í KAFFI",
                            "DÖÐLUBOTN",
                            "DÖÐLUKAKA",
                            "DÖÐLUR, þurrkaðar",
                            "EDIK",
                            "EGG, fýlsegg, hrá",
                            "EGG, hettumáfsegg, hrá",
                            "EGG, hænuegg, hrá",
                            "EGG, hænuegg, soðin",
                            "EGG, hænuegg, steikt",
                            "EGG, svartbaksegg, hrá",
                            "EGG, svartfuglsegg, hrá",
                            "EGG, sílamáfsegg, hrá",
                            "EGGALDIN, hrá",
                            "EGGALDIN, steikt",
                            "EGGJADUFT",
                            "EGGJAHVÍTUR, hænu-, hráar",
                            "EGGJAKAKA",
                            "EGGJAKAKA, frauðeggjakaka",
                            "EGGJAKREM",
                            "EGGJARAUÐUR, hænu-, hráar",
                            "ENDUR, kjöt án skinns, hrátt",
                            "ENGIFERDRYKKUR, My Secret",
                            "ENGJAÞYKKNI, m berjum og morgunkorni",
                            "ENGJAÞYKKNI, m morgunkorni",
                            "ENGJAÞYKKNI, m súkkulaðikornflögum",
                            "EPLABAKA",
                            "EPLAKAKA",
                            "EPLASAFI, hreinn",
                            "EPLASÍDER",
                            "EPLI",
                            "EPLI, þurrkuð",
                            "FEITI, hert lýsi",
                            "FEITI, hert sojaolía",
                            "FEITI, steikingafeiti, Hafmín",
                            "FEITI, steikingafeiti, KEA",
                            "FEITI, steikingafeiti, Palmín",
                            "FEITI, steikingafeiti, meðalsamsetning 2010",
                            "FEITI, steikingafeiti, meðalt. 1998",
                            "FERSKJUR",
                            "FISKBAKSTUR, ofnbakaður",
                            "FISKBOLLUR, með gulrótum og kartöflum, 1944 réttur",
                            "FISKBOLLUR, niðursoðnar",
                            "FISKBÚÐINGUR, niðursoðinn",
                            "FISKBÚÐINGUR, steiktur",
                            "FISKFARS, hrátt",
                            "FISKKÖKUR, með brauðmylsnu",
                            "FISKPATE",
                            "FISKPOTTUR MEÐ GRÆNMETI",
                            "FISKRÚLLUR",
                            "FISMJÓLK, með ávöxtum",
                            "FJALLAGRÖS",
                            "FJÖRMJÓLK, D vítamínbætt",
                            "FLATKÖKUR",
                            "FLÓRSYKUR",
                            "FOLALDAGÚLLAS, hrátt",
                            "FOLALDAHAKK, hrátt",
                            "FOLALDAINNANLÆRI, hrátt",
                            "FORMKAKA",
                            "FRANSKAR KARTÖFLUR, djúpsteiktar",
                            "FRANSKAR KARTÖFLUR, forsteiktar, frystar",
                            "FRANSKAR KARTÖFLUR, ofnsteiktar",
                            "FRANSKAR VÖFFLUR",
                            "FRÓMAS",
                            "FURSTAKAKA",
                            "FÍKJUBITAR",
                            "FÍKJUR, þurrkaðar",
                            "G-MJÓLK, létt ",
                            "GAFFALBITAR, niðursoðnir",
                            "GEIRNYT, flak, hrátt",
                            "GELLUR, hráar",
                            "GER, pressuger",
                            "GER, þurrger",
                            "GIN",
                            "GLASSÚRKAKA",
                            "GOSBLANDAÐIR ÁFENGIR DRYKKIR",
                            "GOSDRYKKIR, kóladrykkir",
                            "GOSDRYKKIR, kóladrykkir, sykurlausir",
                            "GOSDRYKKIR, sykraðir",
                            "GOSDRYKKIR, sykurlausir, aðrir en kóladrykkir",
                            "GOSDRYKKIR, sykurskertir",
                            "GOSDRYKKIR, sódavatn",
                            "GOSDRYKKUR, appelsín",
                            "GRANATEPLI",
                            "GRASKERSFRÆ, kjarnar, ristaðir",
                            "GRASLAUKUR, hrár",
                            "GREIPALDIN",
                            "GREIPSAFI, hreinn",
                            "GRÁFÍKJUKAKA",
                            "GRÁLÚÐA, flök, hrá",
                            "GRÁSLEPPA, hrá",
                            "GRÁSLEPPA, sigin, hrá",
                            "GRÁSLEPPA, sigin, soðin",
                            "GRÁSLEPPA, söltuð, hrá",
                            "GRÁSLEPPUHROGN, hrá",
                            "GRÆNKÁL, hrátt",
                            "GRÆNMETI, blandað, niðursoðið",
                            "GRÆNMETISSAFI",
                            "GRÍSASNITSEL, m raspi, steikt, Goða",
                            "GULLLAX, flök, hrá",
                            "GULRÆTUR, hráar",
                            "GULRÆTUR, soðnar",
                            "GULRÓFUR, hráar",
                            "GULRÓFUR, soðnar",
                            "GULRÓTAKAKA",
                            "GULRÓTASAFI, niðursoðinn",
                            "GÆSIR, kjöt án skinns, hrátt",
                            "GÚRKUR, hráar",
                            "GÚRKUR, súrsaðar",
                            "HAFRAFLÖGUR",
                            "HAFRAGRAUTUR, án sykurs og mjólkur",
                            "HAKKBOLLUR, með kartöflumús og sósu, 1944 réttur",
                            "HAKKBOLLUR, steiktar, í súrsætri sósu, Fljótlegt og freistandi",
                            "HAKKRÉTTUR m grænmeti, steiktur",
                            "HAKKRÉTTUR m hrísgrjónum, steiktur",
                            "HAKKRÉTTUR m tómatsósu, steiktur",
                            "HAKKRÉTTUR með grænmeti, án feiti, steiktur",
                            "HAKKRÉTTUR, með tómatsósu, án feiti",
                            "HAMBORGARHRYGGUR, hrár",
                            "HAMBORGARHRYGGUR, álegg, soðið",
                            "HAMBORGARI, hrár, án brauðs",
                            "HAMBORGARI, steiktur, McDonald",
                            "HAMBORGARI, steiktur, með brauði",
                            "HAMBORGARI, steiktur, með brauði, grænmi og sósu",
                            "HAMBORGARI, steiktur, án brauðs",
                            "HAMSATÓLG",
                            "HANGIKJÖT, hrátt",
                            "HANGIKJÖT, með uppstúf, 1944 dish",
                            "HANGIKJÖT, soðið",
                            "HANGIÁLEGG, soðið",
                            "HANGIÁLEGG, soðið, fituskert",
                            "HARÐFISKUR, steinbítur",
                            "HARÐFISKUR, ýsa",
                            "HEILHVEITI",
                            "HEILHVEITI, próteinríkt",
                            "HIRSIFLÖGUR",
                            "HJARTARSALT",
                            "HJÓNABANDSSÆLA",
                            "HLAUP, sterkjuhlaup",
                            "HLÝRI, hrár",
                            "HNETUKAKA",
                            "HNETUR, furuhnetur",
                            "HNETUR, jarðhnetur",
                            "HNETUR, jarðhnetur, saltaðar, olía",
                            "HNETUR, pistasíuhnetur",
                            "HNETUR, valhnetur",
                            "HNETUSMJÖR",
                            "HNOÐMÖR",
                            "HREFNUKJÖT, hrátt",
                            "HREINDÝRAKJÖT, hrátt",
                            "HREÐKUR, hráar",
                            "HROSSABJÚGU, hrá",
                            "HROSSAFITA",
                            "HROSSAKJÖT, hrátt",
                            "HRÍSGRJÓN, hvít, póleruð, hrá",
                            "HRÍSGRJÓN, hvít, póleruð, soðin",
                            "HRÍSGRJÓN, hvít, vítamínrík, hrá",
                            "HRÍSGRJÓN, hýðishrísgrjón, hrá",
                            "HRÍSGRJÓN, hýðishrísgrjón, soðin",
                            "HRÍSGRJÓN, soðin, meðlæti með 1944 réttum",
                            "HRÍSGRJÓNADRYKKUR, kalkbættur",
                            "HRÍSGRJÓNAGRAUTUR, 1944 réttur",
                            "HRÍSGRJÓNAGRAUTUR, úr léttmjólk",
                            "HRÍSGRJÓNAGRAUTUR, úr nýmjólk",
                            "HRÍSKÖKUR, saltaðar",
                            "HRÍSKÚLUR, Freyjuhrís",
                            "HRÍSKÚLUR, Nóakropp",
                            "HRÍSMJÓLK, m sósu, sykurskert",
                            "HRÍSMJÓLK, með sætri sósu",
                            "HRÍSTERTA",
                            "HRÖKKBRAUÐ, fínt",
                            "HRÖKKBRAUÐ, gróft",
                            "HRÚTSPUNGAR, soðnir, súrsaðir",
                            "HUMAR, hrár",
                            "HUNANG",
                            "HUNANGSKAKA",
                            "HVALKJÖT, hrátt",
                            "HVALRENGI, súrsað",
                            "HVALSPIK",
                            "HVANNARÆTUR, hráar",
                            "HVEITI",
                            "HVEITI, próteinríkt",
                            "HVEITI, vítamín- og járnbætt, Pillsbury best",
                            "HVEITIKLÍÐ",
                            "HVEITIKORN, heil",
                            "HVEITIKÍM",
                            "HVÍTKÁL, hrátt",
                            "HVÍTKÁL, soðið",
                            "HVÍTLAUKSDUFT",
                            "HVÍTLAUKUR, hrár",
                            "HVÍTLAUKUR, í olíu",
                            "HVÍTVÍN, millisætt",
                            "HVÍTVÍN, þurrt",
                            "HVÍTÖL, JÓLAÖL",
                            "HÁKARL, glerhákarl, kæstur",
                            "HÁKARL, hvítur hákarl, kæstur",
                            "HÁKARL, kæstur",
                            "HÖRFRÆ",
                            "HÖRFRÆOLÍA",
                            "HÖRPUDISKUR, hrár",
                            "JARÐARBER",
                            "JURTAOLÍA, meðalsamsetning",
                            "JURTAOLÍA, ÍSÍÓ4, D vítamínbætt",
                            "JÓGÚRT, grísk, hrein",
                            "JÓGÚRT, hreint",
                            "JÓGÚRT, hreint, sykrað",
                            "JÓGÚRT, karamellu-/ kaffi-",
                            "JÓGÚRT, léttjógúrt, með ávöxtum og klíði",
                            "JÓGÚRT, léttjógúrt, sykurskert, m ávöxtum, grænmeti",
                            "JÓGÚRT, með ávöxtum og berjum, FrúTína",
                            "JÓGÚRT, rjómajógúrt",
                            "JÓGÚRT, undanrennujógúrt, sykurskert, með korni eða ávöxtum",
                            "JÓGÚRT, ávaxta-, fituskert, Pascual",
                            "JÓGÚRT, ávaxta-, án fitu, Pascual",
                            "JÓGÚRT, ávaxtajógúrt",
                            "JÓGÚRT, ávaxtajógúrt með korni",
                            "JÓGÚRT, ávaxtajógúrt, Pascual",
                            "JÓGÚRT, þykkjógúrt með korni",
                            "JÓGÚRT, þykkjógúrt með ávöxtum",
                            "JÓGÚRTDRYKKUR, FrúTína ",
                            "JÓGÚRTDRYKKUR, léttur, m perum, án viðbætts sykurs",
                            "JÓGÚRTDRYKKUR, léttur, ávextir / bragðbættur",
                            "JÓGÚRTDRYKKUR, með ávöxtum og múslí",
                            "JÓLAKAKA",
                            "JÖKLASALAT",
                            "KAFFI, lagað",
                            "KAFFIBAUNIR, ristaðar, malaðar",
                            "KAKÓDRYKKUR, Mjólkursams, léttmjólk",
                            "KAKÓDRYKKUR, Swiss Miss án viðb sykurs",
                            "KAKÓDRYKKUR, Swiss-Miss með sykri",
                            "KAKÓDRYKKUR, heimalagaður, nýmjólk",
                            "KAKÓDUFT",
                            "KAKÓDUFT, fituskert",
                            "KAKÓDUFT, sykrað, fyrir drykki",
                            "KALKÚNABRINGA, með kartöflum, 1944 réttur",
                            "KALKÚNAR, kjöt án skinns, hrátt",
                            "KANILL",
                            "KANILSNÚÐAR, harðir",
                            "KANILSNÚÐAR, mjúkir, Findus",
                            "KANILSNÚÐAR, mjúkir, Myllan",
                            "KAPLAMJÓLK",
                            "KARAMELLUR, rjómakaramellur",
                            "KARFI, hrár",
                            "KARRÍ, duft",
                            "KARRÍMAUK, með jurtaolíu",
                            "KARTÖFLUDUFT",
                            "KARTÖFLUMJÖL",
                            "KARTÖFLUMÚS",
                            "KARTÖFLUMÚS, meðlæti með 1944 réttum",
                            "KARTÖFLUR, hráar",
                            "KARTÖFLUR, soðnar",
                            "KARTÖFLUSALAT, með majonesi",
                            "KAVÍAR, grásleppuhrogn, í krukkum",
                            "KAVÍAR, laxa- og hrognamauk í túpum",
                            "KAVÍAR, þorskhrognamauk, í túpum",
                            "KEILA, flök, hrá",
                            "KEILA, mjólkurdrykkur m ávaxtasafa",
                            "KEX, hafrakex",
                            "KEX, heilhveitikex",
                            "KEX, kremkex, Frón",
                            "KEX, maríukex, án súkkulaðis",
                            "KEX, matarkex, Frón",
                            "KEX, matarkex, gróft, Frón",
                            "KEX, saltkex",
                            "KEX, súkkulaðikex",
                            "KEX, tekex",
                            "KINDABJÚGU, með jafningi og kartöflum, 1944 RÉTTUR",
                            "KINDABJÚGU, soðin",
                            "KINDAHAKK, hrátt",
                            "KINDAKÆFA, föst",
                            "KINDAKÆFA, smyrjanleg",
                            "KINNAR, nætursaltaðar, hráar",
                            "KIRSUBER",
                            "KJÖT Í KARRÍSÓSU",
                            "KJÖT Í KARRÍSÓSU, indverskt lambakarrí, án hrísgrjóna, 1944 réttur",
                            "KJÖT Í KARRÍSÓSU, indverskt, með hrísgrjónum, 1944 réttur",
                            "KJÖT Í KARRÍSÓSU, með hrísgrjónum, 1944 réttur",
                            "KJÖT Í KARRÍSÓSU, án hrísgrjóna, 1944 réttur",
                            "KJÖTBOLLUR, fars-, steiktar, Goða",
                            "KJÖTBOLLUR, farsbollur, hráar",
                            "KJÖTBOLLUR, farsbollur, soðnar",
                            "KJÖTBOLLUR, farsbollur, steiktar",
                            "KJÖTBOLLUR, hakkbollur, hráar",
                            "KJÖTBOLLUR, hakkbollur, steiktar",
                            "KJÖTBOLLUR, hakkbollur, án kartaflna, 1944 réttur",
                            "KJÖTBOLLUR, með kartöflumús, 1944 réttur",
                            "KJÖTBOLLUR, án kartaflna, 1944 réttur",
                            "KJÖTBUFF úr hakki, mjólk, eggjum",
                            "KJÖTBÚÐINGUR, Krakkabúðingur, soðinn, í pylsugörn",
                            "KJÖTBÚÐINGUR, soðinn, í pylsugörn",
                            "KJÖTFARS, hrátt",
                            "KJÖTPATE, bakað",
                            "KJÖTPATE, innbakað í smjördeigi",
                            "KJÖTPOTTRÉTTUR, með grænmeti og rjómasósu, soðinn",
                            "KJÖTPOTTRÉTTUR, með rjómasósu, soðinn",
                            "KJÖTPOTTRÉTTUR, með sósu og grænmeti, án rjóma, soðinn",
                            "KJÖTPOTTRÉTTUR, með sósu, án rjóma, soðinn",
                            "KJÖTRÉTTUR, Bolognese kjötkássa, 1944 réttur",
                            "KJÖTRÉTTUR, Stroganoff, með kartöflumús, 1944 réttur",
                            "KJÖTRÉTTUR, Stroganoff, án hrísgrjóna, 1944 réttur",
                            "KJÖTRÉTTUR, súrsætt svínakjöt, með hrísgrjónum, 1944 réttur",
                            "KJÖTRÉTTUR, súrsætt svínakjöt, án hrísgrjóna, 1944 dish",
                            "KJÖTSOÐ",
                            "KJÚKLINGABITAR, djúpsteiktir",
                            "KJÚKLINGARÉTTUR,  m grænm og rjóma",
                            "KJÚKLINGARÉTTUR, Tikka Masala, með hrísgrjónum,1944 réttur",
                            "KJÚKLINGARÉTTUR, Tikka Masala, án hrísgrjóna, 1944 réttur",
                            "KJÚKLINGARÉTTUR, austurlenskur kjúklingur, 1944 réttur",
                            "KJÚKLINGARÉTTUR, austurlenskur kjúklingur, án hrísgrjóna, 1944 réttur",
                            "KJÚKLINGARÉTTUR, bringur, með hrísgrjónum, 1944 réttur",
                            "KJÚKLINGARÉTTUR, bringur, án hrísgrjóna, 1944 réttur",
                            "KJÚKLINGARÉTTUR, með grænmeti, án rjóma, soðinn",
                            "KJÚKLINGAÁLEGG, soðið",
                            "KJÚKLINGUR, bringur án skinns hráar",
                            "KJÚKLINGUR, læri, með skinni, hrátt",
                            "KJÚKLINGUR, með skinni, hrár",
                            "KJÚKLINGUR, með skinni, ofnsteiktur",
                            "KLEINUHRINGIR, amerískir",
                            "KLEINUHRINGIR, með súkkulaðihjúp",
                            "KLEINUHRINGIR, án súkkulaðis",
                            "KLEINUR",
                            "KLEINUR, Gæðabakstur",
                            "KLEINUR, Myllan",
                            "KLEINUR, Ömmubakstur",
                            "KLETTASALAT",
                            "KLÍPA",
                            "KOLMUNNI, hrár",
                            "KONFEKT",
                            "KONÍAK",
                            "KORNSTÖNG, Special K",
                            "KORNSTÖNG, með kókoshnetum, Corny",
                            "KORNSTÖNG, með súkkulaði, Corny",
                            "KRANSAKAKA",
                            "KRINGLUR",
                            "KRYDDKAKA",
                            "KRYDDMAUK (relish)",
                            "KRYDDSULTA,  með mangó",
                            "KRÆKIBER",
                            "KRÆKIBERJASAFT",
                            "KRÆKIBERJASULTA",
                            "KRÆKLINGUR, hrár",
                            "KRÆKLINGUR, soðinn ",
                            "KVARG, með berjum / ávöxtum",
                            "KÁLFABJÚGU, soðin",
                            "KÍNAKÁL, hrátt",
                            "KÍVÍ",
                            "KÓKOSBOLLA",
                            "KÓKOSFEITI",
                            "KÓKOSFORMKAKA",
                            "KÓKOSKAKA",
                            "KÓKOSKÚLUR, úr bakaríum",
                            "KÓKOSMJÓLK, létt, niðursoðin",
                            "KÓKOSMJÓLK, niðursoðin",
                            "KÓKOSMJÖL",
                            "KÓKÓMJÓLK",
                            "KÓKÓMJÓLK, sykurskert",
                            "KÚFSKEL, vöðvi, hrár",
                            "KÚMEN",
                            "KÚRBÍTUR, hrár",
                            "KÚSKÚS, hrátt",
                            "KÚSKÚS, soðið",
                            "LAKKRÍS",
                            "LAKKRÍSKONFEKT",
                            "LAMBABLÓÐ",
                            "LAMBAEISTU, snyrt hrá",
                            "LAMBAFRAMPARTUR, fitusnyrtur, hrár",
                            "LAMBAFRAMPARTUR, m. fitu, hrár",
                            "LAMBAGARNIR",
                            "LAMBAGRILLLEGGUR /SKANKI, hrár",
                            "LAMBAHJÖRTU, fitusnyrt, hrá",
                            "LAMBAHJÖRTU, með fitu, hrá",
                            "LAMBAHRYGGUR, með fitu, hrár",
                            "LAMBAHRYGGVÖÐVAR, án fitu, hráir",
                            "LAMBAHRYGGVÖÐVAR, án fitu, steiktir",
                            "LAMBAINNANLÆRI, hrátt",
                            "LAMBAKJÖT, millifeitt, soðið",
                            "LAMBAKJÖT, millifeitt, steikt",
                            "LAMBAKJÖT, súpukjöt, hrátt",
                            "LAMBAKJÖT, súpukjöt, soðið",
                            "LAMBAKJÖTSBITAR, í raspi, steiktir",
                            "LAMBAKÓTILETTUR, glóðaðar",
                            "LAMBAKÓTILETTUR, hráar",
                            "LAMBAKÓTILETTUR, steiktar í raspi",
                            "LAMBALIFUR, hrá",
                            "LAMBALIFUR, steikt",
                            "LAMBALUNDIR, hráar",
                            "LAMBALUNGU, hreinsuð",
                            "LAMBALÆRI, fitusnyrt, hrátt",
                            "LAMBALÆRI, fitusnyrt, ofnbakað",
                            "LAMBALÆRI, kryddlegið, hrátt",
                            "LAMBALÆRI, með fitu, hrátt",
                            "LAMBALÆRISSNEIÐAR, steiktar",
                            "LAMBALÆRISSNEIÐAR,steiktar m. raspi",
                            "LAMBAMILTU",
                            "LAMBAMÖR",
                            "LAMBANÝRU, hrá",
                            "LAMBASLÖG, hrá",
                            "LAMBAVAMBIR",
                            "LAMBAÞINDAR, hráar",
                            "LANGA, hrá",
                            "LASAGNE, 1944 réttur",
                            "LASAGNE, grænmetislasagne, með sósu, 1944 réttur",
                            "LASAGNE, kjúklingalasagne, 1944 réttur",
                            "LASANJA, grænmetis-, ofnbakað",
                            "LASANJA, með kjöti og grænm ofnb.",
                            "LAUFABRAUÐ",
                            "LAUKUR, hrár",
                            "LAUKUR, steiktur í jurtaolíu",
                            "LAUKUR, þurrkaður",
                            "LAX, eldislax, hrár",
                            "LAX, grafinn",
                            "LAX, reyktur",
                            "LAX, soðinn",
                            "LAX, steiktur",
                            "LAX, villtur, hrár",
                            "LGG+, hreint, með sætuefni",
                            "LGG+, m ávaxtasafa og sætuefni",
                            "LGG+, með ávaxtasafa og sykri",
                            "LH MJÓLKURDRYKKUR, sykurskertur, með ávöxtum, berjum",
                            "LH MJÓLKURDRYKKUR, án viðbætts sykurs, með berjum",
                            "LIFRARKÆFA, bökuð",
                            "LIFRARKÆFA, bökuð, fituskert",
                            "LIFRARKÆFA, niðursoðin",
                            "LIFRARPYLSA, soðin",
                            "LIFRARPYLSA, soðin, súrsuð",
                            "LITLI KARFI, hrár",
                            "LOÐNA, heil, hrá",
                            "LOÐNUHROGN, hrá",
                            "LUNDABAGGAR, soðnir, súrsaðir",
                            "LUNDI, kjöt, bringur, hráar",
                            "LYFTIDUFT",
                            "LÉTT OG LAGGOTT",
                            "LÉTT OG LAGGOTT, með ólífuolíu",
                            "LÉTTMJÓLK",
                            "LÉTTMJÓLK, með ab gerlum",
                            "LÉTTSÚRMJÓLK",
                            "LÉTTSÚRMJÓLK, ávaxta-, sykurskert",
                            "LÍKJÖR",
                            "LÚÐA, með raspi, hrá",
                            "LÚÐA, með raspi, steikt",
                            "LÚÐA, smálúða, hrá",
                            "LÚÐA, smálúða, soðin",
                            "LÚÐA, stórlúða, hrá",
                            "LÚÐA, súrsuð, hrá",
                            "LÝSA, hrá",
                            "MAGÁLL, reyktur",
                            "MAKKARÓNUR, hráar",
                            "MAKKARÓNUR, soðnar",
                            "MAKRÍLL, hrár",
                            "MALAKOFFÁLEGG, soðið",
                            "MALTÖL",
                            "MALTÖL, 11% kolvetni",
                            "MANDARÍNUR",
                            "MANGÓÁVÖXTUR",
                            "MARENSBOTN",
                            "MARENSTERTA",
                            "MARMARAKAKA",
                            "MARMELAÐI",
                            "MARSIPAN",
                            "MASSARÍNUKAKA",
                            "MATARLÍM",
                            "MAÍS, hrár",
                            "MAÍSKORN, niðursoðin",
                            "MAÍSMJÖL",
                            "MAÍSOLÍA",
                            "MAÍSSTERKJA",
                            "MELÓNUR, hunangsmelónur",
                            "MELÓNUR, kantalúpmelónur",
                            "MELÓNUR, vatnsmelónur",
                            "MJÓLKURDRYKKUR, 0,5% fita, bragðbættur",
                            "MJÓLKURDRYKKUR, 0,5% fita, hrein",
                            "MJÓLKURDRYKKUR, cappuccino, fita 0,5%",
                            "MJÓLKURDRYKKUR, með ávöxtum",
                            "MJÓLKURHRISTINGUR",
                            "MORGUNKORN, All bran",
                            "MORGUNKORN, Bran Flakes, Kelloggs",
                            "MORGUNKORN, Cocoa Puffs",
                            "MORGUNKORN, Fitness, Nestlé",
                            "MORGUNKORN, Fruitn Fibre, Kelloggs",
                            "MORGUNKORN, Havre fras",
                            "MORGUNKORN, Magic Stars",
                            "MORGUNKORN, Rice krispies, Kelloggs",
                            "MORGUNKORN, Rug fras",
                            "MORGUNKORN, Special K",
                            "MORGUNKORN, Weetabix, vítamínbætt",
                            "MORGUNKORN, Weetos",
                            "MORGUNKORN, hafrahringir",
                            "MORGUNKORN, hafrahringir, hunangs-",
                            "MORGUNKORN, kornflögur",
                            "MORGUNKORN, kornflögur, súkkulaði-",
                            "MORGUNKORN, múslí, með sykri",
                            "MORGUNKORN, múslí, án sykurs",
                            "MUFFINS ",
                            "MYSA, ostamysa",
                            "MYSA, skyrmysa",
                            "MYSUDRYKKUR, Garpur",
                            "MÓÐURMJÓLK",
                            "MÖNDLUKAKA",
                            "MÖNDLUR",
                            "NAGGAR, Cordon Bleu, steiktir",
                            "NAGGAR, kjúklinganaggar, forsteiktir",
                            "NAGGAR, lambanaggar, steiktir",
                            "NAGGAR, svínasnitsel, steikt",
                            "NAGGAR, ýsunaggar, steiktir",
                            "NANBRAUÐ",
                            "NAUTAFRAMHRYGGJARSNEIÐAR, hráar",
                            "NAUTAGÚLLAS, hrátt",
                            "NAUTAGÚLLAS, með lauk, steikt",
                            "NAUTAHAKK, nautgr 12-20% fita hrátt",
                            "NAUTAHAKK, ungnauta 8-12%fita hrátt",
                            "NAUTAHJÖRTU, hrá",
                            "NAUTAHRYGGUR, hrár",
                            "NAUTAHRYGGVÖÐVI (FÍLE) m fitu hrár",
                            "NAUTAHRYGGVÖÐVI (FÍLE) snyrtur hrár",
                            "NAUTAINNANLÆRI, fitusnyrt, hrátt",
                            "NAUTAINNANLÆRI, fitusnyrt, steikt",
                            "NAUTAKJÖT, millifeitt, steikt í feiti",
                            "NAUTALUNDIR, fitusnyrtar, hráar",
                            "NAUTAMÖR",
                            "NEKTARÍNUR",
                            "NÆPUR, hráar",
                            "NÚÐLUR, eggjanúðlur, þurrkaðar",
                            "NÚÐLURÉTTUR, hrísgrjóna-, tilbúinn",
                            "NÚÐLURÉTTUR, þurrkaður",
                            "NÝMJÓLK",
                            "NÝMJÓLKURDUFT",
                            "ORKUDRYKKUR, Blue Pig",
                            "ORKUDRYKKUR, Burn ",
                            "ORKUDRYKKUR, Burn orkuskot",
                            "ORKUDRYKKUR, Burn, með ávaxtasafa",
                            "ORKUDRYKKUR, Cult",
                            "ORKUDRYKKUR, Egils orka",
                            "ORKUDRYKKUR, Energy, Euroshopper",
                            "ORKUDRYKKUR, Extreme Energy shot",
                            "ORKUDRYKKUR, Magic",
                            "ORKUDRYKKUR, Red Bull",
                            "ORKUDRYKKUR, Redfin energy",
                            "ORKUDRYKKUR, meðalsamsetning",
                            "ORKUMJÓLK, með jarðarberjasafa, D vítamínbætt",
                            "ORKUMJÓLK, með súkkulaði, D vítamínbætt",
                            "OSTAKAKA",
                            "OSTASLAUFUR",
                            "OSTUR, Brie",
                            "OSTUR, Brie, 17% fita",
                            "OSTUR, Camembert",
                            "OSTUR, Camembert, 38% fita",
                            "OSTUR, Dalakollur",
                            "OSTUR, Dalayrja",
                            "OSTUR, Fetaostur",
                            "OSTUR, Fetaostur, í olíu",
                            "OSTUR, Gullostur",
                            "OSTUR, Mozzarella, 17% fita",
                            "OSTUR, Mozzarella, 21% fita",
                            "OSTUR, Parmesan, rifinn",
                            "OSTUR, Ricotta",
                            "OSTUR, blokkostur, 17% fita",
                            "OSTUR, blokkostur, 21% fita",
                            "OSTUR, fastur, 11% fita",
                            "OSTUR, fastur, 17% fita",
                            "OSTUR, fastur, 21% fita",
                            "OSTUR, fastur, 26% fita",
                            "OSTUR, fastur, 30% fita",
                            "OSTUR, fastur, 38% fita",
                            "OSTUR, fastur, Fjörostur",
                            "OSTUR, fetaostur, fituskertur, Léttfeti, í olíu",
                            "OSTUR, gráðaostur",
                            "OSTUR, kotasæla",
                            "OSTUR, kotasæla með ananas",
                            "OSTUR, mysingur",
                            "OSTUR, mysuostur, fastur",
                            "OSTUR, mysuostur, smyrjanlegur",
                            "OSTUR, partíbomba",
                            "OSTUR, rjómamysuostur",
                            "OSTUR, rjómaostur, 19% fita",
                            "OSTUR, rjómaostur, 27% fita",
                            "OSTUR, rjómaostur, 30% fita",
                            "OSTUR, rjómaostur, 44% fita",
                            "OSTUR, skinkuostur",
                            "OSTUR, smurostur með grænmeti",
                            "OSTUR, smurostur með rækju",
                            "OSTUR, smurostur, 18% fita",
                            "OSTUR, smurostur, 4% fita",
                            "OSTUR, smurostur, 6% fita, hreinn",
                            "OSTUR, smurostur, 6% fita, m.rækju",
                            "OSTUR, smurostur, 6%, m. grænmeti",
                            "OSTUR, Ísbúi",
                            "OSTUR, ábætisostur",
                            "PAPRIKA, blanda (græn, rauð, gul)",
                            "PAPRIKA, græn",
                            "PAPRIKA, gul",
                            "PAPRIKA, rauð",
                            "PAPRIKUDUFT",
                            "PASTA, Tortellini með kjöti, soðið",
                            "PASTA, Tortellini með osti, soðið",
                            "PASTA, eggjapasta, soðið",
                            "PASTA, eggjapasta, þurrkað",
                            "PASTA, heilhveiti, soðið",
                            "PASTA, heilhveiti, þurrkað",
                            "PASTA, soðið",
                            "PASTA, þurrkað",
                            "PASTARÉTTUR m skinku, soðinn",
                            "PASTARÉTTUR með grænmeti og rjóma, soðinn",
                            "PASTARÉTTUR, 1944 réttur",
                            "PASTASALAT m kjúklingi og skinku, án sósu",
                            "PASTASALAT m túnfiski og grænmeti, án sósu",
                            "PASTASALAT m/ gænm., án sósu",
                            "PEPPERONI",
                            "PERUR",
                            "PILSNER",
                            "PILSNER, sætur",
                            "PIPAR, svartur",
                            "PIPARKÖKUR",
                            "PITSA, frá pítsustöðum",
                            "PITSA, grænmetispítsa",
                            "PITSA, með nautahakki",
                            "PITSA, með nautahakki / pepperoni",
                            "PITSA, með pepperóní",
                            "PITSA, pönnupitsa, með pepperóní, Pizza Hut",
                            "PITSUBOTN",
                            "PITSUSNÚÐAR",
                            "PLOKKFISKUR",
                            "PLÓMUR",
                            "PLÚS MJÓLKURBÚÐINGUR",
                            "POPPKORN, venjul. og örbylgju-",
                            "POPPKORN, venjulegt",
                            "POPPKORN, örbylgju-",
                            "POPPKORN, örbylgju-, First Price",
                            "POPPKORN, örbylgju-, Pop Secret",
                            "POPPKORN, örbylgju-, létt, Richfood",
                            "PORTVÍN",
                            "PRÓTEINDRYKKUR, Easy body",
                            "PRÓTEINDRYKKUR, Herbalife",
                            "PRÓTEINDRYKKUR, Hleðsla",
                            "PRÓTEINDRYKKUR, Hámark",
                            "PRÓTEINDRYKKUR, Isopure",
                            "PRÓTEINDRYKKUR, Myoplex",
                            "PRÓTEINDRYKKUR, Nupo létt",
                            "PRÓTEINDRYKKUR, VHT Real protein",
                            "PRÓTEINDUFT, Myoplex, original",
                            "PRÓTEINDUFT, Myopro, 100% mysuprótein",
                            "PRÓTEINSTÖNG, EAS Advant Edge",
                            "PRÓTEINSTÖNG, Easy body",
                            "PRÓTEINSTÖNG, Herbalife",
                            "PRÓTEINSTÖNG, Herbalife gull",
                            "PRÓTEINSTÖNG, Isopure",
                            "PRÓTEINSTÖNG, Myoplex light",
                            "PYLSA Í BRAUÐI, með öllu",
                            "PÍTA, með buffi, grænmeti og sósu",
                            "PÍTUBRAUÐ, án fyllingar",
                            "PÖNNUKÖKUR",
                            "PÚÐURSYKUR",
                            "RABARBARI, hrár",
                            "RANDALÍNUKAKA",
                            "RASP",
                            "RAUÐKÁL, hrátt",
                            "RAUÐKÁL, niðursoðið",
                            "RAUÐKÁL, soðið",
                            "RAUÐMAGALIFUR, hrá",
                            "RAUÐMAGI, hrár",
                            "RAUÐMAGI, reyktur",
                            "RAUÐPIPAR",
                            "RAUÐRÓFUR, niðursoðnar",
                            "RAUÐVÍN",
                            "REGNBOGASILUNGUR, hrár",
                            "REGNBOGASILUNGUR, niðursoðinn, reyktur, í olíu",
                            "REPJUOLÍA",
                            "RIFSBER",
                            "RJÓMABOLLA, gerdeigsbolla, með sultu og glassúr",
                            "RJÓMABOLLA, vatnsdeigsbolla, með sultu og glassúr",
                            "RJÓMALÍKI, á þrýstbrúsa",
                            "RJÓMALÍKI, úr jurtafitu",
                            "RJÓMATERTA",
                            "RJÓMI",
                            "RJÓMI, kaffirjómi",
                            "RJÓMI, matreiðslurjómi",
                            "RJÓMI, þeytirjómi",
                            "RJÚPUR, kjöt, hrátt",
                            "RÆKJA, djúpsteikt",
                            "RÆKJA, niðursoðin",
                            "RÆKJA, soðin",
                            "RÓFUSTAPPA, niðurlögð",
                            "RÓSAKÁL, hrátt",
                            "RÓSAKÁL, soðið",
                            "RÓSMARÍN",
                            "RÚGMJÖL, gróft",
                            "RÚGMJÖL, sigtimjöl",
                            "RÚGUR, heill/brotinn",
                            "RÚLLUPYLSA, soðin",
                            "RÚLLUPYLSA, úr svínakjöti, soðin",
                            "RÚLLUTERTA, brún",
                            "RÚLLUTERTA, ljós",
                            "RÚNNSTYKKI",
                            "RÚSÍNUR",
                            "SAGÓGRJÓN",
                            "SALAT, BLAÐSALAT",
                            "SALAT, fisksalat",
                            "SALAT, hangikjötssalat",
                            "SALAT, hrásalat án sósu",
                            "SALAT, hrásalat í majonessósu",
                            "SALAT, rækjusalat með majonesi",
                            "SALAT, rækjusalat með sýrðum rjóma",
                            "SALAT, túnfisksalat",
                            "SALT, Miðjarðarhafssalt",
                            "SALT, Reykjanessalt",
                            "SALT, borðsalt",
                            "SALT, sjávarsalt",
                            "SALTFISKUR, hrár",
                            "SALTFISKUR, soðinn",
                            "SALTFISKUR, tandurfiskur, hrár",
                            "SALTFISKUR, útvatnaður, hrár",
                            "SALTKJÖT, hrátt",
                            "SANDHVERFA, hrá",
                            "SANDKOLI, hrár",
                            "SARDÍNUR, niðursoðnar, í olíu",
                            "SARDÍNUR, niðursoðnar, í tómatsósu",
                            "SAUÐAMJÓLK",
                            "SELKJÖT, hrátt",
                            "SELKJÖT, lundir, hráar",
                            "SELLERÍ, stilksellerí",
                            "SELLERÍRÓT",
                            "SELSPIK",
                            "SESAMFRÆ, með hýði",
                            "SESAMFRÆ, án hýðis",
                            "SHERRY, millisætt",
                            "SHERRY, þurrt",
                            "SINNEP, sætt",
                            "SKARFAKÁL",
                            "SKARKOLI, hrár",
                            "SKATA, hrá",
                            "SKATA, kæst",
                            "SKINKA, brauðskinka, soðin",
                            "SKINKA, lúxus skinka, soðin",
                            "SKINKA, soðin",
                            "SKINKUEFNI, hrátt",
                            "SKONSUR",
                            "SKREIÐ, steinbítur",
                            "SKREIÐ, ýsa",
                            "SKREIÐ, þorskhausar",
                            "SKREIÐ, þorskur",
                            "SKYR",
                            "SKYR, SMS smáskyr, bragðbætt",
                            "SKYR, hefðbundið",
                            "SKYR, krakkaskyr, ávaxta-",
                            "SKYR, rjómaskyr",
                            "SKYR, rjómaskyr, með ávöxtum",
                            "SKYR, rjómaskyr, súkkulaði-",
                            "SKYR, skyr.is, án viðb. sykurs",
                            "SKYR, skyr.is, ávaxta-",
                            "SKYR, skyr.is, ávaxta-, Dagmál, sykurskert",
                            "SKYR, skólaskyr, ávaxta-",
                            "SKYR, ávaxtaskyr",
                            "SKYRDRYKKUR, KEA",
                            "SKYRDRYKKUR, Skyr.is, án viðbætts sykurs",
                            "SKYRDRYKKUR, Skyr.is, ávaxta-",
                            "SKYRHRÆRINGUR",
                            "SKÖTUSELUR, hrár",
                            "SKÚFFUKAKA",
                            "SMJÖR",
                            "SMJÖR, kryddsmjör",
                            "SMJÖR, sérsaltað",
                            "SMJÖR, ósaltað",
                            "SMJÖRDEIGSBOTN",
                            "SMJÖRDEIGSHORN",
                            "SMJÖRKAKA",
                            "SMJÖRKREM",
                            "SMJÖRLÍKI, Akra",
                            "SMJÖRLÍKI, Flórusmjörlíki",
                            "SMJÖRLÍKI, Jurtasmjörlíki",
                            "SMJÖRLÍKI, Kjarnasmjörlíki",
                            "SMJÖRLÍKI, Ljóma",
                            "SMJÖRLÍKI, MH",
                            "SMJÖRLÍKI, Olivía",
                            "SMJÖRLÍKI, fljótandi, Akra",
                            "SMJÖRLÍKI, heimilis-, Kjarnavörur",
                            "SMJÖRLÍKI, hrærismjörlíki",
                            "SMJÖRLÍKI, meðalsamsetning",
                            "SMJÖRLÍKI, rúllusmjörlíki",
                            "SMJÖRLÍKI, stóreldhúsasmjörlíki",
                            "SMJÖRLÍKI, súperrúlla",
                            "SMJÖRLÍKISOLÍA",
                            "SMJÖRVI",
                            "SMURHANGIÁLEGG",
                            "SMURSALAMI",
                            "SMURSKINKA",
                            "SMÁKÖKUR",
                            "SMÁMÁL, mjólkurbúðingur með jarðarberjum",
                            "SMÁMÁL, mjólkurbúðingur með súkkulaði",
                            "SNAKK, Tortilla flögur",
                            "SNAKK, kartöfluflögur, fituríkar",
                            "SNAKK, kartöflunasl, ýmsar gerðir",
                            "SNAKK, kartöfluskrúfur",
                            "SNAKK, saltstengur",
                            "SNITSEL, lamba- og svína-, steikt",
                            "SNÚÐAR",
                            "SNÚÐAR, með súkkulaði",
                            "SOJADRYKKUR",
                            "SOJADRYKKUR, kalkbættur",
                            "SOJAHLAUP (TÓFÚ)",
                            "SOJAKJÖTLÍKI, þurrkað",
                            "SOJAOLÍA",
                            "SOJAOLÍA, hálfhert",
                            "SOJAOSTUR",
                            "SOJASÓSA",
                            "SPAGHETTÍ, hrátt",
                            "SPAGHETTÍ, soðið",
                            "SPELTMJÖL, fínt hvítt mjöl",
                            "SPELTMJÖL, heilmalað",
                            "SPERGILKÁL, hrátt",
                            "SPERGILKÁL, soðið",
                            "SPERGILL / ASPARGUS, hrár",
                            "SPERGILL / ASPARGUS, niðursoðinn",
                            "SPÆGIPYLSA",
                            "SPÆRLINGUR, hrár",
                            "SPÍNAT, hrátt",
                            "STEINBÍTUR, hrár",
                            "STEINBÍTUR, með raspi, hrár",
                            "STEINSELJA",
                            "STOÐMJÓLK, vítamín- og steinefnabætt, fyrir börn 0,5-2 ára",
                            "SULTA, berjasulta",
                            "SULTUKAKA",
                            "SVALADRYKKUR, djús",
                            "SVALADRYKKUR, djús, sykurlaus",
                            "SVALADRYKKUR, djús, sykurskertur",
                            "SVAMPBOTN",
                            "SVARTFUGL, kjöt, bringur, hráar",
                            "SVARTFUGL, með skinni, sviðinn, hrár",
                            "SVEPPIR, hráir",
                            "SVEPPIR, niðursoðnir",
                            "SVEPPIR, steiktir í jurtaolíu",
                            "SVESKJUR",
                            "SVESKJUSAFI, hreinn",
                            "SVIÐ, niðursoðin",
                            "SVIÐ, soðin",
                            "SVIÐASULTA, soðin",
                            "SVIÐASULTA, soðin, súrsuð",
                            "SVÍNABLÓÐ",
                            "SVÍNABÓGUR, hrár",
                            "SVÍNAFITA",
                            "SVÍNAFITA, brædd",
                            "SVÍNAGÚLLAS, hrátt",
                            "SVÍNAHRYGGUR, með fitu, hrár",
                            "SVÍNAKJÖT, magurt, steikt",
                            "SVÍNAKJÖT, millifeitt, steikt",
                            "SVÍNAKÓTILETTUR, hráar",
                            "SVÍNAKÓTILETTUR, ofnsteiktar",
                            "SVÍNALIFUR, hrá",
                            "SVÍNALUNDIR, hráar",
                            "SVÍNALÆRI, hrátt",
                            "SVÍNALÆRI, hrátt, fituhreinsað",
                            "SYKUR",
                            "SÆLGÆTISBUFF",
                            "SÆLGÆTISSTAUR, frá Freyju",
                            "SÆTAR KARTÖFLUR",
                            "SÆTUEFNADUFT, Canderel",
                            "SÆTUEFNADUFT, Suprasweet / Euroshopper",
                            "SÆTUEFNI, sakkarín",
                            "SÍLD, flök, hrá",
                            "SÍLD, flök, marineruð",
                            "SÍLD, flök, marineruð, í majonessósu",
                            "SÍLD, flök, marineruð, í tómatsósu",
                            "SÍLD, flök, niðursoðin, Kippers",
                            "SÍLD, flök, niðursoðin, í sósu",
                            "SÍLD, flök, reykt",
                            "SÍLD, heil, söltuð, hrá",
                            "SÍLDARKÆFA, niðursoðin, reykt",
                            "SÍRÓP",
                            "SÍTRÓNUR",
                            "SÍTRÓNUSAFI, hreinn",
                            "SÓDADUFT",
                            "SÓLBER",
                            "SÓLBLÓMAFRÆ",
                            "SÓLBLÓMAOLÍA",
                            "SÓSA, Bearnaisesósa",
                            "SÓSA, MAJONES, 3% fita",
                            "SÓSA, MAJONES, 37% fita",
                            "SÓSA, MAJONES, 79% fita",
                            "SÓSA, MAJONES, hvítlaukssósa, 53%",
                            "SÓSA, MAJONES-, grænmetissósa",
                            "SÓSA, MAJONES-, hamborgara, eggjalaus, fita 21%",
                            "SÓSA, MAJONES-, hamborgarasósa",
                            "SÓSA, MAJONES-, kokkteilsósa, 67%",
                            "SÓSA, MAJONES-, kokkteilsósa, eggjalaus, 25% fita",
                            "SÓSA, MAJONES-, pítusósa, 62%",
                            "SÓSA, MAJONES-, pítusósa, án eggja, 28% fita",
                            "SÓSA, MAJONES-, remúlaði, 68%",
                            "SÓSA, MAJONES-, sinnepssósa, 41%",
                            "SÓSA, Pestósósa",
                            "SÓSA, SALATSÓSA, olíusalatsósa",
                            "SÓSA, SALATSÓSA, súrmjólkursósa",
                            "SÓSA, SALATSÓSA, þúsundeyja, 15%",
                            "SÓSA, SALATSÓSA, þúsundeyja, 37%",
                            "SÓSA, TÓMAT-, Salsasósa",
                            "SÓSA, TÓMAT-, pastasósa, 1% fita",
                            "SÓSA, TÓMAT-, pítsusósa, 1% fita",
                            "SÓSA, TÓMAT-, tikka masala blanda",
                            "SÓSA, TÓMAT-, tómatsósa",
                            "SÓSA, graflaxsósa",
                            "SÓSA, jafningur / hvít sósa",
                            "SÓSA, jöfnuð brún sósa",
                            "SÓSA, ostasósa, Osta- og smjörsalan",
                            "SÓSA, rjómasveppasósa",
                            "SÓSA, súrsæt, Uncle Ben's",
                            "SÓSA, uppbökuð",
                            "SÖL, þurrkuð",
                            "SÚKKAT",
                            "SÚKKULAÐI, Bounty",
                            "SÚKKULAÐI, Mars",
                            "SÚKKULAÐI, Prins Póló",
                            "SÚKKULAÐI, Prins Póló og Hraun",
                            "SÚKKULAÐI, Snickers",
                            "SÚKKULAÐI, með ávaxtasykri",
                            "SÚKKULAÐI, rjómasúkkulaði",
                            "SÚKKULAÐI, rjómasúkkulaði, fyllt",
                            "SÚKKULAÐI, rjómasúkkulaði, hnetur",
                            "SÚKKULAÐI, rjómasúkkulaði, rúsínur",
                            "SÚKKULAÐI, suðusúkkulaði",
                            "SÚKKULAÐI, suðusúkkulaði, 70-85% kakóþurrefni",
                            "SÚKKULAÐI, súkkulíki, til bökunar",
                            "SÚKKULAÐIBITAR, Hraun",
                            "SÚKKULAÐIBITAR, Æðibitar",
                            "SÚKKULAÐIDRYKKUR, heimatilbúinn",
                            "SÚKKULAÐIHNETUR",
                            "SÚKKULAÐIKAKA",
                            "SÚKKULAÐIRÚSÍNUR",
                            "SÚKKULAÐIÁLEGG, Nusco",
                            "SÚPA, baunasúpa",
                            "SÚPA, baunasúpa með saltkjöti, 1944 réttur",
                            "SÚPA, blómkálssúpa",
                            "SÚPA, brauðsúpa",
                            "SÚPA, fiskisúpa",
                            "SÚPA, grænmetissúpa",
                            "SÚPA, grænmetissúpa, tær",
                            "SÚPA, humarsúpa, niðursoðin",
                            "SÚPA, kakósúpa",
                            "SÚPA, kakósúpa, 1944 réttur",
                            "SÚPA, kjötsúpa",
                            "SÚPA, kjötsúpa, íslensk, 1944 réttur",
                            "SÚPA, pastasúpa",
                            "SÚPA, sjávarréttasúpa, 1944 réttur",
                            "SÚPA, sveppasúpa, 1944 réttur",
                            "SÚPA, tómatsúpa",
                            "SÚPA, uxahalasúpa",
                            "SÚPA, ávaxtasúpa",
                            "SÚPUTENINGAR",
                            "SÚRMJÓLK",
                            "SÚRMJÓLK, með hnetum og karamellum",
                            "SÚRMJÓLK, ávaxtasúrmjólk",
                            "SÝRÐUR RJÓMI, 10% fita",
                            "SÝRÐUR RJÓMI, 18% fita",
                            "SÝRÐUR RJÓMI, 36% fita",
                            "SÝRÐUR RJÓMI, 5% fita",
                            "SÝRÐUR RJÓMI, með kryddi",
                            "TAKÓ SKELJAR, maísbrauð, hart",
                            "TE, jurtate lagað án mjólkur og sykurs",
                            "TE, lagað, án mjólkur og sykurs",
                            "TEBOLLUR",
                            "TINDASKATA, hrá",
                            "TIRAMISU",
                            "TORTILLA, með hakki og grænmeti",
                            "TORTILLA, úr hveiti",
                            "TORTILLA, úr maís",
                            "TVÍBÖKUR",
                            "TVÍBÖKUR, grófar",
                            "TYGGIGÚMMÍ",
                            "TYGGIGÚMMÍ, án sykurs",
                            "TÍMÍAN",
                            "TÓLG, bræddur lambamör",
                            "TÓMATAR, hráir",
                            "TÓMATAR, niðursoðnir",
                            "TÓMATAR, sólþurrkaðir, í olíu",
                            "TÓMATSAFI",
                            "TÓMATÞYKKNI ",
                            "TÖFLUR",
                            "TÖFLUR, sykurlausar",
                            "TÚNFISKUR, hrár",
                            "TÚNFISKUR, niðursoðinn í olíu",
                            "TÚNFISKUR, niðursoðinn í vatni",
                            "UFSALÝSI",
                            "UFSI, flök, hrá",
                            "UFSI, með raspi, forsteiktur",
                            "UFSI, með raspi, hrár",
                            "UNDANRENNA",
                            "UNDANRENNUDUFT",
                            "UNDANRENNUÍS, fitulaus",
                            "UNGHÆNA, bringa með skinni, hrá",
                            "UNGHÆNA, læri með skinni, hrátt",
                            "UNGNEYTALIFUR, hrá",
                            "URRARI, flök, hrá",
                            "VANILLUDROPAR",
                            "VANILLUHRINGIR",
                            "VATN, drykkjarvatn",
                            "VATN, drykkjarvatn með kolsýru",
                            "VATN, hitaveituvatn",
                            "VATN, hitaveituvatn í Reykjavík",
                            "VATNSDRYKKUR, Eðaltoppur með andoxunarefnum",
                            "VATNSDRYKKUR, Eðaltoppur með trefjum",
                            "VATNSDRYKKUR, Kristall plús",
                            "VATNSDRYKKUR, Kristall sport, með sætuefnum",
                            "VISKÍ",
                            "VODKA",
                            "VORRÚLLUR, djúpsteiktar",
                            "VORRÚLLUR, með nautakjöti, steiktar",
                            "VÍNARBRAUÐ",
                            "VÍNARPYLSUR, soðnar",
                            "VÍNARPYLSUR, soðnar, fituskertar",
                            "VÍNARTERTA",
                            "VÍNBER",
                            "VÖFFLUR",
                            "ÁBRYSTIR",
                            "ÁFIR",
                            "ÁSTRÍÐUALDIN",
                            "ÁVAXTADRYKKUR, Svali",
                            "ÁVAXTADRYKKUR, sykurskertur, Svali",
                            "ÁVAXTADRYKKUR, vítamínbættur",
                            "ÁVAXTAGRAUTUR",
                            "ÁVAXTAGRAUTUR, sykurskertur",
                            "ÁVAXTASAFI, þykkur, Trópí",
                            "ÁVEXTIR, niðursoðnir í sykurlegi",
                            "ÁVEXTIR, niðursoðnir í vatni",
                            "ÆRKJÖT, innanlæri, hrátt",
                            "ÍDÝFA, úr fituskertu majonesi",
                            "ÍDÝFA, úr majonesi",
                            "ÍDÝFA, úr sýrðum rjóma",
                            "ÍDÝFA, úr þykkmjólk og majonesi",
                            "ÍS í súkkulaði, Mars",
                            "ÍS í súkkulaði, Snickers",
                            "ÍS, jurtaís",
                            "ÍS, jurtaís, Heimaís",
                            "ÍS, jurtaís, Hversdagsís",
                            "ÍS, jurtaís, Mjúkís",
                            "ÍS, jógúrtís",
                            "ÍS, límonaðiís",
                            "ÍS, límonaðiís, Sun Lolly",
                            "ÍS, pinnaís, með súkkilaðihjúp",
                            "ÍS, rjómaís, 10% fita",
                            "ÍS, rjómaís, 13% fita",
                            "ÍS, rjómaís, 14% fita",
                            "ÍS, úr ísbúðum",
                            "ÍSSÓSA, með súkkulaðibragði",
                            "ÍSTERTA, með kransakökubotni",
                            "ÍSTERTA, með marensbotni",
                            "ÍÞRÓTTADRYKKUR, Aquarius",
                            "ÍÞRÓTTADRYKKUR, Gatorade",
                            "ÍÞRÓTTADRYKKUR, Leppin",
                            "ÍÞRÓTTADRYKKUR, Powerade",
                            "ÍÞRÓTTADRYKKUR, Prímus, með súkkulaði",
                            "ÍÞRÓTTADRYKKUR, Prímus, vanilla og jarðarber",
                            "ÍÞRÓTTADRYKKUR, Soccerade",
                            "ÓLÍFUOLÍA",
                            "ÓLÍFUR, grænar, í saltlegi",
                            "ÝSA, djúpsteiktir bitar með raspi",
                            "ÝSA, flök, hrá",
                            "ÝSA, flök, reykt, hrá",
                            "ÝSA, flök, steikt",
                            "ÝSA, hrá, með raspi",
                            "ÝSA, hrá, í degi",
                            "ÝSA, ofnbökuð, m lauk og osti",
                            "ÝSA, ofnbökuð, m rjómasósu",
                            "ÝSA, ofnbökuð, m rjómasósu og grænmeti",
                            "ÝSA, ofnbökuð, m súrmjólkursósu",
                            "ÝSA, soðin",
                            "ÝSA, steikt í raspi",
                            "ÝSUFARS, hrátt",
                            "ÝSUHAKK, hrátt",
                            "ÝSULIFUR, hrá",
                            "ÞORSKALÝSI",
                            "ÞORSKALÝSI, krakkalýsi",
                            "ÞORSKALÝSI, ómega-3 fiskiolía, án vítamína",
                            "ÞORSKALÝSISÞYKKNI, með vítamínum",
                            "ÞORSKHROGN, hrá",
                            "ÞORSKHROGN, niðursoðin",
                            "ÞORSKHROGN, soðin",
                            "ÞORSKLIFUR, hrá",
                            "ÞORSKLIFUR, niðursoðin",
                            "ÞORSKLIFUR, soðin",
                            "ÞORSKSVIL",
                            "ÞORSKUR, flök, hrá",
                            "ÞORSKUR, með raspi, forsteiktur",
                            "ÞORSKUR, með raspi, hrár",
                            "ÞORSKUR, siginn, hrár",
                            "ÞORSKUR, siginn, soðinn",
                            "ÞORSKUR, soðinn",
                            "ÞORSKUR, steiktur",
                            "ÞORSKUR, stirtlur, hráar",
                            "ÞORSKUR, í degi, hrár",
                            "ÞORSKUR, þunnildi, hrá",
                            "ÞYKKMJÓLK, með ávöxtum",
                            "ÞYKKMJÓLK, með ávöxtum og korni",
                            "ÞYKKMJÓLK, með ávöxtum og súkkulaði",
                            "ÞYKKVALÚRA, hrá",
                            "ÞYNGINGARDRYKKUR, Mass-Tech, þynntur m vatni",
                            "ÞÖRUNGAMJÖL",
    ];
    $scope.matarflokkar = [
        {'heiti': 'Mjólk, mjólkurvörur',
         'undirflokkar': [
            'Nýmjólk, léttmjólk, undanrenna, rjómi, kakómjólk, kakó, bragðbættir mjólkurdrykkir',
            'Sýrðar mjólkurvörur, sýrður rjómi, jógúrt, jógúrtdrykkir og skyr',
            'Mjólkurgrautar og –súpur, mjólkurbúðingar, rjómabúðingar, tiramisú',
            'Nýmjólkurduft, undanrennuduft'
         ]
        },
        {'heiti': 'Ostar',
         'undirflokkar':  [
            'Allir ostar úr mjólk eða mjólkurvörum',
            'Ostar úr soja eða öðru jurtapróteini'
         ]
        },
        {
            'heiti': 'Ís',
            'undirflokkar': [
                'Mjólkurís, rjómaís, jógúrtís',
                'Jurtaís',
                'Vatnsís'
            ]
        },
        {
            'heiti': 'Kornmatur, brauð og kökur',
            'undirflokkar': [
                'Ómalað og heilmalað korn. Hrísgrjón, maís og hafragrjón',
                'Mjöl',
                'Morgunverðarkorn, mjölgrautar',
                'Brauð, hrökkbrauð, tvíbökur, bruður, skonsur',
                'Kex, sætt, ósætt, smákökur',
                'Kökur, tertur, ostakökur, kleinur',
                'Pasta, kús-kús'
            ]
        },
        {
            'heiti': 'Grænmeti og kartöflur',
            'undirflokkar': [
                'Nýir, frystir rótarávextir, nema kartöflur',
                'Nýtt, fryst grænmeti: stönglar, blöð, aldin',
                'Nýjar kartöflur',
                'Nýjar, frystar baunir, ertur',
                'Nýir sveppir',
                'Ferskar kryddjurtir',
                'Niðursoðið og niðurlagt grænmeti, tómatmauk',
                'Þurrkað grænmeti, kartöfluduft',
                'Franskar kartöflur'
            ]
        },
        {
            'heiti': 'Ávextir, ber, hnetur og fræ',
            'undirflokkar': [
                'Nýir, frystir ávextir',
                'Ný, fryst ber',
                'Hnetur, fræ',
                'Niðursoðnir ávextir, ber, ávaxtagrautar, ávaxtamauk',
                'Þurrkaðir ávextir og ber',
                'Ferskar kryddjurtir',
                'Sultur'
            ]
        }
        ,
        {
            'heiti': 'Kjöt og kjötvörur. Fuglakjöt',
            'undirflokkar': [
                'Lambakjöt, kindakjöt, nýtt, fryst, saltað, reykt, hakkað',
                'Nautakjöt',
                'Svínakjöt',
                'Hrossakjöt',
                'Hreindýra- hvalkjöt',
                'Alifuglar',
                'Sjófuglar og aðrir villtir fuglar',
                'Fars, farsvörur, pylsur, bjúgu, áleggspylsur',
                'Innmatur, slátur, svið, kæfa',
                'Niðursoðin kjötvara'
            ]
        }
        ,
        {
            'heiti': 'Fiskur, fiskafurðir og skeldýr',
            'undirflokkar': [
                'Ferskur og frystur fiskur. Fiskhakk, hrogn, lifur',
                'Þurrkaður og hertur fiskur',
                'Fiskfars og farsvörur, fiskipate',
                'Saltfiskur, reyktur fiskur, siginn, kæstur og grafinn fiskur',
                'Niðurlagður og niðursoðinn fiskur og skeldýr',
                'Fersk og fryst skeldýr'
            ]
        },
        {
            'heiti': 'Egg og eggjavörur',
            'undirflokkar': [
                'Egg, ný, fryst, heil eða fljótandi',
                'Þurrkaðar eggjavörur'
            ]
        },
        {
            'heiti': 'Feitmeti: smjör, smjörlíki, olíur o.fl',
            'undirflokkar': [
                'Jurtaolíur, jurtafeiti',
                'Fiskolíur, lýsi',
                'Tólg, mör, kjötfita',
                'Smjör, Smjörvi, Létt og laggott, Klípa',
                'Smjörlíki, hert fita',
                'Hnetusmjör, fræsmjör'
            ]
        },
        {
            'heiti': 'Sykur, hunang og sælgæti',
            'undirflokkar': [
                'Sykur, púðursykur, flórsykur',
                'Hunang',
                'Sælgæti'
            ]
        },
        {
            'heiti': 'Drykkir, nema mjólkurdrykkir',
            'undirflokkar': [
                'Te, kaffi, kakóduft',
                'Gosdrykkir, svaladrykkir',
                'Blandaðir ávaxta- og berjadrykkir, saft',
                'Hreinir safar, ávaxtasafar, berjasafar, grænmetissafar',
                'Íþrótta- og orkudrykkir',
                'Bjór, pilsner, maltöl',
                'Borðvín',
                'Millisterk vín, brennd vín, líkjör',
                'Vatn, sódavatn með og án bragðefna'
            ]
        },
        {
            'heiti': 'Matarsalt, edik, ger, krydd og kraftur',
            'undirflokkar': [
                'Matarsalt, edik, krydd og kraftur',
                'Ger og hjálparefni',
                'Gervisætuefni'
            ]
        },
        {
            'heiti': 'Snakk: poppkorn, flögur o.fl.',
            'undirflokkar': [
                'Poppkorn',
                'Flögur, skrúfur, kornstangir, annað snakk'    
            ]
        },
        {
            'heiti': 'Sósur, súpur og áleggssalöt',
            'undirflokkar': [
                'Allar sósur og ídýfur: Salatsósur, majones og majonessósur, olíusósur, rjóma- og ostasósur, sinnep, tómatsósur, sósur úr grænmeti, uppbakaðar, jafnaðar sósur, súr-sætar sósur o.fl.',
                'Súpur, súpuduft',
                'Áleggssalöt, majonessalöt, salöt úr sýrðum rjóma'           
            ]
        },
        {
            'heiti': 'Tilbúnir réttir',
            'undirflokkar': [
                'Pitsur, samlokur, pitur, brauðréttir, hamborgarar, pylsa í brauði',
                'Pastaréttir, lasagna',
                'Kjötréttir',
                'Fiskréttir',
                'Grænmetisréttir',
                'Eggjaréttir'
            ]
        },
        {
            'heiti': 'Fæðubótarefni, næringardrykkir, sérfæði',
            'undirflokkar': [
                'Vítamín, steinefni, önnur fæðubótarefni',
                'Megrunar- og próteindrykkir, næringardrykkir, próteinstykki'     
            ]
        }
    ];
    $scope.searchedItems =[];
    $scope.fellt = false;
    $scope.neysluflokkun = {
        'Morgunmatur': [],
        'Morgunsnarl': [],
        'Hádegismatur': [],
        'Miðdegissnarl': [],
        'Kvöldmatur': [],
        'Kvöldsnarl': [],
        'Hitaeiningamagn': 0,
        'Fitueiningamagn': 0,
        'Proteineiningamagn': 0,
        'Kolvetniseiningamagn': 0
    };
    $scope.showScaleButton = true;
    $scope.flokkahlekkir = document.getElementsByClassName('flokkar');
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
                            'orka': 37*parseFloat(resp.fooditemForm.fita)+ 17*parseFloat(resp.fooditemForm.protein)+17*parseFloat(resp.fooditemForm.kolvetni_alls),
                            'magn': resp.size,
                            'fita': resp.fooditemForm.fita,
                            'protein': resp.fooditemForm.protein,
                            'kolvetni': resp.fooditemForm.kolvetni_all     
                        });
                        $scope.neysluflokkun['Fitueiningamagn'] += 37*parseFloat(resp.fooditemForm.fita);
                        $scope.neysluflokkun['Proteineiningamagn'] += 17*parseFloat(resp.fooditemForm.protein);
                        $scope.neysluflokkun['Kolvetniseiningamagn'] += 17*parseFloat(resp.fooditemForm.kolvetni_alls);
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Fitueiningamagn'];
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Proteineiningamagn'];
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Kolvetniseiningamagn'];
                        $scope.alertMessageFun('success', 'Fæða skráð.');      
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
                        
                        $scope.showScaleButton = (consumption && consumption.length > 0) ? false:true; 
                        
                        for (var i = 0; i < consumption.length; i++) {
                            var item = consumption[i];
                            $scope.neysluflokkun[item.mal].push(
                                {'heiti':item.fooditemForm.heiti,
                                'orka': 37*parseFloat(item.fooditemForm.fita)+ 17*parseFloat(item.fooditemForm.protein)+17*parseFloat(item.fooditemForm.kolvetni_alls),
                                'magn': item.size,
                                'fita': item.fooditemForm.fita,
                                'protein': item.fooditemForm.protein,
                                'kolvetni': item.fooditemForm.kolvetni_all     
                                }
                            );
                            $scope.neysluflokkun['Fitueiningamagn'] += 37*parseFloat(item.fooditemForm.fita);
                            $scope.neysluflokkun['Proteineiningamagn'] += 17*parseFloat(item.fooditemForm.protein);
                            $scope.neysluflokkun['Kolvetniseiningamagn'] += 17*parseFloat(item.fooditemForm.kolvetni_alls);
                        }
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Fitueiningamagn'];
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Proteineiningamagn'];
                        $scope.neysluflokkun['Hitaeiningamagn'] += $scope.neysluflokkun['Kolvetniseiningamagn'];
                        $scope.fellaNeyslu = true;


                    });
                }
                else {
                    console.log('error');
                }
            });
        
        $scope.finishedNeyslaLoading();
        
    };

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
                        gapi.client.matarvefur.create_user_if_not_exists({'user_name': $cookieStore.get('user_name'),'user_email':$cookieStore.get('user_email')}).execute(function(resp) {
                          if (!resp.code) {
                             
                          }
                          else {
                            
                          }
                        });   
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
        //$('#skoda').button('loading');
    };
    $scope.loadingFlokkar = function () {
        //$('.flokkar2').button('loading');
    };
    $scope.finishedLoading = function () {
        //$('#skoda').button('reset');
    };
    $scope.finishedLoadingFlokkar = function () {
        //$('.flokkar2').button('reset');
    };
    $scope.veljaLoading = function () {
        //$('#velja').button('loading');
    };
    $scope.finishedVeljaLoading = function () {
        //$('#velja').button('reset');
    };
    $scope.neyslaLoading = function () {
        $('#neysluflokkun').button('loading');
    };
    $scope.finishedNeyslaLoading = function () {
        $('#neysluflokkun').button('reset');
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
