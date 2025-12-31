from django.contrib import admin
from django.urls import path
from django.conf import settings
from . import view
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',view.index,name="home"),
    path('api/adapt_content/',view.gemini_request,name='adapt_content'),
    path('recomandation/',view.recomandation,name='recomandation'),
    path('contact-hub/', view.contact_hub, name='contact_hub')
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)