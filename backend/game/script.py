## write the script to populate destination table from data.py file

import os
import sys

import django
from django.db import transaction

from game.models import Destination
from game.data import destination_data

cwd = os.getcwd()
if cwd not in sys.path:
    sys.path.append(cwd)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()


def main():
    try:
        with transaction.atomic():
            destination_objs = []
            with transaction.atomic():
                for destination in destination_data:
                    destination_obj = Destination(
                        city=destination['city'],
                        country=destination['country'],
                        clues=destination['clues'],
                        fun_facts=destination['fun_fact'],
                        trivia=destination['trivia']
                    )
                    destination_objs.append(destination_obj)
                Destination.objects.bulk_create(destination_objs)

        print('Destination table populated successfully')
    except BaseException as e:
        print(e)
        print('Failed to populate destination table')