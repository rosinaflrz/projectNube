const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

// Configuración directa de AWS
const _aws_access_key_id = '';
const _aws_secret_access_key = '';
const _aws_session_token = '';
const _region = 'us-east-1';
const _sqs_queue_url = '';

// Configuración de AWS SDK con las credenciales y región
AWS.config.update({
  accessKeyId: _aws_access_key_id,
  secretAccessKey: _aws_secret_access_key,
  sessionToken: _aws_session_token,
  region: _region,
});

const sns = new AWS.SNS();
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

// Inicializar Express
const app = express();
app.use(bodyParser.json());

// Endpoint para enviar mensajes
app.post('/send-message', async (req, res) => {
  const { sender, receiver, message } = req.body;
  
  if (!sender || !receiver || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: sender, receiver, message' });
  }

  const params = {
    QueueUrl: _sqs_queue_url,
    MessageBody: JSON.stringify({ sender, receiver, message, timestamp: Date.now() }),
  };

  try {
    await sqs.sendMessage(params).promise();
    res.status(200).json({ message: 'Mensaje enviado a la cola de procesamiento' });
  } catch (error) {
    console.error('Error al enviar el mensaje a SQS:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// Endpoint para recibir mensajes
app.get('/receive-messages', async (req, res) => {
  const params = {
    QueueUrl: _sqs_queue_url,
    MaxNumberOfMessages: 10,
  };

  try {
    const messages = await sqs.receiveMessage(params).promise();
    if (!messages.Messages) {
      return res.status(200).json({ message: 'No hay mensajes en la cola' });
    }

    for (let message of messages.Messages) {
      const body = JSON.parse(message.Body);
      const dbParams = {
        TableName: 'MessagesTable',
        Item: {
          MessageId: message.MessageId,
          Sender: body.sender,
          Receiver: body.receiver,
          Message: body.message,
          Timestamp: body.timestamp,
        },
      };

      await dynamoDB.put(dbParams).promise();
      await sqs.deleteMessage({
        QueueUrl: _sqs_queue_url,
        ReceiptHandle: message.ReceiptHandle,
      }).promise();
    }

    res.status(200).json({ message: 'Mensajes procesados y guardados en DynamoDB' });
  } catch (error) {
    console.error('Error al recibir mensajes de SQS:', error);
    res.status(500).json({ error: 'Error al recibir mensajes' });
  }
});

// Endpoint para enviar notificaciones
app.post('/notify', async (req, res) => {
  const { contact, message } = req.body;

  try {
    await sns.publish({
      Message: message,
      PhoneNumber: contact,
    }).promise();
    res.status(200).json({ message: 'Notificación enviada correctamente' });
  } catch (error) {
    console.error('Error al enviar notificación con SNS:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
