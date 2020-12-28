// creamos la clase del juego
class tron{
		constructor(){
			this.size = {
				ancho: 700,
				alto:  480,
				colorfondo: { r: 29, g: 46, b: 37 }
			 };
				 // cada cuantos mls se ejecuta 
			   this.repeat = 15; 
			     //  mensajes del juego          
			   this.gameMessage = {          
				   message : "",
				   fillStyle:"",
				   font: "65px Verdana bold "
			   };
				//archios de audio
			   this.medias = {                                     
				   "start"     : new Audio("audio/start.wav"),
				   "perdiste"  : new Audio("audio/perdiste.wav"),
				   "track"  : new Audio("audio/track2.wav")
			   };

   // 1) this: Creamos en canvas y el context
            this.canvas = document.getElementById("maingame");
            
			this.context= this.canvas.getContext("2d");
	// 2) Le cambiamos el tamaño al canvas y el color de fondo
	   		this.colorCanvasString= "rgb("+this.size.colorfondo.r+ " "+this.size.colorfondo.g+" "+this.size.colorfondo.b+")";
			this.context.fillStyle = this.colorCanvasString;
			this.context.fillRect(0,0,this.size.ancho,this.size.alto);
			  
	// 3) Añadimos las motos,  Recordamos ponerle los x, y , el color y la direccion de inicio;
		
			this.moto1  = new moto(30,300,"rgb(245, 66, 81)", "right",1);
			this.moto2  = new moto(670,300, "blue", "left",2);
		
	}
	
	
		
//------------------------------------- METODOS DE LA CLASE TRON -------------------------------------------------------- 
			// render_my_bike - line 45         playAudio - line 64         empezar - line 69

 	// Render my_y_bike se encarga de renderizar y mostrar la moto con todas sus funciones
	render_my_bike(moto){
		// 1. Del objeto moto, ejecutamos next_move() y guardamos el x/y
			moto.next_move();
		// 2. Ejecutamos el detecta_crash()
			var crash = moto.detecta_crash(this.size.ancho , this.size.alto);  
		// 2.1 si es false, nos muestra que nos la hemos pegado, 2.2 si es true  pintamos el siguiente pixel
			if (crash == false){
				this.context.fillStyle = "rgb(0, 247, 91)";   		//color letras mensaje
				this.context.font      = this.gameMessage.font;		//estilo de la fuente 
				this.context.fillText(" ☠️  Has perdido player " + moto.num + "  ☠️" ,100, 250, 500);//pintamos el texto
				clearInterval(this.intervaloTiempo); 				//paramos la moto borrando el intervalo de moto1
				clearInterval(this.intervaloTiempo1);				//paramos la moto borrando el intervalo de moto2
				this.playAudio("perdiste");
			}						
		// 3. Pintamos el nuevo cuadrado   //aquit tenía moto avanza que era lo mismo 
			moto.avanza(this.context)
	}
	
	// playAudio reproduce la pista de audio que  hayamos puesto en el array medias 
	playAudio(sonido){
		this.medias[sonido].play();
	}
   
	// empieza el juego cuando hacemos click al button index.html 
	empezar(){
		this.intervaloTiempo1 = setInterval(()=>this.render_my_bike(this.moto1),this.repeat);		
		this.intervaloTiempo = setInterval(()=>this.render_my_bike(this.moto2),this.repeat);
        this.playAudio("start");
        this.playAudio("track");
	}

}

// ---------------------------------------- CLASE MOTO -----------------------------------------------------------
		// detecta_crash--line 89      pixelColor--line 106    next_move--line 137      avanza--line 179
		
class moto  {
	constructor(x, y, color , direction, num){ 
		this.color = color;
		this.size = 7;
		this.direction = direction; // top bottom left right
		this.position = {x:x, y:y};
		this.num      = num; 
	}

		// 1. Mirar si estoy fuera de la pared //return false
		detecta_crash(canvasAncho, canvasAlto){
			this.ancho = canvasAncho;
			this.alto  = canvasAlto;
		// Si estamos fuera de la pared, devuelve return false;
			if (this.pixelColor() == false){
				return false;
			}else if(this.position.x >= 0 &&
					 this.position.y >= 0 &&
					 this.position.x <= canvasAncho &&
					 this.position.y <= canvasAlto ){
						 return true;
			}else{       
				  return false;
				}  
 		}  

