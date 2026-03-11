function mostrar(){
	cep = document.getElementById("cep").value // pegando valor do cep
	// url = "https://viacep.com.br/ws/"+cep+"/json/" // url do viacep
	url = `https://viacep.com.br/ws/${cep}/json/` // url do viacep

	// BUSCANDO O CEP USANDO FETCH
	fetch(url)
		.then((res)=>{ // variavel "res" irá armazenar a resposta inicial
			return res.json() // convertendo a resposta em JSON
		})
		.then((cep)=>{ // variavel "cep" contendo o json com o CEP do viacep
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