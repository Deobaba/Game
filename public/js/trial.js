

document.querySelector('.popup .close-btn').addEventListener('click', function(e){
    e.preventDefault()
    document.querySelector('.popup').classList.remove('act')
})


document.querySelector('.Anspopup .Aclose-btn').addEventListener('click', function(e){
    e.preventDefault()
    document.querySelector('.Anspopup').classList.remove('active')
})