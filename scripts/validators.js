function validateForm(selector) {
    let requiredInputs = $(selector).find('input:required');
    let message = '';
    for (let input of requiredInputs) {
        if ($(input).val() === '') {
            message += `Please fill the ${$(input).attr('name')} box!\n`
        }
    }
    if (message !== '') {
        renderErrorBox(message);
        return false;
    } else
        return true;
}