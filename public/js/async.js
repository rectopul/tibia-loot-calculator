const request = require('request')
const cheerio = require('cheerio')

function sync(name) {
    return new Promise((resolve, reject)=>{
        request(urlsearch, (err, res, body)=>{
            if (error) throw new Error(error)
            
            resolve(JSON.parse(body))
        })            
    })
}

const sendResolv = async ()=>{
    try {
        const resTibia = await sync(`Guardiao de Relembra`)
        return resTibia
    } catch (error) {
        
    }
}

module.exports = sendResolv