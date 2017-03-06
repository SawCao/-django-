from __future__ import unicode_literals

from django.db import models

# Create your models here.

class equiInfos(models.Model):
    sn = models.CharField(max_length=100)
    namee = models.CharField(max_length=100)
    temperature = models.IntegerField()
    times = models.CharField(max_length=100)
    errors = models.CharField(max_length=100)
    history = models.TextField()
    states = models.BooleanField(True)
