const http = require('node:http')
const { spawn } = require('node:child_process');
const { readFileSync, readdirSync } = require('node:fs')
const { createInterface } = require("node:readline")

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

let message = ""

rl.on("line", line => {
  message = line
})

rl.on("SIGINT", () => process.exit(0))

const indexPageContent = readFileSync(__dirname + '/frontend.html').toString()

const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    res.end(indexPageContent)
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const text = url.searchParams.get("text")
  if (text) console.log("\n" + text)

  req.on("data", data => {
    if (!data) return
    const body = new URLSearchParams(data.toString())
    console.log()
    console.log(body.get("text"))
  })

  const sended = message
  message = ""

  res.end(sended)
});

server.listen(8000, () => {
  const hostname = spawn("hostname", ['-I'])

  hostname.stdout.on("data", data => {
    if (data.toString().length === 1) data = "127.0.0.1"
    const path = `http://${data.toString().trim()}:8000\n`
    console.log(path)
    const qr = spawn("qr", [path], {stdio: 'inherit'})
  })

});