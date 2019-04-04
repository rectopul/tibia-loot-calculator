function RetornaDataHoraAtual(){
  var dNow = new Date();
  var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
  return localdate;
}

var infosWast = new Array()
var charactername
var charactervoc
var characterbalance
var effectsAnimate = 'animated slideInDown',
	room_join = '',
	code_ts = ''

// RASHIDCITY

var dayName = new Array ("domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado")
var monName = new Array ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro")
var now = new Date

if(dayName[now.getDay() ] == "segunda"){
	console.info('Rashid está em Svargrond')
}else if(dayName[now.getDay() ] == "terça"){
	console.info('Rashid está em Liberty Bay')
}else if(dayName[now.getDay() ] == "quarta"){
	console.info('Rashid está em Port Hope')
}else if(dayName[now.getDay() ] == "quinta"){
	console.info('Rashid está em Ankrahmun')
}else if(dayName[now.getDay() ] == "sexta"){
	console.info('Rashid está em Darashia')
}else if(dayName[now.getDay() ] == "sábado"){
	console.info('Rashid está em Edron')
}else if(dayName[now.getDay() ] == "domingo"){
	console.info('Rashid está em Carlin')
}

function calculo_loots(balanceEk,balanceEd,balanceMs,balanceRp){

	var ekBalance = parseInt($('.'+balanceEk+'').html()),
		edBalance = parseInt($('.'+balanceEd+'').html()),
		msBalance = parseInt($('.'+balanceMs+'').html()),
		rpBalance = parseInt($('.'+balanceRp+'').html()),
		allBalance = ekBalance + edBalance + msBalance + rpBalance,
		printing


	var countbalance = 0

	// Verificar quantidade de player

	if( ekBalance != 0 ){
		countbalance++
	} if( edBalance != 0 ){
		countbalance++
	} if( msBalance != 0 ){
		countbalance++
	} if( rpBalance != 0 ){
		countbalance++
	}

	// Verificar quem tem mais

	var profit = allBalance / countbalance

	ekBalance = profit - ekBalance
	edBalance = profit - edBalance
	msBalance = profit - msBalance
	rpBalance = profit - rpBalance

	var listBalance = {'Profit' : profit}

	if ( ekBalance == Math.min(ekBalance,edBalance,msBalance, rpBalance)) {
		listBalance['pagante'] = 'EK'
	} else {
		listBalance['EK'] = ekBalance
	}

	if ( edBalance == Math.min(ekBalance,edBalance,msBalance, rpBalance)) {
		listBalance['pagante'] = 'ED'
	} else {
		listBalance['ED'] = edBalance
	}
	
	if ( msBalance == Math.min(ekBalance,edBalance,msBalance, rpBalance)) {
		listBalance['pagante'] = 'MS'
	} else {
		listBalance['MS'] = msBalance
	}

	if ( rpBalance == Math.min(ekBalance,edBalance,msBalance, rpBalance)) {
		listBalance['pagante'] = 'RP'
	} else {
		listBalance['RP'] = rpBalance
	}


	return listBalance


}

