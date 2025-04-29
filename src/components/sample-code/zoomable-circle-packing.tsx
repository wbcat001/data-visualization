import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataItem {
  name: string;
  children?: DataItem[];
  value?: number;
}

interface ZoomableCirclePackingProps {
  data: DataItem;
  width?: number;
  height?: number;
}

const ZoomableCirclePacking: React.FC<ZoomableCirclePackingProps> = ({ data, width = 928, height = 928 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous rendering
    d3.select(svgRef.current).selectAll('*').remove();

    // Create the color scale
    const color = d3.scaleLinear<string>()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    // Compute the layout
    const pack = (data: DataItem) => d3.pack<DataItem>()
      .size([width, height])
      .padding(3)
      (d3.hierarchy<DataItem>(data)
        .sum(d => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0)));

    const root = pack(data);

    // Set up the SVG container
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);

    // Keep track of the current focus and view
    let focus = root;
    let view: [number, number, number] = [root.x, root.y, root.r * 2];

    // Zoom to a specific view
    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];
      view = v;

      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }

    // Handle the zoom transition
    function zoom(event: d3.D3ZoomEvent<SVGSVGElement, unknown>, d: d3.HierarchyNode<DataItem>) {
      const focus0 = focus;
      focus = d;

      const transition = svg.transition()
        .duration(event.sourceEvent && event.sourceEvent.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

      label
        .filter(function(d) { 
          const element = this as SVGTextElement;
          return d.parent === focus || element.style.display === "inline"; 
        })
        .transition(transition as any)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(event, d) { 
          const element = this as SVGTextElement;
          if (d.parent === focus) element.style.display = "inline"; 
        })
        .on("end", function(event, d) { 
          const element = this as SVGTextElement;
          if (d.parent !== focus) element.style.display = "none"; 
        });
    }

    // Append the circles
    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event as any, d), event.stopPropagation()));

    // Append the text labels
    const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);

    // Initialize with root node
    svg.on("click", (event) => zoom(event as any, root));
    zoomTo([root.x, root.y, root.r * 2]);

    return () => {
      // Cleanup
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default ZoomableCirclePacking;