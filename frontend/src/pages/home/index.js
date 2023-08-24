import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import EnglishLogo from './images/english.png'


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
            <h1>{`RosettaChat`}</h1>
            
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
                <option value='English'> English</option>
                <option value='Mandarin Chinese'>Mandarin Chinese</option>
                <option value='Traditional Chinese'>Traditional Chinese</option>
                <option value='French'>French</option>
                <option value='Spanish'>Spanish</option>
                <option value='Arabic'>Arabic</option>
                <option value='Hindi'>Hindi</option>
                <option value='Portuguese'>Portuguese</option>
                <option value='Russian'>Russian</option>
                <option value='Japanese'>Japanese</option>
                <option value='Korean'>Korean</option>
                <option value='German'>German</option>
                <option value='Turkish'>Turkish</option>
                <option value='Vietnamese'>Vietnamese</option>
                <option value='Italian'>Italian</option>
                <option value='Thai'>Thai</option>
                <option value='Ukrainian'>Ukrainian</option>
                <option value='Urdu'>Urdu</option>
                <option value='Dutch'>Dutch</option>
                <option value='Danish'>Danish</option>
                <option value='Swedish'>Swedish</option>
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