jQuery(document).ready(function($) {
	$('.datenow').append(RetornaDataHoraAtual)


	//Socket io
		const socket = io()
		socket.on('connect', function(client){
			$('.status_connect').html('Conectado')

		})

		// form user

			$('.form_insert_user').submit(function(event) {
				//validacao
				if(!$('.nick_name').val()){
					$('.modal-body').html('<h6 class="">'+
						'<img src="/img/Demon_Infant.gif" alt="Dragãozinho Tibia" /> Você não informou seu apelido menino!'+
						'</h6')
					$('#myModal').modal('toggle')
				} else {

					$('.insert_user').hide()
					$('.rooms').show()
					socket.emit('new user', $('.nick_name').val(), function(data){
						if(data){
							//console.info(data)
						}
					})
					
					// Emite a solicitaçao de Salas
					socket.emit('getRooms', $('.nick_name').val())
				}

				return false
			})

		// Get Users

		socket.on('get user', (data)=>{
			//console.info(data)
			var ins_users_online = ''
			for (var i = 0; i < data.length; i++) {
				ins_users_online += '<li class="list-group-item">'+data[i]+'</li>'
			}

			$('.usersonline').html(ins_users_online)
		})

		// ROOMS

		$('.form_create_rooms').submit(function(event) {
			/* Act on the event */
			if(!$('.name_roomcreated').val()){

				$('.modal-body').html('<h6 class="">'+
					'<img src="/img/Demon_Infant.gif" alt="Dragãozinho Tibia" /> Informe o Nome da saque que voce quer criar'+
					'</h6')
				$('#myModal').modal('toggle')

			}else{
				socket.emit('create', $('.name_roomcreated').val())
				socket.emit('getRooms', $('.nick_name').val())
			}

			return false
		})

		// Recebendo lista de rooms

		socket.on('rooms', (data)=>{
			if(data){
				var rooms_list = ''
				//console.log(data)

				// loop de rooms
				for (var i = 0; i < data.length; i++) {
					rooms_list += '<li class="list-group-item d-flex justify-content-between align-items-center">\
								    	'+data[i]+'\
								    	<div class="col-auto">\
								      		<button type="submit" class="btn btn-sm btn-success mb-2 btn-join-room" nome="'+data[i]+'">Entrar</button>\
								    	</div>\
								  	</li>'
				}

				//console.log(rooms_list)
				// inserindo list no html
				$('.List_of_rooms').html(rooms_list)

				$('.btn-join-room').click((event) => {
					/* Act on the event */
					room_join = event.currentTarget.attributes.nome.nodeValue

					socket.emit("subscribe", {room: room_join, date: RetornaDataHoraAtual()})

					socket.on('join_to_room', (room)=>{
						$('.name_room').html(room)
						//console.log(room)
					})

					$('.rooms').hide()
					$('.infos_character').show()
					$('.card-info-waste').attr('style', 'display: flex;')
					//console.log(event.currentTarget.attributes.nome.nodeValue)
				})
			}else{
				$('.List_of_rooms').html('Não há nenhuma sala no momento. Crie uma para começar!')
			}
		})
		

		socket.on('msg', function(msg) {
			/* Act on the event */
			//console.log(msg)
			if (msg[1] == "Knight") {
				$('.balance_ek').html(msg[2])
				$('.name_ek').html(msg[0])

				$('.voc-knight').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Druid") {
				$('.balance_ed').html(msg[2])
				$('.name_ed').html(msg[0])

				$('.voc-druid').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Sorcerer") {
				$('.balance_ms').html(msg[2])
				$('.name_ms').html(msg[0])

				$('.voc-sorcerer').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Paladino") {
				$('.balance_rp').html(msg[2])
				$('.name_rp').html(msg[0])

				$('.voc-paladin').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} 

			// Printar Resumos
			var resumecalc = calculo_loots('balance_ek','balance_ed','balance_ms','balance_rp')

			if(resumecalc.pagante == "EK"){

				$('.pagante').html($('.name_ek').html())

				// ED
				$('.pagamento_1').html(resumecalc.ED)
				$('.receb_1').html($('.name_ed').html())

				// MS
				$('.pagamento_2').html(resumecalc.MS)
				$('.receb_2').html($('.name_ms').html())

				// ED
				$('.pagamento_3').html(resumecalc.RP)
				$('.receb_3').html($('.name_rp').html())

				// LUCRO
				$('.valor_lucro').html(resumecalc.Profit)
				
			} else if(resumecalc.pagante == "ED") {

				$('.pagante').html($('.name_ed').html())

				// EK
				$('.pagamento_1').html(resumecalc.EK)
				$('.receb_1').html($('.name_ek').html())

				// MS
				$('.pagamento_2').html(resumecalc.MS)
				$('.receb_2').html($('.name_ms').html())

				// ED
				$('.pagamento_3').html(resumecalc.RP)
				$('.receb_3').html($('.name_rp').html())

				// LUCRO
				$('.valor_lucro').html(resumecalc.Profit)
			} else if(resumecalc.pagante == "MS") {

				$('.pagante').html($('.name_ms').html())

				// EK
				$('.pagamento_1').html(resumecalc.EK)
				$('.receb_1').html($('.name_ek').html())

				// MS
				$('.pagamento_2').html(resumecalc.ED)
				$('.receb_2').html($('.name_ed').html())

				// ED
				$('.pagamento_3').html(resumecalc.RP)
				$('.receb_3').html($('.name_rp').html())

				// LUCRO
				$('.valor_lucro').html(resumecalc.Profit)
			} else if(resumecalc.pagante == "RP") {

				$('.pagante').html($('.name_rp').html())

				// EK
				$('.pagamento_1').html(resumecalc.EK)
				$('.receb_1').html($('.name_ek').html())

				// MS
				$('.pagamento_2').html(resumecalc.MS)
				$('.receb_2').html($('.name_ms').html())

				// ED
				$('.pagamento_3').html(resumecalc.ED)
				$('.receb_3').html($('.name_ed').html())

				// LUCRO
				$('.valor_lucro').html(resumecalc.Profit)
			}
			
			code_ts = $('.codigo_ts').html()
			

			code_ts = code_ts.replace(/<p>/g,'').replace(/<\/p>/g, '').replace(/<\/span>/g, '')
			code_ts = code_ts.replace(/<b>/g, '[b]').replace(/<span class="valor_lucro">/g, '[color=green]')
			code_ts = code_ts.replace(/<\/b>/g, '[/b]').replace(/<span class="pagante">/g, '')
			code_ts = code_ts.replace('<span class="pagamento_1">', '').replace('<span class="pagamento_2">', '').replace('<span class="pagamento_3">', '')
			code_ts = code_ts.replace('<span class="receb_1">', '')
			code_ts = code_ts.replace('<span class="receb_2">', '')
			code_ts = code_ts.replace('<span class="receb_3">', '')
			code_ts = code_ts.replace('<button type="button" class="btn btn-primary copytots" data-clipboard-target="#copytoTS">Copiar Para Teamspeak</button>', '')

			//console.info(code_ts)

			//$('.codigo_ts').html( code_ts )



			copyotsfunc = new ClipboardJS('.copytots', {
				text: function() {
		            return code_ts;
		        }
			})

			copyotsfunc.on('success', function(e) {
			    //console.info('Action:', e.action);
			    //console.info('Text:', e.text);
			    //console.info('Trigger:', e.trigger);

			    e.clearSelection();
			})

			clipboard.destroy()
			//console.info(code_ts)

			//console.info( calculo_loots('balance_ek','balance_ed','balance_ms','balance_rp') )
			$('.sondnotify').trigger('play')
		});

	//Form Submit
		$('.infowastes').submit(function(event) {
			/* Act on the event */
			// VALIDAÇAO

				//console.info($('#InputCharacter').val())

				if (!$('#InputCharacter').val()) {

					$('.modal-body').html('<h6 class="">'+
						'<img src="/img/Demon_Infant.gif" alt="Dragãozinho Tibia" /> Cade o nome do seu personagem?'+
						'</h6')
					$('#myModal').modal('toggle')

				} else if(!$('#InputBalance').val()){
					$('.modal-body').html('<h6 class="">'+
						'<img src="/img/Demon_Infant.gif" alt="Dragãozinho Tibia" /> Tem certeza que não gastou nada?'+
						'</h6>')
					$('#myModal').modal('toggle')
				} else {
					// EMITIR
						charactername = $('#InputCharacter').val()
						infosWast.push(charactername)
						charactervoc = $('#selectVocation').val()
						infosWast.push(charactervoc)
						characterbalance = $('#InputBalance').val()
						infosWast.push(characterbalance)

						socket.emit('msg', infosWast)

						if (infosWast[1] == "Knight") {
							$('.balance_ek').html(infosWast[2])
							$('.name_ek').html(infosWast[0])

							$('.voc-knight').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
						} else if (infosWast[1] == "Druid") {
							$('.balance_ed').html(infosWast[2])
							$('.name_ed').html(infosWast[0])

							$('.voc-druid').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
						} else if (infosWast[1] == "Sorcerer") {
							$('.balance_ms').html(infosWast[2])
							$('.name_ms').html(infosWast[0])

							$('.voc-sorcerer').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
						} else if (infosWast[1] == "Paladino") {
							$('.balance_rp').html(infosWast[2])
							$('.name_rp').html(infosWast[0])

							$('.voc-paladin').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
						} 

						infosWast = []
						//console.log(infosWast[2])
				}
			
			return false;
		})

		//Copy to clipboard
			var clipboard = new ClipboardJS('.btntoCopy')
			clipboard.destroy()

			$('.copynick').on('click', function(event) {
				event.preventDefault();
				/* Act on the event */
				var elemto = $(this)
				$(this).addClass('btntoCopy')
				$(this).attr('data-clipboard-target', '#nameToCopy')
				$(this).next().next().find('h4').addClass('copyclip').attr('id', 'nameToCopy')
				
				var trgg = $(this).next().next().find('h4')
				//Remove Attrs

				clipboard.on('success', function(e) {
				    elemto.removeClass('btntoCopy')
					trgg.removeAttr('data-clipboard-target').removeAttr('id')
				    e.clearSelection();
				})
			})

})