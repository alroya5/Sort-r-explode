
class Black {
    constructor(initialPosition) {
        //parámetros básicos de las bombas
        this.position = initialPosition;
        this.rotation = 0;
        this.image = graphicAssets.black.image;
        this.body = null;

        //velocidad
        this.speed = 0;
        //dirección
        this.direction = 0;
        this.moving = false;
        this.scale = 1.6;
        this.radius = 15;
        this.draggable=true;
        //tiempo para explotar y timer
        this.explodeTimer = 12;
        this.time = 0;
        
        //variables para resetear
        this.remove = false;
        this.reset = false;

        this.halfWidth = 128;
        this.halfHeight = 128;
    }

    Start() {
        //se crea el cuerpo base de la bomba
        this.body = CreateCircle(world, this.position.x / scale, (canvas.height - this.position.y) / scale, this.radius/scale, {
            restitution: 0.75,
            type: b2Body.b2_dynamicBody //StaticBody dynamicBody
        });
        this.body.SetUserData("black");

        //agregar evento de escucha del mouse
        canvas.addEventListener("mousedown", this.MouseDown.bind(this));
        canvas.addEventListener("mousemove", this.MouseMove.bind(this));
        canvas.addEventListener("mouseup", this.MouseUp.bind(this));
      
    }

    Update(deltaTime) {
        this.time+=deltaTime;
        this.position.x = this.body.GetPosition().x * scale;
        this.position.y = canvas.height - (this.body.GetPosition().y * scale);
        this.rotation = this.body.GetAngle();
    

        if (!this.dragStart)
        {
             this.MoveRandomly();
         }
         //se destruye el cuerpo
         if(this.reset)
         {
            world.DestroyBody(this.bombs.body);
         }
         //si se llega al límite de tiempo muere
        if(this.time>= 11)
        {
            this.scale = 2;
            if(this.time>=this.explodeTimer)
            {
               
               
               Reset();
    
            }
        }
      
    }

    Draw(ctx) {
        ctx.save();

        ctx.translate(this.position.x-20, this.position.y);
        ctx.rotate(-this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.drawImage(this.image, 110, 105, 40, 40, -23, -24,50, 50);

        ctx.restore();
    }

    Reset() {
        this.body.SetPosition(new b2Vec2(Math.random() + 1, Math.random() + 2));
        this.body.SetAngularVelocity(0);
        this.body.SetLinearVelocity(new b2Vec2(0, 0));
        this.moving=false;
    }

    //escoge una dirección aleatoria al iniciar y al soltar el mouse
    MoveRandomly() {
        if (!this.moving) {
          const speed = 4; // velocidad de movimiento
          const direction = Math.random() * Math.PI * 2; // dirección aleatoria
          const velocity = new b2Vec2(speed * Math.cos(direction), speed * Math.sin(direction));
           this.body.SetLinearVelocity(velocity);
          this.moving = true;
        }
      }

    MouseDown(event) {
        // Verificar si el mouse está sobre la bola
        this.initialPos = this.body.GetPosition().Copy();

        let mousePos = getMousePos(canvas, event);
        if (this.IsMouseOver(mousePos)&&this.draggable==true) {
            // Guardar la posición del mouse en el momento de hacer clic
            this.dragStart = mousePos;
            this.body.SetAwake(true);
        }
    }

    MouseMove(event) {
        // Si la bola está siendo arrastrada, actualizar su posición
        if (this.dragStart&&this.draggable==true) {
            let mousePos = getMousePos(canvas, event);
            let movement = {
                x: mousePos.x - this.dragStart.x,
                y: mousePos.y - this.dragStart.y
            };
            let newPos = this.initialPos.Copy();
            newPos.Add(new b2Vec2(movement.x / scale, -movement.y / scale));
            this.body.SetPosition(newPos);
            this.body.SetLinearVelocity(new b2Vec2(0, 0));
        }
    }

    MouseUp(event) {
        
        let mousePos = getMousePos(canvas, event);
         this.dragStart = null;
        //  const ballToMouse = new Vector2(mousePos.x-this.position.x,mousePos.y-this.position.y);
         if(this.IsMouseOver(mousePos))
        {
           
            if (RightWallSensor.GetFixtureList().TestPoint(this.body.GetPosition())) {
                
               this.draggable = false;
               this.remove = true;   
           }
           else if(LeftWallSensor.GetFixtureList().TestPoint(this.body.GetPosition()))
           {
                Reset();
           }
           
            // La bola deja de ser arrastrada
              else
              {
                this.moving=false;
                this.body.SetAngularVelocity(0);
                this.body.SetLinearVelocity(new b2Vec2(0, 0));
                
                
               
              }
             
           
             
        }
       
       
       

        
    }

    IsMouseOver(mousePos) {
        // Verificar si el mouse está sobre la bola
        const ballToMouse = new Vector2(mousePos.x-this.position.x,mousePos.y-this.position.y);
        return(ballToMouse.Length()<=this.radius*2.35);//cambiar este valor para ayudar al player
            
           
        }
    }

    // Función auxiliar para obtener la posición del mouse relativa al canvas
    function getMousePos(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    

    
    
   

