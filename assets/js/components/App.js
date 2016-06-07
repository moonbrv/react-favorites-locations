// import libraries
import React from 'react';
import GMaps from 'gmaps';

//import components
import Search from './Search';
import Map from './Map';
import CurrentLocation from './CurrentLocation';
import LocationList from './LocationList';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		let favorites = [];
		if(localStorage.favorites){
			favorites = JSON.parse(localStorage.favorites);
		}
		this.state = {
				favorites: favorites,
				currentAddress:'Киев, Украина, 02000',
				mapCoordinates: {
					lat: 50.4501,
					lng: 30.523400000000038
				}
		}
	}

	addToFavorites = (address) => {
		let favorites = this.state.favorites;
		favorites.push({
			address: address,
			timestamp: Date.now()
		});
		this.setState({
			favorites: favorites
		});
		localStorage.favorites = JSON.stringify(favorites);
	}

	removeFromFavorites = (address) => {
		let favorites = this.state.favorites;
		let index = -1;
		for (let i = 0; i < favorites.length; i++) {
			if (favorites[i].address == address) {
				index = i;
				break;
			}
		}
		if (index !== -1) {
			favorites.splice(index, 1);
			this.setState({
				favorites: favorites
			});
			localStorage.favorites = JSON.stringify(favorites);
		}
	}

	toggleFavorite = (address) => {
		if (this.isAddressInFavorites(address)) {
			this.removeFromFavorites(address);
		} else {
			this.addToFavorites(address);
		}
	}

	isAddressInFavorites = (address) => {
		let favorites = this.state.favorites;
		for (let i = 0; i < favorites.length; i++) {
			if (favorites[i].address == address) {
				return true;
			}
		}
		return false
	}

	searchForAddress = (address) => {
		let self = this;
		GMaps.geocode({
			address: address,
			callback: (result, status) => {
				if (status !== 'OK') {
					return;
				}
				let latlng = result[0].geometry.location;
				self.setState({
					currentAddress: result[0].formatted_address,
					mapCoordinates: {
						lat: latlng.lat(),
						lng: latlng.lng()
					}
				});
			}
		});
	}

	render() {
		return (
			<div>
				<h1>Enter the name of your favourite location</h1>
				<Search onSearch={this.searchForAddress} />
				<Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />

				<CurrentLocation address={this.state.currentAddress} 
				favorite={this.isAddressInFavorites(this.state.currentAddress)} 
				onFavoriteToggle={this.toggleFavorite} />

				<LocationList locations={this.state.favorites} 
				activeLocationAddress={this.state.currentAddress} 
				onClick={this.searchForAddress} />
			</div>
		)
	}
}