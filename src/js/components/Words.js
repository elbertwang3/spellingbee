import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {scroller} from '../scripts/scroller.js';


export default class Coordinator extends Component {
	constructor(props){
	  super(props);

    this.state = {
      

    };
  }


  componentDidMount() {
  	const that = this
    const {data} = this.props
    console.log(data)
    const list = d3.select(".word-list")
    const word = list.selectAll(".word-li")
    	.data(data.slice(1000))
    word.exit().remove()
    word
    	.enter()
    	.append("li")
    	.attr("class", "word-li")
    .merge(word)
    	.text(d => d['correct_spelling'])
    	



  }


  render() {
    return <div className="words">
    	<ul className="word-list"></ul>
    </div>
  }
}