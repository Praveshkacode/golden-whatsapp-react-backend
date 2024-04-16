const http = require("http");
const express = require("express");
const cors = require("cors");

const socketIO = require("socket.io");

const app = express();
const port = process.env.port || 4500;

const users=[{}];

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello its Working");
})

const server= http.createServer(app);

const io = socketIO(server);

io.on("connection",(socket)=>{ // <-- Pass 'socket' object as parameter
    console.log("New connections");

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} is Joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log("User Left");
    })

    
    
    

});

server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`);
})
