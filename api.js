const baseUrl = "http://127.0.0.1:8000/api";
const frontUrl = "https://linkando.herokuapp.com";
const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

function registrarUsuario() {
    
    let data = {};
    data.name = document.getElementById('nome').value;
    data.email = document.getElementById('email').value;
    data.password = document.getElementById('senha').value;
    data.password_confirmation = document.getElementById('confirme_senha').value;

    axios.post(baseUrl + "/register", data).then((response) => {
        console.log('registrarUsuario', response);
    }).catch((error) => {
        console.log('error registrarUsuario', error);
    })
}

function login() {
    
    let data = {};
    data.email = document.getElementById('email').value;
    data.password = document.getElementById('senha').value;

    axios.post(baseUrl + "/login", data).then((response) => {
        console.log('login', response);
        let token = response.data.token;
        localStorage.setItem("token", token);
        window.location.href = frontUrl + "/index.html";
        
    }).catch((error) => {
        console.log('error login', error);
    })
}

 //todas as urls de todos os usuários configuradas como públicas
function pegarTodasUrls() {
    axios.get(baseUrl + "/urls").then((response) => {
        console.log('pegarTodasUrls', response);
        let data = response.data.urls;
        htmlUrlsPublicas(data);
    }).catch((error) => {
        console.log('error pegarTodasUrls', error);
    })
}

function htmlListarTags(tags){
    let lista_categorias = document.getElementById("lista_categorias");
    for(let i = 0; i < tags.length; i++){
        let elementLi = document.createElement("LI");
        let elementUrl = document.createElement("a");
        //elementUrl.href = "";
        elementUrl.innerText = tags[i].name;
        elementLi.appendChild(elementUrl);
        elementLi.classList.add("ponteiro");
        //elementLi.onclick = function() {buscarUrl({elemento: 'input', tag: tags[i].name})};
        elementLi.addEventListener("click", function () {
            buscarUrl(
                {elemento: 'lista', tag: tags[i].name}
                )
        });
        lista_categorias.appendChild(elementLi);
    }
}

function pegarDadosUsuario() {

    axios.get(baseUrl + "/user").then((response) => {
        console.log('pegarDadosUsuario', response);
    }).catch((error) => {
        console.log('error pegarDadosUsuario', error);
    })
}

function pegarUrlsUsuario() {

    axios.get(baseUrl + "/user/urls", config).then((response) => {
        console.log('pegarUrlsUsuario', response);
        let urls = response.data.urls.urls;
        htmlUrlsUsuario(urls)
    }).catch((error) => {
        console.log('error pegarUrlsUsuario', error);
    })
}

function pegarSelect(){
    let tag = document.getElementById('categoria').value;
    if(tag == 'outro')
        document.getElementById("categoria_outro").style.display = "inline";
    else
    document.getElementById("categoria_outro").style.display = "none";
}

function pegarTags(element) {
    axios.get(baseUrl + "/tags").then((response) => {
        console.log('pegarTags', response);
        let tags = response.data.tags;
        if(element == 'checkbox')
            htmlTagsCheckbox(tags);
        else if(element == 'lista')
            htmlListarTags(tags);
    }).catch((error) => {
        console.log('error pegarTags', error);
    })
}

function htmlTagsCheckbox(tags){
    for(let i = 0; i < tags.length; i++){
        let checkboxTags = document.getElementById("categoria");
        let elementInput = document.createElement("input");
        elementInput.type = "checkbox";
        elementInput.value = tags[i].id;
        elementInput.name = "tag_form";
        let label = document.createElement("label");
        label.innerText = tags[i].name;
        label.classList.add("input-tag");
        label.appendChild(elementInput);
        checkboxTags.appendChild(label);
    }
}

function criarUrl() {
    let data = {};
    data.name = document.getElementById('name_link').value;
    data.address = document.getElementById('link').value;
    data.privacy = document.getElementById('privacidade').value;
    data.tags = [];
    data.new_tags = document.getElementById('outras_tags').value;
    let tags = document.getElementsByName('tag_form');
    for(let i = 0; i < tags.length; i++){
        if(tags[i].checked)
            data.tags.push(tags[i].value);
    }
    axios.post(baseUrl + "/url", data, config).then((response) => {
        console.log('criarUrl', response);
        window.location.href = frontUrl + "/meus-links.html";
    }).catch((error) => {
        console.log('error criarUrl', error);
    })
}

