
const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const {generateMessage} = require('./utils/generate')
const {isRealString} = require('./utils/isRealString')
const {Users} = require('./utils/users')
let users = new Users

let Answer = []
let existingQNA =[]

const publicPath = path.join(__dirname,"../public")

app.use(express.static(publicPath))


io.on('connection', (socket) =>{
    console.log(`${socket.id} just joined`)

    socket.on('join', (params,callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('name and room required')
        }

        let user = users.getRoom(params.room) 
        let user1 = user.filter(user => user.room.question === true )

        if(user1.length > 0){
            return callback( 'You can not join now, game session is on')
        }

        socket.join(params.room)
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
    
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room} game room`))
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the group`))
    })

   
    socket.on('createMessage', (message) => {
        let user = users.getUser(socket.id);

        // console.log(user)

        if(user && isRealString(message.text)){
            io.to(user.room.name).emit('newMessage', generateMessage(user.name, message.text));
        }
    })

    socket.on('startGame', () =>{
        let userDetail = users.getUser(socket.id)

        let user= users.getUserList(userDetail.room.name)
        // console.log(user.length, userDetail.id, userDetail.name,userDetail.room.name,userDetail)

        if(userDetail.room.role === 'gamemaster'){
            return socket.emit('alert',generateMessage('Admin', 'You are the previous Gamemaster'))
        }

        if(user.length <= 2) {
          return  socket.emit('alert',generateMessage('Admin', 'More players needed'))
        }
        // console.log('it got here')
        let user2 = users.getRoom(userDetail.room.name)

        let user3= user2.filter(user => user.room.question === true)
        console.log(user3)

        if(user3.length !== 0){
            return  socket.emit('alert',generateMessage('Admin', 'THERE IS A GAMEMASTER'))
        }

        socket.emit('gameOn',{} )
    })





    socket.on('QnA', (message)=>{

        if(!message.question || !message.answer){

            return 
        }
        

        let user = users.getUser(socket.id)
        
        let response = message.answer
        
        socket.broadcast.to(user.room.name).emit('playersAnswer',{response})

        let user1 =users.getRoom(user.room.name)
        let user2 = user1.filter(user => user.room.role === 'gamemaster')

        if(user2.length !== 0){
            user2[0].room.role = 'player'
        } 

        user.room.question = true
        user.room.role = 'gamemaster'
        user.room.answer=response

        function resetGameMaster (){
            setTimeout(()=>{
                user.room.question = false
            }, 60000)
        }

        resetGameMaster()

    })

 

    socket.on('reply', (reply)=>{

      
        let user = users.getUser(socket.id)
        let user1 =users.getRoom(user.room.name)
        let user2 = user1.filter(user => user.room.role === 'gamemaster')

        
        
        if(reply.reply == user2[0].room.answer){


            socket.emit('newMessage', generateMessage('Admin', 'YOU won 10 points'))
            
           user2[0].room.question = false

            console.log(user)

            return user

        }

        else{
           return socket.emit('newMessage', generateMessage('Admin', 'You are wrong'))
        }

        

    })

    socket.on('disconnect', () =>{
        users.removeUser(socket.id);
        console.log('disconnected from server')
    })

})

server.listen(3000, ()=>{
    console.log('server connected')
})



