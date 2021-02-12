// const body = document.querySelector('body');
// body.addEventListener('dblclick', function (e) {
//   e.stopPropagation();
// });

let recordScore=0;
let isMuted = true;

function ratingWrite(num) {
    // console.log(num, recordScore);
    if(parseInt(num) > parseInt(recordScore)) {
        dbWrite(twitchUsername, num);
    }
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

function playAudio(name) {
    var id = makeid(3);
    $("body").prepend(
        '<audio id="audioElement_' + id + '" style="color:#fff">\
        <source src="sounds/'+ name +'.mp3" type="audio/mpeg"></audio>'
        );
        $("#audioElement_" + id + "")[0].play();
        $("#audioElement_" + id + "")[0].onended = function () {
            $("#audioElement_" + id + "").remove();
        };
    }

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};