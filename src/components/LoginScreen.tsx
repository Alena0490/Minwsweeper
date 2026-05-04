import './LoginScreen.css';
import Logo from '../img/logo.webp';

interface LoginScreenProps {
    onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
    return (
        <div className='login-screen-backdrop'>
            <div className='login-screen'>
                <div className='login-title'>
                    <h2>Log On to Windows</h2>
                </div>

                <div className='login-logos'>
                    <div className='copy'>
                        <span>Copyright &copy; 1985-2005</span>
                        <span>Microsoft Corporation</span>
                    </div>

                    <div className='logo'>
                        <img src={Logo} className='xp-logo' alt='' aria-hidden='true' />
                        <span className='tm'>™</span>
                        <p className='top'>Microsoft</p>
                        <p className='mid'>Microsoft<sup className='reg-mark'>®</sup><span>xp</span></p>
                        <p className='bottom'>Professional x32 Edition</p>
                    </div>

                    <span className='company'>Microsoft</span>
                </div>

                <div className='login-body'>
                    <span className='log-user'>
                        <label htmlFor='user'>User name:</label>
                        <input 
                            type='text' 
                            id='user' 
                            defaultValue='Alena' 
                            readOnly 
                        />
                    </span>
                    <span className='password'>
                        <label htmlFor='password'>Password:</label>
                        <input 
                            type='password' 
                            id='password' 
                            defaultValue='1234' 
                            readOnly 
                        />
                    </span>
                    <div className='login-buttons'>
                        <button
                            type='button'
                            onClick={onLogin}
                            className='xp-default-btn'
                        >
                            OK
                        </button>
                        <button
                            type='button'
                            disabled
                            title='Not available in this demo'
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            disabled
                            title='Not available in this demo'
                        >
                            Shut Down...
                        </button>
                        <button
                            type='button'
                            disabled
                            title='Not available in this demo'
                        >
                            Options &lt;&lt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;