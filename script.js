
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showMessage({ text, keepTime = 3000 }) {
    const msgElm = document.getElementById("message")
    await delay(1000)
    msgElm.innerText = text
    msgElm.classList.add("fadeIn")
    if (keepTime === 0) return true
    await delay(keepTime)
    msgElm.classList.remove("fadeIn")
}

document.addEventListener("DOMContentLoaded", async function () {
    await showMessage({ text: "hello" })
    await showMessage({ text: "welcome", keepTime: 5000 })
    await showMessage({ text: "preparing nice things", keepTime: 7000 })
    await showMessage({ text: "coming soon", keepTime: 0 })
})