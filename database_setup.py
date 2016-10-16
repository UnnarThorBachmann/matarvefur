import codecs
#from models import FootItem

f = codecs.open('isgem2.csv', encoding='ISO-8859-1')
    
for line in f:
    items = line.split(";")
    columns = []
    for i in range(len(items)):
        if i == 0:
            columns.append(int(items[i]))
        elif i == 1 or i==2:
            columns.append(items[i])
        else:
            if any(char.isdigit() for char in items[i]): 
                columns.append(float(items[i].replace(u',',u'.')))
            else:
                columns.append(None)

    print len(columns)
f.close()
