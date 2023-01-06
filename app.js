import express from 'express'
const app = express()
const port = 8000

app.post('/api/humidity', (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const frame = JSON.parse(data);
    if (frame.data.substring(0, 2) == "14") {
      const payload = frame.data.substring(2);
      const humInHexa = parseInt("0x" + payload);
      const humInDec = humInHexa.toString(10) / 10;
      console.log("humidité: ", humInDec, "%");
    } else if (frame.data.substring(0, 2) == "0a") {
      const payload = frame.data.substring(2);
      const hum = payload.substring(0, 4);
      const humInHexa = parseInt("0x" + hum);
      const humInDec = humInHexa.toString(10) / 10;
      console.log("humidité: ", humInDec, "%, seuil dépassé");
    } else {
      console.log("erreur")
    }
  })
})

app.post('/api/temperature', (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    const frame = JSON.parse(data);
    if (frame.data.substring(0, 2) == "28") {
      const payload = frame.data.substring(2);
      const tempInHexa = parseInt("0x" + payload);
      const tempInDec = tempInHexa.toString(10) / 10;
      console.log("temperature: ", tempInDec, "°C");
    } else if (frame.data.substring(0, 2) == "1e") {
      const payload = frame.data.substring(2);
      const temp = payload.substring(0, 4);
      const tempInHexa = parseInt("0x" + temp);
      const tempInDec = tempInHexa.toString(10) / 10;
      console.log("temperature: ", tempInDec, "°C, seuil dépassé");
    } else {
      console.log("erreur")
    }
    const code = frame.data.substring(0, 2);
    const point1 = new PointerEvent('temperature')
    .tag('sensor_id', 'TLM01')
    .floatField('temperature', tempInDec)
    .intField('code', code)
    writeApi.writePoint(point1)
    writeApi.flush().then(function() {
      console.log("Write finished");
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
