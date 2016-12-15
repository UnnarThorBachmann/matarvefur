# -*- encoding: utf-8 -*-

import endpoints
import codecs
import math
from datetime import date
from protorpc import remote, messages
from flokkar import c,sc
from google.appengine.ext import ndb

from models import (FoodItem,
                    StringMessage,
                    User,
                    UserForm,
                    Food,
                    FoodForm,
                    FoodForms,
                    FoodItemForm,
                    FoodItemForms,
                    CategoryForm)
USER_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True))
	
FOOD_ITEM_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=False),
    food_item_heiti = messages.StringField(2,required=True))

FOOD_ITEM_DELETE_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    food_item_heiti = messages.StringField(2,required=True))
SEARCH_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    query_string = messages.StringField(2,required=True))


SEARCH_CATEGORY = endpoints.ResourceContainer(
    category = messages.IntegerField(1,required=True),
    subcategory = messages.IntegerField(2,required=False))
CREATE_USER_REQUEST = endpoints.ResourceContainer(
    user_name = messages.StringField(1,required=True),
    user_email = messages.StringField(2,required=True))
FOOD_REQUEST = endpoints.ResourceContainer(
    size = messages.FloatField(1,required=True),
    user_email = messages.StringField(2,required=True),
    food_item_heiti = messages.StringField(3,required=True))
CONSUMPTION_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    year2 = messages.IntegerField(2,required=True),
    day2 = messages.IntegerField(3,required=True),
    month2 = messages.IntegerField(4,required=True),
    year1 = messages.IntegerField(5,required=True),
    day1 = messages.IntegerField(6,required=True),
    month1 = messages.IntegerField(7,required=True))

FOOD_ITEM_REGISTER = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    heiti = messages.StringField(2,required=True),
    name = messages.StringField(3,required=False),
    ediblePortion = messages.IntegerField(4,required=False),
    foodGroup1 = messages.IntegerField(5,required=False),
    foodGroup2 = messages.IntegerField(6,required=False),
    protein = messages.FloatField(7,required=False),
    fita = messages.FloatField(8,required=False),
    mettadar_fitusyrur = messages.FloatField(9,required=False),
    cis_einomettadar_fitusyrur = messages.FloatField(10,required=False),
    cis_fjolomettadar_fitusyrur = messages.FloatField(11,required=False),
    cis_fjolomettadar_fitu_n_3_langar = messages.FloatField(12,required=False),
    trans_fitusyrur = messages.FloatField(13,required=False),
    kolestrol = messages.FloatField(14,required=False),
    kolvetni_alls = messages.FloatField(15,required=False),
    sykrur = messages.FloatField(16,required=False),
    vidbaettur_sykur = messages.FloatField(17,required=False),
    trefjaefni = messages.FloatField(18,required=False),
    alkohol = messages.FloatField(19,required=False),
    steinefni_alls = messages.FloatField(20,required=False),
    vatn = messages.FloatField(21,required=False),
    a_vitamin_rj = messages.FloatField(22,required=False),
    retinol = messages.FloatField(23,required=False),
    beta_karotin = messages.FloatField(24,required=False),
    d_vitamin = messages.FloatField(25,required=False),
    e_vitamin_alfa_tj = messages.FloatField(26,required=False),
    alfa_tokoferol = messages.FloatField(27,required=False),
    b1_vitamin = messages.FloatField(28,required=False),
    b2_vitamin = messages.FloatField(29,required=False),
    niasin_jafngildi = messages.FloatField(30,required=False),
    niasin = messages.FloatField(31,required=False),
    b6_vitamin = messages.FloatField(32,required=False),
    folat_alls = messages.FloatField(33,required=False),
    b_12_vitamin = messages.FloatField(34,required=False),
    c_vitamin = messages.FloatField(35,required=False),
    kalk = messages.FloatField(36,required=False),
    fosfor = messages.FloatField(37,required=False),
    magnesium = messages.FloatField(38,required=False),
    natrium = messages.FloatField(39,required=False),
    kalium = messages.FloatField(40,required=False),
    jarn = messages.FloatField(41,required=False),
    sink = messages.FloatField(42,required=False),
    kopar = messages.FloatField(43,required=False),
    jod = messages.FloatField(44,required=False),
    mangan = messages.FloatField(45,required=False),
    selen = messages.FloatField(46,required=False),
    fluor = messages.FloatField(47,required=False),
    cis_fjolomettadar_fitusyrur_n_6 = messages.FloatField(48,required=False),
    cis_fjolomettadar_fitusyrur_n_3 = messages.FloatField(49,required=False))

