import random
import codecs
from datetime import date, datetime
from protorpc import messages
from google.appengine.ext import ndb


class FoodItem(ndb.Model):
    nr = ndb.IntegerProperty(required=False)
    heiti = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=False)
    ediblePortion = ndb.IntegerProperty(required=False)
    foodGroup1 = ndb.IntegerProperty(required=False)
    foodGroup2 = ndb.IntegerProperty(required=False)
    protein = ndb.FloatProperty(required=False)
    fita = ndb.FloatProperty(required=False)
    mettadar_fitusyrur = ndb.FloatProperty(required=False)
    cis_einomettadar_fitusyrur = ndb.FloatProperty(required=False)
    cis_fjolomettadar_fitusyrur = ndb.FloatProperty(required=False)
    cis_fjolomettadar_fitu_n_3_langar = ndb.FloatProperty(required=False)
    trans_fitusyrur = ndb.FloatProperty(required=False)
    kolestrol = ndb.FloatProperty(required=False)
    kolvetni_alls = ndb.FloatProperty(required=False)
    sykrur = ndb.FloatProperty(required=False)
    vidbaettur_sykur = ndb.FloatProperty(required=False)
    trefjaefni = ndb.FloatProperty(required=False)
    alkohol = ndb.FloatProperty(required=False)
    steinefni_alls = ndb.FloatProperty(required=False)
    vatn = ndb.FloatProperty(required=False)
    a_vitamin_rj = ndb.FloatProperty(required=False)
    retinol = ndb.FloatProperty(required=False)
    beta_karotin = ndb.FloatProperty(required=False)
    d_vitamin = ndb.FloatProperty(required=False)
    e_vitamin_alfa_tj = ndb.FloatProperty(required=False)
    alfa_tokoferol = ndb.FloatProperty(required=False)
    b1_vitamin = ndb.FloatProperty(required=False)
    b2_vitamin = ndb.FloatProperty(required=False)
    niasin_jafngildi = ndb.FloatProperty(required=False)
    niasin = ndb.FloatProperty(required=False)
    b6_vitamin = ndb.FloatProperty(required=False)
    folat_alls = ndb.FloatProperty(required=False)
    b_12_vitamin = ndb.FloatProperty(required=False)
    c_vitamin = ndb.FloatProperty(required=False)
    kalk = ndb.FloatProperty(required=False)
    fosfor = ndb.FloatProperty(required=False)
    magnesium = ndb.FloatProperty(required=False)
    natrium = ndb.FloatProperty(required=False)
    kalium = ndb.FloatProperty(required=False)
    jarn = ndb.FloatProperty(required=False)
    sink = ndb.FloatProperty(required=False)
    kopar = ndb.FloatProperty(required=False)
    jod = ndb.FloatProperty(required=False)
    mangan = ndb.FloatProperty(required=False)
    selen = ndb.FloatProperty(required=False)
    fluor = ndb.FloatProperty(required=False)
    cis_fjolomettadar_fitusyrur_n_6 = ndb.FloatProperty(required=False)
    cis_fjolomettadar_fitusyrur_n_3 = ndb.FloatProperty(required=False)
    def to_form(self):
        form = FoodItemForm()
        form.heiti = self.heiti
        form.name = self.name
        form.ediblePortion = self.ediblePortion
        form.foodGroup1 = self.foodGroup1
        form.foodGroup2 = self.foodGroup2
        form.protein = self.protein
        form.fita = self.fita
        form.mettadar_fitusyrur = self.mettadar_fitusyrur 
        form.cis_einomettadar_fitusyrur = self.cis_einomettadar_fitusyrur
        form.cis_fjolomettadar_fitusyrur = self.cis_fjolomettadar_fitusyrur
        form.cis_fjolomettadar_fitu_n_3_langar = self.cis_fjolomettadar_fitu_n_3_langar
        form.trans_fitusyrur = self.trans_fitusyrur
        form.kolestrol = self.kolestrol
        form.kolvetni_alls = self.kolvetni_alls
        form.sykrur = self.sykrur
        form.vidbaettur_sykur = self.vidbaettur_sykur
        form.trefjaefni = self.trefjaefni
        form.alkohol = self.alkohol
        form.steinefni_alls = self.steinefni_alls
        form.vatn = self.vatn
        form.a_vitamin_rj = self.a_vitamin_rj
        form.retinol = self.retinol
        form.beta_karotin = self.beta_karotin
        form.d_vitamin = self.d_vitamin
        form.e_vitamin_alfa_tj = self.e_vitamin_alfa_tj
        form.alfa_tokoferol = self.alfa_tokoferol
        form.b1_vitamin = self.b1_vitamin 
        form.b2_vitamin = self.b2_vitamin
        form.niasin_jafngildi = self.niasin_jafngildi
        form.niasin = self.niasin
        form.b6_vitamin = self.b6_vitamin
        form.folat_alls = self.folat_alls
        form.b_12_vitamin = self.b_12_vitamin
        form.c_vitamin = self.c_vitamin
        form.kalk = self.kalk
        form.fosfor = self.fosfor
        form.magnesium = self.magnesium
        form.natrium = self.natrium
        form.kalium = self.kalium
        form.jarn = self.jarn
        form.sink = self.sink
        form.kopar = self.kopar
        form.jod = self.jod
        form.mangan = self.mangan
        form.selen = self.selen
        form.fluor = self.fluor
        form.cis_fjolomettadar_fitusyrur_n_6 = self.cis_fjolomettadar_fitusyrur_n_6
        form.cis_fjolomettadar_fitusyrur_n_3 = self.cis_fjolomettadar_fitusyrur_n_3 
        return form

