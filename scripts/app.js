async function startApp() {
    await renderHeader();
    await $('body').append($('<main>'));
    await renderHomeView();
    await renderFooter();
}