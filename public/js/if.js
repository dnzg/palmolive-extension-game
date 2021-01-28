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