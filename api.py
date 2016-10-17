# -*- encoding: utf-8 -*-

import endpoints
import codecs
from protorpc import remote, messages

from models import (FoodItem,
                    StringMessage,
                    User,
                    FoodProportion,
                    FoodItemForm,
                    FoodItemForms,
                    CategoryForm)
c = {}
c[1] = u'Mjólk, mjólkurvörur'
c[2] = u'Ostar'
c[3] = u'Ís'
c[4] = u'Kornmatur, brauð og kökur'
c[5] = u'Grænmeti og kartöflur'
c[6] = u'Ávextir, ber, hnetur og fræ'
c[7] = u'Kjöt og kjötvörur. Fuglakjöt'
c[8] = u'Fiskur, fiskafurðir og skeldýr'
c[9] = u'Egg og eggjavörur'
c[10] = u'Feitmeti: smjör, smjörlíki, olíur o.fl'
c[11] = u'Sykur, hunang og sælgæti'
c[12] = u'Drykkir, nema mjólkurdrykkir'
c[13] = u'Matarsalt, edik, ger, krydd og kraftur'
c[14] = u'Snakk: poppkorn, flögur o.fl.'
c[15] = u'Sósur, súpur og áleggssalöt'
c[16] = u'Tilbúnir réttir'
c[17] = u'Fæðubótarefni, næringardrykkir, sérfæði'
        
sc = {}
sc[(1,1)] = u'Nýmjólk, léttmjólk, undanrenna, rjómi, kakómjólk, kakó, bragðbættir mjólkurdrykkir '
sc[(1,2)] = u'Sýrðar mjólkurvörur, sýrður rjómi, jógúrt, jógúrtdrykkir og skyr'
sc[(1,3)] = u'Mjólkurgrautar og –súpur, mjólkurbúðingar, rjómabúðingar, tiramisú'
sc[(1,4)] = u'Nýmjólkurduft, undanrennuduft'
sc[(2,1)] = u'Allir ostar úr mjólk eða mjólkurvörum'
sc[(2,2)] = u'Ostar úr soja eða öðru jurtapróteini'
sc[(3,1)] = u'Mjólkurís, rjómaís, jógúrtís'
sc[(3,2)] = u'Jurtaís'
sc[(3,3)] = u'Vatnsís'
sc[(4,1)] = u'Ómalað og heilmalað korn. Hrísgrjón, maís og hafragrjón'
sc[(4,2)] = u'Mjöl'
sc[(4,3)] = u'Morgunverðarkorn, mjölgrautar'
sc[(4,3)] = u'Brauð, hrökkbrauð, tvíbökur, bruður, skonsur'
sc[(4,4)] = u'Kex, sætt, ósætt, smákökur'
sc[(4,5)] = u'Kökur, tertur, ostakökur, kleinur'
sc[(4,6)] = u'Pasta, kús-kús'

sc[(5,1)] = u'Nýir, frystir rótarávextir, nema kartöflur'
sc[(5,2)] = u'Nýtt, fryst grænmeti: stönglar, blöð, aldin'
sc[(5,3)] = u'Nýjar kartöflur'
sc[(5,4)] = u'Nýjar, frystar baunir, ertur'
sc[(5,5)] = u'Nýir sveppir'
sc[(5,6)] = u'Ferskar kryddjurtir'
sc[(5,7)] = u'Niðursoðið og niðurlagt grænmeti, tómatmauk'
sc[(5,8)] = u'Þurrkað grænmeti, kartöfluduft'
sc[(5,9)] = u'Franskar kartöflur'

sc[(6,1)] = u'Nýir, frystir ávextir'
sc[(6,2)] = u'Ný, fryst ber'
sc[(6,3)] = u'Hnetur, fræ'
sc[(6,4)] = u'Niðursoðnir ávextir, ber, ávaxtagrautar, ávaxtamauk'
sc[(6,5)] = u'Þurrkaðir ávextir og ber'
sc[(6,6)] = u'Sultur'


sc[(7,1)] = u'Lambakjöt, kindakjöt, nýtt, fryst, saltað, reykt, hakkað' 
sc[(7,2)] = u'Nautakjöt'
sc[(7,3)] = u'Svínakjöt'
sc[(7,4)] = u'Hrossakjöt'
sc[(7,5)] = u'Hreindýra- hvalkjöt'
sc[(7,6)] = u'Alifuglar'
sc[(7,7)] = u'Sjófuglar og aðrir villtir fuglar'
sc[(7,8)] = u'Fars, farsvörur, pylsur, bjúgu, áleggspylsur'
sc[(7,9)] = u'Innmatur, slátur, svið, kæfa'
sc[(7,10)] = u'Niðursoðin kjötvara'


