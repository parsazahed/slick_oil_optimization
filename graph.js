const flows = solveSlickOil();

const nodes = [
    ...new Set(flows.flatMap(f => [f.source, f.target]))
].map(id => ({
    id,
    type: id.startsWith("W") ? "well" : "refinery"
}));

const links = flows.map(f => ({
    source: f.source,
    target: f.target,
    value: f.value,
    cost: f.cost
}));

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#00bcd4")
    .attr("stroke-width", d => d.value / 4);

const node = svg.append("g")
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

node.append("circle")
    .attr("r", 20)
    .attr("fill", d => d.type === "well" ? "#4caf50" : "#ff9800");

node.append("text")
    .attr("dy", 4)
    .attr("text-anchor", "middle")
    .text(d => d.id)
    .style("fill", "#fff");

link.append("title")
    .text(d => `Flow: ${d.value} barrels\nCost: $${d.cost}`);

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}