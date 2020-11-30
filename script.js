function main() {
  // Detect page
  const page = new URLSearchParams(window.location.search).get('page') || 1

  const loadGrid = () => {
    // Show images grid
    const selectImage = (e) => {
      const id = e.target.dataset.id
      let current = JSON.parse(window.localStorage.getItem('selected')) || []

      if (current.findIndex(e => e == id) == -1) {
        current.push(id)
        // e.target.style.border = 'solid 2px red'
        e.target.classList.add('active')
      } else {
        current = current.filter(e => e != id)
        // e.target.style.border = 'none'
        e.target.classList.remove('active')
      }

      window.localStorage.setItem('selected', JSON.stringify(current))
    }

    const showImages = (txt) => {
      const imagesArray = txt.split('\n').filter(e => e.length > 0)
      const $wrapper = document.querySelector('#grid')
      const selected = JSON.parse(window.localStorage.getItem('selected')) || []

      imagesArray.forEach(id => {
        const $img = document.createElement('img')
        $img.src = 'imgs/' + id + '.jpg'
        $img.setAttribute('data-id', id)
        $img.addEventListener('click', selectImage)

        if (selected.findIndex(e => e == id) != -1) {
          // $img.style.border = 'solid 2px red'
          $img.classList.add('active')
        }

        $wrapper.appendChild($img)
      })
    }

    fetch('data/data-' + page + '.txt').then(response => response.text()).then(showImages)
  }

  if (!!parseInt(page)) {
    // Update menu and load grid
    const $a = document.querySelector('a[data-page="' + page + '"]')
    $a.classList.add('active')
    loadGrid()
  } else if (page == 'selected') {
    // Show selected items
    const $grid = document.getElementById('grid')
    const $list = document.getElementById('selected-images')
    $grid.style.display = 'none'

    const list = JSON.parse(window.localStorage.getItem('selected'))
    const html = list.map(item => `<a href="#" onclick="previewImg('${item}')">${item}</a><br/>`).join('')
    $list.innerHTML = html
  }

  // Init local database
  let selected = JSON.parse(window.localStorage.getItem('selected'))
  if (!selected || !Array.isArray(selected)) {
    window.localStorage.getItem('selected', JSON.stringify([]))
  }
}

window.previewImg = function (id) {
  document.getElementById('selected-image-preview').src = 'imgs/' + id + '.jpg'
}

window.addEventListener('DOMContentLoaded', main)