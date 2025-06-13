import { Outlet } from 'react-router-dom';

import { Footer } from './components/Footer';

import { Header } from '@/components/Header';
import { AppContextProvider } from '@/context/AppContext';

function App() {
    return (
        <AppContextProvider>
            <Header />
            <Outlet />
            <Footer />
        </AppContextProvider>
    );
}

export default App;