sc[(8,1)] = u'Ferskur og frystur fiskur. Fiskhakk, hrogn, lifur'
sc[(8,2)] = u'Þurrkaður og hertur fiskur'
sc[(8,3)] = u'Fiskfars og farsvörur, fiskipate'
sc[(8,4)] = u'Saltfiskur, reyktur fiskur, siginn, kæstur og grafinn fiskur'
sc[(8,5)] = u'Niðurlagður og niðursoðinn fiskur og skeldýr'
sc[(8,6)] = u'Fersk og fryst skeldýr'



sc[(9,1)] = u'Egg, ný, fryst, heil eða fljótandi'
sc[(9,2)] = u'Þurrkaðar eggjavörur'


sc[(10,1)] = u'Jurtaolíur, jurtafeiti'
sc[(10,2)] = u'Fiskolíur, lýsi'
sc[(10,3)] = u'Tólg, mör, kjötfita'
sc[(10,4)] = u'Smjör, Smjörvi, Létt og laggott, Klípa'
sc[(10,5)] = u'Smjörlíki, hert fita'
sc[(10,6)] = u'Hnetusmjör, fræsmjör'


sc[(11,1)] = u'Sykur, púðursykur, flórsykur'
sc[(11,2)] = u'Hunang'
sc[(11,3)] = u'Sælgæti'


sc[(12,1)] = u'Te, kaffi, kakóduft'
sc[(12,2)] = u'Gosdrykkir, svaladrykkir'
sc[(12,3)] = u'Blandaðir ávaxta- og berjadrykkir, saft'
sc[(12,4)] = u'Hreinir safar, ávaxtasafar, berjasafar, grænmetissafar'
sc[(12,5)] = u'Íþrótta- og orkudrykkir'
sc[(12,6)] = u'Bjór, pilsner, maltöl'
sc[(12,7)] =u'Borðvín'
sc[(12,8)] = u'Millisterk vín, brennd vín, líkjör'
sc[(12,9)] = u'Vatn, sódavatn með og án bragðefna'


sc[(13,1)] = u'Matarsalt, edik, krydd og kraftur'
sc[(13,2)] = u'Ger og hjálparefni'
sc[(13,3)] = u'Gervisætuefni'


sc[(14,1)] = u'Poppkorn'
sc[(14,2)] = u'Flögur, skrúfur, kornstangir, annað snakk'

sc[(15,1)] = u'Allar sósur og ídýfur: Salatsósur, majones og majonessósur, olíusósur, rjóma- og ostasósur, sinnep, tómatsósur, sósur úr grænmeti, uppbakaðar, jafnaðar sósur, súr-sætar sósur o.fl.' 
sc[(15,2)] = u'Súpur, súpuduft'
sc[(15,3)] = u'Áleggssalöt, majonessalöt, salöt úr sýrðum rjóma'


sc[(16,1)] = u'Pitsur, samlokur, pitur, brauðréttir, hamborgarar, pylsa í brauði'
sc[(16,2)] = u'Pastaréttir, lasagna'
sc[(16,3)] = u'Kjötréttir'
sc[(16,4)] = u'Fiskréttir'
sc[(16,5)] = u'Grænmetisréttir'
sc[(16,6)] = u'Eggjaréttir'


sc[(17,1)] = u'Vítamín, steinefni, önnur fæðubótarefni'
sc[(17,2)] = u'Megrunar- og próteindrykkir, næringardrykkir, próteinstykki'
	
FOODITEM_REQUEST = endpoints.ResourceContainer(
    food_item_nr = messages.IntegerField(1,required=True),)

SEARCH_REQUEST = endpoints.ResourceContainer(
    query_string = messages.StringField(1,required=True),)

SEARCH_CATEGORY = endpoints.ResourceContainer(
    category = messages.IntegerField(1,required=True),
    subcategory = messages.IntegerField(2,required=False))
