import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@material-ui/core';
import { KeyboardArrowDown } from '@material-ui/icons';
import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import AppContext from '../utils/AppContext';
import * as Yup from 'yup';
import { base_url } from '../app.json';

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

function SearchResult(props) {
	const classes = useStyles();
	const { contextVariables, setContextVariables } = React.useContext(AppContext);

	const { searchResults, nextPageToken } = props.location.state.apiResponse;
	const { latitude, longitude, radius, searchElement } =
		props.location.state.searchQuery;

	const [resultState, setResultState] = React.useState({
		searchResults,
		nextPageToken,
	});

	const [loadingState, setLoadingState] = React.useState(false);

	// Formik settings
	const formik = useFormik({
		initialValues: {
			latitude: latitude,
			longitude: longitude,
			radius: radius,
			searchElement: searchElement,
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
			setResultState({
				searchResults: response.data.searchResults,
				nextPageToken: response.data.nextPageToken,
			});
			window.scrollTo({
				top: document.getElementById('search-results').offsetTop,
				behavior: 'smooth',
			});
			setLoadingState(false);
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

	const loadNextSet = async () => {
		try {
			setLoadingState(true);
			const response = await axios.post(`${base_url}/searchAPI/next`, {
				nextPageToken: resultState.nextPageToken,
			});
			setResultState({
				searchResults: response.data.searchResults,
				nextPageToken: response.data.nextPageToken,
			});

			window.scrollTo({
				top: document.getElementById('search-results').offsetTop,
				behavior: 'smooth',
			});
			setLoadingState(false);
		} catch (error) {
			setLoadingState(false);

			setContextVariables({
				...contextVariables,
				snackbarOptions: {
					...contextVariables.snackbarOptions,
					open: true,
					type: 'warning',
					message: "Couldn't get more results",
				},
			});
		}
	};

	return (
		<div className={classes.root}>
			<Box
				style={{
					paddingInline: '5vw',
					paddingBlock: 20,
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
					<Grid item lg={2} md={2} sm={12} xs={12}>
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
					<Grid item lg={2} md={2} sm={12} xs={12}>
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
					<Grid item lg={2} md={2} sm={12} xs={12}>
						<Button
							onClick={loadingState === false ? formik.handleSubmit : () => void 0}
							variant='outlined'
							style={{
								width: 200,
								height: 55,
								borderRadius: 10,
								fontFamily: 'Arial Rounded MT Bold',
								fontSize: 18,
								// color: '#FFFFFF',
								color: '#1976D2',
								textTransform: 'none',
							}}
						>
							{loadingState ? (
								<CircularProgress
									size={20}
									style={{
										color: '#1976D2',
									}}
								/>
							) : (
								<>Search</>
							)}
						</Button>
					</Grid>
				</Grid>
			</Box>
			<Divider
				style={{
					marginInline: '3vw',
				}}
				variant='middle'
			/>
			<Box
				style={{
					paddingTop: 30,
					paddingBottom: 61,
					paddingInline: '3vw',
					fontSize: 30,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
				id='search-results'
			>
				<span>Search Results</span>
				<Button
					variant='outlined'
					style={{
						color: '#1976D2',
						backgroundColor: '#FFFFFF',
						textTransform: 'none',
					}}
					endIcon={<KeyboardArrowDown />}
				>
					options
				</Button>
			</Box>
			<Box
				style={{
					paddingInline: '3vw',
					paddingBottom: 40,
				}}
			>
				{resultState.searchResults?.length > 0 ? (
					<>
						<TableContainer
							component={Paper}
							style={{
								marginBottom: 40,
								fontFamily: 'Arial Rounded MT Bold',
							}}
						>
							<Table sx={{ minWidth: 650, fontFamily: 'Arial Rounded MT Bold' }}>
								<TableHead>
									<TableRow>
										<TableCell
											style={{
												fontFamily: 'Arial Rounded MT Bold',
												fontSize: 17,
											}}
										>
											Business Name
										</TableCell>
										<TableCell
											style={{
												fontFamily: 'Arial Rounded MT Bold',
												fontSize: 17,
											}}
										>
											Address
										</TableCell>
										<TableCell
											style={{
												fontFamily: 'Arial Rounded MT Bold',
												fontSize: 17,
											}}
										>
											Rating
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{resultState.searchResults.map((business) => (
										<TableRow key={business.place_id}>
											<TableCell
												style={{
													fontFamily: 'Calibri',
													fontSize: 15,
												}}
											>
												{business.name}
											</TableCell>
											<TableCell
												style={{
													fontFamily: 'Calibri',
													fontSize: 15,
												}}
											>
												{business.formatted_address}
											</TableCell>
											<TableCell
												style={{
													fontFamily: 'Calibri',
													fontSize: 15,
												}}
												align='center'
											>
												{business.rating}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
						{nextPageToken && (
							<Box display='flex' justifyContent='center'>
								<Button
									variant='contained'
									onClick={loadingState === false ? () => loadNextSet() : () => void 0}
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
										<>Next</>
									)}
								</Button>
							</Box>
						)}
					</>
				) : (
					<span>No result found</span>
				)}
			</Box>
		</div>
	);
}

export default SearchResult;
