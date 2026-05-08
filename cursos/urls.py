from django.contrib import admin
from django.urls import path


urlpatterns = [
    path('admin/', admin.site.urls),
 #urls para la app curso (API REST)
   path('api/cursos/', include('curso.urls')),

]