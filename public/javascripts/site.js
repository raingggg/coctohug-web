$(document).ready(function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

  function detectLanguage() {
    if (!$.cookie('language')) {
      let userLang = navigator.language || navigator.userLanguage;
      const codes = $('#lang-picker a').map(function () { return $(this).data('lang'); }).toArray();
      console.log('codes', codes);

      let finalLang = ''
      if (codes.includes(userLang)) {
        finalLang = userLang;
      } else {
        userLang = userLang.replace(/-\w*/, '');
        if (codes.includes(userLang)) {
          finalLang = userLang;
        }
      }

      if (finalLang && finalLang !== 'en') {
        $.cookie('language', finalLang, { expires: 30 });
        window.location.reload();
      }
    }
  }
  detectLanguage();

  $('#lang-picker li a').click(function () {
    const lang = $(this).data('lang');
    $.cookie('language', lang, { expires: 30 });
    window.location.reload();
  });

  $("#btnImport").click(function (e) {
    e.preventDefault();

    var mnemonic = $('#mnemonic').val().trim();
    if (!mnemonic || mnemonic.split(' ').length != 24) {
      $('.enter-24-words').removeClass('visually-hidden');
      return;
    }

    $(this).prop("disabled", true);
    $(this).closest('#main-form').find('.importing-wrapper').removeClass('visually-hidden');
    $('#main-form').attr('action', '/walletsWeb/importNew');
    $("#main-form").submit();
  });

  $("#btnGenerate").click(function (e) {
    e.preventDefault();

    $(this).prop("disabled", true);
    $(this).closest('#main-form').find('.generating-wrapper').removeClass('visually-hidden');
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

  $('button#btnDownloadAllConfigs').click(function () {
    $(this).attr('disabled', true);
    window.open('/settingsWeb/downAllWalletConfigs');
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
    const coldWalletImportModal = new bootstrap.Modal(document.getElementById('coldWalletImportModal'), { keyboard: false });
    coldWalletImportModal.show();
  });

  $("#btnColdWalletImportConfirm").click(function (e) {
    e.preventDefault();

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
        window.open('/settingsWeb/downAllWalletConfigs');
      },
      error: function (jqXHR, textStatus, err) {
        alert(JSON.stringify(err, null, 2));
        window.open('/settingsWeb/downAllWalletConfigs');
      }
    });
  });

  $(".btnConnectionRemove").click(function (e) {
    e.preventDefault();

    const tabPanel = $(this).closest('.tab-panel');
    const table = tabPanel.find('table');
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

    tabPanel.find('.removing-connection').removeClass('visually-hidden');
  });

  $("#btnHandRemove").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const hands = [];
    const table = $(this).closest('.page-wrapper');
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

    const tabPanel = $(this).closest('.tab-panel');
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

      tabPanel.find('.adding-connection').removeClass('visually-hidden');
    } else {
      tabPanel.find('.connection-error').removeClass('visually-hidden');
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
      $('#confirmSamePassword').removeClass('visually-hidden');
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
          if (data.status === 'success') {
            $('#resetPasswordSuccess').removeClass('visually-hidden');
          } else if (data.status === 'incorrect_old_password') {
            $('#resetPasswordIncorrectOld').removeClass('visually-hidden');
          } else {
            alert(JSON.stringify(data, null, 2));
          }
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    } else {
      $('#resetConfirmSamePassword').removeClass('visually-hidden');
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
          if (data.status === 'success') {
            parent.find('.transferSuccess').removeClass('visually-hidden');
          } else if (data.status === 'incorrect_old_password') {
            parent.find('.transferIncorrectPassword').removeClass('visually-hidden');
          } else {
            alert(JSON.stringify(data, null, 2));
          }
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    } else {
      parent.find('.transferIncorrectFields').removeClass('visually-hidden');
    }
  });

  const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'), { keyboard: false });
  $(".settings-link").click(function (e) {
    if ($.cookie('authed') !== 'true') {
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
            $('#incorrectLoginPassword').removeClass('visually-hidden');
          }
        },
        error: function (jqXHR, textStatus, err) {
          alert(JSON.stringify(err, null, 2));
        }
      });
    }
  });

  if ($.cookie('authed') === 'true') {
    $('.setting-li').removeClass('visually-hidden');
  }

});

