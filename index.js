let randomizeArray = document.getElementById('randomize-array')
let sortBtn = document.getElementById('sort-btn')
let barsContainer = document.getElementById('bars-container')
let sleepInput = document.getElementById('sleep-input')
let methodSelect = document.getElementById('method')

let sorting = false

let minRange = 1
let maxRange = 100
let numOfBars = 40
let heightFactor = 5.5
let unsortedArray = new Array(numOfBars)
let sleepBetweenSwaps = 25

const baseColor = '#BEE3F8'
const accentColor = '#63B3ED'
const offColor = '#333'

function createRandomArray() {
   for (let i = 0; i < numOfBars; i++) {
      unsortedArray[i] = randomNum(minRange, maxRange)
   }
}

document.addEventListener('DOMContentLoaded', () => {
   createRandomArray()
   renderBars(unsortedArray)
})

function renderBars(array) {
   for (let i = 0; i < array.length; i++) {
      let bar = document.createElement('div')
      let text = document.createElement('p')
      text.innerHTML = array[i]

      bar.classList.add('bar')
      bar.style.height = array[i] * heightFactor + 'px'
      bar.appendChild(text)

      barsContainer.appendChild(bar)
   }
}

function setBarColor(index, color = baseColor) {
   const bars = document.getElementsByClassName('bar')
   bars[index].style.backgroundColor = color
}

function resetBarsColor() {
   const bars = document.getElementsByClassName('bar')

   for (let k = 0; k < bars.length; k++) {
      bars[k].style.backgroundColor = baseColor
   }
}

async function bubbleSort(array) {
   const bars = document.getElementsByClassName('bar')

   let i = 0
   let j = array.length - 1
   let atLeasOneSwaped

   do {
      atLeasOneSwaped = false
      i = 0

      while (i < j) {
         resetBarsColor()

         // Current comparison - Change color
         bars[i].style.backgroundColor = accentColor
         bars[i + 1].style.backgroundColor = accentColor

         if (array[i] > array[i + 1]) {
            // Swap
            atLeasOneSwaped = true
            let temp = array[i + 1]
            array[i + 1] = array[i]
            array[i] = temp

            // Update with swaped height
            bars[i].style.height = array[i] * heightFactor + 'px'
            bars[i + 1].style.height = array[i + 1] * heightFactor + 'px'

            // Update numbers
            bars[i].children[0].innerHTML = array[i]
            bars[i + 1].children[0].innerHTML = array[i + 1]

            await sleep(sleepBetweenSwaps)
         }

         i++
      }

      await sleep(sleepBetweenSwaps)
      j--
   } while (atLeasOneSwaped)

   return array
}

async function insertionSort(array) {
   const lastPos = array.length - 1
   const sortedColor = 'green'
   const bars = document.getElementsByClassName('bar')

   let itemToFindTheirPos = 1

   while (itemToFindTheirPos <= lastPos) {
      const value = array[itemToFindTheirPos]
      resetBarsColor()

      let j = itemToFindTheirPos
      setBarColor(itemToFindTheirPos, accentColor)
      await sleep(sleepBetweenSwaps)

      // Corrimiento
      while (j > 0 && value < array[j - 1]) {
         setBarColor(j - 1, accentColor)
         setBarColor(j, baseColor)

         array[j] = array[j - 1]

         // Update with swaped height
         bars[j].style.height = array[j] * heightFactor + 'px'
         bars[j].children[0].innerHTML = array[j]

         j--
         await sleep(sleepBetweenSwaps)
      }

      if (itemToFindTheirPos !== j) {
         array[j] = value
         bars[j].style.height = value * heightFactor + 'px'
         bars[j].children[0].innerHTML = array[j]
      }

      itemToFindTheirPos++
      await sleep(sleepBetweenSwaps)
   }
}

async function selectionSort(array) {
   const lastPos = array.length - 1
   const candidateColor = '#F56565'
   const bars = document.getElementsByClassName('bar')

   let candidatePosition = 0
   while (candidatePosition < lastPos) {
      setBarColor(candidatePosition, candidateColor)

      let smallest = candidatePosition
      let i = candidatePosition + 1

      while (i <= lastPos) {
         setBarColor(i, offColor)
         if (array[smallest] > array[i]) {
            if (smallest !== candidatePosition) {
               setBarColor(smallest, offColor)
            }

            setBarColor(i, accentColor)
            smallest = i
         }
         await sleep(sleepBetweenSwaps)

         i++
      }

      await sleep(Math.max(sleepBetweenSwaps, 500))

      if (candidatePosition != smallest) {
         const temp = array[candidatePosition]
         array[candidatePosition] = array[smallest]
         array[smallest] = temp

         // Update with swaped height
         bars[candidatePosition].style.height =
            array[candidatePosition] * heightFactor + 'px'

         bars[smallest].style.height = array[smallest] * heightFactor + 'px'

         // Update numbers
         bars[candidatePosition].children[0].innerHTML =
            array[candidatePosition]
         bars[smallest].children[0].innerHTML = array[smallest]
      }

      await sleep(Math.max(sleepBetweenSwaps, 500))

      candidatePosition++
      resetBarsColor()
   }
}

randomizeArray.addEventListener('click', () => {
   if (sorting) {
      return
   }

   createRandomArray()
   barsContainer.replaceChildren([])
   renderBars(unsortedArray)
})

sortBtn.addEventListener('click', async () => {
   sleepBetweenSwaps = sleepInput.value || 25
   const method = methodSelect.value || 'bubble'

   if (sorting) return

   sorting = true

   switch (method) {
      case 'bubble':
         await bubbleSort(unsortedArray)
         break

      case 'insertion':
         await insertionSort(unsortedArray)
         break

      case 'selection':
         await selectionSort(unsortedArray)
         break

      default:
         break
   }

   sorting = false
})
