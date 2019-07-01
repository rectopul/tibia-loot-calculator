const express = require("express")
const app = require('express')()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const request = require('request')
const bodyParser = require('body-parser')
const exports_calc = require('./public/js/calc')
const ck_charname = require('./public/js/tibiarequest.js')
const crypto = require('crypto')
// crypto.randomBytes(5, (err, buf) => {
//   if (err) throw err;
//   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
// })
var users = [],
	rooms = [],
	connections = [],
	object_rooms = {}
	


//Configuraçoes
	//Public
		app.use(express.static(path.join(__dirname,"public")))

//Rotas

	app.get('/', (req, res) =>{
		res.sendFile(__dirname+'/index.html')
	})

//socket io
	io.on('connection', (socket)=>{
		connections.push(socket)
		//updateusers()
		console.log('Connected: %s sockets connected', connections.length)

		// Disconnect
		socket.on('disconnect', (data)=>{
			users.splice(users.indexOf(socket.username), 1)
			updateusers()
			connections.splice(connections.indexOf(socket), 1)
			console.log(users)
			console.log('Disconnected: %s sockets connected', connections.length)
		})


		socket.on('new user', (username)=> {
			
			//callback(true)
			socket.username = username			
			users.push(socket.username)
			updateusers()
			console.log(users)
		})

		// Create rooms

		socket.on('create', (room)=>{
			object_rooms[room] = [
				{
					character : null,
					vocation : `Knight`,
					wast : ``
				},
				{
					character : null,
					vocation : `Paladino`,
					wast : ``
				},
				{
					character : null,
					vocation : `Sorcerer`,
					wast : ``
				},
				{
					character : null,
					vocation : `Druid`,
					wast : ``
				}
			]
			rooms.push(room)
			socket.emit('getRooms', rooms)
			io.sockets.emit('rooms', rooms)
			io.emit(`notice`, `notice ${socket.username} Entrered in system`)
			console.log(object_rooms)
		})



		// List rooms

		socket.on('getRooms', function() {
		    io.sockets.emit('rooms', rooms)
		    console.log(JSON.stringify(rooms))
		})

		function updateusers(){
			io.sockets.emit('get user', users)
		}

		

		// Join room

		socket.on('connectToRoom', (data) => { 
			socket.join(data)
			socket.broadcast.to(data).emit( 'notice', `${socket.username} has joined to room ${data}` )
			io.emit( `notice`, `${socket.username} has joined to room ${data}` )			
			console.log(`${socket.username} entrou na sala: ${data}`)
			
			socket.on( `wast`, (wst)=>{
				console.log( `values wst ${JSON.stringify(wst)} \n`)

				//CHECK CHARACTER
				var ch_cn = async()=>{
					try{
						var reschar = await ck_charname(wst[0].value)
						let ck_voc
						console.log(reschar)
						if(reschar.name){
							for (let i in object_rooms[data]) {
								if(reschar.vocation === `Elite Knight` || reschar.vocation === `Knight`)
									ck_voc = 'Knight'

								if(reschar.vocation === `Elder Druid` || reschar.vocation === `Druid`)
									ck_voc = 'Druid'
									
								if(reschar.vocation === `Master Sorcerer` || reschar.vocation === `Sorcerer`)
									ck_voc = 'Sorcerer'

								if(reschar.vocation === `Royal Paladin` || reschar.vocation === `Paladin`)
									ck_voc = 'Paladino'

								if ( object_rooms[data][i].vocation === ck_voc )	{
									object_rooms[data][i][`character`] = wst[0].value
									object_rooms[data][i][`wast`] = parseInt(wst[2].value)
									object_rooms[data][i][`world`] = reschar.world
								}
							}
							
							//Emite a wasta para a sala				
							let res = exports_calc({
								char : object_rooms[data][0].character,
								balance : parseInt(object_rooms[data][0].wast)
							}, {
								char : object_rooms[data][1].character,
								balance : parseInt(object_rooms[data][1].wast)
							}, {
								char: object_rooms[data][3].character,
								balance : parseInt(object_rooms[data][3].wast)
							}, {
								char: object_rooms[data][2].character,
								balance : parseInt(object_rooms[data][2].wast)
							})
							let pft = object_rooms[data]
							io.to(data).emit( `wast`, {res, pft})
							console.log( `\nArray de wasts: \n`)
							console.log( object_rooms[data] )
							console.log(res)
						}else{
							io.to(data).emit( `char not found`, `Opa! O nick do char que você informou parece não existir` )
						}							
					}catch(e){
						console.log(`erro`, e)
					}
				}

				ch_cn()				
			})

			socket.on('msg', function(msg){
	            //envia a mensagem para a sala <id>
	            io.to(data).emit('msg', msg)
	            console.log(msg)
	        })
		})
	})

http.listen(process.env.PORT || 3000, function(){
	console.log(`Servidor Rodando`)
})