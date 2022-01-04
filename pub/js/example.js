"use strict";

const dl1 = new DraggableListGenerator()
dl1.createList({parent: document.querySelector('#twoListDiv'), 
				listName: 'CSC309 Section 1 Student List', 
				entries: ['Mark', 'John', 'Tony', 'Tom', 'Zack', 'James'], 
				background_color: '#347f94'})
dl1.enableDrag()

const dl2 = new DraggableListGenerator()
dl2.createList({parent: document.querySelector('#twoListDiv'),
				listName: 'CSC309 Section 2 Student List', 
				entries: ['Viki', 'Raymond', 'John', 'Ben', 'Alex', 'Sam'], 
				background_color: '#c8d8e4'})
dl2.enableDrag()

const dl3 = new DraggableListGenerator()
dl3.createList({parent: document.querySelector('#mergeListDiv'),
				listName: 'CSC309 Study Partner Assignment',
				entries: ['Viki', 'Raymond', 'John', 'Ben', 'Alex', 'Sam'], 
				background_color: '#7079c2'})
dl3.enableDrag()

const dl4 = new DraggableListGenerator()
dl4.createList({parent: document.querySelector('#styleListDiv'), 
				listName: 'Different Style List',
				entries: ['Amaranth Pink', 'Ash Gray', 'Beau Blue', 'Bittersweet']
})
dl4.changeStyle("font-weight: bold;")
dl4.changeStyle("backgroundColor: #F19CBB; color: #1F75FE", 0)
dl4.changeStyle("backgroundColor: #B2BEB5", 1)
dl4.changeStyle("backgroundColor: #BCD4E6", 2)
dl4.changeStyle("backgroundColor: #FE6F5E", 3)

function clickTab(e) {
	const otherBtns = e.target.parentNode.children
	for (let i = 0; i < otherBtns.length; i++) {
		if (otherBtns[i].classList.contains('tabSelected') && otherBtns[i] !== e.target) {
			otherBtns[i].classList.remove('tabSelected')
		}
	}
	e.target.classList.add('tabSelected')

	const tabId = e.target.parentNode.id
	const htmlTag = document.querySelector(`#${tabId}html`)
	const jsTag = document.querySelector(`#${tabId}js`)
	const descriptionTag = document.querySelector(`#${tabId}description`)

	if (e.target.innerText === 'HTML') {
		if (htmlTag) {
			htmlTag.style.display = 'block'
		}
		if (jsTag) {
			jsTag.style.display = 'none'
		}
		if (descriptionTag) {
			descriptionTag.style.display = 'none'
		}
	}
	else if (e.target.innerText === 'Javascript') {
		if (htmlTag) {
			htmlTag.style.display = 'none'
		}
		if (jsTag) {
			jsTag.style.display = 'block'
		}
		if (descriptionTag) {
			descriptionTag.style.display = 'none'
		}
	}
	else if (e.target.innerText === 'Description') {
		if (htmlTag) {
			htmlTag.style.display = 'none'
		}
		if (jsTag) {
			jsTag.style.display = 'none'
		}
		if (descriptionTag) {
			descriptionTag.style.display = 'block'
		}
	}
}