import * as d3 from "d3";
import './style/main.scss';




class Dots {
    constructor(data, width, height, margin) {
        this.margin = margin || {
            top: 20,
            right: 100,
            bottom: 50,
            left: 100
        };
        this.width = width || 1000;
        this.height = height || 500;
        this.data = data;
        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.height - this.margin.top - this.margin.bottom;

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.data.map(item => item.rateAmount)))
            .range([0, this.width]);

        this.yScale = d3.scaleLinear()
            .domain(d3.extent(this.data.map(item => item.days)))
            .range([this.height, 0]);

        this.axisX = d3.axisBottom(this.xScale);

        this.axisY = d3.axisLeft(this.yScale);

        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden")
            .text("a simple tooltip");
    }

    renderSvg(id) {
        this.svg = d3.select(id).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    renderAxis() {
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.axisX);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.axisY);
    }

    renderLabels() {
      this.svg.append("text")
          .attr("x", this.width / 2)
          .attr("y", this.height + 40)
          .style("text-anchor", "middle")
          .text("Количество активных дней за 6 мес");

      this.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", this.height / 2 * (-1))
          .attr("y", -30)
          .style("text-anchor", "middle")
          .text("Сумма ставок за 6 месяцев");

    }

    renderDots() {
      const self= this;
      this.svg.selectAll("dot")
          .data(this.data)
          .enter().append("circle")
          .attr("r", 2)
          .attr("class", "point")
          .style("opacity", ".5")
          .attr("cx", function(d) {
              return self.xScale(d.rateAmount);
          })
          .attr("cy", function(d) {
              return self.yScale(d.days);
          })
          .on("mouseover", function(d) {
              self.tooltip.html('<div><div> Rate Amount: ' + d.rateAmount + '</div><div>  Days: ' + d.days + '</div></div>')
              return self.tooltip.style("visibility", "visible");
          })
          .on("mousemove", function() {
              return self.tooltip.style("top",
                  (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
          })
          .on("mouseout", function() {
              return self.tooltip.style("visibility", "hidden");
          });
    }

    render(id) {
        this.renderSvg(id);
        this.renderAxis();
        this.renderLabels();
        this.renderDots();
    }
}
window.Dots = Dots;
export default Dots;
