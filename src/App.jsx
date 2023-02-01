import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import {ImSpinner8} from "react-icons/im";
import {
	IoMdCloudy,
	IoMdSunny,
	IoMdRainy,
	IoMdSnow,
	IoMdThunderstorm,
	IoMdSearch,
	IoMdSave,
	IoMdSettings
} from "react-icons/io";
import {BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind} from "react-icons/bs";
import {TbTemperatureCelsius} from "react-icons/tb";
import useStoredState from "./hooks/useLocalStorage";

// api key
const APIkey = '0e9958e2b884dfcb13ba8fe52d9710dd'

export const App = () => {
	const [data, setData] = useState(null)
	const [location, setLocation] = useState('Sevastopol')
	const [inputValue, setInputValue] = useState('')
	const [animate, setAnimate] = useState(false)
	const [loading, setLoading] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')
	const [city, setCity] = useState([])
	const [items, setItems] = useStoredState('cities', [location]);
	const [toogle, setToggle] = useState(false)


	const handleToggle = (e) => {
		e.preventDefault()
		setToggle(!toogle)
	}

	// const handleAddClick = (e) => {
	// 	e.preventDefault()
	// 	setItems((items) => [...items, location]);
	// };

	// const handleCities = () => {
	// const cities = JSON.parse(localStorage.getItem('cities') || '[]');
	// 	const cityObj = {
	// 		city: location
	// 	}
	// 	cities.push(cityObj)
	// 	localStorage.setItem('cities', JSON.stringify(cities))
	// }


	const handleInput = (e) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if(inputValue !== ''){
			setLocation(inputValue)
		}
		const input = document.querySelector('input')

		// if(input.value === ''){
		// 	setAnimate(true)
		// 	setTimeout(() => {
		// 		setAnimate(false)
		// 	}, 500)
		// }
		input.value = '';
	}

	useEffect(() => {
		setLoading(true)
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}&units=metric`
		axios.get(url)
				.then(res => {
					setTimeout(() => {
						setData(res.data)
						// setCity(handleCities)
						setLoading(false)
					},1500)
				}).catch(error => {
					setLoading(false)
			setErrorMsg(error)
		})
	}, [location])

	//errors
	useEffect(() => {
		const timer = setTimeout(() => {
			setErrorMsg('')
		}, 2000)
		return () => clearTimeout(timer)
	}, [errorMsg])

	// if data not OK
	if (!data) {
		return <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
			<ImSpinner8 className='text-5xl animate-spin text-white'/>
		</div>
	}

	//set icon
	let icon
	switch (data.weather[0].main) {
		case 'Clouds':
			icon = <IoMdCloudy/>
			break
		case 'Haze':
			icon = <BsCloudHaze2Fill/>
			break
		case 'Rain':
			icon = <IoMdRainy className='text-[#31cafb]'/>
			break
		case 'Clear':
			icon = <IoMdSunny className='text-[#ffde33]'/>
			break
		case 'Drizzle':
			icon = <BsCloudDrizzleFill className='text-[#31cafb]'/>
			break
		case 'Snow':
			icon = <IoMdSnow className='text-[#31cafb]'/>
			break
		case 'Thunderstorm':
			icon = <IoMdThunderstorm/>
			break
		default:
			icon = 'Icon can`t load, sorry'
	}

	const date = new Date()

	return (
			<div
					className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
				{errorMsg && <div
				className='max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md'
				>{`${errorMsg.response.data.message}`}</div>}
				<form className={` ${animate ? 'animate-shake' : ''} h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
					<div className='h-full relative flex items-center justify-between p-2'>
						<input
								onChange={handleInput}
								className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full' type="text" placeholder='Search by City or Country'/>
						<button
								onClick={handleSubmit}
								className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'>
							<IoMdSearch className='text-2xl text-white '/>
						</button>
						<button
								// onClick={handleAddClick}
								className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'>
							<IoMdSave className='text-2xl text-white '/>
						</button>
						<button
								onClick={handleToggle}
								className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'>
							<IoMdSettings className='text-2xl text-white '/>
						</button>
					</div>
				</form>

				<div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
					{loading ? <div className='w-full h-full flex justify-center items-center '>
								<ImSpinner8 className='text-white text-5xl animate-spin'/>
					</div>
							:
							<div>
								<div className='flex items-center gap-x-5 '>
									<div className='text-[87px] '>{icon}</div>
									<div className='text-2xl font-semibold '>{data.name}, {data.sys.country}</div>
									<div>{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getFullYear()}</div>
								</div>
								<div className='my-20 '>
									<div className='flex justify-center items-center'>
										<div className='text-[144px] leading-none font-light'>{Math.round(data.main.temp)}</div>
										<div className='text-4xl'>
											<TbTemperatureCelsius/>
										</div>
									</div>
									{/*	description*/}
									<div className='capitalize text-center'>{data.weather[0].description}</div>
								</div>
								{toogle
										?
										<div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
											<div className='flex justify-between'>
												<div className='flex items-center gap-x-2'>
													<div className='text-[20px]'>
														<BsEye/>
													</div>
													<div>
														Visibility: <span className='ml-2'>{data.visibility / 1000} km</span>
													</div>
												</div>
												<div className='flex items-center gap-x-2'>
													<div className='text-[20px]'>
														<BsThermometer/>
													</div>
													<div className='flex'>
														Feels like:
														<div className='flex ml-2'>{parseInt(data.main.feels_like)}
															<TbTemperatureCelsius/>
														</div>
													</div>
												</div>
											</div>
											<div className='flex justify-between'>
												<div className='flex items-center gap-x-2'>
													<div className='text-[20px]'>
														<BsWater/>
													</div>
													<div>
														Humidity: <span className='ml-2'>{data.main.humidity} %</span>
													</div>
												</div>
												<div className='flex items-center gap-x-2'>
													<div className='text-[20px]'>
														<BsWind/>
													</div>
													<div>
														Wind: <span className='ml-2'>{data.wind.speed} m/s</span>
													</div>
												</div>
											</div>
											<div className='flex justify-between max-w-[100px]'>

												{/*{<h2 className={'ml-5'} onClick={()=> { setLocation(items[items.length-1])}}>{items}</h2>}*/}
											</div>
										</div>
										: null
								}
							</div>
					}

				</div>
			</div>
	)
			;
}