		// 2. Mira el siguiente pixel, de que color es   (getImageData)
		pixelColor(){                 
							// juego.context.fillStyle="rgb(245, 24, 226)"; ---COMPROBACION RECOGE COLOR
							// juego.context.fillRect(this.position.x+7, this.position.y, 1 ,1); -----COMROBACION RECOGE COLOR
				
				var nextPixel = juego.context.getImageData(this.position.x, this.position.y ,1, 1);  //recogemos datos de la imagen
				var colorNextPixel = "rgb(" + nextPixel.data[0] + " " + nextPixel.data[1] + " " + nextPixel.data[2] + ")"; //lo pasamos a string para facilitar la visualizacion en la consola del navegador
				var colorfondo     =  juego.size.colorfondo;        		//color del canvas

			//  Ponemos unos condicionales sumandole el tamaño del cubo ya que cuando gira recoge el color de la moto y nos da erroes de comparación
				
				if(this.direction == "right" ){
					nextPixel = juego.context.getImageData(this.position.x + 7, this.position.y,1, 1);
					colorNextPixel = "rgb(" + nextPixel.data[0] + " " + nextPixel.data[1] + " " + nextPixel.data[2] + ")";
				} 
				if(this.direction == "down"){
				   nextPixel = juego.context.getImageData(this.position.x, this.position.y + 7 ,1, 1);
				   colorNextPixel = "rgb(" + nextPixel.data[0] + " " + nextPixel.data[1] + " " + nextPixel.data[2] + ")";
				}
			//  Comparamos el color del canvas y si es diferente de cualquier otro.  
				if(
					!(nextPixel.data[0] == juego.size.colorfondo.r &&
					nextPixel.data[1] == juego.size.colorfondo.g &&
					nextPixel.data[2] == juego.size.colorfondo.b)){
				 
				   return false;
				}else{
					return true;
				}  
		}
				
		// 3. Siguiente movimiento
		next_move(){
		
			this.position;// 1. Recoge la posición actual de la moto
			this.direction;// 2. Recoge la dirección
			// 3. Le suma o resta un pixel al x/y correcto
				if(this.direction=="down"){
				 	this.position.y = this.position.y + 1;
				}
				if(this.direction=="up"){
					this.position.y = this.position.y - 1;
				}
				if(this.direction=="right"){
					this.position.x++;
				}
				if(this.direction=="left"){
					 this.position.x = this.position.x -1;
				}
			// 4. Lo guardas en posición actual moto
			  	return this.position;
		}

		// Pinta la moto en el canvas
		avanza(ctx){                      
			this.context = ctx;         
			this.context.fillStyle = this.color;
			this.context.fillRect(this.position.x , this.position.y, this.size, this.size);
		}
}

// -----------------------------------------EVENTO ONLOAD----------------------------------------------------

window.onload = function(){			//Dispara después de la carga del DOM (img, audio, canvas redender)
	juego = new tron();				//Nuevo tron clase del juego 


  //----------------------------------Asignación de controles------------------------------------------------
	
	// ------------------------------ MOTO 1---------------------------------------------
	
	document.onkeydown = function (e) {						 	// El evento onkeydown recoge la tecla pulsada
			 if(e.key=="d"){ juego.moto1.direction="right"; }	// console.log(e.key);muestra la tecla presionada
			 if(e.key=="a"){ juego.moto1.direction="left";}
			 if(e.key=="w"){juego.moto1.direction="up";}
			 if(e.key=="s"){juego.moto1.direction="down";}												

	// ------------------------------ MOTO 2 --------------------------------------
	
		   if(e.key=="ArrowRight"){ juego.moto2.direction="right"; }
			 if(e.key=="ArrowLeft"){ juego.moto2.direction="left";}
			 if(e.key=="ArrowUp"){juego.moto2.direction="up";}
			 if(e.key=="ArrowDown"){juego.moto2.direction="down";}
	};
};

