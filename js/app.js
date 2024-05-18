import { Modal } from "./Modal.js"

document.querySelectorAll(".js-modal").forEach( (el) => {
    new Modal(el)
})
