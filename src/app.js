import * as d3 from "d3";
import './style/main.scss';


export default class App {
    constructor(data, width, height, margin, formatDate) {
        this.margin = margin || {
            top: 20,
            right: 100,
            bottom: 50,
            left: 100
        };
        this.data = data;
        this.width = width || 1000;
        this.height = height || 500;

        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.height - this.margin.top - this.margin.bottom;

        this.formatDate = formatDate || d3.timeFormat('%Y-%m-%d');
        const self = this;
        const dates = window._.keys(this.data).map(item => new Date(item));
        this.mappedData = window._.map(this.data, (item, key) => {
            return {
                date: new Date(key),
                ...item
            };
        });

        var minDate = window._.min(dates);
        var maxDate = window._.max(dates);



        this.xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([0, this.width]);

        var yRange = window._.transform(this.mappedData, function(result, n) {
            result.push(n.dau);
            result.push(n.nau);
        }, []);

        var minRange = window._.min(yRange);
        var maxRange = window._.max(yRange);
        this.yScale = d3.scaleLinear()
            .domain([minRange, maxRange])
            .range([this.height, 0]);
        var oneDay = 24 * 60 * 60 * 1000;

        var diffDays = Math.round(Math.abs((minDate.getTime() - maxDate.getTime()) / (oneDay)));
        this.axisX = d3.axisBottom(this.xScale)
            .ticks(diffDays)
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
            .attr("class", "nau")
            .attr("d", this.lineDau(this.mappedData));

    }
    renderNau() {
        this.svg.append("path")
            .attr("class", "dau")
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
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.axisX);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.axisY);

        this.svg.selectAll("dot")
            .data(self.mappedData)
            .enter().append("circle")
            .attr("r", 5)
            .attr("class", "point")
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
        this.svg.selectAll(".x text") // select all the text elements for the xaxis
            .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-25)";
            });

        this.renderDau();
        this.renderNau();


    }
}
