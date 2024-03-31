const express = require('express');
const router = express.Router();
const fs = require('fs');

// Middleware para parsear el cuerpo de las solicitudes como JSON
router.use(express.json());

// Ruta para obtener la página de inicio
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Ruta para obtener todas las canciones
router.get('/canciones', (req, res) => {
  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'));
    res.json(canciones);
  } catch (error) {
    res.status(500).send('Error al obtener las canciones');
  }
});

// Ruta para agregar una nueva canción
router.post('/canciones', (req, res) => {
  const cancion = req.body;
  if (!cancion || !cancion.titulo || !cancion.artista || !cancion.tono) {
    return res.status(400).send('Se requieren todos los campos (titulo, artista, tono)');
  }

  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'));
    canciones.push(cancion);
    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción agregada');
  } catch (error) {
    res.status(500).send('Error al agregar la canción');
  }
});

// Ruta para actualizar una canción existente
router.put('/canciones/:id', (req, res) => {
  const { id } = req.params;
  const cancion = req.body;
  if (!cancion || (!cancion.titulo && !cancion.artista && !cancion.tono)) {
    return res.status(400).send('Se requiere al menos un campo para actualizar');
  }

  try {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'));
    const index = canciones.findIndex((c) => c.id == id);
    if (index === -1) {
      return res.status(404).send('Canción no encontrada');
    }
    canciones[index] = { ...canciones[index], ...cancion };
    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción actualizada');
  } catch (error) {
    res.status(500).send('Error al actualizar la canción');
  }
});

// Ruta para eliminar una canción existente
router.delete('/canciones/:id', (req, res) => {
  const { id } = req.params;

  try {
    let canciones = JSON.parse(fs.readFileSync('./repertorio.json', 'utf-8'));
    const index = canciones.findIndex((c) => c.id == id);
    if (index === -1) {
      return res.status(404).send('Canción no encontrada');
    }
    canciones.splice(index, 1);
    fs.writeFileSync('./repertorio.json', JSON.stringify(canciones, null, 2));
    res.send('Canción eliminada');
  } catch (error) {
    res.status(500).send('Error al eliminar la canción');
  }
});

module.exports = router;
