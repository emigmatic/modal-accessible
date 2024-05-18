export class Modal {

    constructor (el) {
        this.target = el
        this.elem = document.querySelector(el.getAttribute("href"))

        this.content = document.createElement("div")
        this.content.classList.add("modal-content")
        this.content.innerHTML = this.elem.innerHTML
        this.closeBtn = document.createElement("button")
        this.closeBtn.classList.add("modal-close")
        this.closeBtn.innerHTML = `<span>${(document.documentElement.lang === "fr") ? "Fermer" : "Close"}</span>`
        this.content.prepend(this.closeBtn)
        this.elem.innerHTML = ""
        this.elem.append(this.content)
        this.focusables = Array.from(this.elem.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), *[tabindex]:not([tabindex="-1"]'))

        this.#initModalAttributes()
        this.#addEventListeners()
    }

    #addEventListeners () {
        this.target.addEventListener("click", (e) => this.display(e))
        this.elem.addEventListener("click", (e) => this.display(e))
        this.closeBtn.addEventListener("click", () => this.hide())
    }

    display (e) {
        e.preventDefault()
        if (e.target === this.elem || e.target === this.target) {
            if (this.elem.getAttribute("aria-hidden") === "true") {
                this.show(e)
            } else {
                this.hide(e)
            }
        }
    }

    show () {
        this.elem.setAttribute("aria-hidden", "false")
        setTimeout(() => {
            this.elem.classList.add("is-visible")
        }, 0)
        this.closeBtn.focus()
        window.addEventListener("keydown", this.#handleKeyEvents)
    }

    hide () {
        const transitionEndHandler = () => {
            this.elem.setAttribute("aria-hidden", "true")
            this.elem.removeEventListener("transitionend", transitionEndHandler)
        }
        this.elem.addEventListener("transitionend", transitionEndHandler)
        this.elem.classList.remove("is-visible")
        window.removeEventListener("keydown", this.#handleKeyEvents)
        this.target.focus()
    }

    #handleKeyEvents = (e) => {
        if (e.key === "Escape") {
            this.hide()
        }
        if (e.key === "Tab") {
            let index = this.focusables.findIndex((element) => {
                return element === document.activeElement
            })
            index = e.shiftKey ? index - 1 : index + 1
            if (index >= this.focusables.length) {
                index = 0
            } else if (index < 0) {
                index = this.focusables.length - 1
            }
            setTimeout(() => {
                this.focusables[index].focus()
            }, 0)
        }
    }

    #initModalAttributes () {
        const modalTitleElement = this.elem.querySelector("h1") || this.elem.querySelector("h2")
        if (modalTitleElement && !modalTitleElement.id) {
            modalTitleElement.id = "modal-title"
        }
        const ariaLabelledby = (modalTitleElement?.id) ? modalTitleElement.id : null
        const attributes = {
            "role": "dialog",
            "aria-labelledby": ariaLabelledby,
            "aria-hidden": "true",
            "aria-modal": "true"
        }
        for (const [attr, value] of Object.entries(attributes)) {
            if (value !== null) {
                this.elem.setAttribute(attr, value)
            }
        }
    }
}
