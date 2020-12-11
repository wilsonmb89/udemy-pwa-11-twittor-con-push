// Routes.js - Módulo de rutas
var express = require("express");
var router = express.Router();
var pushManager = require('./push');

const mensajes = [
  {
    _id: "XXX",
    user: "spiderman",
    mensaje: "Hola Mundo",
  },
];

// Get mensajes
router.get("/", function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json(mensajes);
});

// Post mensaje
router.post("/", function (req, res) {
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user,
  };
  mensajes.push(mensaje);
  console.log(mensajes);
  res.json({
    ok: true,
    mensaje,
  });
});

// Almacenar la suscripcion
router.post('/suscribe', function (req, res) {
  const body = req.body;
  pushManager.addSubscription(body.subscription);
  res.json({body});
});

// Retornar key público
router.get('/key', function (req, res) {
  const key = pushManager.getKey();
  // Send para enviar como arraybuffer
  res.send(key);
});

// Enviar una notificacion PUSH a las personas que nosotros queramos
// ES ALGO que se controla del lado del server
router.post('/push', function (req, res) {
  const post = req.body;
  pushManager.sendPush(post);
  res.json('Notificaciones enviadas');
});

module.exports = router;
