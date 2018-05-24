
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
    const {profileimages, data} = this.props
    const margin = {top: 25, bottom: 25, right: 25, left: 25}

    let chart = coordinatorchart()
    const el = d3.select('.coordinator')
    let width = 0
    let height = 0
    let chartWidth = 0
    let chartHeight = 0
    
    function resize() {
      //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
      /*let width
      if (window.innerWidth > 700) {
        width = 700
      } else {
        width = window.innerWidth
      }*/
      console.log(ReactDOM.findDOMNode(that).clientHeight)
      console.log(ReactDOM.findDOMNode(that).clientWidth)
      const width = window.innerWidth > 1000 ? 1000 : window.innerWidth
      const height = window.innerHeight
      chart.width(width).height(height)
      el.call(chart)
    }

    function coordinatorchart() {
      function enter({ container, data }) {
      }
      function updateDom({ container, data }) {
      }

      function chart(container) {
        const data = container.datum()
        enter({ container, data })
        updateDom({ container, data })

      }

      chart.width = function(...args) {
        if (!args.length) return width
        width = args[0]
        chartWidth = width - margin.left - margin.right
        return chart
      }

      chart.height = function(...args) {
        if (!args.length) return height
        height = args[0]
        chartHeight = height - margin.top - margin.bottom
        return chart
      }
      return chart

    }
    function init() {

    

      //resize()
   
      el.datum(data)
      resize()


      window.addEventListener('resize', resize)
      //graphic.select('.slider input').on('input', handleInput)
    }



    init()
    function bee() {

    }

    function one() {

    }

    function two() {

    }

    function three() {

    }

    function four() {

    }

    function placements() {

    }

    function age() {

    }

    function map() {

    }


    const activateFunctions = [];
    for (var i = 0; i < d3.selectAll('#sections1 .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[0] = bee;
    activateFunctions[1] = one;
    activateFunctions[2] = two;
    activateFunctions[3] = three;
    activateFunctions[4] = four;
    activateFunctions[5] = placements;
    activateFunctions[6] = age;
    activateFunctions[7] = map;


    var scroll = scroller()
      .container(d3.select('#graphic1'));

    scroll(d3.selectAll('#sections1 .step'), 'scroller1');

    scroll.on('active', function (index) {
      // highlight current step text
      d3.selectAll('#sections1 .step')
        .style('opacity', function (d, i) {
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600) {
              return i === index ? 0.8 : 0.8;
          } else {
            return i === index ? 1 : 1;
          }
        });
        activate(index);

    })

     function activate(index) {

      that.setState({activeIndex: index});
      var sign = (that.state.activeIndex - that.state.lastIndex) < 0 ? -1 : 1;
      var scrolledSections = d3.range(that.state.lastIndex + sign, that.state.activeIndex + sign, sign);
      scrolledSections.forEach(function (i) {
        activateFunctions[i]();
      });
      that.setState({lastIndex: that.state.activeIndex});
    };


    window.addEventListener('scroll', (event) => {
      const divRect = ReactDOM.findDOMNode(this).parentNode.parentNode.getBoundingClientRect();
      const topoffset = divRect.top + window.pageYOffset
      const bottomoffset = divRect.bottom + window.pageYOffset
      if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", true)
      } else {
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_fixed", false)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_unfixed", true)
        d3.select(ReactDOM.findDOMNode(this).parentNode).classed("is_bottom", false)
      }
    })

  }


  render() {
    return <div className="coordinator">
    </div>
  }
}

