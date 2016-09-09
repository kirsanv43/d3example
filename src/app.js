import * as d3 from "d3";
import _ from 'lodash';
import './style/main.scss';

var data = {
    '2016-08-30': {
        'dau': 50,
        'nau': 7
    },
    '2016-08-31': {
        'dau': 51,
        'nau': 20
    },
    '2016-09-01': {
        'dau': 60,
        'nau': 15
    },
    '2016-09-02': {
        'dau': 71,
        'nau': 19
    },
    '2016-09-03': {
        'dau': 57,
        'nau': 16
    },
    '2016-09-23': {
        'dau': 22,
        'nau': 16
    }
};


export default class App {
    constructor(width, height, padding, formatDate) {
        this.width = width || 1000;
        this.height = height || 500;
        this.padding = padding || 100;
        this.formatDate = formatDate || d3.timeFormat('%Y-%m-%d');
        const self = this;
        const dates = _.keys(data).map(item => new Date(item));
        this.mappedData = _.map(data, (item, key) => {
            return {
                date: new Date(key),
                ...item
            };
        });

        var minDate = _.min(dates);
        var maxDate = _.max(dates);

        var yRange = _.transform(this.mappedData, function(result, n) {
            result.push(n.dau);
            result.push(n.nau);
        }, []);

        var minDau = _.min(yRange);
        var maxDau = _.max(yRange);

        this.xScale = d3.scaleTime()
            .domain([minDate, maxDate]).nice()
            .range([100, this.width]);

        this.yScale = d3.scaleLinear()
            .domain([minDau, maxDau])
            .range([this.height - this.padding - 10, 0]);

        this.axisX = d3.axisBottom(this.xScale)
            .ticks(dates.length)
            .tickFormat(this.formatDate);

        this.axisY = d3.axisLeft(this.yScale);

        this.lineDau = d3.line()
            .x(function(d) {
                return self.xScale(d.date);
            })
            .y(function(d) {
                return self.yScale(d.dau);
            });
        this.lineNau = d3.line()
            .x(function(d) {
                return self.xScale(d.date);
            })
            .y(function(d) {
                return self.yScale(d.nau);
            });

        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden")
            .text("a simple tooltip");
    }

    renderDau() {
      this.svg.append("path")
          .attr("class", "line")
          .attr("transform", "translate(-33,10)")
          .attr("d", this.lineDau(this.mappedData));

    }
    renderNau() {
      this.svg.append("path")
          .attr("class", "line")
          .attr("transform", "translate(-33,10)")
          .attr("d", this.lineNau(this.mappedData));
          this.renderPoint((d) => {
            return this.yScale(d.nau);
          })
    }

    renderPoint(cy) {
      const self = this;
      return this.svg.selectAll("dot")
          .data(self.mappedData)
          .enter().append("circle")
          .attr("r", 5)
          .attr("class", "point")
          .attr("transform", "translate(-33,10)")
          .style('opacity', 0)
          .attr("cx", function(d) {
              return self.xScale(d.date);
          })
          .attr("cy", cy)
          .on("mouseover", function(d) {
              d3.select(this).style('opacity', 1);
              self.tooltip.html('<div><div> Dau: ' + d.dau + '</div><div> Nau: ' + d.nau + '</div><div> Date: ' + self.formatDate(d.date) + '</div></div>')
              return self.tooltip.style("visibility", "visible");
          })
          .on("mousemove", function() {
              return self.tooltip.style("top",
                  (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
          })
          .on("mouseout", function() {
              d3.select(this).style('opacity', 0);
              return self.tooltip.style("visibility", "hidden");
          });
    }

    render(id) {
      const self = this;
        this.svg = d3.select(id).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.svg.selectAll("dot")
            .data(self.mappedData)
            .enter().append("circle")
            .attr("r", 5)
            .attr("class", "point")
            .attr("transform", "translate(-33,10)")
            .style('opacity', 0)
            .attr("cx", function(d) {
                return self.xScale(d.date);
            })
            .attr("cy", function(d) {
                return self.yScale(d.dau);
            })
            .on("mouseover", function(d) {
                d3.select(this).style('opacity', 1);
                self.tooltip.html('<div><div> Dau: ' + d.dau + '</div><div> Nau: ' + d.nau + '</div><div> Date: ' + self.formatDate(d.date) + '</div></div>')
                return self.tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return self.tooltip.style("top",
                    (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).style('opacity', 0);
                return self.tooltip.style("visibility", "hidden");
            });

        this.renderDau();
        this.renderNau();



        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height - this.padding) + ")")
            .call(this.axisX);

        this.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this.padding + ",10)")
            .call(this.axisY);
    }
}
