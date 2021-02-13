const pg = require('pg'); 

const port = process.env.PORT || 3000; 
const client = new pg.Client('postgres://localhost/anime_chars_db');

const syncAndSeed = async () =>{

    const SQL = `
        DROP TABLE IF EXISTS "Character"; 
        DROP TABLE IF EXISTS "Anime"; 
        CREATE TABLE "Anime"(
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(20000)
        ); 

        CREATE TABLE "Character"(
            id INTEGER PRIMARY KEY, 
            name VARCHAR(100) NOT NULL,
            anime_id INTEGER REFERENCES "Anime"(id)
        );

        INSERT INTO "Anime"(id, name,description) VALUES(1, 'One Piece', 'This anime is about a young boy named Monkey D. Luffy who has a desire for adventure. He follows the footsteps of his childhood idol who is known as "Red Haired" Shanks. The story takes place in the age of pirates where all pirates are aiming to find the treasure known as "One Piece" that was left by the king of the pirates "Gold D. ROGER".');
        INSERT INTO "Anime"(id, name, description) VALUES(2, 'Attack On Titan', 'Civilization is left within 3 walls. Over 100 years ago humanity had been driven to the brink of extinction after the emergence of human-like giants called Titans appeared and started to kill and eat all humans. Fast forward to the present and humanity lives in "peace" while not worrying about the outside threat, but they soon will be in for a rude awakening that this "peace" they have blinded themselves with, in reality is a ticking time bomb.');
        INSERT INTO "Anime"(id, name, description) VALUES(3, 'Jujutsu Kaisen', 'This is the story of a high school student Yuji Itadori, who has no choice but to join an organization of sorcerors in order to kill the most powerful curse in existance who is personified as a human named "Ryoma Sukuna". The reason he doesn''t have a choice is because he becomes the host of Sukuna so either he kills himself, or he helps the sorceror organization hunt down and find a way to kill Sukuna. ');

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

