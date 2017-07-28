import sys
import random, string
import os

numberOfEmailsToGenerate = sys.argv[1]

try:
    int(numberOfEmailsToGenerate)
    print('Generating a CSV with ' + numberOfEmailsToGenerate + ' random emails')
    print('This make take some time if the CSV is large ...')
except:
    sys.exit('Please pass a number as the first arg')

numberOfEmailsToGenerate = int(numberOfEmailsToGenerate)

# Delete ./generated.csv, then create it
os.system('touch ./generated.csv')

for x in range(0, numberOfEmailsToGenerate):
    randomString = ''.join(random.choice(string.lowercase) for i in range(20))
    os.system('echo ' + randomString + '@email.com' ' >> ./generated.csv')
