from rest_framework import serializers
from .models import Curso


class CursoSerializer(serializers.ModelSerializer):
    # Campo para recibir la imagen que se guardará como binario
    foto_para_binario = serializers.ImageField(write_only=True, required=False)
    # Campo para mostrar la imagen en base64
    foto_base64_display = serializers.ReadOnlyField()

    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'codigo', 'creditos', 'profesor', 'cupo_maximo', 'estado',
             'foto', 'foto_para_binario', 'foto_base64_display']
    
    def create(self, validated_data):
        # Extraemos el archivo para binario
        archivo_binario = validated_data.pop('foto_para_binario', None)

        # DRF guarda 'foto' automáticamente en la carpeta /media/
        curso = Curso.objects.create(**validated_data)

        # Si mandaron el archivo binario, guardamos los bytes
        if archivo_binario:
            curso.foto_binaria = archivo_binario.read()
            curso.save()

        return curso
    
    def update(self, instance, validated_data):
        # Extraemos el archivo para binario
        archivo_binario = validated_data.pop('foto_para_binario', None)

        # Actualizamos los campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Si mandaron el archivo binario, guardamos los bytes
        if archivo_binario:
            instance.foto_binaria = archivo_binario.read()

        instance.save()
        return instance