class BombSpawn2 {
    constructor() {
        this.position = new Vector2(canvas.width/2,canvas.height-20);
        this.rotation = 0;
        this.image = graphicAssets.newSpawn.image;
        this.body = null;
        
        this.bombs = [];

        
        this.scale = 0.5;
        this.radius = 10;
        this.draggable=true;
        this.timer = 0;

        this.oneMore = false;
       
        this.timeToSpawn = 5;

        this.halfWidth = 128;
        this.halfHeight = 128;
    }

    Update(deltaTime)
    {
        this.timer +=deltaTime;
        if(this.timer>=this.timeToSpawn)
        {
            this.SpawnBombs();
            bombsSpawned++;
            if(this.timeToSpawn>1)
            {
                this.timeToSpawn-=0.15
            }
            if(bombsSpawned>=20&&bombsSpawned<25)
            {
                this.SpawnBombs();
                if(!this.oneMore)
                {
                    this.timeToSpawn = 7;
                    this.oneMore = true;
                }
                
            }
            else if(bombsSpawned>=25)
            {
                this.SpawnBombs();
                this.SpawnBombs();

            }
            this.timer = 0;
            

        }
       
            //console.log(this.bombs.length);
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

        ctx.translate(this.position.x, this.position.y+100);
        ctx.rotate(-this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.image, 498, 790,160, 100, -70, -230,200, 150);
    
        ctx.restore();
        this.bombs.forEach(bomb=>bomb.Draw(ctx));
    }

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
    Restart()
    {
        for(let i = this.bombs.length - 1; i >= 0; --i)
            {  
                this.bombs[i].reset = true;
                
                
            }
           
        this.timeToSpawn = 5;

    }

   

}

   