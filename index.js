const fs = require('fs') // file system = core node module
const http = require('http')
const url = require('url')

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8') // if no 'utf-8', returns "buffer"
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    const urlPath = url.parse(req.url, true).pathname
    console.log(urlPath)
    const id = url.parse(req.url, true).query.id

    // PRODUCTS OVERVIEW
    if (urlPath === '/products' || urlPath === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' }) // header data

        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const laptopCards = laptopData.map(el => htmlTemplate(data, el)).join('')
                overviewOutput = overviewOutput.replace('{%CARDS%}', laptopCards)
                
                res.end(overviewOutput)
            });
        });
    }

    // LAPTOP DETAILS
    else if (urlPath === '/laptop' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' })

        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id]
            const output = htmlTemplate(data, laptop)
            res.end(output)
        });
    }

    // IMAGES
    else if ((/\.(jpg|jpeg|png)$/i).test(urlPath)) {
        fs.readFile(`${__dirname}/data/img${urlPath}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' })
            res.end(data)
        });
    } 

    // INVALID URL 
    else {
        res.writeHead(404, { 'Content-type': 'text/html' })
        res.end(`Oops! We can't find that URL. Try again!`)
    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening for requests...')
})

function htmlTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName)
    output = output.replace(/{%IMAGE%}/g, laptop.image)
    output = output.replace(/{%PRICE%}/g, laptop.price)
    output = output.replace(/{%SCREEN%}/g, laptop.screen)
    output = output.replace(/{%CPU%}/g, laptop.cpu)
    output = output.replace(/{%STORAGE%}/g, laptop.storage)
    output = output.replace(/{%RAM%}/g, laptop.ram)
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description)
    output = output.replace(/{%ID%}/g, laptop.id)
    return output
}