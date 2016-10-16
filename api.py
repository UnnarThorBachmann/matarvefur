import endpoints
import codecs
from protorpc import remote, messages

from models import (FoodItem,
                    StringMessage,
                    User,
                    FoodProportion,
                    FoodItemForm,
                    FoodItemForms)

FOODITEM_REQUEST = endpoints.ResourceContainer(
    food_item_nr = messages.IntegerField(1),)

SEARCH_REQUEST = endpoints.ResourceContainer(
    query_string = messages.StringField(1),)

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
        
api = endpoints.api_server([MatarvefurApi])


