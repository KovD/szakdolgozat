import Header from './assets/header/header.jsx';
import Body from './assets/page/page.jsx'
import "./assets/webpage.css"

function App() {
    return (
        <div>
            <Header />
            <div id="body">
                <Body></Body>
            </div>
        </div>
    );
}

export default App;