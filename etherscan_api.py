import requests
import time
import json
#list of all token addresses
tokens = [
    "0xd5525d397898e5502075ea5e830d8914f6f0affe",
    "0x9765FeA9752505a685c1bce137Ae5b2EFe8dDf62",
    "0x88ef27e69108b2633f8e1c184cc37940a075cc02",
    "0x9D47894f8BECB68B9cF3428d256311Affe8B068B",
    "0xA1AFFfE3F4D611d252010E3EAf6f4D77088b0cd7",
    "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44",
    "0xE8b251822d003a2b2466ee0E38391C2db2048739",
    "0x9ceb84f92a0561fa3cc4132ab9c0b76a59787544",
    "0xb78B3320493a4EFaa1028130C5Ba26f0B6085Ef8",
    "0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa",
    "0xD2dDa223b2617cB616c1580db421e4cFAe6a8a85",
    "0xFbEEa1C75E4c4465CB2FCCc9c6d6afe984558E20",
    "0x2216e873ea4282EbEf7A02aC5aeA220bE6391A7C"
    ]
answer = dict()
for address in tokens:
    lenj = 10000
    startBlock = 0
    while (lenj == 10000):
        r = requests.get('https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&startblock='+str(startBlock)+'&endblock=99999999&sort=asc&apikey=YourApiKeyToken')
        while (r.status_code != 200):
            print("Retrying...")
            r = requests.get('https://api.etherscan.io/api?module=account&action=txlist&address='+address+'&startblock='+str(startBlock)+'&endblock=99999999&sort=asc&apikey=YourApiKeyToken')
        j = r.json()['result']
        lenj = len(j)
        #print(type(j))
        startBlock = int(j[-1]["blockNumber"])-1
        for i in range(lenj):
            answer[j[i]["from"]]=1
        time.sleep(5)
        print(len(answer))
#list of all holders in a text file - one per line
#replace me with the location of the holders list
#you will have to manually download the holders for each token from etherscan for this step
f = open("C:\\Users\\<your username>\\Desktop\\hold.txt", 'r')
k = f.readlines()
for i in k:
    answer[i.strip()]=1
print(len(answer))
#replace me with the place you want to dump the json file containing everyone who qualifies
with open('C:\\Users\\<your username>\\Desktop\\holders.json', 'w') as fp:
    json.dump(answer, fp)
            
