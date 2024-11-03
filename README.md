# projectNube
Proyecto final para la clase de Nube

# Proyecto de Mensajería en la Nube

Este proyecto es una aplicación de mensajería instantánea que permite a los usuarios enviar y recibir mensajes utilizando una arquitectura basada en servicios de Amazon Web Services (AWS). 

## Descripción

El sistema permite:
- **Envío y recepción de mensajes** entre usuarios.
- **Notificaciones en tiempo real** para nuevos mensajes (usando SNS).
- **Gestión de mensajes en cola** para procesamiento (usando SQS).
- **Almacenamiento de mensajes** en una base de datos NoSQL (DynamoDB).

## Tecnologías Utilizadas

- **Node.js**: Plataforma de desarrollo en el backend.
- **Express**: Framework para crear la API REST.
- **AWS SDK**: Librería de AWS para interactuar con servicios como SNS, SQS y DynamoDB.
- **Amazon EC2**: Para alojar la aplicación.
- **Amazon SNS**: Para enviar notificaciones de mensajes.
- **Amazon SQS**: Para gestionar la cola de mensajes.
- **Amazon DynamoDB**: Para almacenar y consultar mensajes.

