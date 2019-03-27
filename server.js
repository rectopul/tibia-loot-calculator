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

			console.log('Voce entrouy na sala: '+ data.room)

			socket.on('msg', function(msg){
	            //envia a mensagem para a sala <id>
	            io.to(data.room).emit('msg', msg)
	            console.log(msg);
	        })
		})
	})


http.listen(process.env.PORT || 3000, function(){
	console.log("Servidor Rodando")
})