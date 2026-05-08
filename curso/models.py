import base64
from django.db import models


class Curso(models.Model):
    
    nombre = models.CharField(max_length=50)
    codigo = models.CharField(max_length=20, unique=True)
    creditos = models.IntegerField()
    profesor = models.CharField(max_length=100)
    cupo_maximo = models.IntegerField()
    estado = models.CharField(
        max_length=10,
        choices=[
            ('ABIERTO', 'Abierto'), 
            ('CERRADO', 'Cerrado')
            ],
        default='ABIERTO',
    )
    
    # CAMPO PARA GUARDAR LA IMAGEN EN CARPETA MEDIA
    foto = models.ImageField(upload_to='curso2/', blank=True, null=True)

    # CAMPO BINARIO PARA LA IMAGEN EN LA BD
    foto_binaria = models.BinaryField(blank=True, null=True)

    def abrir(self):
        self.estado = 'ABIERTO'
        self.save()

    def cerrar(self):
        self.estado = 'CERRADO'
        self.save()

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"
    
    @property
    def foto_base64_display(self):
        if self.foto_binaria:
            codificado = base64.b64encode(self.foto_binaria).decode('utf-8')
            return f"data:image/png;base64,{codificado}"
        return None