$(function () {
    $('.wrap .imgPack').click(function () { $(this).toggleClass('_selected'); });
    $('.btn_preview').click(function () {
        var selectedImg = $('.wrap').children('.imgPack._selected').clone();
        var wrap = $("<div>");
        selectedImg.find('._viewBtn').remove();
        selectedImg.removeClass('interactive').appendTo(wrap);

        var content = '<link href="test.css" rel="stylesheet" type="text/css" />'
            + '<div style="width: 320px;height: 320px;padding: 20px 40px;position: absolute;top: 50%;left: 50%;margin-top: -180px;margin-left: -200px;background-color:#666;">' + wrap.html() + '</div>';

        console.log(content);
        $('.preview').empty().show();
        $$.print.preview($('.preview')[0], {
            html: content,
            domain: document.domain
        });
        $('.btn_print').addClass('_actived');
    });
    $('.btn_print').click(function () {
        if (!$(this).hasClass('_actived')) return;
        $$.print.exec("Print Test");
    });
});