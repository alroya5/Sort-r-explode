/** @type {HTMLCanvasElement} */
var canvas = null;
var ctx = null;

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;

var targetDT = 1 / 60;

var globalDT = 0;

var lastDTsSize = 120;
var lastDTs = [];
var currentLastDTs = 0;

var pause = false;

var graphicAssets = {
    ball: {
        image: null,
        path: "./assets/pink.png"
    },
    background:{
        image:null,
        path:"./assets/Background.png"
    },
    black: {
        image: null,
        path: "./assets/black.png"
    },
    newSpawn: {
        image: null,
        path: "./assets/newSpawn.png"
    }
};

var points = 0;
var highScore = 0;
this.bombsSpawned = 0;
this.newSpawn = false;
var force = 0.75;
var spawnBombs = null;
var spawnBombs2 = null;
var basketSensor = null;
var LeftWallSensor = null;
var RightWallSensor = null;
var Background = new Image();
Background.src = graphicAssets.background.path;




function LoadImages(assets, onloaded) {
    let imagesToLoad = 0;

    if (Object.keys(assets).length === 0)
        onloaded();
    
    const onload = () => --imagesToLoad === 0 && onloaded();

    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].image = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    for (let i = 0; i < lastDTsSize; i++) {
        lastDTs.push(0);
    }

    // input
    SetupKeyboardEvents();
    SetupMouseEvents();

    LoadImages(graphicAssets, () => {
        Start();
        // first Loop call
        Loop();
    })
}