@endpoints.api(name='matarvefur', version='v1')
class MatarvefurApi(remote.Service):
    @endpoints.method(response_message=StringMessage,
        path='upload_database',
        name='upload_database',
        http_method='PUT')   
    def upload_database(self, request):
        f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
    
        for line in f:
            items = line.split(";")
            columns = []
            for i in range(len(items)):
                if i in [0,3,4,5]:
                    if any(char.isdigit() for char in items[i]): 
                        columns.append(int(items[i]))
                    else:
                        columns.append(None)
                elif i == 1 or i==2:
                    columns.append(items[i])
                else:
                    if any(char.isdigit() for char in items[i]): 
                        columns.append(float(items[i].replace(u',',u'.')))
                    else:
                        columns.append(None)
            columns.append(items[1].split(',')[0])
            
            try:
                fooditem = FoodItem(nr = columns[0],
                                heiti = columns[1],
                                name = columns[2],
                                ediblePortion = columns[3],
                                foodGroup1 = columns[4],
                                foodGroup2 = columns[5],
                                protein = columns[6],
                                fita = columns[7],
                                mettadar_fitusyrur = columns[8],
                                cis_einomettadar_fitusyrur = columns[9],
                                cis_fjolomettadar_fitusyrur = columns[10],
                                cis_fjolomettadar_fitu_n_3_langar = columns[11],
                                trans_fitusyrur = columns[12],
                                kolestrol = columns[13],
                                kolvetni_alls = columns[14],
                                sykrur = columns[15],
                                vidbaettur_sykur = columns[16],
                                trefjaefni = columns[17],
                                alkohol = columns[18],
                                steinefni_alls = columns[19],
                                vatn = columns[20],
                                a_vitamin_rj = columns[21],
                                retinol = columns[22],
                                beta_karotin = columns[23],
                                d_vitamin = columns[24],
                                e_vitamin_alfa_tj = columns[25],
                                alfa_tokoferol = columns[26],
                                b1_vitamin = columns[27],
                                b2_vitamin = columns[28],
                                niasin_jafngildi = columns[29],
                                niasin = columns[30],
                                b6_vitamin = columns[31],
                                folat_alls = columns[32],
                                b_12_vitamin = columns[33],
                                c_vitamin = columns[34],
                                kalk = columns[35],
                                fosfor = columns[36],
                                magnesium = columns[37],
                                natrium = columns[38],
                                kalium = columns[39],
                                jarn = columns[40],
                                sink = columns[41],
                                kopar = columns[42],
                                jod = columns[43],
                                mangan = columns[44],
                                selen = columns[45],
                                fluor = columns[46],
                                cis_fjolomettadar_fitusyrur_n_6 = columns[47],
                                cis_fjolomettadar_fitusyrur_n_3 = columns[48],
                                leitarstrengur = columns[49])
                fooditem.put()
            except ValueError:
                raise endpoints.BadRequestException("Error inserting to a database")
            
        f.close()
        return StringMessage(message="Finished resetting the database.")
    
    @endpoints.method(request_message= FOODITEM_REQUEST,
            response_message=FoodItemForm,
            path='get_food_item',
            name='get_food_item',
            http_method='GET')   
    def get_food_item(self, request):
        fooditem = FoodItem.query(FoodItem.nr == request.food_item_nr).get()
        if not fooditem:
            raise endpoints.NotFoundException(
                    'No food item found.')

        return fooditem.to_form()
    
    @endpoints.method(request_message= SEARCH_REQUEST,
            response_message=FoodItemForms,
            path='search_food_item',
            name='search_food_item',
            http_method='GET')   
    def search_food_item(self, request):
        fooditems = FoodItem.query(FoodItem.leitarstrengur == request.query_string.upper())
        if not fooditems:
            raise endpoints.NotFoundException(
                    'No food item found.')

        return FoodItemForms(items=[fooditem.to_form() for fooditem in fooditems])
    @endpoints.method(request_message= SEARCH_CATEGORY,
            response_message=CategoryForm,
            path='search_category',
            name='search_category',
            http_method='GET')   
    def search_category(self, request):
        fooditems = FoodItem.query(FoodItem.foodGroup1 == request.category)
        if request.subcategory:
            fooditems = fooditems.filter(FoodItem.foodGroup2 == request.subcategory)
        if not fooditems:
            raise endpoints.NotFoundException(
                    'No food items found.')
        
        
        if c.has_key(request.category) and sc.has_key((request.category,request.subcategory)):
            cat = (c[request.category],sc[(request.category,request.subcategory)])
        
        elif c.has_key(request.category):
            cat = (c[request.category],None)
        else:
            cat = (None,None)
         
        return CategoryForm(category = cat[0],
                            subcategory = cat[1],
                            items=[fooditem.heiti for fooditem in fooditems])

	
api = endpoints.api_server([MatarvefurApi])


