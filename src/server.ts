import express from 'express';

const PORT = 3000
const app = express();

app.use(express.json())
app.use(express.urlencoded())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`)
})