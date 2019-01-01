import json
import googlemaps
import sys
import logging
import re
gmaps = googlemaps.Client(key='AIzaSyDVY2gfyRxBceJNN6bFESkKMpqPsRnnhSM')

spellers = json.load(open('2018spellers.json', "r"))

for speller in spellers:
	to_geocode = speller['city'] + ", " + speller['state']
	#try:
	geocode_result = gmaps.geocode(to_geocode)
	lat = (geocode_result[0]['geometry']['location']['lat'])
	lng = (geocode_result[0]['geometry']['location']['lng'])

		#print lat
		#print lng
	'''except Exception as e:
		logger.exception(e)
		logger.error("Skipping!")
	except:
		e = sys.exc_info()
		print e'''
	appearances =  speller['previous_bees'].count("tied")
	#print appearances
	speller['appearances'] = appearances
	speller['latitude'] = lat
	speller['longitude'] = lng
	speller['fav_word'] = speller['fav_word'].lower()
	#speller['best_placement'] = 
	ranks = []
	if re.findall('(\d+)(?:st|nd|rd|th)', speller['previous_bees']):
		speller['best_placement'] = min(map(int, (re.findall('(\d+)(?:st|nd|rd|th)', speller['previous_bees']))))
	

	
	

json.dump(spellers, open('2018spellers2.json', "w+"))