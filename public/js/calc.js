// FUNCAO DE CALCULO DE PROFIT

	// PEGAR SOMAR OS BALANCES E PEGAR O RESULTADO

var calc_loots_export = function balancestest(EKBalance, RPBalance, EDBalance, MSBalance) {
    var balanceResult = 0,
    artst = [EKBalance.balance, RPBalance.balance, EDBalance.balance, MSBalance.balance], // Coloca os balances em uma array
    txtgenerate = ``
    //Filta o array removendo valores null 
    artst = artst.filter(v => !isNaN(v))
    //Soma o array
    balanceResult = artst.reduce((a, c) => {return a + c})
    //Divide a soma pelo numero va balances válidos
    var singleProfit = balanceResult / artst.length,
    //Cria um objeto com a soma dividiva pelos numero de player(balance)
    balancegpto = {
        Profit : singleProfit, 
        pagante : ``
    }
    // Verifica o pagante e Adiciona os valores no Objeto
    balancegpto[`listnames`] = {
        EK : EKBalance.char,
        RP : RPBalance.char,
        ED : EDBalance.char,
        MS : MSBalance.char,
    }
        //check math.max
        // VERIFICA O EK
        if(EKBalance.balance == Math.max(...artst)){
            balancegpto['EK'] = singleProfit
            balancegpto['pagante'] = 'EK'
        }else{
            if(EKBalance.balance){ 
                balancegpto['EK'] = parseInt(singleProfit-EKBalance.balance) 
                txtgenerate += `<p><b class="pgt">${balancegpto[`listnames`][balancegpto['pagante']]}</b> deve pagar ${balancegpto['EK'] > 0 ? `<font color="green"><b>${balancegpto['EK']}</b></font>`: `<font color="red"><b>${balancegpto['EK']}</b></font>`} para <b>${EKBalance.char}</b></p>`
            }
        }

        // VERIFICA O RP
        if(RPBalance.balance == Math.max(...artst)){
            balancegpto['RP'] = parseInt(singleProfit)
            balancegpto['pagante'] = 'RP'
        }else{
            if(RPBalance.balance){ balancegpto['RP'] = parseInt(singleProfit-RPBalance.balance) 
                txtgenerate += `<p><b class="pgt">${balancegpto[`listnames`][balancegpto['pagante']]}</b> deve pagar ${balancegpto['RP'] > 0 ? `<font color="green"><b>${balancegpto['RP']}</b></font>`: `<font color="red"><b>${balancegpto['RP']}</b></font>`} para <b>${RPBalance.char}</b></p>`
            }
        }

        // VERIFICA O ED
        if(EDBalance.balance == Math.max(...artst)){
            balancegpto['ED'] = parseInt(singleProfit)
            balancegpto['pagante'] = 'ED'
        }else{
            if(EDBalance.balance){ 
                balancegpto['ED'] = parseInt(singleProfit-EDBalance.balance) 
                txtgenerate += `<p><b class="pgt">${balancegpto[`listnames`][balancegpto['pagante']]}</b> deve pagar ${balancegpto['ED'] > 0 ? `<font color="green"><b>${balancegpto['ED']}</b></font>`: `<font color="red"><b>${balancegpto['ED']}</b></font>`} para <b>${EDBalance.char}</b></p>`
            }
        }
        
        // VERIFICA O MS
        if(MSBalance.balance == Math.max(...artst)){
            balancegpto['MS'] = parseInt(singleProfit)
            balancegpto['pagante'] = 'MS'
        }else{
            if(MSBalance.balance){ 
                balancegpto['MS'] = parseInt(singleProfit-MSBalance.balance) 
                txtgenerate += `<p><b class="pgt">${balancegpto[`listnames`][balancegpto['pagante']]}</b> deve pagar ${balancegpto['MS'] > 0 ? `<font color="green"><b>${balancegpto['MS']}</b></font>`: `<font color="red"><b>${balancegpto['MS']}</b></font>`} para <b>${MSBalance.char}</b></p>`
            }
        }
    txtgenerate += `<p>O lucro para cada jogador é de ${balancegpto['Profit'] > 0 ? `<font color="green"><b>${balancegpto['Profit']}</b></font>`: `<font color="red"><b>${balancegpto['Profit']}</b></font>`}</p>`
    balancegpto['array'] = artst
    balancegpto['txt'] = txtgenerate
    return balancegpto
} 

module.exports = calc_loots_export 
