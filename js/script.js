// Função de buscar por CEP
function mostrar() {

	cep = document.getElementById("cep").value // pegando valor do cep
	// url = "https://viacep.com.br/ws/"+cep+"/json/" // url do viacep
	url = `https://viacep.com.br/ws/${cep}/json/` // url do viacep

	const logEntry = {
		type: "CEP",
		date: new Date().toLocaleDateString('pt-BR'),
		cep: cep
	}

	pushLog(logEntry)

	// BUSCANDO O CEP USANDO FETCH
	fetch(url)
		.then((res) => { // variavel "res" irá armazenar a resposta inicial
			return res.json() // convertendo a resposta em JSON
		})
		.then((cep) => { // variavel "cep" contendo o json com o CEP do viacep
			console.log("Oi, meu CEP É no fetch", cep) // imprimindo os dados do cep
			document.getElementById("cidade").value = cep.localidade
			document.getElementById("bairro").value = cep.bairro
			document.getElementById("ddd").value = cep.ddd
			document.getElementById("estado").value = cep.uf
			M.updateTextFields()
		})
	// FIM DA IMPLEMENTAÇÃO DO FETCH
	console.log("Oi, meu CEP É fora", cep)
}
// tag fechamento do script JS

// Função de buscar por rua
function mostrarRua() {
	uf = $("#lista-ufs").val()
	cidade = $("#lista-cidades").val()
	rua = $("#rua").val()

	url = `https://viacep.com.br/ws/${uf}/${cidade}/${rua}/json/` // url do viacep

	fetch(url)
		.then((res) => { // variavel "res" irá armazenar a resposta inicial
			return res.json() // convertendo a resposta em JSON
		})
		.then((ruas) => { // variavel "cep" contendo o json com o CEP do viacep
			console.log("AQUI AS RUAS", ruas) // imprimindo os dados do cep

			const logEntry = {
				type: "RUA",
				date: new Date().toLocaleDateString('pt-BR'),
				uf: uf,
				cidade: cidade,
				rua: rua
			}

			pushLog(logEntry)

			let listaRuas = ""

			for (let rua of ruas) {
				dadosRua = ""
				const { ddd, ibge, regiao, siafi, ...ruaNova } = rua
				for (let prop in ruaNova) {
					dadosRua = dadosRua + `<h6>${ruaNova[prop]}</h6>`
				}
				listaRuas = listaRuas + `<li class="collection-item avatar">${dadosRua}</li>`
			}

			document.querySelector("#lista-ruas").innerHTML = listaRuas
			confetti();
		})
}

function getLogs() {
	const rawLogs = localStorage.getItem('logs')
	if (!rawLogs) return []
	try {
		const parsed = JSON.parse(rawLogs)
		return Array.isArray(parsed) ? parsed : []
	} catch (err) {
		return []
	}
}

function saveLogs(logs) {
	localStorage.setItem('logs', JSON.stringify(logs))
}

function pushLog(entry) {
	const logs = getLogs()
	logs.unshift(entry)
	saveLogs(logs)
}

function buscarUFs() {

	const cepInput = document.getElementById("cep");

	const mask = IMask(cepInput, {
		mask: '00000-000'
	});

	url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
	listaUfs = '<option value="" disabled selected>Escolha uma UF</option>'

	axios.get(url) // AXIOS
		.then((ufs) => {
			console.log("com axios", ufs.data)

			for (let uf of ufs.data) {
				listaUfs += `<option value="${uf.sigla}">${uf.nome}</option>`
			}
			document.querySelector("#lista-ufs").innerHTML = listaUfs
			$('select').formSelect()
		})
}

buscarUFs()

function buscarCidades(uf) {

	url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
	listaCidades = '<option value="" disabled selected>Escolha uma Cidade</option>'

	$.get(url, (cidades) => { //AJAX

		for (let cidade of cidades) {
			listaCidades += `<option value="${cidade.nome}">${cidade.nome}</option>`
		}
		document.querySelector("#lista-cidades").innerHTML = listaCidades
		$('select').formSelect()
	})

}

function buscarLog(index) {
	const logs = getLogs()
	const log = logs[index]
	if (!log) return

	if (log.type === "CEP") {
		openTab('cep-tab')
		document.querySelector("#cep").value = log.cep
		setTimeout(() => {
			mostrar()
		}, 1000)
	} else {
		openTab('rua-tab')
		document.querySelector("#lista-ufs").value = log.uf
		buscarCidades(log.uf)
		document.querySelector("#rua").value = log.rua
		setTimeout(() => {
			document.querySelector("#lista-cidades").value = log.cidade
			$('select').formSelect()
			mostrarRua()
		}, 500)
	}
}

function openTab(tabId) {
	document.querySelectorAll('#cep-tab, #rua-tab, #log-tab').forEach((section) => {
		section.style.display = 'none'
	})
	document.getElementById(tabId).style.display = 'block'

	const sideNavEl = document.querySelector('#nav-mobile')
	if (window.M && sideNavEl) {
		const instance = M.Sidenav.getInstance(sideNavEl)
		if (instance) instance.close()
	}
}

document.addEventListener('DOMContentLoaded', () => {
	openTab('cep-tab')
})

function limparCep() {
	document.getElementById("cep").value = ""
	document.getElementById("cidade").value = ""
	document.getElementById("bairro").value = ""
	document.getElementById("ddd").value = ""
	document.getElementById("estado").value = ""
	M.updateTextFields()
}

function limparRua() {
	document.getElementById("lista-ufs").selectedIndex = 0
	document.querySelector("#lista-cidades").innerHTML = '<option value="" disabled selected>Escolha umaa Cidade</option>'
	document.getElementById("rua").value = ""
	document.querySelector("#lista-ruas").innerHTML = ""
	$('select').formSelect()
	M.updateTextFields()
}

function carregarLogs(){
	const logs = getLogs()
	let listaLogs = ''

	logs.forEach((log, index) => {
		let content = ''
		if (log.type === "CEP") {
			content = `<strong>CEP</strong> ${log.date}<br>CEP: ${log.cep}`
		} else {
			content = `<strong>RUA</strong> ${log.date}<br>UF: ${log.uf} | Cidade: ${log.cidade} | Rua: ${log.rua}`
		}

		listaLogs += `
		<li class="collection-item">
			<div>${content}<a href="#!" class="secondary-content"><i onclick="buscarLog(${index})" class="material-icons">remove_red_eye</i></a></div>
		</li>
		`
	})

	document.querySelector("#lista-logs").innerHTML = listaLogs
}
