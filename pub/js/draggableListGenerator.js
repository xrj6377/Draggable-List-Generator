// jQuery for packaging src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
(function(global, document, $) {	
	function DraggableListGenerator() {
		this.parent
		this.cellWidth
		this.cellHeight
		this.background_color
		this.listDiv
		this.mainList
		this.garbage
		this.addElementArea
		this.highlightTimeout
		this.originalBorderColor
	}

	DraggableListGenerator.prototype = {
		createList: function({parent = document.querySelector('body'), listName = 'DraggableList', cellWidth = 400, cellHeight = 50, entries = [], background_color = 'transparent'} = {}) {
			if (this.listDiv !== undefined) {
				console.log("The current DraggableListGenerator already has a list generated, delete it (dl.deleteList()) before creating another one.")
				return
			}

			this.cellWidth = cellWidth
			this.cellHeight = cellHeight
			this.background_color = background_color

			// the div wrapping the entire list
			const listDiv = document.createElement('div')
			listDiv.style.width = (cellWidth + 2) + 'px'

			// the title of the list
			const title = document.createElement('div')
			const titleText = document.createElement('h3')
			titleText.appendChild(document.createTextNode(listName))
			title.appendChild(titleText)

			// the main list containing all list entries
			const mainList = document.createElement('ul')
			this.mainList = mainList
			mainList.setAttribute("dragEnabled", "false")
			mainList.style = `list-style: none; border: 1px solid black; padding: 0; min-width: ${cellWidth + 2}px`

			// create garbage icon object for the list
			const garbageImg = document.createElement('img')
			this.garbage = garbageImg
			garbageImg.src = './src/garbage.png'
			garbageImg.style.width = '70px'
			garbageImg.style.height = '70px'
			garbageImg.style.backgroundColor = 'transparent'
			garbageImg.style.position = 'fixed'
			garbageImg.classList.add('garbage')

			// adding list entries to the list
			for (let i = 0; i < entries.length; i++) {
				this.addListEntry(entries[i])
			}

			// create addElementArea for the list, which is also LI element
			const addElementArea = document.createElement('li')
			addElementArea.classList.add('addElementArea')
			addElementArea.style.height = (cellHeight / 2) + 'px'
			addElementArea.style.width = cellWidth + 'px'
			addElementArea.style.backgroundColor = 'transparent'
			addElementArea.style.border = '1px solid black'

			const addElementAreaText = document.createTextNode("Drop entry here to add to this list.")
			addElementArea.appendChild(addElementAreaText)


			listDiv.append(title)
			listDiv.append(mainList)
			parent.append(listDiv)

			this.listDiv = listDiv
			this.parent = parent
			this.addElementArea = addElementArea
		},

		deleteList: function () {
			this.parent.removeChild(this.listDiv)
			this.parent = undefined
			this.listDiv = undefined
			this.addElementArea = undefined
			this.garbage = undefined
			this.mainList = undefined
			this.cellWidth = undefined
			this.cellHeight = undefined
			this.background_color = undefined
			if (this.highlightTimeout) {
				clearTimeout(this.highlightTimeout)
			}
			this.highlightTimeout = undefined
			this.originalBorderColor = undefined
		},

		enableDrag: function () {
			this.mainList.setAttribute("dragEnabled", "true")
			const entries = this.mainList.children

			for (let i = 0; i < entries.length; i++) {
				dragElement(entries[i], this.garbage)
				entries[i].style.cursor = 'pointer'
			}

			this.mainList.append(this.addElementArea)
		},

		disableDrag: function () {
			this.mainList.setAttribute("dragEnabled", "false")
			const entries = this.mainList.children

			for (let i = 0; i < entries.length; i++) {
				entries[i].onmousedown = null
				entries[i].style.cursor = null
				let liChildren = entries[i].children
				for (let j = 0; j < liChildren.length; j++) {
					liChildren[j].onmouseenter = null
					liChildren[j].onmouseout = null
				}
			}

			this.mainList.removeChild(this.addElementArea)
		},

		highlightList: function () {
			if (!this.listDiv) {
				console.log("This list generator has no list associated with it.")
				return
			}

			if (this.highlightTimeout) {
				clearTimeout(this.highlightTimeout)
				this.highlightTimeout = null
			}

			if (!this.originalBorderColor) {
				this.originalBorderColor = this.listDiv.style.border
			}
			this.listDiv.style.border = "2px solid red"
			this.highlightTimeout = setTimeout(() => {
				this.listDiv.style.border = this.originalBorderColor
				this.originalBorderColor = null
				this.highlightTimeout = null
			}, 5000)
		},

		addListEntry: function (entryText) {
			if (typeof entryText !== 'string') {
				console.log('List entry must a string.')
				return
			}
			let li = document.createElement('li')
			li.style.width = this.cellWidth + 'px'
			li.style.minHeight = this.cellHeight + 'px'
			li.style.backgroundColor = this.background_color
			li.style.border = '1px solid black'

			let textDiv = document.createElement('div')
			textDiv.classList.add('textDiv')
			let content = document.createTextNode(entryText)
			textDiv.appendChild(content)
			li.appendChild(textDiv)
			if (this.mainList.getAttribute("dragEnabled") === 'true') {
				this.mainList.lastElementChild.before(li)
				dragElement(li, this.garbage)
				li.style.cursor = 'pointer'
			}
			else {
				this.mainList.append(li)
			}
		},

		removeListEntry: function (index) {
			const listEntires = this.mainList.children
			if (index >= listEntires.length || index < 0) {
				console.log("Index", index, "out of bound.")
			}
			else {
				this.mainList.removeChild(listEntires[index])
			}
		},

		changeStyle: function (style, index=-1) {
			if (typeof style !== 'string') {
				console.log("Style argument must be of type string.")
				return
			}
			// parse the style and check for any error
			const styles = style.split(';')
			const processedStyles = []
			for (let i = 0; i < styles.length; i++) {
				if (styles[i].length > 0) {
					const s = styles[i].split(':')
					if (s.length === 2) {
						processedStyles.push([s[0].trim(), s[1].trim()])
					}
					else {
						console.log("Issue with style entry", styles[i])
					}
				}
			}


			if (index === -1) {
				const targets = this.mainList.children
				for (let i = 0; i < targets.length; i++) {
					for (let j = 0; j < processedStyles.length; j++) {
						if (targets[i] !== this.addElementArea) {
							checkAndChageStyle(targets[i], processedStyles[j][0], processedStyles[j][1])
						}
					}
				}
			}
			else if (index < this.mainList.children.length && this.mainList.children[index] !== this.addElementArea){
				const target = this.mainList.children[index]

				for (let i = 0; i < processedStyles.length; i++) {
					checkAndChageStyle(target, processedStyles[i][0], processedStyles[i][1])
				}
			}
			else {
				console.log("Index", index, "out of bound.")
			}
		},

		convertToXML: function () {
			const enabled = this.mainList.getAttribute("dragEnabled") === "true"
			if (this.listDiv) {
				if (enabled) {
					this.disableDrag()
				}
				const xml = new XMLSerializer().serializeToString(this.listDiv)
				if (enabled) {
					this.enableDrag()
				}
				return xml.replace(' xmlns="http://www.w3.org/1999/xhtml"', '')
			}
			else {
				console.log("Current list generator has no list associated with it.")
			}
		},

		createFromXMLString: function (xmlString) {
			if (typeof xmlString !== 'string') {
				console.log("Input needs to be of type String.")
				return
			}
			const parser = new DOMParser()
			xmlDOM = parser.parseFromString(xmlString,"text/xml")
			return xmlDOM.childNodes[0]
		}
	}

	function checkAndChageStyle(tar, styl, val) {
		// helper funciton, check to see if the style attribute is valid.
		if (tar.style[styl] !== undefined) {
			tar.style[styl] = val
		}
		else {
			console.log("Style attribute", styl, "is not valid.")
		}
	}


	function dragElement(elmnt, garbage) {
		elmnt.onmousedown = mouseDown
		let hoverElmnt = null
		let hoverPromt = null
		let rect = null
		let diffX, diffY = 0
		let otherLI = null
		let otherLITimer = null
		let isMerge = false

		let unmergeTimer = null
		let shouldUnmerge = false
		let unmergedNode = null
		let removedTextDiv = null

		updateLIChild(elmnt.children)

		function updateLIChild(liChildren) {
			for (let i = 0; i < liChildren.length; i++) {
				liChildren[i].onmouseenter = function (e) {
					liChildren[i].style.opacity = '0.5'
				}

				liChildren[i].onmouseout = function (e) {
					liChildren[i].style.opacity = '1'
				}
			}
		}

		function mouseDown(e) {
			e.preventDefault()
			rect = elmnt.getBoundingClientRect()

			// as the user holds the mouse down start a timer. Once the timer expires, start the unmerge process.
			if (e.target.classList.contains('textDiv') && e.target.parentNode.children.length > 1) {
				unmergeTimer = setTimeout(() => {
					shouldUnmerge = true
					if (elmnt) {
						unmergedNode = elmnt.cloneNode(false)
						removedTextDiv = e.target
						const clonedTextNode = e.target.cloneNode(true)
						removedTextDiv.style.visibility = 'hidden'
						clonedTextNode.style.opacity = '1'
						unmergedNode.append(clonedTextNode)

						document.querySelector('body').removeChild(hoverElmnt)
						hoverElmnt = unmergedNode.cloneNode(true)
						hoverElmnt.style.pointerEvents = 'none'
						hoverElmnt.style.listStyleType = 'none'
						hoverElmnt.style.position = 'fixed'
						hoverElmnt.style.border = '1px solid black'
						hoverElmnt.style.top = e.clientY + 'px'
						hoverElmnt.style.left = e.clientX + 'px'
						hoverElmnt.style.opacity = "0.4"

						diffX = 0
						diffY = 0

						document.querySelector('body').append(hoverElmnt)
					}
				}, 2000)
			}

			garbage.style.left = (rect.x + rect.width + 50) + "px"
			garbage.style.top = (rect.y + rect.height / 2 - 35) + "px"
			document.querySelector('body').append(garbage)

			hoverElmnt = elmnt.cloneNode(true)
			hoverElmnt.style.pointerEvents = 'none'
			hoverElmnt.style.listStyleType = 'none'
			hoverElmnt.style.position = 'fixed'
			hoverElmnt.style.border = '1px solid black'
			hoverElmnt.style.top = rect.top + 'px'
			hoverElmnt.style.left = rect.left + 'px'
			hoverElmnt.style.opacity = "0.4"

			diffX = e.clientX - rect.x
			diffY = e.clientY - rect.y

			document.querySelector('body').append(hoverElmnt)

			document.onmousemove = elementDrag;
			document.onmouseup = clearDrag;
		}

		function elementDrag(e) {
			if (unmergeTimer && !shouldUnmerge) {
				clearTimeout(unmergeTimer)
			}
			unmergeTimer = null
			const targetParentLI = findParentLi(e.target)
			if ((targetParentLI && targetParentLI !== elmnt && targetParentLI.parentNode.getAttribute("dragEnabled") === "true") || e.target.classList.contains('garbage')) {
				let otherElmnt = targetParentLI !== null ? targetParentLI : e.target
				otherElmnt.style.opacity = '0.5'

				if (otherElmnt.nodeName === 'LI' && !otherElmnt.classList.contains('addElementArea') && !otherLI) {
					otherLI = otherElmnt
					otherLITimer = setTimeout(() => {
						isMerge = true
						hoverPromt = document.createElement('p')
						hoverPromt.append(document.createTextNode('release to merge entries'))
						hoverPromt.style.pointerEvents = 'none'
						hoverPromt.style.listStyleType = 'none'
						hoverPromt.style.position = 'fixed'
						hoverPromt.style.border = '1px solid black'
						hoverPromt.style.left = otherElmnt.getBoundingClientRect().x - 160 + 'px'
						hoverPromt.style.top = otherElmnt.getBoundingClientRect().y + 'px'
						document.querySelector('body').append(hoverPromt)
					}, 2000)
				}

				otherElmnt.onmouseleave = function () {
					otherElmnt.style.opacity = '1'
					if (otherLI) {
						otherLI = null
						clearTimeout(otherLITimer)
						otherLITimer = null
						isMerge = false
						if (hoverPromt) {
							document.querySelector('body').removeChild(hoverPromt)
							hoverPromt = null
						}
					}
					otherElmnt.onmousein = null
					otherElmnt.onmouseleave = null
				}
			}
			hoverElmnt.style.left = (e.clientX - diffX) + 'px'
			hoverElmnt.style.top = (e.clientY - diffY) + 'px'
		}

		function clearDrag(e) {
			document.querySelector('body').removeChild(hoverElmnt)
			if (hoverPromt) {
				document.querySelector('body').removeChild(hoverPromt)
				hoverPromt = null
			}
			garbage.style.opacity = '1'
			hoverElmnt = null
			rect = null
			diffX = 0
			diffY = 0
			const targetParentLI = findParentLi(e.target)

			if ((shouldUnmerge && targetParentLI && targetParentLI.parentNode.getAttribute("dragEnabled") === "true")) {
				unmergedNode.style.opacity = '1'
				insertBefore(targetParentLI, unmergedNode)
				dragElement(unmergedNode, garbage)
				elmnt.removeChild(removedTextDiv)
				updateLIChild(elmnt.children)
				removedTextDiv = null
				shouldUnmerge = false
				unmergedNode = null
				unmergeTimer = null
			}
			else if (targetParentLI && targetParentLI !== elmnt && targetParentLI.parentNode.getAttribute("dragEnabled") === "true") {
				if (!targetParentLI.classList.contains('addElementArea')) {
					if (!isMerge) {
						swap(elmnt, targetParentLI)
					}
					else {
						merge(elmnt, targetParentLI)
					}
				}
				else {
					addToList(elmnt, targetParentLI)
				}
			}
			else if (e.target.classList.contains('garbage')) {
				if (shouldUnmerge) {
					elmnt.removeChild(removedTextDiv)
					updateLIChild(elmnt.children)
					removedTextDiv = null
					unmergeTimer = null
					shouldUnmerge = false
					unmergedNode = null
				}
				else {
					elmnt.parentNode.removeChild(elmnt)
				}
			}
			else {
				if (shouldUnmerge) {
					removedTextDiv.style.visibility = 'visible'
					unmergeTimer = null
					shouldUnmerge = false
					unmergedNode = null
					removedTextDiv = null
				}
			}

			document.querySelector('body').removeChild(garbage)
			document.onmousemove = null
			document.onmouseup = null
		}

		function swap(node1, node2) {
			const afterNode1 = node1.nextElementSibling
			const afterNode2 = node2.nextElementSibling
			const parent1 = node1.parentNode
			const parent2 = node2.parentNode

			if (afterNode1 === null && afterNode2 === null) {
				parent1.append(node2)
				parent2.append(node1)
			}
			else if (afterNode1 === null) {
				parent1.append(node2)
				afterNode2.before(node1)
			}
			else if (afterNode2 === null) {
				parent2.append(node1)
				afterNode1.before(node2)
			}
			else {
				afterNode2.before(node1)
				afterNode1.before(node2)
			}
		}

		function merge(node1, node2) {
			const node1Children = node1.children
			for (let i = 0; i < node1Children.length; i++) {
				node2.append(node1Children[i].cloneNode(true))
			}
			updateLIChild(node2.children)
			node1.parentNode.removeChild(node1)
		}

		function addToList(node, addElementArea) {
			addElementArea.before(node)
		}

		function insertBefore(node, incomingNode) {
			node.before(incomingNode)
		}
	}

	function findParentLi(tar) {
		const body = document.querySelector('body')
		while (tar !== body) {
			if (tar.nodeName !== 'LI') {
				tar = tar.parentNode
			}
			else {
				return tar
			}
		}
		return null
	}

	global.DraggableListGenerator = global.DraggableListGenerator || DraggableListGenerator
// jQuery for packaging src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
})(window, window.document, $);