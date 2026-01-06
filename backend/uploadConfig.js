const multer = require('multer');
const path = require('path');

// Konfiguration: Wo und wie werden die Dateien gespeichert?
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Der Ordner, den wir vorhin erstellt haben
  },
  filename: (req, file, cb) => {
    // Wir geben der Datei einen eindeutigen Namen: Zeitstempel + Originalname
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;