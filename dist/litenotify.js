var notifyTimeout,
notifyRemoveTimeout,
notifyConfirmCallback;

function produce_litenotify({msg, type = 'msg', time = 10000, callback = false}) {
	// Restart all notify
	window.clearTimeout(notifyTimeout);
	window.clearTimeout(notifyRemoveTimeout);
	$('.litenotify').remove();

	let litenotifyContext = '';
	let title = '';
	if ( type == 'msg' ) {
		title = 'mensagem';
	} else if ( type == 'alert' ) {
		title = 'alerta!';
	} else if ( type == 'error' ) {
		title = 'erro!';
	} else if ( type == 'confirm' ) {
		title = 'Escolha';
	} else {
		title = 'sucesso!';
	}
	litenotifyContext += `
	<section class="litenotify show ${type}">
        <section class="litenotify_left">
            <header class="litenotify_header">
                ${title}
            </header>
            <section class="litenotify_content">
                ${msg}
            </section>
        </section>`;

    if ( type == 'alert' || type == 'error' || type == 'msg' || type == 'confirm' ) {
        litenotifyContext += `
            <section class="litenotify_right">`;

        if ( type == 'alert' || type == 'error' ) {
            litenotifyContext += `
            <div class="litenotify_close" ${((callback != false) ? `data-callback="${callback}"` : '' )}>Ok</div>`;
        } else if ( type == 'msg' ) {
            litenotifyContext += `
            <div class="litenotify_close" ${((callback != false) ? `data-callback="${callback}"` : '' )}>Fechar</div>`;
        } else if ( type == 'confirm' ) {
            litenotifyContext += `
            <div class="litenotify_close">Não</div>`;
            litenotifyContext += `
            <div class="litenotify_confirm" ${((callback != false) ? `data-callback="${callback}"` : '' )}>Sim!</div>`;
        }
        litenotifyContext += `
            </section>`;
    }

    litenotifyContext += `
	</section>`;

	// Render the notify
	$('body').append(litenotifyContext);

	// Callback
	if ( callback != false ) {
		notifyConfirmCallback = new Promise((resolve, reject) => {
			resolve(callback);
		});
	}

	// Hide notify
	if ( time > 0 ) {
		notifyTimeout = setTimeout(() => {
			$('.litenotify').removeClass('show').addClass('hide');
			notifyRemoveTimeout = setTimeout(() => {
				$('.litenotify').remove();
			}, 700);
		}, time);
	}
}

// close litenotify
$(document).on('click', '.litenotify_close', function() {
    $('.litenotify').removeClass('show').addClass('hide');
    notifyRemoveTimeout = setTimeout(() => {
        window.clearTimeout(notifyTimeout);
        window.clearTimeout(notifyRemoveTimeout);
        $('.litenotify').remove();
    }, 700);
});

// Confirm, close and callback
$(document).on('click', '.litenotify_confirm, .litenotify_close', function() {
	let th = $(this);
	let callback = th.data('callback');

	// If has callback
	if ( callback != undefined ) {
		// Callback Notify Confirm
		notifyConfirmCallback.then(function(callback) {
			callback();
		});

		$('.litenotify').removeClass('show').addClass('hide');
		notifyRemoveTimeout = setTimeout(() => {
			// Restart Notifications
			window.clearTimeout(notifyTimeout);
			window.clearTimeout(notifyRemoveTimeout);
			$('.litenotify').remove();
		}, 700);
	}
});