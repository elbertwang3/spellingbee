import csv
import difflib
import unidecode


def iterative_levenshtein(s, t):
	""" 
		iterative_levenshtein(s, t) -> ldist
		ldist is the Levenshtein distance between the strings 
		s and t.
		For all i and j, dist[i,j] will contain the Levenshtein 
		distance between the first i characters of s and the 
		first j characters of t
	"""
	rows = len(s)+1
	cols = len(t)+1
	dist = [[0 for x in range(cols)] for x in range(rows)]
	# source prefixes can be transformed into empty strings 
	# by deletions:
	for i in range(1, rows):
		dist[i][0] = i
	# target prefixes can be created from an empty source string
	# by inserting the characters
	for i in range(1, cols):
		dist[0][i] = i
		
	for col in range(1, cols):
		for row in range(1, rows):
			if s[row-1] == t[col-1]:
				cost = 0
			else:
				cost = 1
			deletion = dist[row-1][col] + 1
			insertion = dist[row][col-1] + 1
			substitution = dist[row-1][col-1] + cost
			a = [deletion, insertion, substitution]
			dist[row][col] = min(a) # substitution
			#print a.index(min(a))
	rowscount = rows-1
	colscount = cols-1
	#print colscount
	while rowscount > 0 or colscount > 0:
		currdistance = dist[rowscount][colscount]
		#print 'currdistance: ' + str(currdistance)
		deletion = dist[rowscount-1][colscount]

		insertion = dist[rowscount][colscount-1]
		substitution = dist[rowscount-1][colscount-1]
		a = [substitution, deletion, insertion]
		#print a
		mindist = min(a)
		#print 'mindist: ' + str(mindist)
		argmin = a.index(min(a))
		#print 'argmin: ' + str(argmin)
	   
		

		if argmin == 1:
			
			rowscount -= 1
			if currdistance == mindist + 1:
				print "delete " + s[rowscount]
		elif argmin == 2:
			
			colscount -= 1
			if currdistance == mindist + 1:
				print "insert " + t[colscount]
			
		elif argmin == 0:
			
			colscount -= 1
			rowscount -= 1
			if currdistance == mindist + 1:
				print "sub " + s[rowscount] + " for " + t[colscount]
			

	for r in range(rows):
		#print(dist[r])
		pass


	
 
	return dist[row][col]

file = open("public/data/results.csv", "r")
reader = csv.reader(file)
next(reader)
for thing in reader:
	#print row
	correct_spelling = thing[6]
	given_spelling = thing[7]
	correct = thing[8]
	#print correct_spelling
	#print given_spelling
	if correct and given_spelling:
		print given_spelling
		print correct_spelling
		iterative_levenshtein(given_spelling.lower(),correct_spelling.lower())
		#break
		#print correct_spelling
		#print given_spelling
		#print difflib.ndiff(given_spelling, correct_spelling)
		'''for i,s in enumerate(difflib.ndiff(given_spelling.lower().decode('UTF-8'), correct_spelling.lower().decode('UTF-8'))):
			if s[0]==' ': 
				continue
			elif s[0]=='-':
				print(u'Delete "{}" from position {}'.format(s[-1],i))
			elif s[0]=='+':
				print(u'Add "{}" to position {}'.format(s[-1],i))''' 

#print iterative


#print(iterative_levenshtein("flaw", "lawn"))