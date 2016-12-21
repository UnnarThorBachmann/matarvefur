import codecs
#from models import FootItem

f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
f2 = codecs.open('flokkar.txt','w')
for line in f:
    items = line.split(";")
    heiti = items[1]
    f2.write(('<option value="%s"> </option>\n' % heiti).encode('utf-8'))
f2.close()
f.close()
