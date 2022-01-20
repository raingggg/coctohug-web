const simpleViewColumns = ['se_no', 'blockchain', 'chain_status', 'netspace_size', 'expected_time_to_win', 'coin_symbol', 'coin_price', 'protocol_port', 'fork_version', 'noBlockInDays', 'blockCountToday'];
const statusViewColumns = ['se_no', 'blockchain', 'chain_status', 'chain_sync_to_time', 'chain_height', 'plot_count', 'plots_size', 'netspace_size', 'expected_time_to_win', 'connection_count', 'wallet_status', 'wallet_height', 'total_coins'];
const balanceViewColumns = ['se_no', 'blockchain', 'coin_symbol', 'coin_price', 'total_coins', 'wallet_balance', 'reward_balance', 'total_price'];

$(document).ready(function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });

  function detectLanguage() {
    if (!$.cookie('language')) {
      let userLang = navigator.language || navigator.userLanguage;
      const codes = $('#lang-picker a').map(function () { return $(this).data('lang'); }).toArray();
      // console.log('codes', codes);

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

  $("#fadeOutMessage").fadeOut(10000);

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
    $.get('/walletsWeb/generateNew', function (data) {
      alert(JSON.stringify(data, null, 2));
    });
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

  let coldWalletImportModal = null;
  $("#btnImportColdWallet").click(function (e) {
    if (!coldWalletImportModal) {
      coldWalletImportModal = new bootstrap.Modal(document.getElementById('coldWalletImportModal'), { keyboard: false });
    }
    coldWalletImportModal.show();
  });

  $("#btnColdWalletImportConfirm").click(function (e) {
    if (coldWalletImportModal) coldWalletImportModal.hide();

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
    if (connection && connection.length > 8) {
      const connectionIps = new Set();
      const lines = connection.trim().split('\n');
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i] && lines[i].trim();
        if (line) {
          line = line.replace(/.*-a\s+/g, '');
          line = line.replace(/:\d+/g, '');
          if (line) connectionIps.add(line);
        }
      }

      const connections = Array.from(connectionIps);
      if (connections.length > 0) {
        $(this).prop("disabled", true);

        $.ajax({
          url: '/connectionsWeb/add',
          type: 'POST',
          cache: false,
          data: JSON.stringify({ blockchain, hostname, connections }),
          contentType: 'application/json'
        });

        tabPanel.find('.adding-connection').removeClass('visually-hidden');
      }
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

  $(".chiaClaimNFTButton").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const parent = $(this).closest('.claimNFTWrapper');
    const blockchain = parent.data('blockchain');
    const hostname = parent.data('hostname');
    if (blockchain && hostname) {
      $.ajax({
        url: '/walletsWeb/claimChiaNFT',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ blockchain, hostname }),
        contentType: 'application/json',
        success: function (data) {
          if (data.status === 'success') {
            parent.closest('.tab-panel').find('.transferSuccess').removeClass('visually-hidden');
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

  $("#btnWalletBalanceRemove").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const balances = [];
    const table = $(this).closest('.page-wrapper');
    table.find('input:checkbox:checked').each(function (index, item) {
      const blockchain = $(this).data('blockchain');
      const address = $(this).data('address');
      balances.push({ blockchain, address });
    });

    $.ajax({
      url: '/walletBalanceWeb/remove',
      type: 'POST',
      cache: false,
      data: JSON.stringify({ balances }),
      contentType: 'application/json',
      success: function (data) {
        window.location.reload();
      },
      error: function (jqXHR, textStatus, err) {
        window.location.reload();
      }
    });
  });

  $("#btnWalletBalanceAdd").click(function (e) {
    e.preventDefault();
    $(this).prop("disabled", true);

    const blockchain = $('#newBalanceName').val();
    const address = $('#newBalanceAddress').val();
    $.ajax({
      url: '/walletBalanceWeb/add',
      type: 'POST',
      cache: false,
      data: JSON.stringify({ blockchain, address }),
      contentType: 'application/json',
      success: function (data) {
        window.location.reload();
      },
      error: function (jqXHR, textStatus, err) {
        window.location.reload();
      }
    });
  });

  function toggleReviewColumns(visibleColumns) {
    $("#reviewTable").trigger("destroy");

    $('#reviewTable th, #reviewTable td').each(function () {
      const eClass = $(this).attr('class');
      let isVisible = false;
      visibleColumns.forEach(sc => {
        if (eClass.includes(sc)) {
          isVisible = true;
        }
      })

      if (isVisible) {
        $(this).removeClass('columnSelector-false');
      } else {
        $(this).addClass('columnSelector-false');
      }
    });

    $.tablesorter.addParser({
      id: 'netspace',
      is: function (s) {
        return false;
      },
      format: function (str) {
        const isTb = str.includes('TiB');
        const isEb = str.includes('EiB');
        const isPb = str.includes('PiB');
        let n = parseFloat(str);
        if (n > 0) {
          if (isTb) n = n * 1000;
          if (isPb) n = n * 1000 * 1000;
          if (isEb) n = n * 1000 * 1000 * 1000;
        }
        // console.log(n, str);
        return !isNaN(n) && isFinite(n) ? n : 0;
      },
      type: 'numeric'
    });

    function getTimeInSeconds(n, str) {
      if (n && str) {
        let mut = str.includes('second') ? 1 : 0;
        if (!mut) mut = str.includes('minute') ? 60 : 0;
        if (!mut) mut = str.includes('hour') ? 60 * 60 : 0;
        if (!mut) mut = str.includes('day') ? 60 * 60 * 24 : 0;
        if (!mut) mut = str.includes('week') ? 60 * 60 * 24 * 7 : 0;
        if (!mut) mut = str.includes('month') ? 60 * 60 * 24 * 30 : 0;

        if (mut) {
          return parseFloat(n) * mut;
        }
      }

      return 0;
    }

    const REG_ETW = /(\d+)\s+(\w+)(\s+and\s+)?(\d+)?\s?(\w+)?/;
    $.tablesorter.addParser({
      id: 'expected_time_to_win',
      is: function (s) {
        return false;
      },
      format: function (str) {
        const match = REG_ETW.exec(str);
        let n = 0;
        if (match) {
          n = getTimeInSeconds(match[1], match[2]) + getTimeInSeconds(match[4], match[5]);
        }
        // console.log(n, str);
        return !isNaN(n) && isFinite(n) ? n : str;
      },
      type: 'numeric'
    });

    // $.tablesorter.addParser({
    //   id: 'last_block_time',
    //   is: function (s) {
    //     return false;
    //   },
    //   format: function (str) {
    //     const n = new Date(str).getTime();
    //     return !isNaN(n) && isFinite(n) ? n : 0;
    //   },
    //   type: 'numeric'
    // });

    $("#reviewTable").tablesorter({
      headers: {
        7: { sorter: "netspace" },
        8: { sorter: "expected_time_to_win" },
        // 20: { sorter: "last_block_time" }
      },
      widgets: ['columnSelector'], // https://mottie.github.io/tablesorter/docs/example-widget-column-selector.html
      widgetOptions: {
        // hide columnSelector false columns while in auto mode
        columnSelector_mediaqueryHidden: true,

        // set the maximum and/or minimum number of visible columns; use null to disable
        columnSelector_maxVisible: null,
        columnSelector_minVisible: null,
      }
    });
  }

  $("#btnSimpleView").click(function (e) {
    $('#totalBalanceRow').addClass('visually-hidden');
    $('.btnViewMode').removeClass('active');
    $(this).addClass('active');

    toggleReviewColumns(simpleViewColumns);
  });

  $("#btnStatusView").click(function (e) {
    $('#totalBalanceRow').addClass('visually-hidden');
    $('.btnViewMode').removeClass('active');
    $(this).addClass('active');

    toggleReviewColumns(statusViewColumns);
  });

  $("#btnBalanceView").click(function (e) {
    $('#totalBalanceRow').removeClass('visually-hidden');
    $('.btnViewMode').removeClass('active');
    $(this).addClass('active');

    toggleReviewColumns(balanceViewColumns);
  });

  $("#btnFullView").click(function (e) {
    $('#totalBalanceRow').addClass('visually-hidden');
    $('.btnViewMode').removeClass('active');
    $(this).addClass('active');

    $('#reviewTable th, #reviewTable td').each(function () {
      $(this).removeClass('visually-hidden');
    });
  });

  const desktopReviewPage = $('#desktopReviewPage');
  if (desktopReviewPage && desktopReviewPage.length > 0) {
    $("#btnSimpleView").click();

    const reviewTableFontSize = $.cookie('reviewTableFontSize');
    if (reviewTableFontSize) {
      $("#reviewTable").addClass(reviewTableFontSize);
    }
  }

  $('#btnToggleFont').click(function (e) {
    $("#reviewTable").toggleClass('fs-6');
    if ($("#reviewTable").hasClass('fs-6')) {
      $.cookie('reviewTableFontSize', 'fs-6', { expires: 30 });
    } else {
      $.cookie('reviewTableFontSize', '', { expires: 30 });
    }
  });

  $('#desktopReviewPage #reviewTable tbody tr').click(function (e) {
    $(this).toggleClass('clicked-row');
  });

});

