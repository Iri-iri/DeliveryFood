window.disableScroll = function () {

    const widthScroll = window.innerWidth -
        document.body.offsetWidth;

    document.body.dbscrollY = window.scrollY

    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        width: 100%;
        overflow: hidden;
        height: 100vh;
        padding-right: ${widthScroll}px
    `;
}

window.enableScroll = function () {
    document.body.style.cssText = ``;
    window.scroll({ top: document.body.dbscrollY });
}