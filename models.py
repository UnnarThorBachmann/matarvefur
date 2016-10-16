import random
import codecs
from datetime import date, datetime
from protorpc import messages
from google.appengine.ext import ndb

class FoodItem(ndb.Model):
    nr = ndb.IntegerProperty(required=True)
    heiti = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=True)
    ediblePortion = ndb.IntegerProperty(required=True)
    foodGroup1 = ndb.IntegerProperty(required=True)
    foodGroup2 = ndb.IntegerProperty(required=True)
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
    
    
class StringMessage(messages.Message):
    """StringMessage-- outbound (single) string message"""
    message = messages.StringField(1, required=True)

