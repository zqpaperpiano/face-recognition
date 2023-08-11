import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './icons8-brain-100.png';

const Logo = () => {
    return(
        <div className='ma4 mt0 '>
             <Tilt className='br2 shadow-2 tilt'>
                <div className="pa3">
                    <img 
                    style={{paddingTop: '10px'}}
                    src={brain} alt="brain" />
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;