import codecs
#from models import FootItem

f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
f2 = codecs.open('flokkar.txt','w')
heitin = []
for line in f:
    items = line.split(";")
    heiti = items[1]
    heitin.append(heiti)

heitin = sorted(heitin)
for heiti in heitin:
    f2.write(('<option value="%s"> </option>\n' % heiti).encode('utf-8'))

f2.close()
f.close()
