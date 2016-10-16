import random
import codecs
from datetime import date, datetime
from protorpc import messages
from google.appengine.ext import ndb

class User(ndb.Model):
    name = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    
class FoodProportion(ndb.Model):
    size = ndb.FloatProperty(required=True)
    user = ndb.KeyProperty(required=True,kind='User')
    fooditem = ndb.KeyProperty(required=True,kind='FoodItem')

class FoodItem(ndb.Model):
    nr = ndb.IntegerProperty(required=True)
    heiti = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=True)
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
        return form
    
class StringMessage(messages.Message):
    """StringMessage-- outbound (single) string message"""
    message = messages.StringField(1, required=True)

class FoodItemForm(messages.Message):
    heiti = messages.StringField(1,required=True)
    name = messages.StringField(2,required=True)
    ediblePortion = messages.IntegerField(3,required=False)
    foodGroup1 = messages.IntegerField(4,required=False)
    foodGroup2 = messages.IntegerField(5,required=False)
    
