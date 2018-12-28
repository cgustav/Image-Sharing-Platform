/******************************************************* */
/*       CONTROL Y EVENTOS DE INDEX IMÁGENES            */
/*******************************************************/

$('#post-comment').hide();
$('#btn-toggle-comments').click(e => {
    $('#post-comment').slideToggle();
});




//Enviando Like mediante ajax
$('#btn-like').click(function (e) {
    e.preventDefault();
    let imgId = $(this).data('id');
    console.log(imgId);
    //se envía el request al controlador like para dar un like a la imagen a través del método post
    //Se recibe una respuesta del servidor capturada en el objeto data
    $.post('/images/' + imgId + '/like').done(data => {
        $('.likes-count').text(data.likes)
    });
});


$('#btn-delete').click(function (e) {
    //Mostrando modal de verificación
    let $this = $(this);
    if ($(this).hasClass('btn-danger')) {
        $('#cdelete-modal').modal('show');
    }

    $('#modal-accept').on('click', function () {
        let imgId = $this.data('id');
        $.ajax({
            url: '/images/' + imgId,
            type: 'DELETE'
        }).done(function (result) {
            $this.removeClass('btn-danger').addClass('btn-success');
            $this.find('i').removeClass('fa-times').addClass('fa-check');
            $this.text('Deleted!');
            $('#cdelete-modal').modal('hide');
        })

    });

});


/******************************************************* */
/*       VALIDACIONES //#endregion                      */
/*******************************************************/