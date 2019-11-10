import React from 'react';
import RichDocument from './components/RichDocument';
import './css/app.css';

class App extends React.Component {
    render() {
        return (
        <div className = "App">
            <RichDocument></RichDocument>
        </div>
        );
    }
}

export default App;