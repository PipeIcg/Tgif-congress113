
// let members = data.results[0].members


//dibujar tabla principal
    
    function renderTablaSenate(miembros, id) {
        const cuerpoTabla = document.querySelector(`#${id} tbody`)
        cuerpoTabla.innerHTML = "" // Borrar contenido
        if (filtroPartidos(filtroEstados(/*members*/miembros, select.value), checkbox()) != 0) {
            miembros.forEach(miembro => {
                let fila = document.createElement("tr")
                let nombre = `${miembro.last_name}, ${miembro.first_name} ${miembro.middle_name ? miembro.middle_name : ""}`
                
                fila.innerHTML += `
                <td><a href="${miembro.url}" target="_blank">${nombre}</a></td>
                <td>${miembro.party}</td>
                <td>${miembro.state}</td>
                <td>${miembro.seniority}</td>
                <td>${miembro.votes_with_party_pct +"%"}</td>
                `
                cuerpoTabla.appendChild(fila)
            })
        } else {
            
            cuerpoTabla.innerHTML += `
            <tr><td colspan="5">
            <div class = "alert alert-danger text-center" role = "alert" >
            No hay informacion que mostrar! 
            </div>
            </td></tr>`
            
        }console.log("function")
        
    }
    
    function dibujarSelect(miembros, id) {
        const cuerpoSelect = document.querySelector(`#${id}`)
        let states = []
        miembros.forEach(miembro => {
            states.push(miembro.state)
        })
        
        let orden = [...new Set(states.sort())]
        console.log(orden)
        
        orden.forEach(state => {
            cuerpoSelect.innerHTML += `
            <option class="opt" value="${state}">${state}</option>
            `
        })
        
        /* cuerpoSelect.appendChild("select") */
        
    }
    
   /*  dibujarSelect(members, "selec") */
    
    
    //Filtrar estados
    function filtroEstados(array, state) {
        if (select.value == "all") {
            return array
        }
        let filtrados = array.filter((e) =>
        e.state == state
        )
        
        
        return filtrados
    }
    
    
    let select = document.querySelector(`#selec`)
    
    // // checkbox
    
    function checkbox() {
        let chequeados = document.querySelectorAll("input[type=checkbox]:checked")
        let arrayAux = []
        chequeados.forEach((check) => arrayAux.push(check.value))
        return arrayAux
    }
    
    //Filtrar partidos
    function filtroPartidos(array, party) {
        let filtrados = []
        for (let i = 0; i < party.length; i++) {
            filtrados = filtrados.concat(array.filter(partido => partido.party == party[i]))
        }
        return filtrados
    }

    let chamber = document.querySelector("#senate-table") ? "senate":"house"

    let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`
    
    let init = {
        headers: {
            "X-API-Key":"GO0yZe0pVfcPjxnBwFz99rqoFg3rnm1XZySZ4qMr"
        }
    }
    
    fetch(endpoint, init)
    .then(res => res.json())
    .then(data => {
        let miembros = data.results[0].members
        let selector = document.querySelector("#selec")
        let check = document.querySelectorAll("input[type=checkbox]")
        dibujarSelect(miembros, "selec")
        function tiqueado() {
            renderTablaSenate(filtroPartidos(filtroEstados(miembros, select.value), checkbox()), `${chamber}-table`)
        }
        tiqueado()
        selector.addEventListener("change", tiqueado)
        check.forEach(e => e.addEventListener("change", tiqueado))
    
    })
    .catch(err => console.error(err))


