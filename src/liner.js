import * as d3 from "d3";
import './style/main.scss';


class Liner {
    constructor(data, width, height, margin, formatDate) {
        this.margin = margin || {
            top: 30,
            right: 100,
            bottom: 50,
            left: 100
        };

        this.data = data;
        this.width = width || 1000;
        this.height = height || 500;

        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.height - this.margin.top - this.margin.bottom;

        this.parseDate = d3.timeParse('%Y-%m-%d');
        this.formatDate = formatDate || d3.timeFormat('%Y-%m-%d'); //
        const self = this;
        const dates = window._.keys(this.data).map(item => new Date(item));
        this.mappedData = window._.map(this.data, (item, key) => {
            return {
                date: self.parseDate(self.formatDate(new Date(key))),
                ...item
            };
        });

        var minDate = window._.min(dates);
        var maxDate = window._.max(dates);

        this.xScale = d3.scaleTime()
            .domain([minDate, maxDate]).nice()
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

        //var oneDay = 24 * 60 * 60 * 1000;
        //console.log(d3.timeDay.count(minDate, maxDate) + 1);
        //var diffDays = Math.round(Math.abs((minDate.getTime() - maxDate.getTime()) / (oneDay)));
        console.log(d3.timeDay.count(minDate, maxDate) + 1);
        this.axisX = d3.axisBottom(this.xScale)
            .ticks(d3.timeDay.count(minDate, maxDate) + 1)
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

    renderLabels() {
        this.svg.append("text")
            .attr("x", this.width + 50)
            .attr("y", this.height + 7)
            .style("text-anchor", "middle")
            .text("Период");

        this.svg.append("text")
            //.attr("transform", "rotate(-90)")
            .attr("x", 80)
            .attr("y", 0 - 10)
            .style("text-anchor", "middle")
            .text("Количество дней");

    }

    renderDau() {
        this.svg.append("path")
            .attr("class", "dau")
            .attr("d", this.lineDau(this.mappedData));
        this.renderPoint((d) => {
            return this.yScale(d.dau);
        })
    }
    renderNau() {
        this.svg.append("path")
            .attr("class", "nau")
            .attr("d", this.lineNau(this.mappedData));
        this.renderPoint((d) => {
            return this.yScale(d.nau);
        })
    }

    renderLegend(text, x, y, className) {
        this.dauLegend = this.svg.append('rect')
            .attr("x", x)
            .attr("y", y)
            .attr("width", 20)
            .attr("height", 20)
            .attr("class", className);

        this.dauLegend = this.svg.append('text')
            .attr("x", x + 22)
            .attr("y", y + 15)
            .attr("width", 20)
            .attr("height", 20)
            .text(text);
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

    renderSvg(id) {
        this.svg = d3.select(id).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("class", 'liner')
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    render(id) {
        const self = this;
        this.renderSvg(id);


        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.axisX);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.axisY);

        this.svg.selectAll(".x text") // select all the text elements for the xaxis
            .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-25)";
            });

        this.renderDau();
        this.renderNau();
        this.renderLabels();
        this.renderLegend('Dau', this.width, this.height/2- 30, 'dauLegendBox');
        this.renderLegend('Nau', this.width, this.height/2, 'nauLegendBox');

    }
}


window.Liner = Liner;
export default Liner;
