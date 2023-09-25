var notifyTimeout, notifyRemoveTimeout, notifyConfirmCallback, domLiteNotify, closeLiteNotify, confirmLiteNotify;

function litenotify({
    msg,
    type = "msg",
    time = 10000,
    callback = false,
}) {
    // Restart all notify
    window.clearTimeout(notifyTimeout);
    window.clearTimeout(notifyRemoveTimeout);
    domLiteNotify = document.querySelector(".litenotify");
    if(domLiteNotify) {
        domLiteNotify.remove();
    }

    let liteNotifyContext = "";
    let title = "";
    if (type == "msg") {
        title = "message";
    } else if (type == "alert") {
        title = "alert!";
    } else if (type == "error") {
        title = "error!";
    } else if (type == "confirm") {
        title = "choose";
    } else {
        title = "success!";
    }

    liteNotifyContext += `
	<section class="litenotify show ${type}">
        <section class="litenotify_left">
            <header class="litenotify_header">
                ${title}
            </header>
            <section class="litenotify_content">
                ${msg}
            </section>
        </section>`;

    if (
        type == "alert" ||
        type == "error" ||
        type == "msg" ||
        type == "confirm"
    ) {
        liteNotifyContext += `
            <section class="litenotify_right">`;

        if (type == "alert" || type == "error") {
            liteNotifyContext += `
            <div class="litenotify_close" ${
                callback != false ? `data-callback="${callback}"` : ""
            }>Ok</div>`;
        } else if (type == "msg") {
            liteNotifyContext += `
            <div class="litenotify_close" ${
                callback != false ? `data-callback="${callback}"` : ""
            }>Fechar</div>`;
        } else if (type == "confirm") {
            liteNotifyContext += `
            <div class="litenotify_close">Não</div>`;
            liteNotifyContext += `
            <div class="litenotify_confirm" ${
                callback != false ? `data-callback="${callback}"` : ""
            }>Sim!</div>`;
        }
        liteNotifyContext += `
            </section>`;
    }

    liteNotifyContext += `
	</section>`;

    // Render the notify
    const body = document.querySelector("body");
    body.insertAdjacentHTML("beforeend", liteNotifyContext);
    domLiteNotify = document.querySelector(".litenotify");


    // Callback
    if (callback != false) {
        notifyConfirmCallback = new Promise((resolve, reject) => {
            resolve(callback);
        });
    }

    // Hide notify
    if (time > 0) {
        notifyTimeout = setTimeout(() => {
            domLiteNotify.classList.remove("show");
            domLiteNotify.classList.add("hide");
            notifyRemoveTimeout = setTimeout(() => {
                domLiteNotify.remove();
            }, 700);
        }, time);
    }

    // close litenotify
    closeLiteNotify = document.querySelector(".litenotify_close");

    closeLiteNotify.addEventListener("click", (e) => {
        domLiteNotify.classList.remove("show");
        domLiteNotify.classList.add("hide");
        notifyRemoveTimeout = setTimeout(() => {
            window.clearTimeout(notifyTimeout);
            window.clearTimeout(notifyRemoveTimeout);
            domLiteNotify.remove();
        }, 700);
    });

    if (type == "confirm") {
        // Confirm Button in callback
        confirmLiteNotify = document.querySelector(".litenotify_confirm");

        confirmLiteNotify.addEventListener("click", (e) => {
            // If has callback

            if (callback) {
                // Callback Notify Confirm
                notifyConfirmCallback.then(function (callback) {
                    callback();
                });
            
                domLiteNotify.classList.remove("show");
                domLiteNotify.classList.add("hide");
                notifyRemoveTimeout = setTimeout(() => {
                    // Restart Notifications
                    window.clearTimeout(notifyTimeout);
                    window.clearTimeout(notifyRemoveTimeout);
                    domLiteNotify.remove();
                }, 700);
            }
        });
    }
}