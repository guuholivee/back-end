const express = require("express");
const axios =require ("axios");

const app = express();

const api = axios.create({
    baseURL:"https://swapi.py4e.com/api",
});

app.get("/:categoria/:id", async (req, res)=> {
    const { categoria, id} = req.params;
    try{
        let { data } = await api.get(`/${categoria}/${id}`);
        console.log(data);
        
        await Promise.all(
            Object.entries(data).map(async (p) =>{
                if(p[0] == "homeworld") {
                    const homeworld = await api.get(
                        `/planets/${p[1].split(`planets/`)[1]}`
                    );
                    data[p[0]] = homeworld.data.name; 
                }   else if (Array.isArray(p[1])) {
                    let name, id;
                    for(const [i, v] of p[1].entries()){
                        name = p[0] == "people" ||
                            p[0] == "characters" ||
                            p[0] == "pilots" ||
                            p[0] == "residents" ?
                            "people"
                            :p[0];
                        id = v.split(`${name}/`)[1];
                        const retornoAPI = await api.get(
                            `/${name}/${id}`
                        );
                        const nome = retornoAPI.data.name 
                            ? retornoAPI.data.name 
                            : retornoAPI.data.title 
                        p[1][i] = nome;
                    }

                }
                    
            })
        );
        let retorno;
        if(categoria == "people"){   
         retorno =`
        <html>
            <body>
                <title> Star wars Wiki</title>
                <h1>Nome:${data.name}</h1>
                <p>Altura:${data.height}</p>
                <p>Peso:${data.mass}</p>
                <p>homeworld: ${data.homeworld}</p>
                <p>films: ${data.films}</p>
                <p>Espécie: ${data.species}</p>
                <p>Veiculos: ${data.vehicles}</p>
                <p>Naves: ${data.starships}</p> 
            </body>
        </html>
        `
        } else if (categoria == "films"){   
             retorno =`
            <html>
                <body>
                    <h1>Nome:${data.title}</h1>
                    <p>episodio:${data.episode_id}</p>
                    <p>personagens: ${data.characters}</p>
                    <p>Planeta: ${data.planets}</p>
                    <p>Veiculos: ${data.vehicles}</p>
                    <p>Naves: ${data.starships}</p>
                    <p>Especies: ${data.species}</p> 
                </body>
            </html>
            `
            } else if (categoria == "planets"){   
                retorno =`
               <html>
                   <body>
                       <h1>Nome:${data.nane}</h1>
                       <p>Residentes: ${data.residents}</p>
                       <p>films: ${data.films}</p>
                   </body>
               </html>
               `
               } else if (categoria == "starships"){   
                retorno =`
               <html>
                   <body>
                       <h1>Nome:${data.name}</h1>
                       <p>pilotos: ${data.pilots}</p>
                       <p>films: ${data.films}</p>
                       <p>Veiculos: ${data.vehicles}</p>
                       <p>Naves: ${data.starships}</p>
                       <p>Especies: ${data.species}</p> 
                   </body>
               </html>
               `
               } else if (categoria == "vehicles"){   
                retorno =`
               <html>
                   <body>
                       <h1>Nome:${data.name}</h1>
                       <p>Pilotos:${data.pilots}</p>
                       <p>films: ${data.films}</p>
                   </body>
               </html>
               `
               } 
       res.status(202).send(retorno);
    } catch (error) {
         res.status(404).send("<html><body><h1>Erro!!!</h1></body></html>")
    }
    
    
});

app.listen(8888,()=>{
    console.log("servidor web iniciado"); 
});


 