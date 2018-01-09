import sys
import random, string

try:
    numberOfEmailsToGenerate = int(sys.argv[1])
    print('Generating a CSV with %d random emails' % numberOfEmailsToGenerate)
    print('This may take some time if the CSV is large ...')
except:
    sys.exit('Failed to parse argument. Usage "python %s <number of expected e-mail addresses e.g.: 10>' % sys.argv[0])

with open("./generated.csv", "w") as generated_csv:
    for x in range(0, numberOfEmailsToGenerate):
        randomString = ''.join(random.choice(string.lowercase) for i in range(20))
        generated_csv.write("%s@gmail.com\n" % randomString)
