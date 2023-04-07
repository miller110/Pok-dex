/*Autor: Miller Santiago
Descrição:
Eu utilizei a maior parte do código da DIO, fazendo um fork do arquivo e clonando-o. Adicionei um código HTML que simula uma segunda página que apresenta o resultado quando o usuário clica na imagem do Pokémon. Quando o usuário passa o mouse sobre a imagem do Pokémon, uma mensagem é exibida, informando "Clique e saiba mais do: nome_do_pokemon". Quando o usuário clica na imagem, eu limpo a tela, removendo os elementos HTML que tinham nela, e deixo apenas o Pokémon que o usuário clicou, com sua descrição e um botão para voltar à tela principal. Ao clicar no botão "voltar", o usuário retorna à tela inicial e pode utilizá-la normalmente.
 */



// utilizando o dom para capturar elementos html pelo id.
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

// variaveis de fluxo
const maxRecords = 1154 // quantidade de pokemons
const limit = 12 // limite de 12 pokemons por requisicao
let offset = 0 // inicio da contagem de apresentacao dos pokemons = incrementando de 12 em 12

let pokemons = [] // lista para armazenamento dos pokemons dinamicamente
let pokemons2 = [] // lista para armazenamento dos pokemons dinamicamente 
let quantPokemonsAtual = 0 // contagem de pokemons atual
let btnVoltarClicado = false

// funcao de modelo apresentada na aula da Dio. Representa a apresentacao dos pokemons na tela principal
function convertPokemonToLi(pokemon) {
    return `
    <li class="pokemon ${pokemon.type}">
        <span class="number">${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <button title="Clique e Saiba mais do: ${pokemon.name}" id="${pokemon.name}"><img src="${pokemon.photo}"
                 alt="${pokemon.name}"></button>
        </div>
    </li>
`
}

// meu código que apresenta os detalhes do pokemon = codigo html dinamico
function adicionarDetalhesDoPokemon(pokemon, details_pokemon) {
    return `<div class="pokeid">
    <li id="poke" class="pokemon ${pokemon.type}">
    <span class="number">${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>

    <div class="detail">
        <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>

        <img src="${pokemon.photo}"
             alt="${pokemon.name}">
    </div>
    <br>
    <ul class="types">
            <li>Habilidades: ${details_pokemon.abilities}</li>
            <li>Experiência: ${details_pokemon.experience}</li>
            <li>Altura: ${details_pokemon.height}</li>
            <li>Largura: ${details_pokemon.weigth}</li>
        </ul>
    </li>
    </div>
    <br>
     `
}

// funcao modelo apresentada na aula para identificar os pokemons consumidos pela api rest
function loadPokemonItens(offset, limit) {
    console.log('LoadPokemonsItens: offset: ' + offset + ' - limit: ' + limit)
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        quantPokemonsAtual += limit
        return pokemons

    }).then(pokemons => {
        pokemons.forEach(element => {
            pokemons2.push(element)
        })

        pokemons = pokemons2
        console.log(pokemons)
        return pokemons
    }).then(pokemons => {
        apresentarDetalhesDosPokemons(pokemons)
    })
}

// minha contribuicao do carregamento dos dados do pokemon, consumindo a api rest
function loadPokemon(offset, limit, pokemons) {
    pokeApi2.getPokemons2(offset + 1).then((details_pokemon) => {
       
        // escondendo o botao de loadmore, que nao sera necessario na apresentacao dos detalhes
        loadMoreButton.style.display = 'none'
        return details_pokemon
    
    
    // atualizando o html dinamicamente com os dados do pokemon que foi clicado pelo usuario (usuario clica na imagem do pokemon)
    }).then(details_pokemon => {
        pokemonList.innerHTML = adicionarDetalhesDoPokemon(pokemons[offset], details_pokemon)
            
    // adicionando o botao de voltar dinamicamente
    }).then(() => {
        pokemonList.innerHTML += `<button type="button" id="btn_voltar">Voltar</button>`

    }).then(() => {
        // adicionando o evento de click do mouse dinamicamente ao botao voltar
        let btnVoltar = document.getElementById('btn_voltar')
        btnVoltar.addEventListener('click', () => {
        // limpando a tela secundária para apresentar novamente a tela principal com a listagem dos pokemons (quando o usuario clicar no botao voltar)
            pokemonList.innerHTML = ''
            offset = 0
            console.log('BTN VOLTAR=off:' + offset + ' - lim: ' + limit)
            quantPokemonsAtual = 0
            pokemons = []
            pokemons2 = []
            btnVoltarClicado = true

            // adicionar elementos aqui
            loadPokemonItens(offset, limit)
            // reapresentando o botao load more que estava escondido
            loadMoreButton.style.display = 'initial'
        })
    })
}

// adicionando eventos de click a todos os pokemons que surgiram do consumo da api
function apresentarDetalhesDosPokemons(pokemons) {
    console.log('apresentarDetalheDosPokemons: ' + pokemons.length)
    for (let i = 0; i < pokemons.length; i++) {
        // adicionando o evento de clique de mouse a cada pokemon

        document.getElementById(pokemons[i].name).addEventListener('click', () => {
           // carredando a tela secundaria onde apresenta os detalhes do pokemon 
            loadPokemon(i, 12, pokemons) // parametros (i=elemento clicado, 12=limite de paginacao, pokemons=lista)
        })
    }
}
// inicializacao = primeira vez que a pagina aparece e a primeira listagem de pokemons consumindo a api
loadPokemonItens(offset, limit)
// modelo apresentado na aula para o botao loadmore que apresenta a listagem de pokemon de acordo com o offset dinamico e limite controlado
loadMoreButton.addEventListener('click', () => {
    // controle de fluxo do offset para apresentar a lista de pokemons resetada
    if (btnVoltarClicado === true) {
        offset = 0
        btnVoltarClicado = false
    }
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        console.log('LoadMoreButton: newLimit: ' + newLimit)
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        console.log('LoadMoreButton: offset' + offset + '- limit: ' + limit)
        loadPokemonItens(offset, limit)
    }
})