class User(ndb.Model):
    name = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    fooditems = ndb.StructuredProperty(FoodItem, repeated=True)
    consumption_days = ndb.StringProperty(repeated=True)
    def to_form(self):
        form = userForm()
        form.user = self.user
        form.email = self.email
        form.consumption_days = self.consumption_days
        return form
    
    def put_item(self,fooditem):
        self.fooditems.append(fooditem)
        
    def put_consumption_days(self,consumption_day):
        self.consumption_days.append(consumption_day)
        
    def get_item(self,heiti):
        for item in self.fooditems:
            if item.heiti == heiti:
                return item
        return None
        


class Food(ndb.Model):
    user = ndb.KeyProperty(required=True,kind='User')
    size = ndb.FloatProperty(required=True)
    foodItem = ndb.KeyProperty(required=False,kind='FoodItem')
    foodItemName = ndb.StringProperty(required=False)
    dagsetning = ndb.DateProperty(required=True)
    mal = ndb.StringProperty(required=True)

class Statistics(ndb.Model):
    user = ndb.StringProperty(required=True)
    fita = ndb.FloatProperty(required=True)
    kolvetni = ndb.FloatProperty(required=True)
    protein = ndb.FloatProperty(required=True)
    orka = ndb.FloatProperty(required=True)
    protein_orku_hlutfall = ndb.FloatProperty(required=True)
    kolvetni_orku_hlutfall = ndb.FloatProperty(required=True)
    fita_orku_hlutfall = ndb.FloatProperty(required=True)
    dagsetning = ndb.StringProperty(required=True)
    def to_form(self):
        form = StatisticsForm()
        form.user = self.user
        form.fita = self.fita
        form.kolvetni = self.kolvetni
        form.protein = self.protein
        form.orka = self.orka
        form.protein_orku_hlutfall = self.protein_orku_hlutfall
        form.kolvetni_orku_hlutfall = self.kolvetni_orku_hlutfall
        form.fita_orku_hlutfall = self.fita_orku_hlutfall
        form.dagsetning = self.dagsetning
    
        return form
    
class StringMessage(messages.Message):
    """StringMessage-- outbound (single) string message"""
    message = messages.StringField(1, required=True)

