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
            <h1>Epic Anime List</h1>
            <h2>Top 3 Anime</h2> 
            <ul>
            ${
                animes.map(anime => `
                    <li>
                        <a href="/brands/${anime.id}"> 
                    ${anime.name}
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