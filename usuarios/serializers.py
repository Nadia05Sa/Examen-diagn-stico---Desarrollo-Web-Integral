from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Esto obtiene dinámicamente tu modelo 'MiUsuario' gracias al settings.py
User = get_user_model() 

class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'nombre_completo', 'password', 'telefono')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Como programamos el Manager arriba, create_user encriptará el password
        user = User.objects.create_user(**validated_data)
        return user


class MiTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para usar email en lugar de username"""
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar información adicional al token si es necesario
        token['email'] = user.email
        token['nombre_completo'] = user.nombre_completo
        return token