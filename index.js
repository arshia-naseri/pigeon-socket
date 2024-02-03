// const {instrument} = require("@socket.io/admin-ui")

const updateChatMessageURL = process.env.REACT_APP_GET_UPDATE_MESSAGES_URL || "http://localhost:5040/updateChatMessage";
const io = require('socket.io')(5050, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    },
    transports: ['websocket','polling'], 
    upgrade: false
},);

io.on('connection', socket => {
    // console.log(socket.id);

    socket.on("send_message", (from, time, text, roomID) => {
        let id = from.id;
        delete from.id;
        socket.to(roomID).emit("receive_message", {from, time, text, roomID})
        
        fetch(updateChatMessageURL, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id, time, text, roomID})
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
        
        
    })

    socket.on("join-room", (roomList) => {
        // console.log(roomList);
        socket.join(roomList);
    })
})

// instrument(io, {auth:false,mode: "development"})