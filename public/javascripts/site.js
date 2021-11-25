function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

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

  $(".btnConnectionRemove").click(function (e) {
    e.preventDefault();

    const table = $(this).closest('.tab-panel').find('table');
    const blockchain = table.data('blockchain');
    const hostname = table.data('hostname');

    const nodeIds = [];
    table.find('input:checkbox:checked').each(function (index, item) {
      nodeIds.push($(this).val());
    });

    $.ajax({
      url: '/connectionsWeb/remove',
      type: 'POST',
      cache: false,
      data: JSON.stringify({ blockchain, hostname, nodeIds }),
      contentType: 'application/json'
    });

    alert('removing... please check again few minutes later');
  });

  $("#btnHandRemove").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const hands = [];
    const table = $(this).closest('table');
    table.find('input:checkbox:checked').each(function (index, item) {
      const blockchain = $(this).data('blockchain');
      const hostname = $(this).data('hostname');
      hands.push({ blockchain, hostname });
    });

    $.ajax({
      url: '/handsWeb/remove',
      type: 'POST',
      cache: false,
      data: JSON.stringify({ hands }),
      contentType: 'application/json',
      success: function (data) {
        if (data.status === 'success') {
          window.location.reload();
        } else {
          alert(JSON.stringify(data, null, 2));
        }
      },
      error: function (jqXHR, textStatus, err) {
        alert(JSON.stringify(err, null, 2));
      }
    });
  });

  $(".btnConnectionAdd").click(function (e) {
    e.preventDefault();

    const table = $(this).closest('.tab-panel').find('table');
    const blockchain = table.data('blockchain');
    const hostname = table.data('hostname');
    const connection = $(this).closest('.row').find('.new-connection').val();
    if (connection && connection.length > 10 && connection.includes(':')) {
      $.ajax({
        url: '/connectionsWeb/add',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ blockchain, hostname, connection }),
        contentType: 'application/json'
      });

      alert('adding... please check again few minutes later');
    } else {
      alert('new connection must have : to specify the port number');
    }
  });

  $("#createPasswordButton").click(function (e) {
    e.preventDefault();

    const parent = $(this).closest('.createPassword');
    const password = parent.find('#inputCreatePassword').val();
    const password2 = parent.find('#inputCreatePassword2').val();
    if (password && password === password2) {
      $(this).prop("disabled", true);

      $.ajax({
        url: '/settingsWeb/createPasswordOp',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ password: md5(password) }),
        contentType: 'application/json',
        success: function (data) {
          window.location.href = '/';
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    } else {
      alert('confirm password must be same with password');
    }
  });

  $("#resetPasswordButton").click(function (e) {
    e.preventDefault();

    const parent = $(this).closest('.resetPassword');
    const oldPassword = parent.find('#inputOldPassword').val();
    const password = parent.find('#inputResetPassword').val();
    const password2 = parent.find('#inputResetPassword2').val();
    if (oldPassword && password && password === password2) {
      $(this).prop("disabled", true);

      $.ajax({
        url: '/settingsWeb/resetPasswordOp',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ oldPassword: md5(oldPassword), password: md5(password) }),
        contentType: 'application/json',
        success: function (data) {
          alert(JSON.stringify(data, null, 2));
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    } else {
      alert('confirm password must be same with password');
    }
  });

  $(".tranferButton").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const parent = $(this).closest('.transferMoney');
    const blockchain = parent.data('blockchain');
    const hostname = parent.data('hostname');
    const toAddress = parent.find('.toAddress').val().trim();
    const amount = parseFloat(parent.find('.amount').val().trim());
    const password = parent.find('.password').val();
    if (blockchain && hostname && toAddress && amount && amount > 0 && password) {
      $.ajax({
        url: '/walletsWeb/transferCoin',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ blockchain, hostname, toAddress, amount, password: md5(password) }),
        contentType: 'application/json',
        success: function (data) {
          alert(JSON.stringify(data, null, 2));
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    } else {
      alert('Please ensure all fields are entered!');
    }
  });

  const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'), { keyboard: false });
  $(".settings-link").click(function (e) {
    if (getCookie('authed') !== 'true') {
      passwordModal.show();
    }
  });

  $("#btnSettingPassword").click(function (e) {
    const password = $('#inputSettingPassword').val();
    if (password) {
      $.ajax({
        url: '/settingsWeb/login',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ password: md5(password) }),
        contentType: 'application/json',
        success: function (data) {
          if (data.status === 'success') {
            passwordModal.hide();
            $('.setting-li').removeClass('visually-hidden');
          } else {
            alert(JSON.stringify(data, null, 2));
          }
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    }
  });

  if (getCookie('authed') === 'true') {
    $('.setting-li').removeClass('visually-hidden');
  }

});

