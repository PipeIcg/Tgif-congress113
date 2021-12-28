// const members = data.results[0].members

let chamber = document.querySelector("#senate-Glance") ? "senate" : "house"

let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    headers: {
        "X-API-Key": "GO0yZe0pVfcPjxnBwFz99rqoFg3rnm1XZySZ4qMr"
    }
}

fetch(endpoint, init)
    .then(res => res.json())
    .then(data => {
        let miembros = data.results[0].members

        estadisticas.democrats = miembros.filter(member => member.party === "D")
        estadisticas.republicans = miembros.filter(member => member.party === "R")
        estadisticas.independents = miembros.filter(member => member.party === "ID")

        function renderAtGlance(estadisticas, idTabla) {
            const cuerpoTabla = document.querySelector(`#${idTabla} tbody`)
            cuerpoTabla.innerHTML += `
        <tr><td>Democrats</td><td>${estadisticas.democrats.length}</td><td>${calcularPromedio(estadisticas.democrats, "votes_with_party_pct") + "%"}</td></tr>
        <tr><td>Republicans</td><td>${estadisticas.republicans.length}</td><td>${calcularPromedio(estadisticas.republicans, "votes_with_party_pct") +"%"}</td></tr>
        <tr><td>Independents</td><td>${estadisticas.independents.length}</td><td>${calcularPromedio(estadisticas.independents, "votes_with_party_pct" + "%") || 0 +"%"}</td></tr>
        <tr><td>Total</td><td>${estadisticas.independents.length + estadisticas.republicans.length + estadisticas.democrats.length}</td><td>${Math.round((calcularPromedio(estadisticas.independents, "votes_with_party_pct") + calcularPromedio(estadisticas.republicans, "votes_with_party_pct") + calcularPromedio(estadisticas.democrats, "votes_with_party_pct")) / (estadisticas.independents.length > 0 ? 3 : 2)) + "%"}</td></tr>
        `
        }

        if (window.location.href.indexOf("pl") > -1) {

            renderTablaLoyal(leastLoyal(miembros), "leastLoyal")

            renderTablaLoyal(mostLoyal(miembros), "mostLoyal")
        }
        else {
            renderTablaMissed(leastEng(miembros), "leastEngaged")

            renderTablaMissed(mostEng(miembros), "mostEngaged")
        }
        renderAtGlance(estadisticas, `${chamber}-Glance`)

    })



let estadisticas = {
    democrats: [],
    republicans: [],
    independents: [],
    mostLoyal: [],
    leastLoyal: [],
    mostEngaged: [],
    leastEngaged: []
}


// estadisticas.democrats = members.filter(member => member.party === "D")
// estadisticas.republicans = members.filter(member => member.party === "R")
// estadisticas.independents = members.filter(member => member.party === "ID")



//calcular promedio  % votos por partido
function calcularPromedio(array, propiedad) {
    let promedio
    let suma = 0

    array.forEach(element => {
        suma += element[propiedad]
    });

    let cantidad = array.length

    promedio = suma / cantidad

    return Math.round(promedio) || 0
}

//Dibuja la tabla atGlance
// function renderAtGlance(estadisticas, idTabla) {
//     const cuerpoTabla = document.querySelector(`#${idTabla} tbody`)
//     cuerpoTabla.innerHTML += `
//     <tr><td>Democrats</td><td>${estadisticas.democrats.length}</td><td>${calcularPromedio(estadisticas.democrats, "votes_with_party_pct")}</td></tr>
//     <tr><td>Republicans</td><td>${estadisticas.republicans.length}</td><td>${calcularPromedio(estadisticas.republicans, "votes_with_party_pct")}</td></tr>
//     <tr><td>Independents</td><td>${estadisticas.independents.length}</td><td>${calcularPromedio(estadisticas.independents, "votes_with_party_pct") || 0}</td></tr>
//     <tr><td>Total</td><td>${estadisticas.independents.length + estadisticas.republicans.length + estadisticas.democrats.length}</td><td>${Math.round((calcularPromedio(estadisticas.independents, "votes_with_party_pct") + calcularPromedio(estadisticas.republicans, "votes_with_party_pct") + calcularPromedio(estadisticas.democrats, "votes_with_party_pct")) / (estadisticas.independents.length > 0 ? 3 : 2))}</td></tr>
//     `
// }
//Llamado de la funcion


//////////////// dibuja tabla missed

function renderTablaMissed(miembros, id) {
    const cuerpoTabla = document.querySelector(`#${id} tbody`)
    cuerpoTabla.innerHTML = ""

    miembros.forEach(miembro => {
        let fila = document.createElement("tr")
        let nombre = `${miembro.last_name}, ${miembro.first_name} ${miembro.middle_name ? miembro.middle_name : ""}`

        fila.innerHTML += `
                    <tr><td><a href="${miembro.url}" target="_blank">${nombre}</a></td></tr>
                    <tr><td>${miembro.missed_votes}</td></tr>
                    <tr><td>${miembro.missed_votes_pct + "%"}</td></tr>
                `
        cuerpoTabla.appendChild(fila)
    });
}

//////////////Dibuja tabla Loyal D:
function renderTablaLoyal(miembros, id) {
    const cuerpoTabla = document.querySelector(`#${id} tbody`)
    cuerpoTabla.innerHTML = ""

    miembros.forEach(miembro => {
        let fila = document.createElement("tr")
        let nombre = `${miembro.last_name}, ${miembro.first_name} ${miembro.middle_name ? miembro.middle_name : ""}`

        fila.innerHTML += `
                    <tr><td><a href="${miembro.url}" target="_blank">${nombre}</a></td></tr>
                    <tr><td>${miembro.total_votes}</td></tr>
                    <tr><td>${miembro.votes_with_party_pct + "%"}</td></tr>
                `
        cuerpoTabla.appendChild(fila)
    });
}

// let copiaMembers = [...members]

//Dibuja contenido
//Least Engaged
function leastEng(array) {
    array.sort((b, a) => a.missed_votes - b.missed_votes)

    let indiceLimite = (array.length * 10 / 100) - 1

    return array.slice(0, indiceLimite)
}
//Most Engaged
function mostEng(array) {
    array.sort((b, a) => b.missed_votes - a.missed_votes)

    let indiceLimite = (array.length * 10 / 100) - 1

    return array.slice(0, indiceLimite)
}
//Least Loyal
function leastLoyal(array) {
    let arrayAux = []
    array.sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)

    let indiceLimite = (array.length * 0.1)
    arrayAux = array.filter(miembro => miembro.votes_with_party_pct > 0).slice(0, indiceLimite)


    return arrayAux
}

//Most Loyal
function mostLoyal(array) {
    let arrayAux = []
    array.sort((b, a) => a.votes_with_party_pct - b.votes_with_party_pct)

    let indiceLimite = (array.length * 0.1)
    arrayAux = array.slice(0, indiceLimite)


    return arrayAux.filter(miembro => miembro.votes_with_party_pct > 0) 
}


// if (window.location.href.indexOf("pl") > -1) {

//     renderTablaLoyal(leastLoyal(members), "leastLoyal")

//     renderTablaLoyal(mostLoyal(members), "mostLoyal")
// }
// else {
//     renderTablaMissed(leastEng(members), "leastEngaged")

//     renderTablaMissed(mostEng(members), "mostEngaged")
// }
// renderAtGlance(estadisticas, `${chamber}-Glance`)
//attendance


//part loyal



