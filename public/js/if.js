let recordScore=0;
let isMuted = false;

function ratingWrite(num) {
    console.log(num);
    // if(num > recordScore) {
    //     console.log('more');
        dbWrite(twitchUsername, num);
    // }
}

function hideBody(state) {
    if(state) {
        $('#bodyGlobal').hide();
        $('#showGlobal').show();
    } else {
        $('#bodyGlobal').show();
        $('#showGlobal').hide();
    }
}

function sound(e) {
    if(isMuted) {
        isMuted=false;
        $('#ismuted').attr('src','assets/soundoff.png');
    } else {
        isMuted=true;
        $('#ismuted').attr('src','assets/soundon.png');
    }
}

function chooseShip(num) {
    $('#chooseship').hide();

    const arr = [
        '<span class="orangeColor">Цитрусовый взрыв</span><br/>3 заряда атомных бомб',
        '<span class="iceColor">Арктический ветер</span><br/>Заморозка препятствий, перезарядка каждые 3 сек',
        '<span class="redColor">Очищение и перезагрузка</span><br/>Стреляет скоростными бластерами',
        '<span class="blueColor">Спорт</span><br/>Стреляет мощными энерголучами',
    ];
    var n = num+1;
    $('[data-id="space"]').attr('src', 'assets/ship'+n+'.png');
    $('[data-id="desc"]').html(arr[num]);
    $('[data-id="ship"]').data('value', num);

    $('#spacedetails').css('display','flex');
}

function detaction(num){
    switch (num) {
        case 0:
            $('#chooseship').css('display','flex');
            $('#spacedetails').hide();
            break;
        
        case 1:
            $('#chooseship').hide();
            $('#spacedetails').hide();
            Reset($('[data-id="ship"]').data('value'));
            break;

        case 2:
            $('#chooseship').css('display','flex');
            break;
    }
}