@endpoints.api(name='matarvefur', version='v1')
class MatarvefurApi(remote.Service):
    @endpoints.method(request_message= CREATE_USER_REQUEST,
            response_message=UserForm,
            path='create_user',
            name='create_user',
            http_method='PUT')   
    def create_user(self, request):
        if User.query(User.name == request.user_name).get():
            raise endpoints.ConflictException(
                'User already exists!')
        
        if User.query(User.email == request.user_email).get():
            raise endpoints.ConflictException(
                'User already exists!')
        user = User(name=request.user_name,email=request.user_email)
        user.put()
        return UserForm(name = user.name,
                        email = user.email)
    @endpoints.method(response_message=StringMessage,
        path='delete_database',
        name='delete_database',
        http_method='PUT')
    def delete_database(self,request):
        foodItemsQuery = FoodItem.query().fetch()
        n = len(foodItemsQuery)
        
        for item in foodItemsQuery:
            item.key.delete()
            
        return StringMessage(message="Finished deleting " + str(n) + " items from the database. ")
    
    @endpoints.method(response_message=StringMessage,
        path='upload_database',
        name='upload_database',
        http_method='PUT')
    def upload_database(self, request):
        f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
        n = 0
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
                n += 1
            except ValueError:
                raise endpoints.BadRequestException("Error inserting to a database")
            
        f.close()
        return StringMessage(message="Finished resetting the database with "+ str(n) + " items.")
    # Food item functions.
    @endpoints.method(request_message= FOOD_ITEM_REQUEST,
            response_message=FoodItemForm,
            path='get_food_item',
            name='get_food_item',
            http_method='GET')   
    def get_food_item(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            fooditem = fooditem = FoodItem.query(FoodItem.heiti == request.food_item_heiti).get()
        else:
            for item in user.fooditems:
                if item.heiti == request.food_item_heiti:
                    fooditem = item
                    break
            fooditem = fooditem = FoodItem.query(FoodItem.heiti == request.food_item_heiti).get()
        
        if not fooditem:
            raise endpoints.NotFoundException(
                    'No food item found.')

        return fooditem.to_form()
    @endpoints.method(request_message= FOOD_ITEM_DELETE_REQUEST,
            response_message=FoodItemForm,
            path='delete_user_food_item',
            name='delete_user_food_item',
            http_method='GET')   
    def delete_user_food_item(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                    'User not found')

        fooditem = None
        for i in range(len(user.fooditems)):
            if user.fooditems[i].heiti == request.food_item_heiti:
                fooditem =  user.fooditems[i]
                del user.fooditems[i]
                user.put()
                break
                    
        if not fooditem:
            raise endpoints.NotFoundException(
                    'Food item not found.')

        return fooditem.to_form()
    @endpoints.method(request_message= USER_REQUEST,
            response_message=FoodItemForms,
            path='get_user_food_items',
            name='get_user_food_items',
            http_method='GET')   
    def get_user_food_items(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                    'No user found.')
        
        return  FoodItemForms(items = [item.to_form() for item in user.fooditems])
    
    @endpoints.method(request_message= FOOD_ITEM_REGISTER,
            response_message=FoodItemForm,
            path='put_food_item',
            name='put_food_item',
            http_method='POST')   
    def put_food_item(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            raise endpoints.ForbiddenException(
                'User does not exist.')
        
        if user.get_item(request.heiti) is not None:
            raise endpoints.ForbiddenException(
                'Item does exist.')
        fooditem = FoodItem.query(FoodItem.heiti == request.heiti).get()
        
        if fooditem is not None:
            raise endpoints.NotFoundException(
                'Item does exist.')
        
        fooditem = FoodItem(heiti = request.heiti,
                            name = request.name,
                            ediblePortion = request.ediblePortion,
                            foodGroup1 = request.foodGroup1,
                            foodGroup2 = request.foodGroup2,
                            protein = request.protein,
                            fita = request.fita,
                            mettadar_fitusyrur = request.mettadar_fitusyrur,
                            cis_einomettadar_fitusyrur = request.cis_einomettadar_fitusyrur,
                            cis_fjolomettadar_fitusyrur = request.cis_fjolomettadar_fitusyrur,
                            cis_fjolomettadar_fitu_n_3_langar = request.cis_fjolomettadar_fitu_n_3_langar,
                            trans_fitusyrur = request.trans_fitusyrur,
                            kolestrol = request.kolestrol,
                            kolvetni_alls = request.kolvetni_alls,
                            sykrur = request.sykrur,
                            vidbaettur_sykur = request.vidbaettur_sykur,
                            trefjaefni = request.trefjaefni,
                            alkohol = request.alkohol,
                            steinefni_alls = request.steinefni_alls,
                            vatn = request.vatn,
                            a_vitamin_rj = request.a_vitamin_rj,
                            retinol = request.retinol,
                            beta_karotin = request.beta_karotin,
                            d_vitamin = request.d_vitamin,
                            e_vitamin_alfa_tj = request.e_vitamin_alfa_tj,
                            alfa_tokoferol = request.alfa_tokoferol,
                            b1_vitamin = request.b1_vitamin,
                            b2_vitamin = request.b2_vitamin,
                            niasin_jafngildi = request.niasin_jafngildi,
                            niasin = request.niasin,
                            b6_vitamin = request.b6_vitamin,
                            folat_alls = request.folat_alls ,
                            b_12_vitamin = request.b_12_vitamin,
                            c_vitamin = request.c_vitamin,
                            kalk = request.kalk,
                            fosfor = request.fosfor,
                            magnesium = request.magnesium,
                            natrium = request.natrium,
                            kalium = request.kalium,
                            jarn = request.jarn,
                            sink = request.sink,
                            kopar = request.kopar,
                            jod = request.jod,
                            mangan = request.mangan,
                            selen = request.selen,
                            fluor = request.fluor,
                            cis_fjolomettadar_fitusyrur_n_6 = request.cis_fjolomettadar_fitusyrur_n_6,
                            cis_fjolomettadar_fitusyrur_n_3 = request.cis_fjolomettadar_fitusyrur_n_3)
        
        user.fooditems.append(fooditem)
        user.put()

        return fooditem.to_form()

    @endpoints.method(request_message= FOOD_ITEM_REGISTER,
            response_message=FoodItemForm,
            path='put_food_item',
            name='put_food_item',
            http_method='POST')   
    def put_food_item(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            raise endpoints.ForbiddenException(
                'User does not exist.')
        
        if user.get_item(request.heiti) is not None:
            raise endpoints.ForbiddenException(
                'Item does exist.')
        fooditem = FoodItem.query(FoodItem.heiti == request.heiti).get()
        
        if fooditem is not None:
            raise endpoints.NotFoundException(
                'Item does exist.')
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
    
    # Food functions.
    @endpoints.method(request_message= FOOD_REQUEST,
            response_message=FoodForm,
            path='put_food',
            name='put_food',
            http_method='PUT')   
    def put_food(self, request):
        user = User.query(User.email == request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                'User does not exist.')

        fooditem = FoodItem.query(FoodItem.heiti == request.food_item_heiti).get()
        if not fooditem:
            raise endpoints.NotFoundException(
                'Food item not found.')
        
        food = Food(size = request.size,
                    user = user.key,
                    foodItem = fooditem.key)
        food.put()
        
        return FoodForm(size = request.size,
                        fooditemForm = fooditem.to_form(),
                        user = user.name,
                        dagsetning = str(food.dagsetning))
    @endpoints.method(request_message= CONSUMPTION_REQUEST,
                      response_message=FoodForms,
                      path='get_food',
                      name='get_food',
                      http_method='GET')   
    def get_food(self, request):
        user = User.query(User.email == request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                'User does not exist.')

        dagsetning_leit2 = date(request.year2,request.month2,request.day2)
        dagsetning_leit1 = date(request.year1,request.month1,request.day1)

        consumption = Food.query(Food.user == user.key,Food.dagsetning <= dagsetning_leit2,Food.dagsetning >= dagsetning_leit1).fetch()
        
        foodForms = []
        for item in consumption:
            foodForms.append(FoodForm(user = user.name,
                                      size = item.size,
                                      fooditemForm = item.foodItem.get().to_form(),
                                      dagsetning = str(item.dagsetning)))
        
        
        
        return FoodForms(items = foodForms)
                        
api = endpoints.api_server([MatarvefurApi])


