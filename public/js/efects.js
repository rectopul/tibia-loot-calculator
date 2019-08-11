$( document ).ready(()=> {
	var effectsAnimate = 'animated slideInDown',
	listRooms = []

	let textTsCopy

	//Socket io
		const socket = io()
		socket.on('connect', function(client){
			$('.status_connect').html('Conectado')
			console.info(`usuario conectado`)
		})
	
	//Lista as Salas
	socket.emit( `getRooms`, `List` )
	socket.on( `rooms`, (rooms)=> {
		listRooms = rooms
		let Element_Room = ''
		for (let i in rooms) {
			if (rooms.hasOwnProperty(i)) {
				Element_Room += `<li class="list-group-item d-flex justify-content-between align-items-center" id="${rooms[i]}">
					${rooms[i]}
					<div class="col-auto">
						<button type="submit" class="btn btn-sm btn-success mb-2 btn-join-room" nome="${rooms[i]}">Entrar</button>
					</div>
				</li>`	
				
			}
		}	
		
		$( `.List_of_rooms` ).html(Element_Room)
		
		//Entrar na Salas
		$( `.btn-join-room` ).click(function (e) { 
			e.preventDefault()
			socket.emit( `connectToRoom`, $( this ).attr(`nome`) )
			console.info(`Notice: Voce entrou na sala ${$( this ).attr(`nome`)}`)
			$( `.rooms` ).hide()
			$( `.card-info-waste` ).show()
			$( `.infos_character` ).show()
		})
	})

	//FORM USER AND INSERT NEW USER

	$( `.insert_user` ).submit(function (e) { 
		e.preventDefault()
		
		let inputUser = $( this ).find( `input` )

		if ( !inputUser.val() ) {
			$( `#myModal .modal-body` ).html(`Você não informou seu Nome`)
			$( `#myModal` ).modal(`show`)
		}else{	
			//Emite o nome informado no formulário e o comando para listar as salas
			socket.emit( `new user`, inputUser.val() )
			console.log('Lista de Salas após Usuario: ')

			//Esconde Formulário de Usuário
			$( `.insert_user` ).hide()
			//Mostra a Lista de usuários
			$( `.rooms` ).show()
		}
	})

	//listar de salas e Formulario de crição de salas

	$( `.form_create_rooms` ).submit(function (e) { 
		e.preventDefault()
		//Validação de Formulário
		if ( !$( this ).find(`input`).val() ) {
			$( `#myModal .modal-body` ).html(`Informe o Nome da Sala`)
			$( `#myModal` ).modal(`show`)
		}else if ( listRooms.indexOf($( this ).find(`input`).val()) != -1 ){
			//Check se a sala já existe
			$( `#myModal .modal-body` ).html(`A Sala que voce criou já existe`)
			$( `#myModal` ).modal(`show`)			
		
		} else {
			//Emite o Nome da sala a ser criada
			socket.emit( `create`, $( this ).find(`input`).val() )	
		}
	})

	//Formulário de Wastes
	$( `.infowastes` ).submit(function (e) { 
		e.preventDefault()
		//Coloca os valores do formulario em uma array
		let iw = $( this ).serializeArray()
		console.log(iw)
		if(!iw[0].value){
			$( `#myModal .modal-body` ).html(`Informe o nome do seu char!`)
			$( `#myModal` ).modal(`show`)
		}else if (!iw[2].value) {
			$( `#myModal .modal-body` ).html(`Informe o valor do seu balance!`)
			$( `#myModal` ).modal(`show`)
		}else {
			//Emite os valores
			socket.emit( `wast`, iw )
		}
		
	})

	//Caso o char nao exista
	socket.on( `char not found`, (data) => {
		$( `#myModal .modal-body` ).html(data)
		$( `#myModal` ).modal(`show`)
	} )

	//Recebendo as wast
	socket.on( `wast`, (wst)=>{
		//Seleciona os blocos de personagem
		$( `.resume_of_calc > div.card-body > p` ).html(
			wst[`res`][`txt`]
		)

		$( `.resume_of_calc > div.card-body > p > p:not(:last-child)` ).click(function (e) { 
			e.preventDefault()
			textTsCopy = `Transfer ${$( this ).find( `font` ).text()} to ${$( this ).find( `b:eq( 2 )` ).text()}`
			//Copy to TS

		})
		
		var copyotsfunc = new ClipboardJS(`.resume_of_calc > div.card-body > p > p:not(:last-child)`, {
			text: function() {
				return textTsCopy
			}
		})

		//Copy to TS
		copyotsfunc.on('success', function(e) {
			//console.info('Action:', e.action)
			//console.info('Text:', e.text)
			//console.info('Trigger:', e.trigger)
			e.clearSelection()
		})

		for (let i in wst.res.listnames) {
			if (wst.res.listnames.hasOwnProperty(i)) {
				let element = ``

				for (let i_ in wst.pft) {
					if (wst.pft.hasOwnProperty(i_)) {
						element = wst.pft[i_]
					}
				}
				
				if(wst.res.listnames[i]){
					let charname = wst.pft.filter( (a) => {return a.character === wst.res.listnames[i]} )
					//console.info(charname[0][`wast`])
					$( `.voc-${i} > div > h4` ).html(wst.res.listnames[i])
					$( `.voc-${i} > div > h3` ).html(charname[0][`wast`])
					$( `.voc-${i}` ).addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
					//$('.voc-knight').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
				}				
			}
		}
	})

	//Gerar Texto de transfer
	/*$( `.resume_of_calc > div.card-body > p > p` ).on(`click`, function () {
		let gen_txt = `Transfer ${$( this ).find( `font` )} to ${$( this ).find( `b` ).not( `class='pgt'`)}`
		console.info( gen_txt )
	}) */

	//Listar Usuários
	socket.on(`get user`, (data) =>{
		//console.info(data)
		var ins_users_online = ''
		for (var i = 0; i < data.length; i++) {
			ins_users_online += '<li class="list-group-item">'+data[i]+'</li>'
		}

		$('.usersonline').html(ins_users_online)
	})
	

	socket.on( `notice`, (notice)=>{
		console.log(notice)
	})
})