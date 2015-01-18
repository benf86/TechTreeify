#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,'/home/benf/public_html/techtreeify/server')
from visualize import app as application
application.secret_key = 'whaaaat'
