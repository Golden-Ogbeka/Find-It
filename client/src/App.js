import './App.css';
import React from 'react';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchResult from './pages/SearchResult';
import { AppBar, Box, IconButton, Snackbar, Toolbar } from '@material-ui/core';
import AppContext from './utils/AppContext';
import LogoAlt from './assets/logo-alt.png';

function App() {
	const [contextVariables, setContextVariables] = React.useState({
		snackbarOptions: { open: false, type: 'error', message: '' },
	});

	const toggleSnackbar = () =>
		setContextVariables({
			...contextVariables,
			snackbarOptions: {
				...contextVariables.snackbarOptions,
				open: !contextVariables.snackbarOptions.open,
			},
		});

	return (
		<AppContext.Provider value={{ contextVariables, setContextVariables }}>
			<BrowserRouter>
				{/* Navbar */}
				<AppBar
					position='static'
					style={{
						backgroundColor: '#1976D2',
						boxShadow: 'none',
					}}
				>
					<Toolbar>
						<Box flexGrow='1'>
							<Link to='/'>
								<img
									src={LogoAlt}
									alt='Find it'
									style={{
										height: 30,
										width: 'auto',
										// flexGrow: 1,
									}}
								/>
							</Link>
						</Box>

						<h4
							style={{
								fontFamily: 'Arial Rounded MT Bold',
								fontWeight: 'lighter',
								fontSize: 12,
								margin: 0,
							}}
						>
							by Golden Ogbeka
						</h4>
					</Toolbar>
				</AppBar>
				<Switch>
					<Route path='/' component={Homepage} exact />
					<Route path='/searchResults' component={SearchResult} exact />
				</Switch>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					autoHideDuration={5000}
					open={contextVariables.snackbarOptions.open}
					onClose={toggleSnackbar}
					action={
						<IconButton
							size='small'
							aria-label='close'
							color='inherit'
							onClick={toggleSnackbar}
						>
							<Close fontSize='small' />
						</IconButton>
					}
				>
					<Alert
						onClose={toggleSnackbar}
						severity={contextVariables.snackbarOptions.type}
						variant='filled'
					>
						{contextVariables.snackbarOptions.message}
					</Alert>
				</Snackbar>
			</BrowserRouter>
		</AppContext.Provider>
	);
}

export default App;
