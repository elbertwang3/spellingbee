import React, {Component}  from 'react';
import '../../css/App.css';
import legend from 'd3-svg-legend';
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
    const originaldata = data
    const margin = {top: 50, bottom: 50, right: 25, left: 25}

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

    const beeScaleX = d3.scaleLinear()
    const beeScaleY = d3.scaleLinear()
    const radialScale = d3.scaleSqrt()
    const offsetScale = d3.scaleLinear()



    const appearanceScale = d3.scaleSqrt()

    const placementScale = d3.scaleLinear()
    const ageScale = d3.scaleLinear()

    let path = d3.geoPath();

    let prevCut 
    const annos = ["everyone", "at least one appearance", "two", "three", "four"]
    d3.select(".tooltip")
      .on("click",function(){
        d3.select(this).style("visibility","hidden");
      });


    
    
    function resize() {
      const width = window.innerWidth > 1000 ? ReactDOM.findDOMNode(that).clientWidth : window.innerWidth
      const height = window.innerHeight
      chart.width(width).height(height)
      beesize = Math.min(chartWidth, chartHeight)
      ringsize = beesize * 0.9


      
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
        gEnter.append("g").attr("class", "annotations")
        const axis = gEnter.append('g').attr('class', 'g-axis')

        axis.append("text")
          .text("Best placement")
          .attr("class", "axis-annotation")
          .attr("transform", `translate(0, -10)`)




        const legendg = gEnter.append("g")
          .attr("class", "legendSize")
          

        legendg.append("text")
          .attr("class", "legend-annotation")
          .attr("transform", `translate(0,-10)`)
          .text("Number of previous bees")
          .attr("text-anchor", "start")


        




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

        appearanceScale
          .domain([0,1, 4])
          .range([chartHeight/300,chartHeight/150,chartHeight/50]) 

        
        placementScale
          .domain([300,50,25,10,1])
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
        const annotations = g.select(".annotations")
        const axis = g.select(".g-axis")
          .attr("transform",`translate(${chartWidth/3}, 0)`)
        const states = svg.select(".states")
        const legendg = g.select(".legendSize")
          .attr("transform", `translate(${chartWidth*2.75/4}, ${chartHeight*3/4})`)
        let node = nodes.selectAll(".node")
          .data(data, d => d['speller_number'])

        node.exit().remove()
        if (cut == "bee") {
      
          states.selectAll(".state-path")
            .attr("opacity", 0)

          axis.attr("opacity", 0)
          legendg.attr("opacity", 0)
  

          if (prevCut == "map") {
            node
            .enter()
            .append("circle")
            .attr("class", "node") 
            .attr("opacity", 0)
          .merge(node)
            .on("mouseover", d => {
              mouseOverEvents(d)
            })
            .on("mouseout", d => {
              d3.select(".tooltip")
              .style("visibility","hidden")

            })
            .transition()
            .duration(1000)
            .attr("cx", d => beeScaleX(d['beex']))
            .attr("cy", d => beeScaleY(d['beey']))
            .attr("r", d => beesize/300)
            .attr("opacity", 1)

          } else {
            node
              .enter()
              .append("circle")
              .attr("class", "node") 
              .attr("opacity", 0)
            .merge(node)
              .attr("cx", d => beeScaleX(d['beex']))
              .attr("cy", d => beeScaleY(d['beey']))
              .on("mouseover", d => {
                mouseOverEvents(d)
              })
              .on("mouseout", d => {
                d3.select(".tooltip")
                .style("visibility","hidden")
              })
              .transition()
              .duration(1000)
              .attr("r", d => beesize/300)
              .attr("opacity", 1)

          }

            
        } else if (cut == "zero") {

          states.selectAll(".state-path")
            .attr("opacity", 0)

          d3.selectAll(".node")
            .classed("selected", false)
          d3.selectAll(".node")
            .classed("unselected", false)

          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,1))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("opacity", 0)
         .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          const annotation = annotations.selectAll(".annotation")
            .data(annos.slice(0,1))
          annotation.exit().remove()
          annotation
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("opacity", 0)
          .merge(annotation)
            .text(d => d)
            .attr("x", chartWidth/2)
            .attr("y", (d, i) => {
              return chartHeight/2 - radialScale(i) * ringDict[i]
            })
            .transition()
            .duration(1000)
            .attr("opacity", 1)


          simulation.nodes(data)
            .force("charge", d3.forceCollide().radius(d => ringsize/100 * 1.5))
            .force("r", d3.forceRadial(radialScale(0)))
            .on("tick", ticked)
            .on('end', null)
            .alpha(1)
            .restart()

          /*node
            .transition()
            .duration(500)
            .attr("r", ringsize/100)*/

        } else if (cut == "atman") {
          states.selectAll(".state-path")
            .attr("opacity", 0)
          d3.selectAll(".node")
            .filter(d => d['fullname'] == "BalakrishnanAtman")
            .classed("selected", true)

          d3.selectAll(".node")
            .filter(d => d['fullname'] != "BalakrishnanAtman")
            .classed("unselected", true)

          

        } else if (cut == "one") {
          d3.selectAll(".node")
            .classed("selected", false)
          d3.selectAll(".node")
            .classed("unselected", false)

          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,2))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("opacity", 0)
          .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          const annotation = annotations.selectAll(".annotation")
            .data(annos.slice(0,2))
          annotation.exit().remove()
          annotation
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("opacity", 0)
          .merge(annotation)
            .text(d => d)
            .attr("x", chartWidth/2)
            .attr("y", (d, i) => chartHeight/2 - radialScale(i) * ringDict[i])
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          simulation
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 1) {
                return radialScale(1)
              } else {
                return radialScale(d['appearances'])
              }
            }))
            .on('tick', ticked)
            .on('end', null)
            .alpha(1)
            .restart()


        } else if (cut == "two") {
          states.selectAll(".state-path")
            .attr("opacity", 0)
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,3))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("opacity", 0)
          .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          const annotation = annotations.selectAll(".annotation")
            .data(annos.slice(0,3))
          annotation.exit().remove()
          annotation
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("opacity", 0)
          .merge(annotation)
            .text(d => d)
            .attr("x", chartWidth/2)
            .attr("y", (d, i) => chartHeight/2 - radialScale(i) * ringDict[i])
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          simulation
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 2) {
                return radialScale(2)
              } else {
                return radialScale(d['appearances'])
              }
            }))
            .on('tick', ticked)
            .on('end', null)
            .alpha(1)
            .restart()

            
        } else if (cut == "three") {
          states.selectAll(".state-path")
            .attr("opacity", 0)
          const ring = rings.selectAll(".ring")
            .data(lengthDict.slice(0,4))
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("opacity", 0)
          .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          const annotation = annotations.selectAll(".annotation")
            .data(annos.slice(0,4))
          annotation.exit().remove()
          annotation
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("opacity", 0)
          .merge(annotation)
            .text(d => d)
            .attr("x", chartWidth/2)
            .attr("y", (d, i) => chartHeight/2 - radialScale(i) * ringDict[i])
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          simulation
            .force("r", d3.forceRadial(d => {
              if (d['appearances'] >= 3) {
                return radialScale(3)
              } else {
                return radialScale(d['appearances'])
              }
            }))
            .on('tick', ticked)
            .on('end', null)
            .alpha(1)
            .alphaDecay(0.0228)
            .restart()

        } else if (cut == "four") {
          axis.attr("opacity", 0)
          legendg.attr("opacity", 0)
          const ring = rings.selectAll(".ring")
            .data(lengthDict)
          ring.exit().remove()
          ring
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("opacity", 0)
          .merge(ring)
            .attr("r", (d,i) => radialScale(i) * ringDict[i])
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2)
            .transition()
            .duration(1000)
            .attr("opacity", 1)

          const annotation = annotations.selectAll(".annotation")
            .data(annos.slice(0,5))
          annotation.exit().remove()
          annotation
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("opacity", 0)
          .merge(annotation)
            .text(d => d)
            .attr("x", chartWidth/2)
            .attr("y", (d, i) => chartHeight/2 - radialScale(i) * ringDict[i])
            .transition()
            .duration(1000)
            .attr("opacity", 1)


          if (prevCut == "placements") {
            simulation.stop()
            
            data.forEach(d => {
              d.x = Math.floor(Math.random() * chartWidth) - chartWidth/2;
              d.y = Math.floor(Math.random() * chartHeight) - chartHeight/2;
            })

            node = nodes.selectAll(".node")
              .data(data, d => d['speller_number'])
            node.exit().remove()
            node
              .enter()
              .append("circle")
              .attr("class", "node")  
            .merge(node)
              //.attr("cx", chartWidth/2)
              //.attr("cy", chartHeight/2)
             
              .on("mouseover", d => {
                mouseOverEvents(d)
              })
              .on("mouseout", d => {
                d3.select(".tooltip")
                .style("visibility","hidden")

            })
            simulation
              .nodes(data)
              .force("charge", d3.forceCollide().radius(d => ringsize/100 * 1.5))
              .force("r", d3.forceRadial(d => radialScale(d['appearances'])))
              .force("x", null)
              .force("y", null)
              .force("collide", null)
              .on("tick", ticked)
              .on('end', end)
              .alpha(1)
              .restart()

          } else {
            simulation
              .force("r", d3.forceRadial(d => radialScale(d['appearances'])))
              .on('end', end)
              .alpha(1)
              .alphaDecay(1)
              .restart()

          }
        } else if (cut == "placements") {
          states.selectAll(".state-path")
            .attr("opacity", 0)

          const legendSize = legend.legendSize()
            .scale(appearanceScale)
            .shape('circle')
            .shapePadding(15)
            .labelOffset(10)
            .labelFormat(d3.format("d"))
            .orient('vertical');

          legendg
            .attr("opacity", 1)
            .call(legendSize);


          simulation.stop()
          const ring = rings.selectAll(".ring")
            .data([])
          ring.exit().remove()

          const annotation = annotations.selectAll(".annotation")
            .data([])
          annotation.exit().remove()

          


          const placementOnly = data.filter(d => d['best_placement'] != null)
          let node = nodes.selectAll(".node")
            .data(placementOnly, d => d['speller_number'])
          node.exit().remove()


          simulation.nodes(placementOnly)
            .force("collide", d3.forceCollide(d => appearanceScale(d['appearances']) + 1))
            .force("r", null)
            .force("charge", null)
            .force("x", d3.forceX(d => chartWidth/2).strength(1))
            .force("y", d3.forceY(d => placementScale(d['best_placement'])).strength(1))
            .on('end', null)
            .alpha(1)
            .alphaDecay(0.0228)
            //.restart()
            .stop()


          for (var i = 0; i < 300; ++i) simulation.tick();

          node
            .enter()
            .append("circle")
          .merge(node)
            .transition()
            .duration(1000)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => appearanceScale(d['appearances']))


          axis.select(".axis-annotation")
            .text("Best placement")

          axis.attr("opacity", 1).transition()
          .duration(1000).call(d3.axisLeft(placementScale)
            .tickValues([300,50,25,10,1]))

          axis.select("path")
            .remove()



        } else if (cut == "age") {
          states.selectAll(".state-path")
            .attr("opacity", 0)
          

          simulation.nodes(data)
            .force("charge", null)
            .force("collide", d3.forceCollide(d => appearanceScale(d['appearances']) + 1))
            .force("r", null)
            .force("x", d3.forceX(d => chartWidth/2).strength(1))
            .force("y", d3.forceY(d => ageScale(d['age'])).strength(1))
            .on('end', null)
            .alpha(1)
            .alphaDecay(0.05)
            .stop()

          for (var i = 0; i < 150; ++i) simulation.tick();

          let node = nodes.selectAll(".node")
            .data(data, d => d['speller_number'])
          node.exit().remove()
          node
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("opacity", 0)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
          .merge(node)
            .on("mouseover", d => {
                mouseOverEvents(d)
            })
            .on("mouseout", d => {
              d3.select(".tooltip")
              .style("visibility","hidden")

            })
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => appearanceScale(d['appearances']))

          

          axis.select(".axis-annotation")
            .text("Age")

          axis.attr("opacity", 1).transition()
          .duration(1000).call(d3.axisLeft(ageScale)
            .tickValues([8,9,10,11,12,13,14,15])
              .tickFormat(d3.format("d")))

          axis.select("path")
            .remove()
          


        } else if (cut == "map") {
          simulation.stop()
          const ring = rings.selectAll(".ring")
            .data([])
          ring.exit().remove()


          const annotation = annotations.selectAll(".annotation")
            .data([])
          annotation.exit().remove()

          const projection = d3.geoAlbersUsa()
            .scale(width*1.25)
            .translate([chartWidth / 2, chartHeight / 2]);
          path.projection(projection)
        

          const state = states.selectAll(".state-path")
            .data(topojson.feature(us, us.objects.states).features)
          state.exit().remove()
          state
            .enter()
            .append("path")
            .attr("class", "state-path")
         
            .attr("opacity", 0)
          .merge(state)
            .attr("d", path)
            .transition()
            .duration(1000)
            .attr("opacity", 1)
    
          d3.select(".nodes").moveToFront()
        
          
          d3.selectAll(".node")
            .attr("opacity", d => projection([d['longitude'], d['latitude']]) == null ? 0 : 0.7)
            .transition()
            .duration(1000)
            
            .attr("r", d => beesize/300)
            .attr("cx", function(d) { 
              if (projection([d['longitude'], d['latitude']]) != null) {
                return projection([d['longitude'], d['latitude']])[0]
              }
            })
            .attr("cy", function(d) { 
              if (projection([d['longitude'], d['latitude']]) != null) {
                return projection([d['longitude'], d['latitude']])[1]
              }
            })
        }

        function mouseOverEvents(d) {
          const tooltip = d3.select(".tooltip")

          that.setState({currSpellerData: d})
          tooltip
          .style("visibility","visible")
          .style("top",function(d){ 
            const height = tooltip.node().getBoundingClientRect().height

            if (d3.event.clientY + height + 20 >= window.innerHeight) {
              return (d3.event.clientY - height - 20) +"px"
            } else {
              return (d3.event.clientY + 20) +"px"
            } 
            
            
          })
          .style("left",function(d){
            const width =  tooltip.node().getBoundingClientRect().width
            const sectionswidth = document.getElementById("sections1").getBoundingClientRect().width
            if (window.innerWidth > 1000) {


              if (d3.event.clientX + width + 20 >= window.innerWidth) {
                return (d3.event.clientX - sectionswidth - width - 20) +"px"
              } else {
                return (d3.event.clientX - sectionswidth + 20) +"px"
              }
            } else {
              if (d3.event.clientX + width + 20 >= window.innerWidth) {
                return (d3.event.clientX - width - 20) +"px"
              } else {
                return (d3.event.clientX + 20) +"px"
              }

            }
          })

        }


        function ticked() {
          d3.selectAll(".node")
            .attr("cx", d => d.x + chartWidth/2)
            .attr("cy", d => d.y + chartHeight/2) 
            .attr("r", ringsize/100)
            .attr("opacity", 1)
        }

        function end() {
          d3.selectAll(".node")
            .filter(d => d['appearances'] == 4)
            .transition()
            .duration(500)
            .attr("cx", chartWidth/2)
            .attr("cy", chartHeight/2) 
            .attr("r", ringsize/100)

        }

        d3.selection.prototype.moveToFront = function() {  
          return this.each(function(){
            this.parentNode.appendChild(this);
          });
        };
        d3.selection.prototype.moveToBack = function() {  
            return this.each(function() { 
                var firstChild = this.parentNode.firstChild; 
                if (firstChild) { 
                    this.parentNode.insertBefore(this, firstChild); 
                } 
            });
        };
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
        prevCut = cut
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
      chart.cut("bee")
      el.call(chart)

    }
    function zero() {
      chart.cut("zero")
      el.call(chart)

    }

    function atman() {
      chart.cut("atman")
      el.call(chart)

    }
    function one() {
      chart.cut("one")
      el.call(chart)

    }

    function two() {
      chart.cut("two")
      el.call(chart)

    }

    function three() {
      chart.cut("three")
      el.call(chart)

    }

    function four() {
      chart.cut("four")
      el.call(chart)

    }

    function placements() {
      chart.cut("placements")
      el.call(chart)

    }

    function age() {
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
    activateFunctions[1] = map;
    activateFunctions[2] = zero;
    activateFunctions[3] = atman
    activateFunctions[4] = one;
    activateFunctions[5] = two;
    activateFunctions[6] = three;
    activateFunctions[7] = four;
    activateFunctions[8] = placements;
    activateFunctions[9] = age;


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

