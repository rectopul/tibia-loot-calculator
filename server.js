const express = require("express")
const app = require('express')()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
var users = [],
	rooms = [],
	connections = []


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
			//console.log('Disconnected: %s sockets connected', connections.length)
		})


		socket.on('new user', function(data, callback){
			
			callback(true)
			socket.username = data
			
			users.push(socket.username)
			updateusers()
			console.log(users)
		})

		// Create rooms

		socket.on('create', (room)=>{
			rooms.push(room)
			socket.emit('getRooms', rooms)
			//console.log(rooms)
		})



		// List rooms

		socket.on('getRooms', function() {
		    io.sockets.emit('rooms', rooms)
		    console.log(rooms)
		})

		function updateusers(){
			io.sockets.emit('get user', users)
		}

		// Join room

		socket.on('subscribe', (data) => { 
			socket.join(data.room)

			io.sockets.emit('join_to_room', data.room)

			console.log('Voce entrouy na sala: '+ data.room)

			socket.on('msg', function(msg){
	            //envia a mensagem para a sala <id>
	            io.to(data.room).emit('msg', msg)
	            console.log(msg);
	        })
		})
	})
var listips = `
187.17.123.136/32
187.17.123.82/32
187.17.123.80/32
187.17.123.78/32
187.17.123.79/32
187.17.123.77/32
187.17.123.76/32
187.17.123.48/32
187.17.123.47/32
187.17.123.46/32
52.67.255.165/32
191.232.244.14/32
191.235.80.17/32
191.232.183.87/32
191.232.166.110/32
170.82.175.0/24
200.170.221.64/29
200.150.5.24/29
201.157.234.40/29
195.181.162.128/26
187.16.245.192/29
201.148.101.24/29
191.232.54.176/32`

http.listen(process.env.PORT || 3000, function(){
	console.log(`Servidor Rodando INSTANCIANDO ipS aGUARDE A RELAÇAO \nLista de IPS: ${listips}`)
})