var ismobile = navigator.userAgent.match(/(iPhone)|(iPod)|(android)|(webOS)|(BlackBerry)/i);
var scroll_x = $(window).width() / 2;
var floor_x = 0;
var mario_x = 0;
var direction = false;
var music_play = false;
var interval_left = false;
var interval_right = false;
var isJumping = false;  // Track if Mario is currently jumping
var jumpHeight = 150;   // Maximum height of the jump
var gravity = 10;       // Speed of the fall
var jumpSpeed = 15;     // Speed of the jump
var currentJumpHeight = 0; // Track how high Mario has jumped


if (ismobile) scroll_x -= 170;
else scroll_x -= 240;

$('#scroll').css('left', scroll_x + 'px');


$('.tweet').click(function () {
    window.open('https://twitter.com/intent/tweet?text=' + document.title + '&tw_p=tweetbutton&url=' + document.location.href);
    return false;
});
function jump() {
    if (isJumping) return;  // If already jumping, do nothing

    isJumping = true;       // Start jump
    var originalBottom = parseInt($('#mario').css('bottom'));  // Get Mario's starting position
    
    var jumpInterval = setInterval(function () {
        if (currentJumpHeight < jumpHeight) {
            currentJumpHeight += jumpSpeed;
            $('#mario').css('bottom', (originalBottom + currentJumpHeight) + 'px');
        } else {
            clearInterval(jumpInterval);  // Stop going up and start falling down
            var fallInterval = setInterval(function () {
                if (currentJumpHeight > 0) {
                    currentJumpHeight -= gravity;
                    $('#mario').css('bottom', (originalBottom + currentJumpHeight) + 'px');
                } else {
                    clearInterval(fallInterval);
                    isJumping = false;  // Allow jumping again
                }
            }, 20);
        }
    }, 20);
}


function moveTo(pos) {

    diff = ismobile ? 13 : 20;

    if (pos == 'left') {

        if (!direction) {
            direction = 'left';
            $('#mario').css('-webkit-transform', 'scaleX(-1)');
        }
        floor_x += diff;
        scroll_x += diff;
        mario_x -= 65;
        if (mario_x == -195) mario_x = 0;

    } else if (pos == 'right') {

        if (!direction) {
            direction = 'right';
            $('#mario').css('-webkit-transform', 'scaleX(1)');
        }
        floor_x -= diff;
        scroll_x -= diff;
        mario_x -= 65;
        if (mario_x == -195) mario_x = 0;

    } else {
        direction = false;
    }


    // reach end
    if (scroll_x < (parseInt($('#scroll').css('width')) * -1)) {
        scroll_x = $(window).width();


        // reach start
    } else if (scroll_x > $(window).width()) {
        scroll_x = parseInt($('#scroll').css('width')) * -1;
    }

    $('#scroll').css('left', scroll_x + 'px');
    $('#floor').css('background-position-x', floor_x + 'px');
    $('#mario').css('background-position-x', mario_x + 'px');
}


function playMusic() {
    if (!music_play) {
        document.getElementById("bg_music").play();
        music_play = true;
    }
}

function moveLeft() {
    playMusic();

    direction = false;
    if (!interval_left) {
        interval_left = setInterval(function () {
            moveTo('left');
        }, 100);
    }
}

function moveRight() {
    playMusic();

    direction = false;
    if (!interval_right) {
        interval_right = setInterval(function () {
            moveTo('right');
        }, 70);
    }
}

function stopMove() {
    clearInterval(interval_left);
    clearInterval(interval_right);
    interval_left = false;
    interval_right = false;
}




$(function () {

    $("body, #scroll").click(function () {
        playMusic();
    });

    $("body").keydown(function (e) {
        if (e.keyCode == 37) {
            moveLeft();
        } else if (e.keyCode == 39) {
            moveRight();
        } else if (e.keyCode == 38) { // Up arrow key
            jump();  // Trigger jump
        }
    });

    $("body").keyup(function (e) {
        stopMove();
    });

    $('#btn_left').on('mousedown touchstart', function () {
        moveLeft();
    });

    $('#btn_right').on('mousedown touchstart', function () {
        moveRight();
    });

    $('#btn_left, #btn_right').on('mouseup touchend', function (event) {
        stopMove();
    });

});