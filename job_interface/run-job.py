#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Jobbed infrastructure.
#
# TO BE DONE; hier ist nur die argparse()-Syntax von der StandupStrategy hinkopiert.
#
# Dies hier sollte der Nachfolger fuer das PHP/Bash/Python-Konzept des alten Codes sein.
#

import argparse, sys

parser = argparse.ArgumentParser(description='Testing the StandupStrategy algorithm')
parser.add_argument('--iterations', metavar='N', dest='iterations', type=int, default=1,
	           help='How many iterations you want to run')
parser.add_argument('--month', metavar='MM', dest='month', type=int, choices=range(1,12),
	           help='Month as number (2 digits)')
parser.add_argument('--year', metavar='YYYY', dest='year', type=int, choices=range(1970,2020),
		   help='Year as number (4 digits)')

args = parser.parse_args()
if not args.month or not args.year:
	print "Missing month or year"
	parser.print_usage()
	sys.exit(1)

# example data
data = { 'month': args.month, 'year': args.year }

s = StandupStrategy(data)

for i in range(0, args.iterations):
	res = s.createSchedule()
	s.checkSchedule(res, silent=False)
	s.printSchedule(res)
