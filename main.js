async function getData() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    if(response.ok) {
      const dataSet = await response.json();
      dataSet.forEach(data => {
        const parseTime = data['Time'].split(':');
        data['ParseTime'] = new Date(2000, 01, 01, 00, parseTime[0], parseTime[1]);
      });
      const h = 600;
      const w = 900;
      const padding = 50;
      const svg = d3.select('#svg-container')
        .append('svg')
        .attr('width', w)
        .attr('height', h);
      const tooltip = d3.select('#svg-container')
              .append('div')
              .attr('id', 'tooltip')
              .attr('class', 'bar');
      const xScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d.Year - 1), d3.max(dataSet, d => d.Year + 1)])
        .range([padding, w - padding]);
      const yScale = d3.scaleTime()
        .domain([d3.min(dataSet, d => d.ParseTime), d3.max(dataSet, d => d.ParseTime)])
        .range([padding, h - padding]);


      svg.selectAll('circle')
        .data(dataSet)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.Year))
        .attr('cy', d => yScale(d.ParseTime))
        .attr('r', 7)
        .attr('fill', d => d.Doping === '' ? 'Orange' : 'DodgerBlue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => d.ParseTime)
        .on('mouseover', (d, i) => {
          console.log(true);
          tooltip.style('left', xScale(d.Year) + 'px')
            .style('top', yScale(d.ParseTime) + 'px')
            .style('opacity', 0.9)
            .attr('data-year', d.Year)
            .html(`${d.Name}: ${d.Nationality}</br>Year: ${d.Year}, Time: ${d.Time}</br></br>${d.Doping}`)
        })
        .on('mouseout', (d, i) => {
          tooltip.style('opacity', 0);
        });

      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S"));

      svg.append('g')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
        .attr('id', 'x-axis')
        .call(xAxis);

      svg.append('g')
        .attr('transform', 'translate(' + padding + ', 0)')
        .attr('id', 'y-axis')
        .call(yAxis);

      const legends = svg.append('g')
        .attr('id', 'legend')
        .attr('font-size', 10)
        .selectAll('g')
        .data(['Orange', 'DodgerBlue'])
        .enter()
        .append('g')
        .attr('transform', (d, i) => 'translate(0 , ' + (h / 2 - i * 20) +')');

      legends.append('text')
        .text(d => (d === 'Orange' ? 'No' : 'Riders with') + ' doping allegations')
        .style('text-anchor', 'end')
        .attr('x', w - padding - 15 - 10);
      legends.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', w - padding - 15)
        .attr('y', -10)
        .attr('fill', d => d);

    }
  } catch (error) {
    console.log(error);
  }
}

getData();
