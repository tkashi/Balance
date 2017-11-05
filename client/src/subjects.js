var jQuery = require('jQuery');

(function($){
    var constants = require('./consts')();

    $.ajax(constants.BASE_URL + 'terms/2017FA/subjects', {
        type: 'GET',
        data:{
           dept: 1
        },
        headers: {
           client_id: constants.CLIENT_ID,
           client_secret: constants.CLIENT_SECRET
        }
    }).done((data) => {
        $('#container').text(JSON.stringify(data))
    }).fail(( jqXHR, textStatus, errorThrown) => {
        console.log(errorThrown)  
    })
})(jQuery)