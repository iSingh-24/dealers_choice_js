const pg = require('pg'); 

const port = process.env.PORT || 3000; 
const client = new pg.Client('postgres://localhost/anime_chars_db');

const syncAndSeed = async () =>{

    const SQL = `
        DROP TABLE IF EXISTS "Character"; 
        DROP TABLE IF EXISTS "Anime"; 
        CREATE TABLE "Anime"(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        ); 

        CREATE TABLE "Character"(
            id INTEGER PRIMARY KEY, 
            name VARCHAR(100) NOT NULL,
            anime_id INTEGER REFERENCES "Anime"(id)
        );

        INSERT INTO "Anime"(id, name) VALUES(1, 'One Piece');
        INSERT INTO "Anime"(id, name) VALUES(2, 'Attack On Titan');
        INSERT INTO "Anime"(id, name) VALUES(3, 'Jujutsu Kaisen');

        INSERT INTO "Character"(id, name, anime_id) VALUES(1, 'Monkey D. Luffy',1);
        INSERT INTO "Character"(id, name, anime_id) VALUES(2, 'Eren Yeager',2);
        INSERT INTO "Character"(id, name, anime_id) VALUES(3, 'Satoru Gojo',3);
        
        
    `;

    await client.query(SQL); //this is how the client will interact with the database. This line tells the client to run the SQL 
}

module.exports = {
    client,
    syncAndSeed
}

