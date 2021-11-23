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

  $("#btnImport").click(function (e) {
    e.preventDefault();

    var mnemonic = $('#mnemonic').val().trim();
    if (!mnemonic) {
      alert("Please provide a non-empty mnemonic seed phrase to import.");
      return;
    }
    if (mnemonic.split(' ').length != 24) {
      alert("Please exactly 24 words in the mnemonic seed phrase to import.");
      return;
    }
    $(this).prop("disabled", true);
    $(this).html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Importing...`
    );
    $('#main-form').attr('action', '/walletsWeb/importNew');
    $("#main-form").submit();
  });

  $("#btnGenerate").click(function (e) {
    e.preventDefault();

    $(this).prop("disabled", true);
    $(this).html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...`
    );
    $('#main-form').attr('action', '/walletsWeb/generateNew');
    $("#main-form").submit();
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

  $('button.restart').click(function () {
    $(this).attr('disabled', true);
    const hostname = $(this).data("hostname");
    const blockchain = $(this).data("blockchain");
    $.get('/settingsWeb/restartOp', { hostname, blockchain }, function (data) {
      alert(JSON.stringify(data, null, 2));
    });
  });

  $('button#btnExportColdWallet').click(function () {
    $(this).attr('disabled', true);
    window.open('/settingsWeb/coldWalletExport');
  });

  $('#inputImportColdWallet').change(function (e) {
    const [file] = document.querySelector('#inputImportColdWallet').files;
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      $('#textareaImportColdWallet').val(reader.result);
    }, false);

    if (file) {
      reader.readAsText(file);
    }
  });

  $("#btnImportColdWallet").click(function (e) {
    e.preventDefault();

    if (confirm('All farming rewards will go to addresses included in the uploaded cold wallet file. Do you really feel safe to make this change?')) {
      $(this).prop("disabled", true);

      const wallets = JSON.parse($('#textareaImportColdWallet').val());
      $.ajax({
        url: '/settingsWeb/coldWalletImport',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ wallets }),
        contentType: 'application/json',
        success: function (data) {
          alert(JSON.stringify(data, null, 2));
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    }

  });


});

