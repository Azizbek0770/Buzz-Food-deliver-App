# Generated by Django 4.2 on 2025-01-11 08:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_type', models.CharField(choices=[('cash', 'Naqd pul'), ('card', 'Karta'), ('online', "Online to'lov")], max_length=20)),
                ('status', models.CharField(choices=[('pending', 'Kutilmoqda'), ('completed', 'Tugallandi'), ('failed', 'Muvaffaqiyatsiz'), ('refunded', 'Qaytarildi')], default='pending', max_length=20)),
                ('transaction_id', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='orders.order')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PaymeTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_id', models.CharField(max_length=255, unique=True, verbose_name='Tranzaksiya ID')),
                ('request_id', models.CharField(blank=True, max_length=255, null=True, verbose_name="So'rov ID")),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Summa')),
                ('status', models.CharField(choices=[('pending', 'Kutilmoqda'), ('processing', 'Jarayonda'), ('completed', 'Bajarildi'), ('cancelled', 'Bekor qilindi'), ('failed', 'Muvaffaqiyatsiz')], default='pending', max_length=20, verbose_name='Holat')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan vaqt')),
                ('performed_time', models.DateTimeField(blank=True, null=True, verbose_name='Bajarilgan vaqt')),
                ('cancelled_time', models.DateTimeField(blank=True, null=True, verbose_name='Bekor qilingan vaqt')),
                ('reason', models.CharField(blank=True, max_length=255, null=True, verbose_name='Sabab')),
                ('payment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payme_transactions', to='payments.payment', verbose_name="To'lov")),
            ],
            options={
                'verbose_name': 'Payme tranzaksiya',
                'verbose_name_plural': 'Payme tranzaksiyalar',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ClickTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('click_trans_id', models.CharField(blank=True, max_length=255, null=True, verbose_name='Click tranzaksiya ID')),
                ('click_paydoc_id', models.CharField(blank=True, max_length=255, null=True, verbose_name="Click to'lov hujjati ID")),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Summa')),
                ('status', models.CharField(choices=[('pending', 'Kutilmoqda'), ('processing', 'Jarayonda'), ('completed', 'Bajarildi'), ('cancelled', 'Bekor qilindi'), ('failed', 'Muvaffaqiyatsiz')], default='pending', max_length=20, verbose_name='Holat')),
                ('error_code', models.IntegerField(blank=True, null=True, verbose_name='Xatolik kodi')),
                ('error_note', models.CharField(blank=True, max_length=255, null=True, verbose_name='Xatolik izohi')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan vaqt')),
                ('performed_time', models.DateTimeField(blank=True, null=True, verbose_name='Bajarilgan vaqt')),
                ('cancelled_time', models.DateTimeField(blank=True, null=True, verbose_name='Bekor qilingan vaqt')),
                ('sign_time', models.CharField(blank=True, max_length=255, null=True, verbose_name='Imzo vaqti')),
                ('sign_string', models.TextField(blank=True, null=True, verbose_name='Imzo')),
                ('payment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='click_transactions', to='payments.payment', verbose_name="To'lov")),
            ],
            options={
                'verbose_name': 'Click tranzaksiya',
                'verbose_name_plural': 'Click tranzaksiyalar',
                'ordering': ['-created_at'],
            },
        ),
    ]
