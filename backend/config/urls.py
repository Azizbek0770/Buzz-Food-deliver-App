from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.views.generic import RedirectView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

admin.site.site_header = 'Buzz Restaurant Administration'
admin.site.site_title = 'Buzz Admin Portal'
admin.site.index_title = 'Welcome to Buzz Restaurant Portal'

schema_view = get_schema_view(
    openapi.Info(
        title="Buzz Restaurant API",
        default_version='v1',
        description="Buzz Restaurant uchun API dokumentatsiyasi",
        contact=openapi.Contact(email="admin@buzz.uz"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/')),
    path('admin/', admin.site.urls),
    path('api/', include([
        path('users/', include('apps.users.urls')),
        path('restaurants/', include('apps.restaurants.urls')),
        path('orders/', include('apps.orders.urls')),
        path('payments/', include('apps.payments.urls')),
    ])),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path('api-auth/', include('rest_framework.urls')),
    ] 