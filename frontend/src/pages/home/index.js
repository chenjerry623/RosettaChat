import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, language, setLanguage, socket }) => {

    const navigate = useNavigate();

    const joinRoom = () => {

        if (room !== '' && username !== '' && language !== '') {
            socket.emit('join_room', { username, room, language });
        }

        // Redirect to /chat
        navigate('/chat', { replace: true });
    };

    return (

        <div className={styles.container}>
        <div className={styles.formContainer}>
            <h1>{`<>ChatRooms</>`}</h1>
            
            <input 
                className={styles.input} 
                placeholder='Username...' 
                onChange={(e) => setUsername(e.target.value)}
            />

            <select 
                className={styles.input}
                onChange={(e) => setRoom(e.target.value)}
            >
                <option>-- Select Room --</option>
                <option value='room1'>Room #1</option>
                <option value='room2'>Room #2</option>
            </select>

            <select 
                className={styles.input}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option>-- Select Language --</option>
                <option value='english'>English</option>
                <option value='chinese'>Chinese</option>
                <option value='japaness'>Japness</option>
            </select>

            <button 
                className='btn btn-secondary' 
                style={{ width: '100%' }}
                onClick={joinRoom}
            >
            Join Room
            </button>

        </div>
        </div>
    );
};

export default Home;