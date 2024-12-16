window.addEventListener('load', () => {
    const cardTable = new CardTable()
})


class CardTable {
    suits = ['♥', '♦', '♠', '♣']
    values = new Array(13).fill(null).map((_, i) => 1 + i) // 1, 2, 3, ..., 13

    cardContainer = document.getElementById('card-table')
    resetButton = document.getElementById('reset-button')
    displaySlot = document.getElementById('expected-value')
    imageRoot = 'cards/'

    cards = this.suits.map(suit => this.values.map(value => ({
        value,
        image: suit + String(value).padStart(2, '0') + '.' + 'svg'
    })))

    totalCardCount = this.cards.flat().length

    cardsInPlay = this.cards.flat()

    constructor() {
        this.resetButton.addEventListener('click', () => this.reset())
        this.reset()
    }

    adjustResetButtonStatus() {
        if ( this.cardsInPlay.length < this.totalCardCount ) {
            this.resetButton.removeAttribute('disabled')
        } else {
            this.resetButton.setAttribute('disabled', '')
        }
    }

    reset() {
        this.clearTable()
        this.fillTable()
        this.adjustResetButtonStatus()
        this.showExpectedValue()
    }

    clearTable() {
        while (this.cardContainer.firstChild) {
            this.cardContainer.firstChild.remove()
        }
    }

    fillTable() {
        this.cardsInPlay = this.cards.flat()
        this.cardsInPlay.forEach(card => this.addCardToRow(card, this.cardContainer))
    }

    addCardToRow(card, container) {
        const cell = document.createElement('DIV')
        const img = this.createCard(card)
        cell.append(img)
        container.append(cell)
    }

    createCard(card) {
        const cardImgElement = document.createElement('IMG')
        cardImgElement.setAttribute('src', this.imageRoot + card.image)
        cardImgElement.classList.add('card-face')
        cardImgElement.addEventListener('click', () => this.toggleCard(card, cardImgElement))
        return cardImgElement
    }

    toggleCard(card, cardImgElement) {
        if ( cardImgElement.classList.contains('used')) {
            cardImgElement.classList.remove('used')
            this.cardsInPlay = [...this.cardsInPlay, card]
        } else {
            cardImgElement.classList.add('used')
            this.cardsInPlay = this.cardsInPlay.filter(c => c !== card)
        }
        this.adjustResetButtonStatus()
        this.showExpectedValue()
    }

    showExpectedValue() {
        this.displaySlot.innerHTML = this.calculateExpectedValue()
    }

    calculateExpectedValue() {
        const expectedValue = this.cardsInPlay.length
            ? this.cardsInPlay.reduce((total, card) => total + card.value, 0) / this.cardsInPlay.length
            : NaN
        return this.toPrecision(expectedValue)
    }

    toPrecision(n) {
        return Math.round((n + Number.EPSILON) * 100 ) / 100
    }

}

