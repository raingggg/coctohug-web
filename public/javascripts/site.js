$(document).ready(function () {
  $("#enLanguage").click(function () {
    $.cookie('language', 'en');
    window.location.reload();
  });

  $("#deLanguage").click(function () {
    $.cookie('language', 'de');
    window.location.reload();
  });

  $('.nav-tab').click(function () {
    const index = $(this).data("tabp-index");
    const page = $(this).closest('.page-wrapper');
    if (page && index >= 0) {
      page.find('.tab-panel').each(function () {
        if ($(this).data("panel-index") == index) {
          $(this).removeClass('d-none');
        } else {
          $(this).addClass('d-none');
        }
      });
    }
  });


});

