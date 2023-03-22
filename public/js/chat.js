let socket= io()

function scrollMessage(){
    const message = document.querySelector('#messages').lastElementChild
    message.scrollIntoView()
}


socket.on('connect', function(){
  console.log('A user connected')

  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
  socket.emit('join', params, function(err){
    if(err){
        alert(err)
        window.location.href= '/'
    }
    else{
        console.log('No error')
    }
  })

})

socket.on('newMessage', function(message) {
    const formattedTime = moment(message.createdAt).format('LT')
    // console.log('newMessage', message)
    let li = document.createElement('li')
    li.innerText = `${message.from} ${formattedTime} : ${message.text}`
    document.querySelector('#messages').appendChild(li)

    scrollMessage()
})

document.querySelector('#send-btn').addEventListener('click', function (e){
    e.preventDefault()
    socket.emit('createMessage', {
        from:'user',
        text:document.querySelector('input[name="message"]').value
    })

})

document.querySelector("#Start-Game").addEventListener('click', function () {
    socket.emit('startGame',{}, function(err){
        if(err){
            alert(err)
        }
       
    })
})

socket.on('alert',function(message){
    return alert(message.text)
} )


function questionForm (){
    document.querySelector('.popup').classList.add('act');
}


socket.on('gameOn', function (){
    
 questionForm()
    
})

document.querySelector('#submit-btn').addEventListener('click', function(e){
    e.preventDefault()
    let question = document.querySelector('input[name="question"]').value
    let answer = document.querySelector('input[name="answer"]').value

    console.log(question, answer)

    socket.emit('QnA', {question, answer})

    document.querySelector('.popup').classList.remove('act')
    
})


socket.on('playersAnswer', function(response){
 
    
    
    function answerForm() {

        let count = 0

        document.querySelector('.Anspopup').classList.add('active');
    
        function startCounter (){
            
            
            function counting (){
                count=count +1;
    
                let timeReading = document.getElementById('timer')
    
                timeReading.innerHTML='00:'+count
                
                console.log(count)
            }
    
            let time = setInterval(counting,1000); 

            setTimeout(()=>{
                clearInterval(time);
                document.querySelector('.Anspopup').classList.remove('active')
            },60000)}
        
        startCounter()
    }
    

answerForm()

    
})

document.querySelector("#answerCheck").addEventListener("click", function(e){
    e.preventDefault()
    let reply = document.querySelector('input[name="answerCheck"]').value
    console.log(reply)
    
    socket.emit('reply', {reply})
    document.querySelector('.Anspopup').classList.remove('active')
})

socket.on('disconnect', function (){
    console.log('disconnected from server')
})

