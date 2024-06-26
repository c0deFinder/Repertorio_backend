const express = require('express');
const app = express();
const router = require('./routes/router');
const PORT = 4000;

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
})