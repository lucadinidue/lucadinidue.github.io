(function () {
  function render(container, detail, data) {
    if (!container || !data || !Array.isArray(data.authors) || !Array.isArray(data.authorLinks)) {
      return;
    }

    if (!data.authors.length) {
      container.innerHTML = "<p>No author data available yet.</p>";
      return;
    }

    const expanded = container.dataset.graphSize === "expanded";
    const width = expanded ? 1280 : 920;
    const height = expanded ? 860 : 620;
    const cx = width / 2;
    const cy = height / 2;
    const nodes = data.authors.map((author, index) => ({ ...author, index }));
    const links = data.authorLinks;
    const maxPapers = Math.max(...nodes.map((node) => Number(node.papers) || 1), 1);
    const innerCount = Math.min(Math.max(3, Math.ceil(nodes.length / 3)), nodes.length);

    nodes.forEach((node, index) => {
      const isInner = index < innerCount;
      const ringIndex = isInner ? index : index - innerCount;
      const ringSize = isInner ? innerCount : Math.max(nodes.length - innerCount, 1);
      const angle = (Math.PI * 2 * ringIndex) / ringSize - Math.PI / 2;
      const radius = expanded ? (isInner ? 190 : 340 + (index % 4) * 26) : (isInner ? 135 : 250 + (index % 3) * 20);
      node.x = cx + Math.cos(angle) * radius;
      node.y = cy + Math.sin(angle) * radius;
      node.r = expanded ? 14 + (34 * (Number(node.papers) || 1)) / maxPapers : 11 + (26 * (Number(node.papers) || 1)) / maxPapers;
    });

    const byId = new Map(nodes.map((node) => [node.id, node]));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("class", "paper-graph__svg");

    const edgeGroup = document.createElementNS(svg.namespaceURI, "g");
    edgeGroup.setAttribute("class", "paper-graph__edges");
    const nodeGroup = document.createElementNS(svg.namespaceURI, "g");
    nodeGroup.setAttribute("class", "paper-graph__nodes");

    const edgeElements = [];
    links.forEach((link) => {
      const source = byId.get(link.source);
      const target = byId.get(link.target);
      if (!source || !target) {
        return;
      }

      const edge = document.createElementNS(svg.namespaceURI, "line");
      edge.setAttribute("x1", source.x);
      edge.setAttribute("y1", source.y);
      edge.setAttribute("x2", target.x);
      edge.setAttribute("y2", target.y);
      edge.setAttribute("stroke-width", String(1 + (Number(link.weight) || 1) * 0.9));
      edge.setAttribute("class", "paper-graph__edge");
      edge.dataset.source = link.source;
      edge.dataset.target = link.target;
      edge.dataset.papers = (link.papers || []).join(" | ");
      edge.addEventListener("click", () => {
        setDetail(
          detail,
          `${link.sourceName} + ${link.targetName}`,
          `${link.weight} shared collaboration${link.weight > 1 ? "s" : ""}`,
          link.papers || [],
        );
        highlightEdge(edgeElements, edge, nodeGroup, [link.source, link.target]);
      });
      edgeGroup.appendChild(edge);
      edgeElements.push(edge);
    });

    nodes.forEach((node) => {
      const group = document.createElementNS(svg.namespaceURI, "g");
      group.setAttribute("class", "paper-graph__node");
      group.dataset.nodeId = node.id;

      const circle = document.createElementNS(svg.namespaceURI, "circle");
      circle.setAttribute("cx", node.x);
      circle.setAttribute("cy", node.y);
      circle.setAttribute("r", node.r);
      circle.setAttribute("class", "paper-graph__node-circle");

      const label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", node.x);
      label.setAttribute("y", node.y + node.r + (expanded ? 26 : 20));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "paper-graph__label");
      label.setAttribute("style", `font-size: ${expanded ? 15 : 12}px;`);
      label.textContent = node.name;

      group.appendChild(circle);
      group.appendChild(label);
      group.addEventListener("click", () => {
        const connected = links.filter((link) => link.source === node.id || link.target === node.id);
        const sharedPapers = new Set();
        connected.forEach((link) => (link.papers || []).forEach((paper) => sharedPapers.add(paper)));
        setDetail(
          detail,
          node.name,
          `${node.papers} paper${node.papers > 1 ? "s" : ""} in the library`,
          Array.from(sharedPapers),
        );
        highlightNode(edgeElements, group, nodeGroup, node.id);
      });

      nodeGroup.appendChild(group);
    });

    svg.appendChild(edgeGroup);
    svg.appendChild(nodeGroup);
    container.innerHTML = "";
    container.appendChild(svg);
  }

  function setDetail(container, title, subtitle, papers) {
    if (!container) {
      return;
    }
    const items = (papers || [])
      .map((paper) => `<li>${escapeHtml(paper)}</li>`)
      .join("");
    container.innerHTML = `
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(subtitle)}</p>
      ${items ? `<ul>${items}</ul>` : "<p>No shared paper metadata available.</p>"}
    `;
  }

  function highlightNode(edges, activeNode, nodeGroup, nodeId) {
    Array.from(nodeGroup.children).forEach((node) => {
      node.classList.toggle("is-active", node === activeNode);
      node.classList.toggle("is-muted", node !== activeNode);
    });

    edges.forEach((edge) => {
      const connected = edge.dataset.source === nodeId || edge.dataset.target === nodeId;
      edge.classList.toggle("is-active", connected);
      edge.classList.toggle("is-muted", !connected);
    });
  }

  function highlightEdge(edges, activeEdge, nodeGroup, nodeIds) {
    edges.forEach((edge) => {
      edge.classList.toggle("is-active", edge === activeEdge);
      edge.classList.toggle("is-muted", edge !== activeEdge);
    });

    Array.from(nodeGroup.children).forEach((node) => {
      const active = nodeIds.includes(node.dataset.nodeId);
      node.classList.toggle("is-active", active);
      node.classList.toggle("is-muted", !active);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  window.PaperLibraryGraph = { render };
})();
