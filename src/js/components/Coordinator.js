import React, {Component}  from 'react';
import '../../css/App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {scroller} from '../scripts/scroller.js';
import * as topojson from "topojson-client";
import Tooltip from './Tooltip.js';

export default class Coordinator extends Component {
	constructor(props){
	  super(props);

    this.state = {
      currSpellerData: null,

    };
  }


  componentDidMount() {


    
    const that = this
    const {profileimages, data, us} = this.props
    const margin = {top: 25, bottom: 25, right: 25, left: 25}

    const lengthDict = d3.nest()
      .key(function(d) { return d['appearances']; })
      .rollup(function(v) { return v.length; })
      .entries(data)

    const ringDict = {0:1.2, 1:1.2, 2:1.2, 3:1.2, 4:1.2}

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
    const swarmScalePlX = d3.scaleLinear()
    const swarmScalePlY = d3.scaleLinear()
    const swarmScaleAgeX = d3.scaleLinear()
    const swarmScaleAgeY = d3.scaleLinear()


    const appearanceScale = d3.scaleSqrt()
    const appearanceScale2 = d3.scaleSqrt()

    const placementScale = d3.scaleLinear()
    const ageScale = d3.scaleLinear()

    let path = d3.geoPath();

    /*let tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .on("click",function(){
        tooltip.style("visibility",null);
      });*/


    
    
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

        gEnter.append('g').attr('class', 'g-axis')



        gEnter.append("g").attr("class", "states")

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
          .range([ringsize/2, ringsize/40])

        radiusScale
          .domain([0,4])
          .range([ringsize/100,ringsize/150])

        console.log(chartHeight)
        appearanceScale
          .domain([0, 4])
          .range([chartHeight/300,chartHeight/80]) 

        appearanceScale2
          .domain([1, 4])
          .range([4,15]) 

        swarmScalePlX
          .domain(d3.extent(data, d => d['placement_x']))
          .range([chartWidth/2 - (d3.mean(data, d => d['placement_x']) - d3.min(data, d => d['placement_x'])), chartWidth/2 + (d3.mean(data, d => d['placement_x'])  - d3.min(data, d => d['placement_x']))])

        swarmScalePlY
          .domain(d3.extent(data, d => d['placement_y']))
          .range([0, chartHeight])


        swarmScaleAgeX
          .domain(d3.extent(data, d => d['age_x']))
          .range([chartWidth/2 - (d3.mean(data, d => d['age_x']) - d3.min(data, d => d['age_x'])), chartWidth/2 + (d3.mean(data, d => d['age_x'])  - d3.min(data, d => d['age_x']))])

        swarmScaleAgeY
          .domain(d3.extent(data, d => d['age_y']))
          .range([0, chartHeight])

        
        placementScale
          .domain([300,50,25,10,0])
          .range([chartHeight, chartHeight*3/4, chartHeight/2, chartHeight/4, 0])

        
        ageScale  
          .domain(d3.extent(data, d => d['age']))
          .range([chartHeight, 0])
  

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

        let node = nodes.selectAll(".node")
          .data(data)

        node.exit().remove()
        if (cut == "bee") {
          simulation.stop()
          const ring = rings.selectAll(".ring")
            .data([])
          ring.exit().remove()
          
       
  
          node
            .enter()
            .append("circle")
            .attr("class", "node") 
            .attr("opacity", 0)
          .merge(node)
            .attr("cx", d => beeScaleX(d['beex']))
            .attr("cy", d => beeScaleY(d['beey']))
            .on("mouseover", d => {
              const tooltip = d3.select(".tooltip")

              that.setState({currSpellerData: d})
              tooltip
              .style("visibility","visible")
              .style("top",function(d){ 
                const height = tooltip.node().getBoundingClientRect().height
                console.log(height)
                if (d3.event.clientY + height + 20 >= window.innerHeight) {
                  return (d3.event.clientY - height - 20) +"px"
                } else {
                  return (d3.event.clientY + 20) +"px"
                } 
                
                
              })
              .style("left",function(d){
                 const width =  tooltip.node().getBoundingClientRect().width
                if (d3.event.clientX + width + 20 >= window.innerWidth) {
                  return (d3.event.clientX - width - 20) +"px"
                } else {
                  return (d3.event.clientX + 20) +"px"
                }
              })
            })
            /*.on("mouseout", d => {
              d3.select(".tooltip")
              .style("visibility","hidden")

            })*/
            .transition()
            .duration(1000)
            .attr("r", d => beesize/300)
            .attr("opacity", 1)

            
        } else if (cut == "zero") {
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,1))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
         .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)

          simulation.nodes(data)
            .force("charge", d3.forceCollide().radius(d => radiusScale(d['appearances']) * 1.5))
            .force("r", d3.forceRadial(radialScale(0)).strength(0.1))
            .on("tick", ticked)
            .alpha(1)
            .restart()

          node
            .transition()
            .duration(500)
            .attr("r", d => radiusScale(d['appearances']))

        } else if (cut == "one") {
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,2))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
          .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
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
            .strength(0.1))
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
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
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
            .strength(0.1))
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
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
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
            .strength(0.1))
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
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)

          let node = nodes.selectAll(".node")
            .data(data)

          node.exit().remove()
          node
            .enter()
            .append("circle")
            .attr("class", "node")
          .merge(node)
            .attr("r", d => radiusScale(d['appearances']))

          simulation.nodes(data)
            .force("r", d3.forceRadial(d => radialScale(d['appearances'])).strength(0.1))
            .alpha(1)
            .restart()


        } else if (cut == "placements") {
          simulation.stop()
          const ring = rings.selectAll(".ring")
            .data([])
          ring.exit().remove()

         
            //.data()

          const middle = g.selectAll(".middle-line")
            .data([data])
          
          middle.exit().remove()
          middle
            .enter()
            .append("line")
            .attr("class", "middle-line")
          .merge(middle)
            .attr("x1", chartWidth/2)
            .attr("x2", chartWidth/2)
            .attr('y1', 0)
            .attr("y2", chartHeight)

        
          let node = nodes.selectAll(".node")
            .data(data.filter(d => d['best_placement'] != null))
          node.exit().remove()
          node
            .enter()
            .append("circle")
            .attr("class", "node")
          .merge(node)
            .transition()
            .duration(1000)
            .attr("r", d => appearanceScale2(d['appearances']))
            .attr("cx", d => {  return swarmScalePlX(d['placement_x'])})
            .attr("cy", d => {  return swarmScalePlY(d['placement_y'])})

          d3.select("g-axis").call(d3.axisLeft(placementScale)
            .tickValues([500,100,10,5,3,2,1]))
            .attr("class", "intro-ranking-axis")



        } else if (cut == "age") {
          let node = nodes.selectAll(".node")
            .data(data)
          node.exit().remove()
          node
            .enter()
            .append("circle")
            .attr("class", "node")
          .merge(node)
            .transition()
            .duration(1000)
            .attr("r", d => appearanceScale(d['appearances']))
            .attr("cx", d => {  return swarmScaleAgeX(d['age_x'])})
            .attr("cy", d => {  return swarmScaleAgeY(d['age_y'])})
          


        } else if (cut == "map") {
          console.log(map)

          const states = svg.select(".states")
          states
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path")
            .attr("d", path);

        states.append("path")
            .attr("class", "state-borders")
            .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
        }




        function ticked() {
          d3.selectAll(".node")
            .attr("cx", d => d['appearances'] == 4 && cut == "four" ? d.x + chartWidth/2 + radialScale(4) : d.x + chartWidth/2)
            .attr("cy", d => d['appearances'] == 4 && cut == "four" ? d.y + chartHeight/2 - radialScale(4)/2 : d.y + chartHeight/2) 
            .attr("r", d => radiusScale(d['appearances']))   
        }

        function ticked2() {
          d3.selectAll(".node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
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
              return i === index ? 0.8 : 0.1;
          } else {
            return i === index ? 1 : 0.1;
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
    let tooltip
    const {currSpellerData, tooltipStyle} = this.state
    if (this.state.currSpellerData != null) {

        tooltip = <Tooltip data={currSpellerData} tooltipStyle={tooltipStyle} />
      } else {

        tooltip = <Tooltip tooltipStyle={tooltipStyle} />
      }
    return <div className="coordinator">
      {tooltip}
    </div>
  }
}

