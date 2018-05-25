
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

    const lengthDict = d3.nest()
      .key(function(d) { return d['appearances']; })
      .rollup(function(v) { return v.length; })
      .entries(data)
  
    console.log(data)
    console.log(lengthDict)



    let chart = coordinatorchart()
    const el = d3.select('.coordinator')
    
    let width = 0
    let height = 0
    let chartWidth = 0
    let chartHeight = 0
    let beesize = 0
    let ringsize = 0
    const scaleDown = 1

    const radius = 3
    let simulation = d3.forceSimulation()
    let cut 
    let calculated = false
    let counter = 0

    const beeScaleX = d3.scaleLinear()
    const beeScaleY = d3.scaleLinear()
    const radialScale = d3.scaleSqrt()
    const radiusScale = d3.scalePow().exponent(2)
    const offsetScale = d3.scaleLinear()

    
    
    function resize() {
      //const sz = Math.min(el.node().offsetWidth, window.innerHeight) * 0.9
      /*let width
      if (window.innerWidth > 700) {
        width = 700
      } else {
        width = window.innerWidth
      }*/
      //console.log(window.innerHeight)
      const width = window.innerWidth > 1000 ? ReactDOM.findDOMNode(that).clientWidth : window.innerWidth
      const height = window.innerHeight
      chart.width(width).height(height)
      beesize = Math.min(chartWidth, chartHeight)
      ringsize = beesize * 0.8

      console.log("beesize: " + beesize)
      
      el.call(chart)
    }

    function translate(x, y) {
      return `translate(${x}, ${y})`
    }


    function coordinatorchart() {
      function enter({ container, data }) {
        const svg = container.selectAll('svg').data([data])
        const svgEnter = svg.enter().append('svg').attr("class", "servesvg")
        const gEnter = svgEnter.append('g')
        gEnter.append("g").attr("class", "nodes")
        gEnter.append("g").attr("class", "rings")

        const axis = gEnter.append('g').attr('class', 'g-axis')
        axis.append('g').attr('class', 'axis-x')

        axis.append('g').attr('class', 'axis-y')

      }

      function updateScales({ data }) {    
        const offset = Math.abs(chartHeight - chartWidth) / 2
        beeScaleX
          .domain(d3.extent(data, d => d['beex']))
          .range(chartWidth < chartHeight ? [0, beesize] : [offset, chartWidth-offset])

        
        beeScaleY
          .domain(d3.extent(data, d => d['beey']))
          .range(chartHeight < chartWidth ? [0, beesize] : [offset, chartHeight-offset])

        radialScale
          .domain([0, 4])
          .range([ringsize/2, 10])

        radiusScale
          .domain([0,4])
          .range([ringsize/100,ringsize/200])

        offsetScale
          .domain([600,300])
          .range([1.1,1.2])

      }

      function updateDom({ container, data }) {
        const svg = container.select('svg')

        svg
          .attr('width', width)
          .attr('height', height)


        const g = svg.select('g')

        g.attr('transform', translate(margin.left, margin.top))

        const nodes = g.select(".nodes")
        const rings = g.select(".rings")

        /*simulation = d3.forceSimulation(data)
          .force('charge', d3.forceManyBody().strength(5))
          .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
          .force('collision', d3.forceCollide().radius(function(d) {
            return 3
          }))
          .on('tick', ticked)

        console.log(data)

        simulation.nodes(data)
           .on('tick', ticked)*/
        let node = nodes.selectAll(".node")
          .data(data)

        node.exit().remove()
        console.log(cut)
        if (cut == "bee") {
          simulation.stop()
          node
            .enter()
            .append("circle")
            .attr("class", "node")
         
          .merge(node)

            .transition()
            .duration(1000)
            .attr("r", d => beesize/300)
            .attr("cx", d => beeScaleX(d['beex']))
            .attr("cy", d => beeScaleY(d['beey']))
        } else if (cut == "zero") {
          
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,1))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i))
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)

          simulation.nodes(data)
            .force("charge", d3.forceCollide().radius(d => radiusScale(d['appearances']) * 1.5))
            .force("r", d3.forceRadial(radialScale(0)).strength(0.05))
            .on("tick", ticked)
            .alpha(1)
            .restart()

        } else if (cut == "one") {
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,2))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i))
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)

          simulation.nodes(data)
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 1) {
                return radialScale(1)
              } else {
                return radialScale(d['appearances'])
              }
            })
            .strength(0.05))
            .alpha(1)
            .restart()


        } else if (cut == "two") {
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,3))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i))
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)

          simulation.nodes(data)
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 2) {
                return radialScale(2)
              } else {
                return radialScale(d['appearances'])
              }
            })
            .strength(0.05))
            .alpha(1)
            .restart()

            
        } else if (cut == "three") {
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,4))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i))
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
          simulation.nodes(data)
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 3) {
                return radialScale(3)
              } else {
                return radialScale(d['appearances'])
              }
            })
            .strength(0.05))
            .alpha(1)
            .restart()

        } else if (cut == "four") {

          const ring = rings.selectAll(".ring")
            .data(lengthDict)
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i))
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
          
    

          

        }



        function ticked() {
          console.log("ticking")
          //console.log(counter)
          counter += 1
          if (counter >= 300) {
            calculated = true
          }


          if (cut != "four") {
            node
              .attr("cx", function(d){ return d.x + chartWidth/2; })
              .attr("cy", function(d){ return d.y + chartHeight/2; })
              .attr("r", d => radiusScale(d['appearances']))
          } else {

            console.log(node
             .filter(d => d['appearances'] != 4))
            node
             .filter(d => d['appearances'] != 4)
              .attr("cx", function(d){ return d.x + chartWidth/2; })
              .attr("cy", function(d){ return d.y + chartHeight/2; })
              .attr("r", d => radiusScale(d['appearances']))

            node
              .filter(d => d['appearances'] == 4)
              .transition()
              .duration(1000)
              .attr("cx", chartWidth/2)
              .attr("cy", chartHeight/2)

          }
          

          
          
        }
      }

      

      function chart(container) {
        const data = container.datum()
        enter({ container, data })
        updateScales({ container, data })
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

      chart.cut = function(...args) {
        cut = args[0]
        return chart
      }


      return chart

    }

    function init() {

    

      //resize()
   
      el.datum(data)
      resize()
      bee()

      window.addEventListener('resize', resize)
      //graphic.select('.slider input').on('input', handleInput)
    }



    init()
    function bee() {
      console.log("getting inside bee")
      chart.cut("bee")
      el.call(chart)

    }
    function zero() {
      console.log("getting inside zero")
      chart.cut("zero")
      el.call(chart)

    }
    function one() {
      console.log("getting inside one")
      chart.cut("one")
      el.call(chart)

    }

    function two() {
      console.log("getting inside two")
      chart.cut("two")
      el.call(chart)

    }

    function three() {
      console.log("getting inside three")
      chart.cut("three")
      el.call(chart)

    }

    function four() {
      console.log("getting inside four")
      chart.cut("four")
      el.call(chart)

    }

    function placements() {
      console.log("getting inside placements")
      chart.cut("placements")
      el.call(chart)

    }

    function age() {
      console.log("getting inside age")
      chart.cut("age")
      el.call(chart)

    }

    function map() {
      chart.cut("map")
      el.call(chart)

    }


    const activateFunctions = [];
    for (var i = 0; i < d3.selectAll('#sections1 .step').size(); i++) {
      activateFunctions[i] = function () {};
    }
    activateFunctions[0] = bee;
    activateFunctions[1] = zero;
    activateFunctions[2] = one;
    activateFunctions[3] = two;
    activateFunctions[4] = three;
    activateFunctions[5] = four;
    activateFunctions[6] = placements;
    activateFunctions[7] = age;
    activateFunctions[8] = map;


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

