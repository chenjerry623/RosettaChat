class Handler {

    _io;
    _openai;
    _allUsers = []; // element: id: socket.id, username, room, language

    CHAT_BOT = "ChatBot";
    CHATGPT_MODEL = "text-davinci-003";

    constructor(io, openai) {
        this._io = io;
        this._openai = openai;
    }

    handleJoinRoom(socket, data) {

        const { username, room, language } = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room

        let __createdtime__ = Date.now(); // Current timestamp
        
        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_message', {
            message: `${username} (${language}) has joined the chat room`,
            username: this.CHAT_BOT,
            __createdtime__,
        });

        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: this.CHAT_BOT,
            __createdtime__,
        });

        this._allUsers.push({ id: socket.id, username, room, language });
        
        let chatRoomUsers = this._allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
    }

    async handleSendMessage(data) {

        const { message, username, room, __createdtime__ } = data;

        const chatRoomUsers = this._allUsers.filter((user) => user.room === room && user.username !== username)
        const languages = chatRoomUsers.map(user => user.language);

        const result = await this.runCompletion(data.message, languages);
        
        if (result != '') {
            data.message = data.message + "\n \n" + result; 
        }

        this._io.in(room).emit('receive_message', data); // broadcase the message to all users in room
    };

    handleLeaveRoom(socket, data) {

        const { username, room } = data;
        socket.leave(room);
        
        const __createdtime__ = Date.now();

        this._allUsers.splice(this._allUsers.findIndex(user => user.id === socket.id), 1);
        let chatRoomUsers = this._allUsers.filter((user) => user.room === room);

        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.to(room).emit('receive_message', {
            username: this.CHAT_BOT,
            message: `${username} has left the chat`,
            __createdtime__,
        });
        console.log(`${username} has left the chat`);
    };
    
    handleDisconnect(socket) {
          
        console.log('User disconnected from the chat');

        const user = this._allUsers.find((user) => user.id == socket.id);

        if (user?.username) {

            let chatRoomUsers = this._allUsers.filter((user) => user.room != room);

            socket.to(chatRoom).emit('chatroom_users', chatRoomUsers);
            
            socket.to(chatRoom).emit('receive_message', {
                message: `${user.username} has disconnected from the chat.`,
            });
        }        
    }

    async runCompletion (message, language) {

        let result = '';

        if (typeof language !== 'undefined' && language.length > 0) {

            for (let i = 0; i < language.length; i++) {

                const promptString = "translate this exact phrase into " + language[i] + 
                ", outputting only the translated phrase and without adding any new words into the original phrase : " + message +
                 ". Please only translate the exact phrase " + language[i] + "the translation should not alter this phrase in any way.";

                const completion = await this._openai.createCompletion({
                model: this.CHATGPT_MODEL,
                prompt: promptString,
                });
            
                if (result.length > 0) {
                }
                
                result += language[i] + " : " + completion.data.choices[0].text + "\n";
                console.log(result)
                console.log("API CALL");
            }
        }
        
        return result;
     }
}

module.exports = Handler
