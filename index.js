const server = require("http").Server(); 
const port = process.env.PORT || 10001;

var io = require("socket.io")(server);

var users = {};
var msgs = {};

io.on("connection", function(socket){
    socket.on("joinRoom", function(data){
        socket.join(data.room);
        
        socket.myRoom = data.room;
        
        if(!users[data.room]){
            users[data.room] = [];
        }
        if(!msgs[data.room]){
            msgs[data.room] = [];
        }
        
        users[data.room].push(data.user);
        
        io.to(data.room).emit("userjoined", users[data.room]); 
    });
    
    socket.on("sendmsg", function(data){
        msgs[this.myRoom].push(data);
                
        io.to(this.myRoom).emit("msgs", msgs[this.myRoom]);   
    });
    
    socket.on("disconnect", function(){
        //some disconnect function
    })
});

server.listen(port, (err)=>{
    if(err){
        console.log("error: " + err);
        return false;
    }
    console.log("Socket port is running");
})