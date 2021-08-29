let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req = new XMLHttpRequest()

let baseTemp
let data = []

let xScale
let yScale

let width = 1000
let height = 600
let padding = 60

let minYear
let maxYear
let numberOfYears = maxYear - minYear

let tooltip = d3.select('#tooltip')
    .text('hi');

let svg = d3.select("svg")
svg.attr("width", width)
svg.attr("height", height)

let genScales = () => {
  
   minYear = d3.min(data,(d)=>d['year'])
   maxYear = d3.max(data,(d)=>d['year'])
  
  xScale= d3.scaleLinear()
            .range([padding,width-padding])
            .domain([minYear,maxYear+1])
            
            
 
  yScale = d3.scaleTime()
             .domain([new Date(0,0,0,0,0,0,0),new Date (0,12,0,0,0,0,0)])
             .range([padding,height-padding])
  
             
}

let drawBlocks = () => {
  
  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("class","cell")
     .attr("fill", (d)=>{
      variance = d['variance']
      if(variance <= -1){
        return "#76a5a6"
      } else if (variance <= 0){
        return "#dbd39a"
      } else if (variance <= 1){
        return "#dbc19a"
      } else {
        return "#db9a9a"
      }
  })
      .attr("data-year", (d)=>(d['year']))
      .attr("data-month", (d)=>(d['month'])-1)//js runs months from 0 to 11 not from 1 to 12 apparently 
      .attr("data-temp", (d)=>{
            return baseTemp + d['variance']})
      .attr("height",((height - (2*padding))/12))
      .attr("y",(d)=>{
            return yScale(new Date(0,d['month']-1,0,0,0,0,0))
  })
      .attr("width",(d)=>{
    numberOfYears = maxYear - minYear
    return ((width - (2*padding))/numberOfYears)
  })
      .attr("x",(d)=>{
    return xScale(d['year'])
  })
      .on("mouseover", (d)=>{
          tooltip.transition()
               .style("visibility","visible")
          tooltip.text(d['year'])
          tooltip.attr("data-year",(d['year']))
        
  })
  .on("mouseout",(d)=>{
    tooltip.transition()
           .style("visibility","hidden")})
}

let drawAxis = () => {
  
   let xAxis = d3.axisBottom(xScale)
                 .tickFormat(d3.format('d'))
     
   svg.append('g')
     .call(xAxis)
     .attr("id","x-axis")
     .attr("transform","translate(0 ," + (height-padding) + ")")
     
  
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%B'))
  svg.append('g')
     .call(yAxis)
     .attr("id","y-axis")
     .attr("transform","translate(" + padding + ",0)")

}

req.open("GET", url, true)
req.onload = () => {
let object = JSON.parse(req.responseText)
    baseTemp = object["baseTemperature"]
    data = object["monthlyVariance"]
    genScales()
    drawBlocks()
    drawAxis()
}
req.send()