# Generated by Django 3.2.3 on 2021-05-24 00:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lugar',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=20, max_digits=30),
        ),
    ]
