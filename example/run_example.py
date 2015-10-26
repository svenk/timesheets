#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Package "stundenzettel_generator", excutable example
# (c) 2015 Sven K., GPL
#
# This Python2 code is a working standalone executable to play around
# with the StundenzettelGenerator objects. Consider also the interactive
# python shell as an example.
#
# Run as:
#  $  python run_example.py
# 
#

import sys

# append the "stundenzettel_generator" module from the parent path
sys.path.append("..")

from stundenzettel_generator import StundenzettelGenerator

# the template data are specific to the template, in this case a given example file
example_template = 'Stundenzettel-vorlage.ods'
example_target   = 'Stundenzettel-ausgefuellt.pdf'

example_data = {
	'INSTITUT': u'Institut für Automatisierung', # example for unicode characters
	'NAME':     'HAL 9000',
	'MONAT':    'Mai 2015',
	'PERSNR':   '', # just left blank

	# these parameters drive the simulation
	'month': 10, 'year': 2014,
	'sum': 40, 'hours': 40
}

gen = StundenzettelGenerator(example_template, example_target, example_data)

gen.make()
