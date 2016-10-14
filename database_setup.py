import codecs
#from models import FootItem

f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
    
for line in f:
    items = line.split(";")
    print items[0],items[1],items[2]
        
f.close()
