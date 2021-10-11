import React from 'react';
import {
	Box,
	TextField,
	Button,
	Grid,
	Hidden,
	CircularProgress,
} from '@material-ui/core';
import Logo from '../assets/logo.png';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { base_url } from '../app.json';
import { useHistory } from 'react-router';
import AppContext from '../utils/AppContext';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100vh',
		fontFamily: 'Arial Rounded MT Bold',
		fontWeight: 'normal',
		color: '#000000',
		backgroundColor: '#FFFFFF',
	},
	form: {
		'& > *': {
			marginBlock: theme.spacing(1),
			width: '100%',
		},
	},
}));
function Homepage() {
	const classes = useStyles();
	const history = useHistory();
	const { contextVariables, setContextVariables } = React.useContext(AppContext);

	const [loadingState, setLoadingState] = React.useState(false);

	// Formik settings
	const formik = useFormik({
		initialValues: {
			latitude: '',
			longitude: '',
			radius: '',
			searchElement: '',
		},
		validationSchema: Yup.object({
			latitude: Yup.string().required('Latitude is required'),
			longitude: Yup.string().required('Longitude is required'),
			radius: Yup.number().typeError('Only numbers are allowed'),
			searchElement: Yup.string().required('Search element is required'),
		}),
		onSubmit: (values) => {
			executeSearch(values);
		},
		enableReinitialize: true,
	});

	const executeSearch = async (values) => {
		try {
			setLoadingState(true);

			const response = await axios.post(`${base_url}/searchAPI`, values);
			setLoadingState(false);

			history.push({
				pathname: '/searchResults',
				state: { apiResponse: response.data, searchQuery: values },
			});
		} catch (error) {
			setLoadingState(false);

			setContextVariables({
				...contextVariables,
				snackbarOptions: {
					...contextVariables.snackbarOptions,
					open: true,
					type: 'error',
					message: "Couldn't retrieve results",
				},
			});
		}
	};

	return (
		<div className={classes.root}>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='50vh'
			>
				<Hidden smDown>
					<img
						src={Logo}
						alt='Find it'
						style={{
							height: 'auto',
							width: '40vw',
							// flexGrow: 1,
						}}
					/>
				</Hidden>
				<Hidden mdUp>
					<img
						src={Logo}
						alt='Find it'
						style={{
							height: 'auto',
							width: '60vw',
							// flexGrow: 1,
						}}
					/>
				</Hidden>
			</Box>
			<Box
				style={{
					paddingInline: '5vw',
				}}
			>
				<Grid container spacing={2}>
					<Grid item lg={4} md={4} sm={12} xs={12}>
						<TextField
							label='Search Element'
							variant='outlined'
							required
							type='text'
							fullWidth
							inputProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							InputLabelProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
									color: 'rgba(25, 118, 210, 0.5)',
								},
							}}
							FormHelperTextProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							id='searchElement'
							name='searchElement'
							placeholder='What your are searching for?'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.searchElement || ''}
							error={formik.touched.searchElement && formik.errors.searchElement}
							helperText={
								formik.touched.searchElement &&
								formik.errors.searchElement &&
								formik.errors.searchElement
							}
						/>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<TextField
							label='Latitude'
							variant='outlined'
							required
							type='text'
							fullWidth
							inputProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							InputLabelProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
									color: 'rgba(25, 118, 210, 0.5)',
								},
							}}
							FormHelperTextProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							id='latitude'
							name='latitude'
							placeholder="Location's latitude"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.latitude || ''}
							error={formik.touched.latitude && formik.errors.latitude}
							helperText={
								formik.touched.latitude &&
								formik.errors.latitude &&
								formik.errors.latitude
							}
						/>
					</Grid>
					<Grid item lg={3} md={3} sm={12} xs={12}>
						<TextField
							label='Longitude'
							variant='outlined'
							required
							type='text'
							fullWidth
							inputProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							InputLabelProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
									color: 'rgba(25, 118, 210, 0.5)',
								},
							}}
							FormHelperTextProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							id='longitude'
							name='longitude'
							placeholder="Location's longitude"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.longitude || ''}
							error={formik.touched.longitude && formik.errors.longitude}
							helperText={
								formik.touched.longitude &&
								formik.errors.longitude &&
								formik.errors.longitude
							}
						/>
					</Grid>
					<Grid item lg={2} md={2} sm={12} xs={12}>
						<TextField
							label='Range'
							variant='outlined'
							// required
							type='number'
							fullWidth
							inputProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							InputLabelProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
									color: 'rgba(25, 118, 210, 0.5)',
								},
							}}
							FormHelperTextProps={{
								style: {
									fontFamily: 'Arial Rounded MT Bold',
								},
							}}
							id='radius'
							name='radius'
							placeholder='Search radius'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.radius || ''}
							error={formik.touched.radius && formik.errors.radius}
							helperText={
								formik.touched.radius && formik.errors.radius && formik.errors.radius
							}
						/>
					</Grid>
				</Grid>
			</Box>

			<Box
				display='flex'
				justifyContent='center'
				paddingTop='40px'
				paddingBottom='40px'
			>
				<Button
					onClick={loadingState === false ? formik.handleSubmit : () => void 0}
					variant='contained'
					style={{
						width: 200,
						height: 60,
						borderRadius: 10,
						fontFamily: 'Arial Rounded MT Bold',
						fontSize: 18,
						color: '#FFFFFF',
						backgroundColor: '#1976D2',
						textTransform: 'none',
					}}
				>
					{loadingState ? (
						<CircularProgress
							size={20}
							style={{
								color: '#FFFFFF',
							}}
						/>
					) : (
						<>Search</>
					)}
				</Button>
			</Box>
		</div>
	);
}

export default Homepage;
