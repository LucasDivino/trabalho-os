from django.contrib.auth.models import User
from django.db import models


class Lugar(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    latitude =  models.DecimalField(blank=True, decimal_places=20, max_digits=30)
    longitude =  models.DecimalField(blank=True, decimal_places=20, max_digits=30)
    name = models.CharField(blank=True, max_length=30)
    destino = models.BooleanField(default=False)

    class Meta:
        db_table = 'lugares'

    def __str__(self):
        return self.name

