# Package "stundenzettel_generator"
# (c) 2015 Sven K., GPL

# Setup for PyPi, easy_install and friends. Not yet tested.
#
# vgl. http://python-packaging.readthedocs.org/en/latest/minimal.html

from setuptools import setup

setup(name='stundenzettel_generator',
      version='0.1',
      description='A program to generate time sheets, e.g. for the German minimum wage law',
      url='http://github.com/svenk/stundenzettel_generator',
      author='svenk',
      author_email='svenk@github.com',
      license='GPL',
      packages=['stundenzettel_generator'],
      zip_safe=True)