class FoodItemForm(messages.Message):
    heiti = messages.StringField(1,required=True)
    name = messages.StringField(2,required=False)
    ediblePortion = messages.IntegerField(3,required=False)
    foodGroup1 = messages.IntegerField(4,required=False)
    foodGroup2 = messages.IntegerField(5,required=False)
    protein = messages.FloatField(6,required=False)
    fita = messages.FloatField(7,required=False)
    mettadar_fitusyrur = messages.FloatField(8,required=False)
    cis_einomettadar_fitusyrur = messages.FloatField(9,required=False)
    cis_fjolomettadar_fitusyrur = messages.FloatField(10,required=False)
    cis_fjolomettadar_fitu_n_3_langar = messages.FloatField(11,required=False)
    trans_fitusyrur = messages.FloatField(12,required=False)
    kolestrol = messages.FloatField(13,required=False)
    kolvetni_alls = messages.FloatField(14,required=False)
    sykrur = messages.FloatField(15,required=False)
    vidbaettur_sykur = messages.FloatField(16,required=False)
    trefjaefni = messages.FloatField(17,required=False)
    alkohol = messages.FloatField(18,required=False)
    steinefni_alls = messages.FloatField(19,required=False)
    vatn = messages.FloatField(20,required=False)
    a_vitamin_rj = messages.FloatField(21,required=False)
    retinol = messages.FloatField(22,required=False)
    beta_karotin = messages.FloatField(23,required=False)
    d_vitamin = messages.FloatField(24,required=False)
    e_vitamin_alfa_tj = messages.FloatField(25,required=False)
    alfa_tokoferol = messages.FloatField(26,required=False)
    b1_vitamin = messages.FloatField(27,required=False)
    b2_vitamin = messages.FloatField(28,required=False)
    niasin_jafngildi = messages.FloatField(29,required=False)
    niasin = messages.FloatField(30,required=False)
    b6_vitamin = messages.FloatField(31,required=False)
    folat_alls = messages.FloatField(32,required=False)
    b_12_vitamin = messages.FloatField(33,required=False)
    c_vitamin = messages.FloatField(34,required=False)
    kalk = messages.FloatField(35,required=False)
    fosfor = messages.FloatField(36,required=False)
    magnesium = messages.FloatField(37,required=False)
    natrium = messages.FloatField(38,required=False)
    kalium = messages.FloatField(39,required=False)
    jarn = messages.FloatField(40,required=False)
    sink = messages.FloatField(41,required=False)
    kopar = messages.FloatField(42,required=False)
    jod = messages.FloatField(43,required=False)
    mangan = messages.FloatField(44,required=False)
    selen = messages.FloatField(45,required=False)
    fluor = messages.FloatField(46,required=False)
    cis_fjolomettadar_fitusyrur_n_6 = messages.FloatField(47,required=False)
    cis_fjolomettadar_fitusyrur_n_3 = messages.FloatField(48,required=False)

class FoodItemForms(messages.Message):
    items = messages.MessageField(FoodItemForm,1,repeated=True)
    category = messages.StringField(2,required=False)
    subcategory = messages.StringField(3,required=False)

class FoodForm(messages.Message):
    class Mal(messages.Enum):
        Morgunmatur = 1
        Morgunsnarl = 2
        Hadegismatur = 3
        Middegissnarl = 4
        Kvoldmatur = 5
        Kvoldsnarl = 6
        

    user = messages.StringField(1,required = True)
    size = messages.FloatField(2,required=True)
    fooditemForm = messages.MessageField(FoodItemForm,3,required = True)
    dagsetning = messages.StringField(4,required=True)
    mal = messages.EnumField('Mal',5,required=True,default="Morgunmatur")
     

class FoodForms(messages.Message):
    items = messages.MessageField(FoodForm,1,repeated=True)


class StatisticsForm(messages.Message):
    user = messages.StringField(1,required = True)
    fita = messages.FloatField(2,required = True)
    kolvetni = messages.FloatField(3,required = True)
    protein = messages.FloatField(4, required = True)
    orka = messages.FloatField(5,required = True)
    protein_orku_hlutfall = messages.FloatField(6,required=True)
    kolvetni_orku_hlutfall = messages.FloatField(7,required=True)
    fita_orku_hlutfall = messages.FloatField(8,required=True)
    dagsetning = messages.StringField(9,required=True)

class StatisticsForms(messages.Message):
    items = messages.MessageField(StatisticsForm,1,repeated=True)
    
class CategoryForm(messages.Message):
    category = messages.StringField(1,required=True)
    subcategory = messages.StringField(2,required=False)
    items = messages.StringField(3,repeated=True)

class UserForm(messages.Message):
    name = messages.StringField(1,required=True)
    email = messages.StringField(2,required=True)
    consumption_days = messages.StringField(3,repeated=True)
