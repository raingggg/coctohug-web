$(document).ready(function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

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
      page.find('.nav-tab').each(function () {
        if ($(this).data("tabp-index") == index) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
      
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

