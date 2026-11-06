// ===================================
// Flappy bird 
// ===================================


// 1. CONFIGURAÇÃO DO CANVAS

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// 2. PERSONAGEM

const bird = {
    x: 100,
    y: 100,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.3
};


// 3. OBSTÁCULOS

let pipes = [];
let frameCount = 0; // Contador para controlar o tempo de criação dos canos
let score = 0;      // Pontuação do jogador
let isGameOver = false; // Estado do jogo


// 4. DESENHAR PERSONAGEM

function drawBird() {
    ctx.fillStyle = "black";

    ctx.fillRect(
        bird.x,
        bird.y,
        bird.width,
        bird.height
    );
}


// 5. DESENHAR OBSTÁCULOS

function drawPipes() {
    ctx.fillStyle = "green";

    pipes.forEach(function(pipe) {

        // Cano superior
        ctx.fillRect(
            pipe.x,
            0,
            pipe.width,
            pipe.topHeight
        );

        // Cano inferior
        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            pipe.width,
            canvas.height - pipe.bottomY
        );

    });
}


// 6. ATUALIZAR PERSONAGEM

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}


// 7. MOVIMENTAR E CRIAR OBSTÁCULOS

function updatePipes() {
    // Cria novos canos a cada 100 quadros (frames)
    frameCount++;
    if (frameCount % 100 === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - 150;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        const gap = 120; // Espaço entre o cano de cima e o de baixo

        pipes.push({
            x: canvas.width,
            width: 55,
            topHeight: topHeight,
            bottomY: topHeight + gap,
            speed: 3,
            passed: false // Serve para contar ponto quando passar do passarinho
        });
    }

    pipes.forEach(function(pipe, index) {
        pipe.x -= pipe.speed;

        // Sistema de pontuação: se o cano passou do passarinho e ainda não pontuou
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            score++;
            pipe.passed = true;
        }

        // Remove os canos que já saíram da tela pela esquerda para economizar memória
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
        }
    });
}


// 7.1. DETECTAR COLISÕES

function checkCollision() {
    // Colisão com o chão ou teto
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        isGameOver = true;
    }

    // Colisão com os canos
    pipes.forEach(function(pipe) {
        // Verifica se o passarinho está na mesma linha horizontal do cano
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x
        ) {
            // Verifica se bateu no cano de cima OU no cano de baixo
            if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
                isGameOver = true;
            }
        }
    });
}


// 8. FAZER O PERSONAGEM PULAR

function jump() {
    if (isGameOver) {
        resetGame(); // Se o jogo acabou, reinicia ao apertar espaço
    } else {
        bird.velocity = -7;
    }
}

// 8.1. REINICIAR O JOGO

function resetGame() {
    bird.y = 100;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    isGameOver = false;
}


// 9. DETECTAR TECLADO

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {
        event.preventDefault();
        jump();
    }

});


// 10. DESENHAR O JOGO E PLACAR

function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBird();
    drawPipes();

    // Desenhar a pontuação na tela
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Pontos: " + score, 20, 30);

    // Se o jogo acabou, mostra a mensagem de Game Over
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = "16px Arial";
        ctx.fillText("Pressione Espaço para Reiniciar", canvas.width / 2, canvas.height / 2 + 30);
        ctx.textAlign = "left"; // Reseta o alinhamento
    }
}


// 11. LOOP DO JOGO

function gameLoop() {

    if (!isGameOver) {
        updateBird();
        updatePipes();
        checkCollision();
    }
    
    drawGame();

    requestAnimationFrame(gameLoop);
}


// 12. INICIAR JOGO

gameLoop();