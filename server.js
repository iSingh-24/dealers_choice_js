const { client, syncAndSeed} = require('./animeDB') 
const express = require('express');
const path = require('path');

const app = express(); 

app.use('/public', express.static(path.join(__dirname,'public')));

app.get('/', async(req, res, next)=>{
    try{
        const response = await client.query(`SELECT * FROM "Anime";`);
        //res.send(response.rows)//JSON data

        const animes = response.rows; 

        res.send(`
            <html>
            <head>
              <link rel='stylesheet' href='/public/styles.css'/>
            </head>
            <body>
            <h1 class ="title">Epic Anime List</h1>
           <br>
           <br>
            <h2>Top 3 Anime</h2> 
            <ul>
            ${
                animes.map(anime => `
                    <li class="animes">
                        <a href="/animes/${anime.id}"> 
                    ${anime.name}
                    </li>
                    <a/>
                    <p>${anime.description}</p>
                `).join("")
            }
            </ul>
            </body>
            </html>
        `)

    }catch(ex){
        next(ex); 
    }
})

let img = `<img>`; 

app.get('/animes/:id', async(req, res, next)=>{
    try{

        const promises = [
            client.query(`SELECT * FROM "Anime" WHERE id=$1;`, [req.params.id]), client.query(`SELECT * FROM "Character" WHERE anime_id=$1;`, [req.params.id])
        ]
        
        const responses = await Promise.all(promises); 

        const anime = responses[0].rows[0];
        
        const characters = responses[1].rows; 

        res.send(`
            <html>
            <head>
              <link rel='stylesheet' href='/public/styles.css'/>
            </head>
            <body>
            <h1>Epic Anime List</h1>
            <h2><a href = "/">Top 3 Anime</a> <p>${anime.name}</p></h2>  
            <ul>
            ${
                characters.map(character => `
                <li class="characters">
                  ${character.name}
                </li>
                <li>
                ${character.description}
                </li>
                `).join("")

            }
            </ul>
            </body>
            </html>
        `)

    }catch(ex){
        next(ex); 
    }
})

const port = process.env.PORT || 3000; 

const setUp = async() =>{
    try{
        await client.connect();
        await syncAndSeed(); //this will create the tables 
        console.log("Connected to database");
        //listen after you know you're connected 
        app.listen(port, ()=> console.log(`Listening at port ${port}`));
    }catch(ex){
        console.log(ex); 
    }
}  //will handle testing to see if you connected

setUp();