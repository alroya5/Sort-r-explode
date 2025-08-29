# Sort ‘R’ Splode – MiniJuego estilo Mario DS

## Descripción
**Sort ‘R’ Splode** es un minijuego inspirado en los clásicos de Mario para Nintendo DS, desarrollado con JavaScript, HTML5 y CSS3.  
El juego combina mecánicas de plataformas, físicas de colisiones y enemigos interactivos, ofreciendo una experiencia ligera y rápida en el navegador.  

El proyecto está diseñado para ser modular, mantenible y escalable, facilitando la incorporación de nuevas mecánicas o niveles.

---

## Características principales

- **Movimiento fluido del jugador:** control con teclado, incluyendo desplazamientos y saltos.  
- **Mecánicas de bombas:** obstáculos dinámicos generados mediante `BombSpawn.js` y `BombSpawn2.js`.  
- **Física simple pero efectiva:** colisiones, gravedad y rebotes implementados de manera modular.  
- **Enemigos con comportamiento propio:** `Black.js` y `Pink.js` con distintos patrones de movimiento.  
- **Código modular y mantenible:** cada aspecto del juego (entrada, físicas, lógica de enemigos, utilidades) está separado en archivos independientes.

---

## Estructura del proyecto

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Punto de entrada y canvas de renderizado |
| `style.css` | Estilos visuales y diseño de la interfaz |
| `code.js` | Bucle principal y gestión de actualización de objetos |
| `input.js` | Captura y gestión de eventos de teclado |
| `physics.js` | Control de física, colisiones y gravedad |
| `utils.js` | Funciones utilitarias reutilizables |
| `BombSpawn.js / BombSpawn2.js` | Generación de bombas y obstáculos dinámicos |
| `Box2D.js` | Sistema de colisiones personalizado |
| `Black.js / Pink.js` | Enemigos con comportamientos diferenciados |
| `Sort r splode.zip` | Recursos adicionales (sprites, niveles o sonidos) |

---

## Tecnologías utilizadas

- **JavaScript (ES6+)**: lógica del juego y programación orientada a objetos.  
- **HTML5 Canvas**: renderizado de sprites y animaciones.  
- **CSS3**: estilos visuales y diseño responsivo.

---

## Instalación y ejecución

1. Clonar el repositorio:  
```bash
git clone <URL_DEL_REPOSITORIO>
```
2. Abrir `index.html` en un navegador moderno compatible con HTML5 y JavaScript.

3. Controles del jugador:
   - Flechas izquierda/derecha → mover jugador
   - Flecha arriba / Espacio → saltar

---

## Mejoras futuras y filosofía

Sort ‘R’ Splode está diseñado para ser un juego modular, mantenible y escalable. La estructura del código permite agregar nuevas mecánicas, enemigos o niveles sin afectar la estabilidad del juego, demostrando buenas prácticas en desarrollo de software para videojuegos.

Posibles mejoras futuras incluyen:

- Añadir niveles y progresión de dificultad
- Implementar enemigos con IA más compleja y comportamientos variados
- Integrar sonido y música de fondo
- Optimizar físicas con librerías especializadas como Matter.js o Box2D real
- Hacer responsive y compatible con dispositivos táctiles
