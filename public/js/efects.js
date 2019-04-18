// FUNCAO DE CALCULO DE PROFIT

	// PEGAR SOMAR OS BALANCES E PEGAR O RESULTADO

	function balancestest(EKBalance, RPBalance, EDBalance, MSBalance) {
		var numPlayers = 0,
		balanceResult = 0

		if(EKBalance){ 
			balanceResult = balanceResult+parseInt(EKBalance)
			numPlayers++ 
		}
		if(RPBalance){numPlayers++ 
			balanceResult = balanceResult+parseInt(RPBalance)}
		if(EDBalance){numPlayers++ 
			balanceResult = balanceResult+parseInt(EDBalance)}
		if(MSBalance){numPlayers++ 
			balanceResult = balanceResult+parseInt(MSBalance)}

		var singleProfit = balanceResult / numPlayers,
		balancegpto = {'Profit' : singleProfit}

		// Verifica o pagante e Adiciona os valores no Objeto
			// VERIFICA O EK
			if(EKBalance == Math.max(EKBalance, RPBalance, EDBalance, MSBalance)){
				balancegpto['EK'] = singleProfit
				balancegpto['pagante'] = 'EK'
			}else{
				if(EKBalance != ''){ balancegpto['EK'] = parseInt(singleProfit-EKBalance) }
			}

			// VERIFICA O RP
			if(RPBalance == Math.max(EKBalance, RPBalance, EDBalance, MSBalance)){
				balancegpto['RP'] = parseInt(singleProfit)
				balancegpto['pagante'] = 'RP'
			}else{
				if(RPBalance != ''){ balancegpto['RP'] = parseInt(singleProfit-RPBalance) }
			}

			// VERIFICA O ED
			if(EDBalance == Math.max(EKBalance, RPBalance, EDBalance, MSBalance)){
				balancegpto['ED'] = parseInt(singleProfit)
				balancegpto['pagante'] = 'ED'
			}else{
				if(EDBalance != ''){ balancegpto['ED'] = parseInt(singleProfit-EDBalance) }
			}
			
			// VERIFICA O MS
			if(MSBalance == Math.max(EKBalance, RPBalance, EDBalance, MSBalance)){
				balancegpto['MS'] = parseInt(singleProfit)
				balancegpto['pagante'] = 'MS'
			}else{
				if(MSBalance != ''){ balancegpto['MS'] = parseInt(singleProfit-MSBalance) }
			}

		return balancegpto
	}

	console.log(balancestest(1700000, 2450000, -625000, -312000))
	


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
	code_ts = '',
	NameEK,
	NameED,
	NameMS,
	NameRP

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
		
		var calcEK = '',
			calcRP = '',
			calcED = '',
			calcMS = ''
			
		socket.on('msg', function(msg) {
			/* Act on the event */
			//console.log(msg)

			if (msg[1] == "Knight") {
				NameEK = msg[0]
				calcEK = msg[2]
				
				$('.balance_ek').html(msg[2])
				$('.name_ek').html(msg[0])
				$('.voc-knight').attr('text-transfer="Transfer "')
				$('.voc-knight').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Druid") {
				NameED = msg[0]
				calcED = msg[2]
				$('.balance_ed').html(msg[2])
				$('.name_ed').html(msg[0])

				$('.voc-druid').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Sorcerer") {
				NameMS = msg[0]
				calcMS = msg[2]
				$('.balance_ms').html(msg[2])
				$('.name_ms').html(msg[0])

				$('.voc-sorcerer').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} else if (msg[1] == "Paladino") {
				NameRP = msg[0]
				calcRP = msg[2]
				$('.balance_rp').html(msg[2])
				$('.name_rp').html(msg[0])

				$('.voc-paladin').addClass('showVoc '+effectsAnimate).removeClass('hideVoc')
			} 

			console.info(balancestest(parseInt(calcEK), calcRP, calcED, calcMS))

			console.info(calcEK, calcRP, calcED, calcMS)

			// Printar Resumos
			
			var resumecalc = balancestest(calcEK, calcRP, calcED, calcMS)

			function CopytoTs(pagante, p1, p1calc, p2, p2calc, p3, p3calc, profitclc) {
				var text = p1calc ? '' : '[b]'+pagante+'[/b] deve Pagar '+p1calc+' para [b]'+p1+'[/b].'  
				text += p2calc ? '': '[b]'+pagante+'[/b] deve Pagar '+p2calc+' para [b]'+p2+'[/b].'
				text += p3calc ? '': '[b]'+pagante+'[/b] deve Pagar '+p3calc+' para [b]'+p3+'[/b].'
				text += 'O valor de lucro será de [b][color=green]${profitclc}[/color][/b] para cada player' 

				// TEMPLATE STRING
				var tempstringText = p1calc || `[b]${pagante}[/b] deve Pagar ${p1calc} para [b]${p1}[/b]`

				console.log(tempstringText)
				return text
			}

			var textTsCopy
			
			
			// FUNCAO QUE GERA O TEXTO DO CALCULO

			function CalcVocation(pagante, vocation, value, playernumber) {
				var nameVocInsert,
				PagName			

				if(value){
					// CHECK NOME DO PAGANTE
					if(pagante == 'ED'){ pagante = NameED
						
					}else if(pagante == 'MS'){ PagName = NameMS
						
					}else if(pagante =='EK'){ PagName = NameEK
						
					}else if(pagante == 'RP'){ PagName = NameRP } 
					
					
					// CHECK NOME DE CADA VOCAÇAO
					if(vocation == 'ED'){ nameVocInsert = NameED

					}else if(vocation == 'MS'){ nameVocInsert = NameMS

					}else if(vocation == 'EK'){ nameVocInsert = NameEK

					}else if(vocation == 'RP'){ nameVocInsert = NameRP}

										
					text_dinamic_calc = `<b><span class="pagante">${PagName}</span></b> deve Pagar <span class="pagamento_${playernumber}">
					${value}</span> para <b><span class="receb_${playernumber} copytoTransfer" data-transfer="Transfer ${value} To ${nameVocInsert}">${nameVocInsert}</span></b></br>`

					return text_dinamic_calc
				}
			}

			console.log($.number(resumecalc.Profit))

			if(resumecalc.pagante == "EK"){

				$('.pagante').html(NameEK)

				var textToInsert = ''
				if(resumecalc.ED){ textToInsert += CalcVocation(resumecalc.pagante, 'ED', resumecalc.ED, '1') }

				if(resumecalc.MS){ textToInsert += CalcVocation(resumecalc.pagante, 'MS', resumecalc.MS, '2') }
				
				if(resumecalc.RP){ textToInsert += CalcVocation(resumecalc.pagante, 'RP', resumecalc.RP, '3') }

				var ReplaceNumbemProfit = resumecalc.Profit	

				textToInsert += 'O valor de lucro será de <b><span class="valor_lucro">'+ReplaceNumbemProfit+'</span></b> para cada player'

				$('.codigo_ts').find('p').html(textToInsert)

				// LUCRO
				textTsCopy = CopytoTs(NameEK, NameED, resumecalc.ED, NameMS, resumecalc.MS, NameRP, resumecalc.RP, resumecalc.Profit)
				$('.valor_lucro').html(resumecalc.Profit)
				
			} else if(resumecalc.pagante == "ED") {

				$('.pagante').html(NameED)

				var textToInsert = ''
				if(resumecalc.EK){ textToInsert += CalcVocation(resumecalc.pagante, 'EK', resumecalc.EK, '1') }

				if(resumecalc.MS){ textToInsert += CalcVocation(resumecalc.pagante, 'MS', resumecalc.MS, '2') }
				
				if(resumecalc.RP){ textToInsert += CalcVocation(resumecalc.pagante, 'RP', resumecalc.RP, '3') }

				var ReplaceNumbemProfit = resumecalc.Profit	

				textToInsert += 'O valor de lucro será de <b><span class="valor_lucro">'+ReplaceNumbemProfit+'</span></b> para cada player'

				$('.codigo_ts').find('p').html(textToInsert)

				// LUCRO
				textTsCopy = CopytoTs(NameED, NameEK, resumecalc.EK, NameMS, resumecalc.MS, NameRP, resumecalc.RP, resumecalc.Profit)
				$('.valor_lucro').html(resumecalc.Profit)
			} else if(resumecalc.pagante == "MS") {

				$('.pagante').html( NameMS )

				var textToInsert = ''
				if(resumecalc.EK){ textToInsert += CalcVocation(resumecalc.pagante, 'EK', resumecalc.EK, '1') }

				if(resumecalc.ED){ textToInsert += CalcVocation(resumecalc.pagante, 'ED', resumecalc.ED, '2') }
				
				if(resumecalc.RP){ textToInsert += CalcVocation(resumecalc.pagante, 'RP', resumecalc.RP, '3') }

				var ReplaceNumbemProfit = resumecalc.Profit	

				textToInsert += 'O valor de lucro será de <b><span class="valor_lucro">'+ReplaceNumbemProfit.Math.floor+'</span></b> para cada player'

				$('.codigo_ts').find('p').html(textToInsert)

				// LUCRO
				textTsCopy = CopytoTs(NameMS, NameEK, resumecalc.EK, NameED, resumecalc.ED, NameRP, resumecalc.RP, resumecalc.Profit)
				$('.valor_lucro').html(resumecalc.Profit)
			} else if(resumecalc.pagante == "RP") {

				$('.pagante').html($('.name_rp').html())

				var textToInsert = ''
				if(resumecalc.EK){ textToInsert += CalcVocation(resumecalc.pagante, 'EK', resumecalc.EK, '1') }

				if(resumecalc.ED){ textToInsert += CalcVocation(resumecalc.pagante, 'ED', resumecalc.ED, '2') }
				
				if(resumecalc.MS){ textToInsert += CalcVocation(resumecalc.pagante, 'MS', resumecalc.RP, '3') }

				var ReplaceNumbemProfit = resumecalc.Profit	

				textToInsert += 'O valor de lucro será de <b><span class="valor_lucro">'+ReplaceNumbemProfit+'</span></b> para cada player'

				$('.codigo_ts').find('p').html(textToInsert)

				// LUCRO
				textTsCopy = CopytoTs(NameRP, NameEK, resumecalc.EK, NameED, resumecalc.ED, NameMS, resumecalc.MS, resumecalc.Profit)

				$('.valor_lucro').html(resumecalc.Profit)
			}

			$('.valor_lucro').number(true)
			// $('[class^="pagamento_"]').number(true)
			//$( '[class^="balance_"]' ).number(true)

			new ClipboardJS('.copytoTransfer', {
				text: function(trigger) {
					console.log(trigger.getAttribute('data-transfer'))
					return trigger.getAttribute('data-transfer')
				}
			})

			console.info(code_ts)
			
			

			code_ts = code_ts.replace(/<p>/g,'').replace(/<\/p>/g, '').replace(/<\/span>/g, ' ')
			code_ts = code_ts.replace(/<b>/g, '[b]').replace(/<span class="valor_lucro">/g, '[color=green]')
			code_ts = code_ts.replace(/<\/b>/g, '[/b]').replace(/<span class="pagante">/g, ' ')
			code_ts = code_ts.replace(/<\/?span[^>]*>|<\/?br[^>]*>+/g, ' ')
			code_ts = code_ts.replace('<button type="button" class="btn btn-primary copytots" data-clipboard-target="#copytoTS">Copiar Para Teamspeak</button>', ' ')

			//console.info(code_ts)

			//$('.codigo_ts').html( code_ts )



			copyotsfunc = new ClipboardJS('.copytots', {
				text: function() {
		            return textTsCopy
		        }
			})

			copyotsfunc.on('success', function(e) {
			    //console.info('Action:', e.action);
			    console.info('Text:', e.text)
			    //console.info('Trigger:', e.trigger);

			    e.clearSelection()
			})
			
			$('.sondnotify').trigger('play')
		})

		

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