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
            <img class= "onePiece" src="https://i.pinimg.com/originals/77/86/bd/7786bdded50f80f4e71979b281e0eb78.jpg">
            <img class ="AOT" src = "https://c4.wallpaperflare.com/wallpaper/756/731/751/anime-attack-on-titan-eren-yeager-shingeki-no-kyojin-wallpaper-thumb.jpg">
            <img class ="jujutsu" src = "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/4-jujutsu-kaisen-jonathan-dat.jpg">
            <div class ="container1">
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
            </div> 
            </body>
            </html>
        `)

    }catch(ex){
        next(ex); 
    }
})

app.get('/animes/:id', async(req, res, next)=>{
    try{

        const promises = [
            client.query(`SELECT * FROM "Anime" WHERE id=$1;`, [req.params.id]), client.query(`SELECT * FROM "Character" WHERE anime_id=$1;`, [req.params.id])
        ]
        
        const responses = await Promise.all(promises); 

        //If you wanted to destructure and use it would be as follows
        // const [animeResponse, charactersResponse] = await Promise.all(promises);
        // const anime = animeResponse.rows[0];
        // const characters = charactersResponse[1].rows; 

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
                </li>`).join("")
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