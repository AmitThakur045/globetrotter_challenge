# Generated by Django 4.2.19 on 2025-03-01 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='destination',
            name='name',
        ),
    ]
