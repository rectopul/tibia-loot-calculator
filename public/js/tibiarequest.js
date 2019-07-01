
const request = require('request')
//const url = `https://api.tibiadata.com/v2/characters/rogeirinho.json`


function makeRequest(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) 
                reject(error)

            resolve(JSON.parse(body))
        })
    })
}

const getData = async function message(charname) {
    try {
        const regex = / /gm
        const filter_nick = charname.replace(regex, `+`)
        const character = await makeRequest(`https://api.tibiadata.com/v2/characters/${filter_nick}.json`)
        //const film = await makeRequest(character.films[0])
        return character.characters.data
    } catch(error) {
        console.log(error)
    }
}

module.exports = getData 