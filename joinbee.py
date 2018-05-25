import csv

file = open("public/data/bee.csv", "r")
reader = csv.reader(file)

file2 = open("public/data/bee2.csv", "w+")
writer = csv.writer(file2)
writer.writerow(["beex, beey, index"])
for i, row in enumerate(reader):
	#print i
	#print row
	row.append(i)
	print row
	writer.writerow(row)
