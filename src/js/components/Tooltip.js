import React, {Component}  from 'react';
import '../../css/App.css';

export default class Tooltip extends Component {
	constructor(props){
	  super(props);
	  this.state = {
	  	style: this.props.tooltipStyle
	  }

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  	this.setState({style: nextProps.tooltipStyle})
  	//console.log(this.state)

  }


	render() {
		//console.log(this.props.data)
		
		if (this.props.data == null) {
			return <div className="tooltip">
			</div>
		} else {
			const {firstname, lastname, age, image_url, school_name, display_city, display_state, display_name, fav_word, previous_bees, speller_number} = this.props.data
			return <div className="tooltip">
				<div className="photo">
					<img className="clip-circle" src={image_url} alt={{speller_number}.png}></img>
				</div>
				<div className="content">
					<div className="spellernumber">Speller No. {speller_number}</div>
					<div className="tooltip-header"> {firstname} {lastname}, {age}</div>
					<div className="sponsor">{display_name}</div>
					
					<div className="hometown">hometown: {display_city}, {display_state}</div>
					{/*<div className="age">age: {age}</div>
					<div className="school">school: {school_name}</div>*/}
					<div className="word">favorite word: {fav_word}</div>
					<div className="previous">previous bees: {previous_bees}</div>

				</div>
			</div>

		}
	}
}
