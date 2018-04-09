function renderHeader() {
    $('header').remove();
    let logged = sessionStorage.getItem('userAuth') !== null;
    $.get('templates/header.hbs').then((view) => {
        let template = Handlebars.compile(view);
        $('body').prepend(template({logged}));
        attachEventsToLinks();
    });

    function attachEventsToLinks() {
        $('#linkHome').on('click', renderHomeView);
        $('#linkRegister').on('click', renderRegisterView);
        $('#linkLogout').on('click', logoutUser);
        $('#linkLogin').on('click', renderLoginView);
        $('#linkCreateAd').on('click', renderCreateAdView);
        $('#linkListAds').on('click', loadAds);
    }
}

function renderFooter() {
    $.get('templates/footer.hbs').then((view) => $('body').append(view));
}

function renderHomeView() {
    $.get('views/home-view.html').then((view) => showView(view));
}

function renderRegisterView() {
    $.get('./views/register-user-view.html').then((view) => {
        showView(view);
        $('#buttonRegisterUser').on('click', registerUser);
    });
}

function renderLoginView() {
    $.get('./views/login-user-view.html').then((view) => {
        showView(view);
        $('#buttonLoginUser').on('click', loginUser);
    });
}

function renderInfoBox(message) {
    $.get('templates/info-box.hbs').then((view) => {
        let template = Handlebars.compile(view);
        let infoBox = template({message});
        $(infoBox).on('click', removeInfoBox).insertBefore($('main'))
    });
    setInterval(removeInfoBox, 10000);
}

function removeInfoBox() {
    $('#infoBox').remove();
}

function renderErrorBox(message) {
    $.get('templates/error-box.hbs').then((view) => {
        let template = Handlebars.compile(view);
        let infoBox = template({message});
        $(infoBox).on('click', removeErrorBox).insertBefore($('main'))
    });
    setInterval(removeErrorBox, 10000);
}

function removeErrorBox() {
    $('#errorBox').remove();
}

function showView(view) {
    removeErrorBox();
    removeInfoBox();
    $('main').empty().append(view)
}

function renderCreateAdView() {
    $.get('templates/create-edit-ad-form.hbs').then((view) => {
        let template = Handlebars.compile(view);
        let context = {
            formId: 'formCreateAd',
            title: 'Create new Advertisement',
            buttonId: 'buttonCreateAd',
            buttonText: 'Create',
        };
        showView(template(context));
        $('#buttonCreateAd').on('click', createAd)
    })
}

function renderAds(ads) {
    $.get('templates/ads.hbs').then((view) => {
        let template = Handlebars.compile(view);
        showView(template(ads.reverse()));
        showHideActionButtons();
    });

    function showHideActionButtons() {
        let trs = $('#ads').find('tbody > tr');
        let username = sessionStorage.getItem('username');
        trs.toArray().forEach(tr => {
            tr = $(tr);
            let author = tr.find('td[name=author]').html();
            if (username !== author) {
               let tdActions = $(tr.find('td[name=actions]'));
                $(tdActions.find('a[name=btnDelete]')).remove();
                $(tdActions.find('a[name=btnEdit]')).remove();
            }
        })
    }
}

function renderEditView(ad) {
    $.get('templates/create-edit-ad-form.hbs').then((view) => {
        let template = Handlebars.compile(view);
        let context = {
            formId: 'formEditAd',
            title: 'Edit Advertisement',
            buttonId: 'buttonEditAd',
            buttonText: 'Edit',
        };

        showView(template(context));
        fillInputs(ad);
        $('#buttonEditAd').on('click', () => updateAd(ad._id))
    });

    function fillInputs() {
        let formEditAd = $('#formEditAd');
        $(formEditAd.find('input[name = title]')).val(ad.title);
        $(formEditAd.find('input[name = datePublished]')).val(ad.date);
        $(formEditAd.find('input[name = price]')).val(ad.price);
        $(formEditAd.find('textarea[name = description]')).val(ad.description);
        $(formEditAd.find('input[name = image]')).val(ad.image);
    }
}

function renderDetailedAd(ad) {
    $.get('./templates/detailed-ad').then((view) => {
        let template = Handlebars.compile(view);
        showView(template({ad: ad[0]}))
    })
}