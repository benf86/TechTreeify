#!/usr/bin/python
import sys
import logging
import os
import inspect

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '{}/..'.format(os.path.dirname(
            os.path.abspath(inspect.getfile(
                inspect.currentframe())))))

from visualize import app as application
