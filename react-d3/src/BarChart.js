import React, { Component } from 'react'
import * as d3 from "d3"; 


export default class BarChart extends Component {
  constructor(props){
    super(props);

    this._rootNode = React.createRef();

    this.data = [];

    this.onRezize = this.onRezize.bind(this);
  }

  onRezize(){
    this.update(
      this._rootNode,
      this.data,
      this.props.config,
      this._chart
   );
  }

  componentDidMount() {
    window.addEventListener("resize", this.onRezize);

    this.getData((data) => {
      this.data = data;

      this._chart = this.create(
        this._rootNode,
        this.data
      );
    })
    
  }

  componentDidUpdate() {
    this.getData((data) => {
      this.data = data;

      this.update(
        this._rootNode,
        this.data,
        this.props.config,
        this._chart
     );
    })
  } 

  componentWillUnmount() {
    window.removeEventListener("resize", this.onRezize);
    this.destroy(this._rootNode);
  }

  render() {
    return (
      <div id="line-chart" style={{"width": "100%","height": "500px"}} ref={this._rootNode} />
    )
  }

  getData(callback){
    d3.tsv("/data/data.tsv")
        .then(function(data) {
            callback(data);
        });
  }

  create(el, data){
    const formatPercent = d3.format(".0%");
    const rect = d3.select(el.current).node().getBoundingClientRect();
    
    let width = rect.width;
    let height = rect.height;
    let padding = 20;
    let realWidth = width - (padding * 2)
    let realHeight = height - (padding * 2)
    let barsHeight = realHeight / 2;
    let svg = d3.select("#line-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding + ")")
    
    svg.append("rect")
            .attr("width", realWidth)
            .attr("height", realHeight)
            .attr("x", 0)
            .attr("y", 0)
            .attr("fill", '#cdcdcd');

    var maxValue = d3.max(data, function(d){ return d.value });
    var minValue = d3.min(data, function(d){ return d.value });

    let yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .rangeRound([3*realHeight/4, realHeight/4]);

    let xScale = d3.scaleBand()
        .domain(data.map(function (d) {
            return d.letter;
        }))
        .rangeRound([padding, realWidth-padding])
        .padding(0.1);

    let colorScale = d3.scaleOrdinal(d3.schemeAccent)

    let xAxis = d3.axisBottom(xScale);

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(formatPercent);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 3*realHeight/4 + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append("rect")
        .attr('class', 'bar')
        .attr('x', function(d) { return xScale(d.letter); })
        .attr('y', function(d) { 
            return yScale(d.value); 
        })
        .attr('width', xScale.bandwidth())
        .attr('height', function(d) { return (3*realHeight/4) - yScale(d.value); })
        .style("fill", function(d,i) { return colorScale(i) });
  }

  update(el){
    this.destroy(el);
    this._chart = this.create(
      this._rootNode,
      this.data
    );
  }

  destroy(el){
    d3.select(el.current).select('.no-results').remove();
    d3.select(el.current).select('svg').remove();
  }
}
