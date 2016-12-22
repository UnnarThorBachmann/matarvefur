# -*- encoding: utf-8 -*-

import endpoints
import codecs
import math
from datetime import date,datetime
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
                    CategoryForm,
                    Statistics,
                    StatisticsForm,
                    StatisticsForms)
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


SEARCH_FOOD_ITEMS = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=False),
    category = messages.IntegerField(2,required=False),
    subcategory = messages.IntegerField(3,required=False))

CREATE_USER_REQUEST = endpoints.ResourceContainer(
    user_name = messages.StringField(1,required=True),
    user_email = messages.StringField(2,required=True))
FOOD_REQUEST = endpoints.ResourceContainer(
    size = messages.FloatField(1,required=True),
    user_email = messages.StringField(2,required=True),
    food_item_heiti = messages.StringField(3,required=True),
    mal = messages.StringField(4,required=True),
    dags = messages.StringField(5,required=False))
    
CONSUMPTION_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    dags2 = messages.StringField(2,required=True),
    dags1 = messages.StringField(3,required=True))
    

DELETE_REQUEST = endpoints.ResourceContainer(
    user_email = messages.StringField(1,required=True),
    food_item_heiti = messages.StringField(2,required=True),
    size = messages.IntegerField(3,required=True),
    mal = messages.StringField(4,required=True),
    dags = messages.StringField(5,required=True))

    
    

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
    def dags_str_datetime(self,dags):
        if dags:
            a = dags.split('-')
            dagsetning = datetime(int(a[0]),int(a[1]),int(a[2]))
        else:
            dagsetning = datetime.now()
        return dagsetning
    """
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
    """
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
            if int(items[0]) > 908:
                
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
                                    cis_fjolomettadar_fitusyrur_n_3 = columns[48])
                    fooditem.put()
                    n += 1
                except ValueError:
                    raise endpoints.BadRequestException("Error inserting to a database")
            
        f.close()
        return StringMessage(message="Finished resetting the database with "+ str(n) + " items.")
    # Food item functions.
    

    @endpoints.method(request_message= FOOD_ITEM_REQUEST,
            response_message=FoodItemForm,
            path='food_item_get',
            name='food_item_get',
            http_method='GET')   
    def food_item_get(self, request):
        if request.user_email:
            user = User.query(User.email == request.user_email).get()
            if not user:
                raise endpoints.NotFoundException(
                    'User not found.')
            else:
                for item in user.fooditems:
                    if item.heiti == request.food_item_heiti:
                        return item.to_form()
                raise endpoints.NotFoundException(
                    'Item not found.')
        else:                    
            fooditem = fooditem = FoodItem.query(FoodItem.heiti == request.food_item_heiti).get()
        
            if not fooditem:
                raise endpoints.NotFoundException(
                    'No food item found.')

            return fooditem.to_form()

    
    
    @endpoints.method(request_message= FOOD_ITEM_DELETE_REQUEST,
            response_message=StringMessage,
            path='food_item_delete',
            name='food_item_delete',
            http_method='GET')   
    def food_item_delete(self, request):
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

        return StringMessage(message='One item deleted')
    @endpoints.method(request_message= SEARCH_FOOD_ITEMS,
            response_message=FoodItemForms,
            path='food_items_get',
            name='food_items_get',
            http_method='GET')   
    def food_items_get(self, request):
        if request.user_email:
            user = User.query(User.email== request.user_email).get()
            if not user:
                raise endpoints.NotFoundException('No user found.')
            return  FoodItemForms(items = [item.to_form() for item in user.fooditems],category=None, subcategory=None)
        elif request.category:
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
         
            return FoodItemForms(items=[fooditem.to_form() for fooditem in fooditems],
                                 category = cat[0],
                                subcategory = cat[1])
    
        else:
            return FoodItemForms(items =[],category=None,subcategory=None)
            
    """
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
    """
    
    
    @endpoints.method(request_message= FOOD_ITEM_REGISTER,
            response_message=FoodItemForm,
            path='food_item_put',
            name='food_item_put',
            http_method='PUT')   
    def food_item_put(self, request):
        user = User.query(User.email== request.user_email).get()
        if not user:
            raise endpoints.ForbiddenException(
                'User does not exist.')
        
        if user.get_item(request.heiti):
            raise endpoints.ForbiddenException(
                'Item does exist.')
        fooditem = FoodItem.query(FoodItem.heiti == request.heiti).get()
        
        if fooditem:
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

    """
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
        
        dagsetning = self.dags_str_datetime(request.dags)
            
        food = Food(size = request.size,
                    user = user.key,
                    foodItem = fooditem.key,
                    mal = request.mal,
                    dagsetning = dagsetning)
        food.put()
        
        return FoodForm(size = request.size,
                        fooditemForm = fooditem.to_form(),
                        user = user.name,
                        dagsetning = str(food.dagsetning),
                        mal = FoodForm.Mal(food.mal))
   
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

        dagsetning_leit2 = self.dags_str_datetime(request.dags2)
        dagsetning_leit1 = self.dags_str_datetime(request.dags1)

        consumption = Food.query(Food.user == user.key,Food.dagsetning <= dagsetning_leit2,Food.dagsetning >= dagsetning_leit1).fetch()
        
        foodForms = []
        for item in consumption:
            foodForms.append(FoodForm(user = user.name,
                                      size = item.size,
                                      fooditemForm = item.foodItem.get().to_form(),
                                      dagsetning = str(item.dagsetning),
                                      mal=FoodForm.Mal(item.mal)))
        
    
        return FoodForms(items = foodForms)
    
    @endpoints.method(request_message= CONSUMPTION_REQUEST,
                      response_message=StatisticsForms,
                      path='statistics',
                      name='statistics',
                      http_method='GET')   
    def statistics(self, request):
        user = User.query(User.email == request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                'User does not exist.')

        dagsetning_leit2 = self.dags_str_datetime(request.dags2)
        dagsetning_leit1 = self.dags_str_datetime(request.dags1)

        consumption = Food.query(Food.user == user.key,Food.dagsetning <= dagsetning_leit2,Food.dagsetning >= dagsetning_leit1).fetch()
        fita = 0
        kolvetni = 0
        protein = 0
        days_dict =  {} 
        
        for food in consumption:
            fooditem = food.foodItem.get()

            if not days_dict.has_key(str(food.dagsetning)):
               days_dict[str(food.dagsetning)] = {'protein': 0,'fita': 0, 'kolvetni': 0, 'orka':0}
               
            if hasattr(fooditem,'fita'):
                days_dict[str(food.dagsetning)]['fita'] += fooditem.fita
            if hasattr(fooditem,'kolvetni_alls'):
                days_dict[str(food.dagsetning)]['kolvetni'] += fooditem.kolvetni_alls
            if hasattr(fooditem,'protein'):
                days_dict[str(food.dagsetning)]['protein'] += fooditem.protein

        
        for day in days_dict.keys():
            days_dict[day]['orka'] = 37*days_dict[day]['fita'] + 17*days_dict[day]['protein'] + 17*days_dict[day]['kolvetni']


        consumpt_days = []
        for day in days_dict.keys():     
            stat = Statistics(user = user.name,
                              fita = days_dict[day]['fita'],
                              kolvetni = days_dict[day]['kolvetni'],
                              protein = days_dict[day]['protein'],
                              orka = days_dict[day]['orka'],
                              protein_orku_hlutfall = float(17)*days_dict[day]['protein']/days_dict[day]['orka'],
                              kolvetni_orku_hlutfall = float(17)*days_dict[day]['kolvetni']/days_dict[day]['orka'],
                              fita_orku_hlutfall = float(37)*days_dict[day]['fita']/days_dict[day]['orka'],
                              dagsetning = day)
            consumpt_days.append(stat)
        return StatisticsForms(items = [item.to_form() for item in consumpt_days])
    
    @endpoints.method(request_message= DELETE_REQUEST,
                      response_message=StringMessage,
                      path='delete_food',
                      name='delete_food',
                      http_method='PUT')   
    def delete_food(self, request):
        user = User.query(User.email == request.user_email).get()
        if not user:
            raise endpoints.NotFoundException(
                'User does not exist.')

        size = request.size
        dagsetning = self.dags_str_datetime(request.dags)

        fooditem = FoodItem.query(FoodItem.heiti == request.food_item_heiti).get()
        food_to_delete = Food.query(Food.user == user.key,
                                    Food.dagsetning == dagsetning,
                                    Food.foodItem == fooditem.key,
                                    Food.mal==request.mal).get()
        
        
        if food_to_delete is None:
            return StringMessage(message= 'No item deleted.')
        else:
            food_to_delete.key.delete()
            return StringMessage(message='Food deleted.')
        
    """
    
                        
api = endpoints.api_server([MatarvefurApi])


