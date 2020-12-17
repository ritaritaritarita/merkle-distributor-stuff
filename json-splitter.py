import json
#input
with open('C:\\Users\\<<username>>\\Downloads\\merkle-distributor\\scripts\\res.json', 'r') as fp:
    data = json.load(fp)
data = data["claims"]
l = list(data.keys())
res = dict()
counter = 0;
for i in range(len(l)):
    res[l[i]] = data[l[i]]
    if (i%20000==19999):
        counter+=1
        with open('C:\\Users\\<<username>>\\Desktop\\split'+str(counter)+'.json', 'w') as f:
            json.dump(res, f)
            print("files created: "+str(counter))
        res = dict()
counter+=1
#output
with open('C:\\Users\\<<username>>\\Desktop\\split'+str(counter)+'.json', 'w') as f:
    json.dump(res, f)
    print("files created: "+str(counter))
