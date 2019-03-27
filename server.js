const express = require("express")
const app = require('express')()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
var users = []
var rooms = []


//Configuraçoes
	//Public
		app.use(express.static(path.join(__dirname,"public")))

//Rotas

	app.get('/', (req, res) =>{
		res.sendFile(__dirname+'/index.html')
	})

//socket io
	io.on('connection', (socket)=>{
		

		// Disconnect
		socket.on('disconnect', (data)=>{
			//if(!socket.usersname) return
			//users.splice(users.indexOf(socket.usersname), 1)
			updateusers()
			console.log(users)
		})


		// socket.on('chat message', function(id,msg){
  //           //envia a mensagem para a sala <id>
  //           io.to(id).emit('chat message', msg)
  //           console.log(msg);
  //       })

		// socket.on('msg', (msg)=>{
		// 	//console.log(msg)
		// 	socket.broadcast.emit('msg', msg)
		// })

		// New user

		socket.on('new user', function(data, callback){
			
			callback(true)
			socket.usernames = data
			
			users.push(socket.usernames)
			updateusers()
			console.log(users)
		})

		// Create rooms

		socket.on('create', (room)=>{
			rooms.push(room)
			//console.log(rooms)
		})



		// List rooms

		socket.on('getRooms', function() {
		    socket.emit('rooms', rooms)
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