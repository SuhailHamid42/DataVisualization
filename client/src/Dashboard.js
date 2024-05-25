import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (dataPoints.length > 0) {
      renderBarChart(dataPoints, 'intensity');
      renderBarChart(dataPoints, 'likelihood');
      renderBarChart(dataPoints, 'relevance');
      renderLineChart(dataPoints, 'start_year');
    }
  }, [dataPoints]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://blackcoffer-kunc.onrender.com/api/data', {
        params: filters
      });
      setDataPoints(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const renderBarChart = (data, key) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(`#${key}-bar-chart`).selectAll('*').remove();

    const svg = d3
      .select(`#${key}-bar-chart`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.title))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d[key])]).nice().range([height, 0]);

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.title))
      .attr('y', d => y(d[key]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[key]))
      .attr('fill', 'steelblue');

    svg.append('g').call(d3.axisLeft(y));
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  };

  const renderLineChart = (data, key) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(`#${key}-line-chart`).selectAll('*').remove();

    const svg = d3
      .select(`#${key}-line-chart`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.title))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d[key])]).nice().range([height, 0]);

    const line = d3
      .line()
      .x(d => x(d.title))
      .y(d => y(d[key]))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(data).attr('fill', 'none').attr('stroke', 'steelblue').attr('stroke-width', 2).attr('d', line);

    svg.append('g').call(d3.axisLeft(y));
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  };

  return (
    <div className="container">
      <h1>Data Visualization Dashboard</h1>
      <div className="filters">
        {[
          { label: 'End Year', name: 'end_year', type: 'number' },
          { label: 'Topic', name: 'topic', type: 'text' },
          { label: 'Sector', name: 'sector', type: 'text' },
          { label: 'Region', name: 'region', type: 'text' },
          { label: 'PESTLE', name: 'pestle', type: 'text' },
          { label: 'Source', name: 'source', type: 'text' },
          { label: 'SWOT', name: 'swot', type: 'text' },
          { label: 'Country', name: 'country', type: 'text' },
          { label: 'City', name: 'city', type: 'text' }
        ].map((filter, index) => (
          <div className="filter" key={index}>
            <label>{filter.label}</label>
            <input
              type={filter.type}
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
            />
          </div>
        ))}
      </div>

      <div className="charts">
        <div id="intensity-bar-chart" className="chart"></div>
        <div id="likelihood-bar-chart" className="chart"></div>
        <div id="relevance-bar-chart" className="chart"></div>
        <div id="start_year-line-chart" className="chart"></div>
      </div>

      <div className="data-points">
        <h2>Detailed Data Points</h2>
        <ul>
          {dataPoints.map((dataPoint, index) => (
            <li key={index}>
              <h3>{dataPoint.title}</h3>
              <p>Topic: {dataPoint.topic}</p>
              <p>Start Year: {dataPoint.start_year}</p>
              <p>End Year: {dataPoint.end_year}</p>
              <p>Intensity: {dataPoint.intensity}</p>
              <p>Likelihood: {dataPoint.likelihood}</p>
              <p>Relevance: {dataPoint.relevance}</p>
              <p>Sector: {dataPoint.sector}</p>
              <p>Region: {dataPoint.region}</p>
              <p>Country: {dataPoint.country}</p>
              <p>City: {dataPoint.city}</p>
              <p>Published: {new Date(dataPoint.published).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