function editarUrl(id) {
    
    let data = {};
    data.name = document.getElementById('name').value;
    data.address = document.getElementById('address').value;
    data.privacy = document.getElementById('privacy').value;
    data.tags = document.getElementById('tags').value;

    axios.put(baseUrl + "/url/" + id, data).then((response) => {
        console.log('editarUrl', response);
    }).catch((error) => {
        console.log('error editarUrl', error);
    })
}

function deletarUrl(id) {
    axios.delete(baseUrl + "/url/" + id, config).then((response) => {
        console.log('deletarUrl', response);
        pegarUrlsUsuario();
    }).catch((error) => {
        console.log('error deletarUrl', error);
    })
}

function buscarUrl(busca){
    let url;
    if(busca.elemento == 'input')
        url = document.getElementById("busca_index").value;
    else if(busca.elemento == 'lista')
        url = busca.tag;   
    console.log('url', url);
    axios.get(baseUrl + "/urls").then((response) => {
        console.log('buscarUrl', response);
        let data = response.data.urls;
        let result = [];
        for(let i = 0; i < data.length; i++){
            if(data[i].name.toLowerCase().includes(url.toLowerCase())){
                result.push(data[i]);
            }
            for(let j = 0; j < data[i].tags.length; j++){
                if(data[i].tags[j].name.toLowerCase().includes(url.toLowerCase()))
                    result.push(data[i]);
            }
        }
        let lista = document.getElementById('lista-urls-publicas');
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
        htmlUrlsPublicas(result);
    }).catch((error) => {
        console.log('error buscarUrl', error);
    })
}

function htmlUrlsPublicas(data) {
    for(let i = 0; i < data.length; i++){
        let url = data[i].address;
        let title = data[i].name;
        let tags = data[i].tags;
        //html da lista
        let lista = document.getElementById('lista-urls-publicas');
        let elementLi = document.createElement("LI");
        let elementUrl = document.createElement("a");
        elementUrl.href = url;
        elementUrl.innerText = title;
        elementLi.appendChild(elementUrl);
        lista.appendChild(elementLi);
        let elementHr = document.createElement("HR");
        elementLi.insertAdjacentElement("afterend", elementHr);
        let elementBr = document.createElement("BR");
        elementLi.insertAdjacentElement("beforebegin", elementBr);
        let elementBr2 = document.createElement("BR");
        elementHr.insertAdjacentElement("beforebegin", elementBr2);
        let elementBr3 = document.createElement("BR");
        elementUrl.insertAdjacentElement("afterend", elementBr3);
        //icone categorias
        let elementTag = document.createElement("a");
        //elementTag.href = '';
        elementTag.classList.add("icone-categoria");
        let tagName = "Categoria: ";
        //categorias
        for(let j = 0; j < tags.length; j++){
            if(j == 0)
                tagName = tagName + tags[j].name;
            else
                tagName = tagName + ', '  + tags[j].name;
        }
        elementTag.innerText = tagName;
        if(tags.length > 0)
            elementUrl.insertAdjacentElement("afterend", elementTag);
    }
}

function htmlUrlsUsuario(urls){
    let lista = document.getElementById('lista-minhas-urls');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    for(let i = 0; i < urls.length; i++){
        let url = urls[i].address;
        let title = urls[i].name;
        let tags = urls[i].tags;
        let id = urls[i].id;
        //html da lista
        let elementLi = document.createElement("LI");
        let elementUrl = document.createElement("a");
        elementUrl.href = url;
        elementUrl.innerText = title;
        elementLi.appendChild(elementUrl);
        lista.appendChild(elementLi);
        let elementHr = document.createElement("HR");
        elementLi.insertAdjacentElement("afterend", elementHr);
        let elementBr = document.createElement("BR");
        elementLi.insertAdjacentElement("beforebegin", elementBr);
        let elementBr2 = document.createElement("BR");
        elementHr.insertAdjacentElement("beforebegin", elementBr2);
        //icone categorias
        let elementTag = document.createElement("a");
        //elementTag.href = '';
        elementTag.classList.add("icone-categoria");
        let tagName = "Categoria: ";
        //categorias
        for(let j = 0; j < tags.length; j++){
            if(j == 0)
                tagName = tagName + tags[j].name;
            else
                tagName = tagName + ', '  + tags[j].name;
        }
        elementTag.innerText = tagName;
        if(tags.length > 0)
            elementUrl.insertAdjacentElement("afterend", elementTag);
        //botao remover
        let btn = document.createElement("button");
        btn.classList.add("remover-link");
        elementLi.insertAdjacentElement("beforeend", btn);
        btn.onclick = function(event) {
            deletarUrl(id);
          }
    }
}