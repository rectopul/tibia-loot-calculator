const request = require('request')
const cheerio = require('cheerio')


function reqtibia(name) {

    var options = { 
        method: 'POST',
        url: 'https://www.tibia.com/community/',
        qs: { subtopic: 'characters' },
        formData: { name: name } 
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) 
                reject(error)

            var $ = cheerio.load(body)
            $(`#characters`).each(function() {
                var namechar = $(this).find(`div.Border_2 > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)`).text()
                var vochar = $(this).find(` div.Border_2 > div > div > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child(2)`).text()
                var lvlchar = $(this).find(`div.Border_2 > div > div > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child(2)`).text()
                resolve(`${namechar} ${vochar} Level: ${lvlchar}`)
            })            
        })
    })
}

const getData = async (charname) => {
    try {
        const character = await reqtibia(charname)
        return character
    } catch(error) {
        console.log(error)
    }
}

module.exports = getData 