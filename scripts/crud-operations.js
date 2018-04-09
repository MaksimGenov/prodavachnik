const URL_DB = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Bykm8lnqM';
const APP_SECRET = '325a3ea41ee240bebb4a825719092799';
const APP_AUTH = btoa(APP_KEY + ':' + APP_SECRET);

function registerUser() {
    let form = $('#formRegister');
    let inputUserName = $(form.find('input[name=username]'));
    let inputPassword = $(form.find('input[name=password]'));
    let data = {
        username: inputUserName.val(),
        password: inputPassword.val()
    };
    $.ajax({
        method: 'POST',
        url: URL_DB + 'user/' + APP_KEY,
        headers: {'Authorization': 'Basic ' + APP_AUTH},
        data: data
    }).then((user) => {
        signInUser(user);
        renderInfoBox('Registration successful.');
    }).catch();
}

function loginUser() {
    let form = $('#formLogin');
    let inputUserName = $(form.find('input[name=username]'));
    let inputPassword = $(form.find('input[name=password]'));
    let data = {
        username: inputUserName.val(),
        password: inputPassword.val()
    };
    $.ajax({
        method: 'POST',
        url: URL_DB + 'user/' + APP_KEY + '/login',
        headers: {'Authorization': 'Basic ' + APP_AUTH},
        data: data
    }).then((user) => {
        signInUser(user);
        renderInfoBox('Login successful.');
    }).catch();
}

function signInUser(user) {
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('userAuth', user._kmd.authtoken);
    renderHeader();
    renderHomeView();
}

function logoutUser() {
    sessionStorage.clear();
    renderHeader();
    renderHomeView();
    renderInfoBox('Logout successful.')
}

function createAd() {
    let formCreateAd = $('#formCreateAd');
    if(!validateForm(formCreateAd))
        return;
    let inputTitle = $(formCreateAd.find('input[name = title]'));
    let inputDatePublished = $(formCreateAd.find('input[name = datePublished]'));
    let inputPrice = $(formCreateAd.find('input[name = price]'));
    let textAreaDescription = $(formCreateAd.find('textarea[name = description]'));
    let inputImage = $(formCreateAd.find('input[name = image]'));
    let data = {
        title: inputTitle.val(),
        author: sessionStorage.getItem('username'),
        date: inputDatePublished.val(),
        price: inputPrice.val(),
        description: textAreaDescription.val(),
        image: inputImage.val()
    };
    $.ajax({
        method: 'POST',
        url: URL_DB + 'appdata/' + APP_KEY + '/ads',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('userAuth')},
        data: data
    }).then(() => {
        renderInfoBox('Advertisement created successfully.');
        setTimeout(loadAds, 3000);
    }).catch(handleAjaxError);
}

function loadAds() {
    $.ajax({
        method: 'GET',
        url: URL_DB + 'appdata/' + APP_KEY + '/ads',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('userAuth')},
    }).then(renderAds).catch(handleAjaxError);
}

function loadAd(id) {
    return $.ajax({
        method: 'GET',
        url: URL_DB + 'appdata/' + APP_KEY + '/ads/' + `?query={"_id":"${id}"}`,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('userAuth')}
    }).then(renderDetailedAd).catch(handleAjaxError);
}

function deleteAd(id) {
    $.ajax({
        method: 'DELETE',
        url: URL_DB + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('userAuth')}
    }).then(loadAds).catch(handleAjaxError);
}

function updateAd(id) {
    let formEditAd = $('#formEditAd');
    if (!validateForm(formEditAd))
        return;
    let inputTitle = $(formEditAd.find('input[name = title]'));
    let inputDatePublished = $(formEditAd.find('input[name = datePublished]'));
    let inputPrice = $(formEditAd.find('input[name = price]'));
    let textAreaDescription = $(formEditAd.find('textarea[name = description]'));
    let inputImage = $(formEditAd.find('input[name = image]'));
    let data = {
        title: inputTitle.val(),
        author: sessionStorage.getItem('username'),
        date: inputDatePublished.val(),
        price: inputPrice.val(),
        description: textAreaDescription.val(),
        image: inputImage.val()
    };
    $.ajax({
        method: 'PUT',
        url: URL_DB + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('userAuth')},
        data: data
    }).then(() => {
        renderInfoBox('Advertisement edited successfully.');
        setTimeout(loadAds, 3000);
    }).catch(handleAjaxError);
}

function handleAjaxError(err) {
    let errorMsg = '';
    if (err.status === 400)
        errorMsg = 'Invalid username or password!';
    else if (err.status === 401)
        errorMsg = 'Unauthorized event!';
    else if (err.status === 404)
        errorMsg = 'Not Found!';
    else if (err.status === 408)
        errorMsg = 'The server is not responding, please try again later!';
    else
        errorMsg = err.responseJSON.description;
    renderErrorBox(errorMsg);
}