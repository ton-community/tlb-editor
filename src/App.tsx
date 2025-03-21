import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';
import { AppContextProvider } from '@/context/AppContext';

import { Footer } from './components/Footer';

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