function Start() {

     // Obtén una referencia al botón de inicio
     var startButton = document.getElementById("startButton");
     var pauseText = document.getElementById("pauseText");
     startButton.addEventListener("click", function() {
        // Cargar imágenes y otros recursos
        startButton.hidden=true;
        time = performance.now();
    
        CreateWorld(ctx);
    
        // floor
        CreateEdge(world, 3.2, 0, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
        // left wall
        CreateEdge(world, 0, 2.4, 0, -2.4, 0, 2.4, { type: b2Body.b2_staticBody });
        // right wall
        CreateEdge(world, 6.4, 2.4, 0, -2.4, 0, 2.4, { type: b2Body.b2_staticBody });
        // top wall
        CreateEdge(world, 3.2, 4.8, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
        //right wall
         CreateEdge(world,4.65, 1, 0, 0.2, 0, 2.4, { type: b2Body.b2_staticBody });
         //other walls in right
         CreateEdge(world, 7.9, 1.2, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
         CreateEdge(world, 7.9, 3.40, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
        
        // left wall
         CreateEdge(world, 1.78, 1,  0, 0.2, 0, 2.4, { type: b2Body.b2_staticBody });
        //other walls in left
         CreateEdge(world, -1.5, 1.22, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
         CreateEdge(world, -1.5, 3.38, -3.2, 0, 3.2, 0, { type: b2Body.b2_staticBody });
          
        //left box sensor
        LeftWallSensor = CreateBox(world, 0.7, 2.3,2 , 2.1,{type: b2Body.b2_staticBody,isSensor:true});
        LeftWallSensor.SetUserData("left");
         //right box sensor
        RightWallSensor = CreateBox(world, 5.7, 2.3,2 , 2.1,{type: b2Body.b2_staticBody,isSensor:true});
        RightWallSensor.SetUserData("right");
    
    
        // create the bombs
        spawnBombs = new BombSpawn();
        spawnBombs.SpawnBombs();
        // Reproducir música de fondo
        var backgroundMusic = document.getElementById("backgroundMusic");
        backgroundMusic.play();

        
    });
   

    

}

function Loop() {
    requestAnimationFrame(Loop);
    
    let now = performance.now();
    if (now - time < targetDT * 900)
        return;

    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;

    if (deltaTime > 1)
        deltaTime = 0;

    time = now;

    lastDTs[currentLastDTs] = deltaTime;
    currentLastDTs = (currentLastDTs + 1) % lastDTs.length
    
    framesAcum++;
    acumDelta += deltaTime;

    if (acumDelta >= 1) {
        fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
    }

    // update the logic -----
    Update(deltaTime);

    // draw the game elements ----
    Draw(ctx);

    Input.PostUpdate();
}

function Update(deltaTime) {
    //lógica de pausa
    if (Input.IsKeyDown(KEY_PAUSE))
    {
        pause = !pause;
        backgroundMusic.play();
        pauseText.style.display = "none";
    }

    if (pause&&bombsSpawned>0){
        backgroundMusic.pause();
        pauseText.style.display = "block";
        return;
    }
       
   //se genera el nuevo spawn en la parte inferior de la pantalla
    if(this.bombsSpawned>=10&&!this.newSpawn)
    {
        spawnBombs2 = new BombSpawn2();
        
        
        
        spawnBombs2.SpawnBombs();
        
       
        
        this.newSpawn = true;
    }
    // update physics
    // Step(timestep , velocity iterations, position iterations)
    world.Step(deltaTime, 8, 3);
    world.ClearForces();
    if(points>=highScore)
    {
        highScore = points;

    }

    // update logic
    if(newSpawn==true)
    {
        spawnBombs2.Update(deltaTime);
    }
    
    spawnBombs.Update(deltaTime);

}

function Draw(ctx) {
    // background
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
   
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    // box2d world debug
    DrawWorldDebug(ctx);
    ctx.drawImage(Background, 0, 0, canvas.width, canvas.height);
   

    // Draw logic
   if(newSpawn){
    spawnBombs2.Draw(ctx);
   }
    spawnBombs.Draw(ctx);

    ctx.fillStyle = "black";
   
    ctx.fillRect(150, 21, canvas.width/2+60, canvas.height/2-200);
    ctx.textAlign = "center";
    ctx.fillStyle = "purple";
    ctx.strokeStyle = "white";
    ctx.font = "34px Comic Sans MS regular";
    ctx.fillText("Points: " + points, canvas.width / 2-100, 50);
    ctx.strokeText("Points: " + points, canvas.width / 2-100, 50);

     ctx.textAlign = "center";
     ctx.fillStyle = "red";
     ctx.strokeStyle = "yellow";
     ctx.font = "34px Comic Sans MS regular";
     ctx.fillText("Highscore: " + highScore, canvas.width / 2+100, 50);
     ctx.strokeText("Highscore: " + highScore, canvas.width / 2+100, 50);


    // draw the fps
    DrawStats(ctx);

    // mouse info (position and state)
    ctx.beginPath();
    ctx.arc(Input.mouse.x, Input.mouse.y, 10, 0, Math.PI * 2, false);
    ctx.fillStyle = "white";
    if (Input.IsMousePressed())
        ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
   
}

function DrawStats(ctx)
{
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

function DrawProfiler(ctx)
{
    let xStep = 2;
    let yScale = 5000;
    let initX = 10;
    let initY = 400;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(initX, initY - (lastDTs[0] * yScale));
    for (let i = 0; i < lastDTs.length; i++) {
        ctx.lineTo(initX + (i * xStep), initY - (lastDTs[i] * yScale));
    }
    ctx.stroke();

    const redLineHeight = 20 / 2;
    const currentXStep = initX + (currentLastDTs * xStep);
    const currentYStep = lastDTs[currentLastDTs] * yScale;

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1.5;
    ctx.moveTo(currentXStep, (initY - redLineHeight) - currentYStep);
    ctx.lineTo(currentXStep, (initY + redLineHeight) - currentYStep);
    ctx.stroke();
}

function DrawWorldDebug(ctx) {
    // Transform the canvas coordinates to cartesian coordinates
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    world.DrawDebugData();
    ctx.restore();
}

//resetea todo el juego
function Reset()
{
    
    points = 0;
    bombsSpawned = 0; 
    spawnBombs.Restart();
    if(newSpawn)
    {
        spawnBombs2.Restart();
        spawnBombs2.Update();
        
        newSpawn = false;
    }
    
    
}



window.onload = Init;
