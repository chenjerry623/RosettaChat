import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsersColumn from './room-and-users';

const Chat = ({ username, room, language, socket }) => {
    return (
        <div className={styles.chatContainer}>

            <RoomAndUsersColumn socket={socket} username={username} room={room} language={language} />

            <div>
                <MessagesReceived socket={socket} />
                <SendMessage socket={socket} username={username} room={room} language={language} />
            </div>

        </div>
    );
};

export default Chat;