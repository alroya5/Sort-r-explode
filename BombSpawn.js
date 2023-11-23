class BombSpawn {
    constructor() {
        this.position = new Vector2(canvas.width/2,0+20);
        this.rotation = 0;
        this.image = graphicAssets.background.image;
        this.body = null;
        
        //array de bombas
        this.bombs = [];

        
        this.scale = 0.5;
        this.radius = 25;
        //si se peude agarrar
        this.draggable=true;
        this.timer = 0;

        //spawn adicional
        this.oneMore = false;
       
        //tiempo de spawn
        this.timeToSpawn = 5;

        this.halfWidth = 128;
        this.halfHeight = 128;
    }

    Update(deltaTime)
    {
        //lógica de la dificultad del juego
        this.timer +=deltaTime;
        if(this.timer>=this.timeToSpawn)
        {
            this.SpawnBombs();
            bombsSpawned++;
            //para que no pase de 1 segundo y se rompa el juego
            if(this.timeToSpawn>1)
            {
                this.timeToSpawn-=0.15
            }
            //otra bomba más
            if(bombsSpawned>=20&&bombsSpawned<25)
            {
                this.SpawnBombs();
                if(!this.oneMore)
                {
                    this.timeToSpawn = 7;
                    this.oneMore = true;
                }
                
            }
            //dos bombas más
            else if(bombsSpawned>=25)
            {
                this.SpawnBombs();
                this.SpawnBombs();

            }
            
            
            this.timer = 0;

        }
       
            //si hay alguna bomba con estas condiciones activadas se destruyen
            for(let i = this.bombs.length - 1; i >= 0; --i)
            {   
                if(this.bombs[i].remove==true)
                {
                    world.DestroyBody(this.bombs[i].body);
                    this.bombs.splice(i,1);
                    points++;
                }
                else if(this.bombs[i].reset==true)
                {
                    world.DestroyBody(this.bombs[i].body);
                    this.bombs.splice(i,1);
                   
                    
                }
                
                this.bombs[i].Update(deltaTime);
                
            }
       
        
       
       
        
       
    }

    Draw(ctx) {
        
        
       
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(-this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.image, 600, 300, 80, 120, -90, -90,180, 200);
    
        ctx.restore();
        this.bombs.forEach(bomb=>bomb.Draw(ctx));
    }

    //saca bombas por pantalla y las añade al array
    SpawnBombs ()
    {
       let newBomb=null; 
      
       let random = RandomBetweenInt(1,2);
       if(random==1)
       {
         newBomb = new Black(new Vector2(this.position.x, this.position.y));
         newBomb.Start(this.position.x,this.position.y);
         this.bombs.push(newBomb);
       }
       else
       {
        newBomb = new Pink(new Vector2(this.position.x, this.position.y));
        newBomb.Start(this.position.x,this.position.y);
        this.bombs.push(newBomb);
       }
       
       
      
    }
    //resetea todas las bombas del array
    Restart()
    {
        for(let i = this.bombs.length - 1; i >= 0; --i)
            {  
                this.bombs[i].reset = true;
                
            }
         
        this.timeToSpawn = 5;
        

    }

   

}

   