(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const GRAPH_STATE = new WeakMap();
  const EMPTY_DETAIL = {
    title: "Author graph",
    subtitle: "Hover or select a node or an edge to inspect local collaborations.",
    papers: null,
  };

  function render(container, detail, data) {
    if (!container || !data || !Array.isArray(data.authors) || !Array.isArray(data.authorLinks)) {
      return;
    }

    cleanup(container);

    if (!data.authors.length) {
      container.innerHTML = '<p class="paper-graph__empty">No author data available yet.</p>';
      if (detail) {
        setDetail(detail, EMPTY_DETAIL.title, EMPTY_DETAIL.subtitle, EMPTY_DETAIL.papers);
      }
      return;
    }

    const expanded = container.dataset.graphSize === "expanded";
    const size = resolveSize(container, expanded);
    const graph = normalizeGraphData(data, size, expanded);
    const scales = buildScales(graph.nodes, graph.links, expanded);
    const scene = setupSvg(container, size, expanded);
    const state = {
      container,
      detail,
      data,
      expanded,
      size,
      graph,
      scales,
      scene,
      selected: null,
      hovered: null,
      resizeFrame: null,
      frame: null,
      observer: null,
    };

    graph.nodes.forEach((node) => {
      node.r = scales.radius(node.papers);
      node.fill = scales.nodeColor(node.colorValue);
      node.haloColor = scales.haloColor(node.colorValue);
      node.stroke = scales.nodeStroke(node.colorValue);
      node.labelWeight = node.importance >= scales.labelThreshold ? "primary" : "secondary";
    });

    graph.links.forEach((link) => {
      link.strokeWidth = scales.linkWidth(link.weight);
      link.opacity = scales.linkOpacity(link.weight);
    });

    renderLinks(state);
    renderNodes(state);
    bindInteractions(state);
    updateDetail(state, EMPTY_DETAIL, false);
    resetState(state, false);
    startSimulation(state);
    installResizeHandling(state);

    GRAPH_STATE.set(container, state);
  }

  function cleanup(container) {
    const existing = GRAPH_STATE.get(container);
    if (!existing) {
      return;
    }

    if (existing.frame) {
      cancelAnimationFrame(existing.frame);
    }

    if (existing.resizeFrame) {
      cancelAnimationFrame(existing.resizeFrame);
    }

    if (existing.observer) {
      existing.observer.disconnect();
    }

    GRAPH_STATE.delete(container);
  }

  function resolveSize(container, expanded) {
    const bounds = container.getBoundingClientRect();
    const fallbackWidth = expanded ? 1240 : 920;
    const width = Math.max(Math.round(bounds.width || fallbackWidth), expanded ? 720 : 320);
    const heightRatio = expanded ? 0.64 : 0.68;
    const minHeight = expanded ? 620 : 380;
    const height = Math.max(Math.round(width * heightRatio), minHeight);
    return {
      width,
      height,
      centerX: width / 2,
      centerY: height / 2,
      padding: expanded ? 40 : 28,
    };
  }

  function normalizeGraphData(data, size, expanded) {
    const nodes = data.authors.map((author, index) => ({
      ...author,
      index,
      papers: Number(author.papers) || 1,
      degree: 0,
      x: size.centerX + Math.cos(index * 0.9) * (expanded ? 18 : 12),
      y: size.centerY + Math.sin(index * 0.9) * (expanded ? 18 : 12),
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
      r: 0,
      labelWeight: "secondary",
    }));

    const byId = new Map(nodes.map((node) => [node.id, node]));
    const links = data.authorLinks
      .map((link, index) => {
        const source = byId.get(link.source);
        const target = byId.get(link.target);
        if (!source || !target) {
          return null;
        }

        source.degree += Number(link.weight) || 1;
        target.degree += Number(link.weight) || 1;

        return {
          ...link,
          index,
          sourceNode: source,
          targetNode: target,
          weight: Math.max(Number(link.weight) || 1, 1),
          papers: Array.isArray(link.papers) ? link.papers : [],
          strokeWidth: 1,
          opacity: 0.2,
        };
      })
      .filter(Boolean);

    nodes.forEach((node) => {
      node.colorValue = node.papers + node.degree * 0.55;
      node.importance = node.papers * 0.75 + node.degree;
    });

    return { nodes, links, byId };
  }

  function buildScales(nodes, links, expanded) {
    const minPapers = Math.min(...nodes.map((node) => node.papers));
    const maxPapers = Math.max(...nodes.map((node) => node.papers));
    const minColor = Math.min(...nodes.map((node) => node.colorValue));
    const maxColor = Math.max(...nodes.map((node) => node.colorValue));
    const minWeight = Math.min(...links.map((link) => link.weight), 1);
    const maxWeight = Math.max(...links.map((link) => link.weight), 1);
    const orderedImportance = [...nodes.map((node) => node.importance)].sort((a, b) => b - a);
    const labelIndex = Math.min(Math.max(Math.ceil(nodes.length * 0.35), 4), orderedImportance.length) - 1;
    const labelThreshold = orderedImportance[Math.max(labelIndex, 0)] || 0;
    const minRadius = expanded ? 11 : 9;
    const maxRadius = expanded ? 28 : 22;

    return {
      radius(value) {
        return interpolate(value, minPapers, maxPapers, minRadius, maxRadius, true);
      },
      nodeColor(value) {
        const t = normalize(value, minColor, maxColor);
        return mixColors([48, 71, 100], [112, 145, 170], t);
      },
      haloColor(value) {
        const t = normalize(value, minColor, maxColor);
        return mixColors([88, 114, 141], [146, 178, 194], t, 0.16);
      },
      nodeStroke(value) {
        const t = normalize(value, minColor, maxColor);
        return mixColors([180, 195, 210], [214, 224, 232], t);
      },
      linkWidth(value) {
        return interpolate(value, minWeight, maxWeight, 1.05, expanded ? 3.2 : 2.8);
      },
      linkOpacity(value) {
        return interpolate(value, minWeight, maxWeight, 0.16, 0.42);
      },
      labelThreshold,
    };
  }

  function setupSvg(container, size, expanded) {
    container.innerHTML = "";
    container.style.position = "relative";

    const svg = createSvg("svg", {
      class: "paper-graph__svg",
      viewBox: `0 0 ${size.width} ${size.height}`,
      preserveAspectRatio: "xMidYMid meet",
      role: "img",
      "aria-label": "Author collaboration graph",
    });

    const defs = createSvg("defs");
    defs.appendChild(
      createSvg("filter", { id: "paper-graph-shadow", x: "-30%", y: "-30%", width: "160%", height: "160%" }, [
        createSvg("feDropShadow", {
          dx: "0",
          dy: expanded ? "8" : "6",
          stdDeviation: expanded ? "7" : "5",
          "flood-color": "#081017",
          "flood-opacity": "0.22",
        }),
      ]),
    );
    svg.appendChild(defs);

    const backdrop = createSvg("rect", {
      x: "0",
      y: "0",
      width: String(size.width),
      height: String(size.height),
      fill: "transparent",
      class: "paper-graph__backdrop",
    });
    svg.appendChild(backdrop);

    const edgeGroup = createSvg("g", { class: "paper-graph__edges" });
    const nodeGroup = createSvg("g", { class: "paper-graph__nodes" });
    svg.appendChild(edgeGroup);
    svg.appendChild(nodeGroup);

    const tooltip = document.createElement("div");
    tooltip.className = "paper-graph__tooltip";
    Object.assign(tooltip.style, {
      position: "absolute",
      left: "0",
      top: "0",
      maxWidth: expanded ? "18rem" : "14rem",
      padding: expanded ? "0.6rem 0.75rem" : "0.5rem 0.65rem",
      borderRadius: "0.85rem",
      background: "rgba(8, 16, 23, 0.92)",
      color: "#f8fafc",
      boxShadow: "0 18px 36px rgba(8, 16, 23, 0.22)",
      border: "1px solid rgba(190, 204, 220, 0.18)",
      pointerEvents: "none",
      opacity: "0",
      transform: "translate3d(0, 0, 0)",
      transition: "opacity 160ms ease",
      fontSize: expanded ? "0.88rem" : "0.81rem",
      lineHeight: "1.35",
      zIndex: "2",
    });

    container.appendChild(svg);
    container.appendChild(tooltip);

    return {
      svg,
      edgeGroup,
      nodeGroup,
      tooltip,
      backdrop,
      width: size.width,
      height: size.height,
    };
  }

  function renderLinks(state) {
    const { scene, graph } = state;
    const linkElements = [];

    graph.links.forEach((link) => {
      const path = createSvg("path", {
        class: "paper-graph__edge",
        fill: "none",
        stroke: "rgba(140, 181, 200, 0.35)",
        "stroke-linecap": "round",
        "stroke-width": String(link.strokeWidth),
        opacity: String(link.opacity),
      });

      path.dataset.source = link.source;
      path.dataset.target = link.target;
      scene.edgeGroup.appendChild(path);

      link.element = path;
      linkElements.push(path);
    });

    state.edgeElements = linkElements;
  }

  function renderNodes(state) {
    const { scene, graph, expanded } = state;
    const nodeElements = [];

    graph.nodes.forEach((node) => {
      const group = createSvg("g", {
        class: "paper-graph__node",
        tabindex: "0",
        role: "button",
        "aria-label": `${node.name}, ${node.papers} papers`,
      });
      group.dataset.nodeId = node.id;

      const halo = createSvg("circle", {
        class: "paper-graph__node-halo",
        r: String(node.r + (expanded ? 8 : 6)),
        fill: node.haloColor,
        opacity: "0",
      });
      halo.style.fill = node.haloColor;

      const circle = createSvg("circle", {
        class: "paper-graph__node-circle",
        r: String(node.r),
        fill: node.fill,
        stroke: node.stroke,
        "stroke-width": expanded ? "1.8" : "1.5",
        filter: "url(#paper-graph-shadow)",
      });
      circle.style.fill = node.fill;
      circle.style.stroke = node.stroke;
      circle.style.transition = "fill 180ms ease, stroke 180ms ease, stroke-width 180ms ease, opacity 180ms ease";

      const label = createSvg("text", {
        class: "paper-graph__label",
        "text-anchor": "middle",
        fill: "rgba(226, 233, 240, 0.78)",
        "font-size": expanded ? "12.5" : "11.5",
      });
      label.textContent = node.name;

      const labelBack = createSvg("rect", {
        class: "paper-graph__label-back",
        rx: expanded ? "9" : "8",
        ry: expanded ? "9" : "8",
        fill: "rgba(7, 13, 18, 0.68)",
        opacity: node.labelWeight === "primary" ? "0.82" : "0",
      });

      group.appendChild(halo);
      group.appendChild(circle);
      group.appendChild(labelBack);
      group.appendChild(label);
      scene.nodeGroup.appendChild(group);

      node.element = group;
      node.circle = circle;
      node.halo = halo;
      node.label = label;
      node.labelBack = labelBack;
      nodeElements.push(group);
    });

    state.nodeElements = nodeElements;
  }

  function bindInteractions(state) {
    const { scene, graph } = state;

    scene.backdrop.addEventListener("click", () => {
      state.selected = null;
      resetState(state, true);
    });

    scene.svg.addEventListener("mouseleave", () => {
      state.hovered = null;
      applyStateClasses(state);
      hideTooltip(scene.tooltip);
      if (!state.selected) {
        updateDetail(state, EMPTY_DETAIL, false);
      }
    });

    graph.links.forEach((link) => {
      const element = link.element;
      element.style.cursor = "pointer";

      element.addEventListener("mouseenter", (event) => {
        state.hovered = { type: "link", id: link.index };
        applyStateClasses(state);
        showTooltip(state, event, buildLinkDetail(link));
        if (!state.selected) {
          updateDetail(state, buildLinkDetail(link), false);
        }
      });

      element.addEventListener("mousemove", (event) => {
        showTooltip(state, event, buildLinkDetail(link));
      });

      element.addEventListener("mouseleave", () => {
        state.hovered = null;
        applyStateClasses(state);
        hideTooltip(scene.tooltip);
        if (!state.selected) {
          updateDetail(state, EMPTY_DETAIL, false);
        }
      });

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        state.selected = { type: "link", id: link.index };
        updateDetail(state, buildLinkDetail(link), true);
        applyStateClasses(state);
      });
    });

    graph.nodes.forEach((node) => {
      const group = node.element;
      const onEnter = (event) => {
        state.hovered = { type: "node", id: node.id };
        applyStateClasses(state);
        showTooltip(state, event, buildNodeDetail(state, node));
        if (!state.selected) {
          updateDetail(state, buildNodeDetail(state, node), false);
        }
      };

      group.addEventListener("mouseenter", onEnter);
      group.addEventListener("focus", onEnter);

      group.addEventListener("mousemove", (event) => {
        showTooltip(state, event, buildNodeDetail(state, node));
      });

      group.addEventListener("mouseleave", () => {
        state.hovered = null;
        applyStateClasses(state);
        hideTooltip(scene.tooltip);
        if (!state.selected) {
          updateDetail(state, EMPTY_DETAIL, false);
        }
      });

      group.addEventListener("blur", () => {
        state.hovered = null;
        applyStateClasses(state);
      });

      group.addEventListener("click", (event) => {
        event.stopPropagation();
        state.selected = { type: "node", id: node.id };
        updateDetail(state, buildNodeDetail(state, node), true);
        applyStateClasses(state);
      });

      bindDrag(state, node);
    });
  }

  function bindDrag(state, node) {
    const { svg } = state.scene;
    let pointerId = null;

    node.element.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      pointerId = event.pointerId;
      node.element.setPointerCapture(pointerId);
      const point = projectPointer(svg, event);
      node.fx = point.x;
      node.fy = point.y;
      node.vx = 0;
      node.vy = 0;
      kickSimulation(state, 0.22);
    });

    node.element.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) {
        return;
      }
      const point = projectPointer(svg, event);
      node.fx = point.x;
      node.fy = point.y;
      kickSimulation(state, 0.18);
    });

    const release = (event) => {
      if (pointerId !== event.pointerId) {
        return;
      }
      pointerId = null;
      node.element.releasePointerCapture(event.pointerId);
      node.fx = null;
      node.fy = null;
      kickSimulation(state, 0.15);
    };

    node.element.addEventListener("pointerup", release);
    node.element.addEventListener("pointercancel", release);
  }

  function startSimulation(state) {
    if (!state.simulation) {
      state.simulation = {
        alpha: 1,
        alphaMin: 0.018,
        alphaDecay: 0.032,
        velocityDecay: 0.78,
      };
    }

    const simulation = state.simulation;
    simulation.alpha = Math.max(simulation.alpha, 0.2);

    const step = () => {
      applyForces(state);
      tick(state);

      simulation.alpha += (0 - simulation.alpha) * simulation.alphaDecay;
      if (simulation.alpha > simulation.alphaMin) {
        state.frame = requestAnimationFrame(step);
      } else {
        state.frame = null;
      }
    };

    state.frame = requestAnimationFrame(step);
  }

  function kickSimulation(state, alpha) {
    if (!state.simulation) {
      return;
    }
    state.simulation.alpha = Math.max(state.simulation.alpha, alpha);
    if (!state.frame) {
      startSimulation(state);
    }
  }

  function applyForces(state) {
    const { graph, size, simulation } = state;
    const alpha = simulation.alpha;
    const nodes = graph.nodes;
    const links = graph.links;
    const chargeStrength = state.expanded ? 1800 : 1150;
    const centerStrength = state.expanded ? 0.0015 : 0.0022;
    const collisionPadding = state.expanded ? 14 : 10;

    nodes.forEach((node) => {
      const offsetX = size.centerX - node.x;
      const offsetY = size.centerY - node.y;
      node.vx += offsetX * centerStrength * alpha;
      node.vy += offsetY * centerStrength * alpha;
    });

    links.forEach((link) => {
      const source = link.sourceNode;
      const target = link.targetNode;
      let dx = target.x - source.x;
      let dy = target.y - source.y;
      let distance = Math.hypot(dx, dy) || 1;
      const desired = state.expanded ? 82 + (6 - Math.min(link.weight, 5)) * 19 : 70 + (6 - Math.min(link.weight, 5)) * 16;
      const force = ((distance - desired) / distance) * (0.007 + link.weight * 0.0045) * alpha;

      dx *= force;
      dy *= force;

      source.vx += dx;
      source.vy += dy;
      target.vx -= dx;
      target.vy -= dy;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distanceSq = dx * dx + dy * dy;
        if (!distanceSq) {
          dx = (Math.random() - 0.5) * 0.2;
          dy = (Math.random() - 0.5) * 0.2;
          distanceSq = dx * dx + dy * dy;
        }

        const distance = Math.sqrt(distanceSq);
        const minDistance = a.r + b.r + collisionPadding;
        if (distance < minDistance) {
          const push = ((minDistance - distance) / distance) * 0.08 * alpha;
          const pushX = dx * push;
          const pushY = dy * push;
          a.vx -= pushX;
          a.vy -= pushY;
          b.vx += pushX;
          b.vy += pushY;
        }

        const repulse = (chargeStrength * alpha) / (distanceSq + 24);
        a.vx -= dx * repulse * 0.00011;
        a.vy -= dy * repulse * 0.00011;
        b.vx += dx * repulse * 0.00011;
        b.vy += dy * repulse * 0.00011;
      }
    }
  }

  function tick(state) {
    const { graph, size, simulation } = state;

    graph.nodes.forEach((node) => {
      if (node.fx != null && node.fy != null) {
        node.x = node.fx;
        node.y = node.fy;
      } else {
        node.vx *= simulation.velocityDecay;
        node.vy *= simulation.velocityDecay;
        node.x += node.vx;
        node.y += node.vy;
      }

      const inset = node.r + size.padding;
      node.x = clamp(node.x, inset, size.width - inset);
      node.y = clamp(node.y, inset, size.height - inset);
    });

    updateLinkPositions(state);
    updateNodePositions(state);
  }

  function updateLinkPositions(state) {
    state.graph.links.forEach((link) => {
      const source = link.sourceNode;
      const target = link.targetNode;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const nx = -dy / distance;
      const ny = dx / distance;
      const curve = Math.min(24, 6 + link.weight * 2.8) * (source.index < target.index ? 1 : -1);
      const cx = (source.x + target.x) / 2 + nx * curve;
      const cy = (source.y + target.y) / 2 + ny * curve;
      link.element.setAttribute("d", `M ${source.x.toFixed(2)} ${source.y.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${target.x.toFixed(2)} ${target.y.toFixed(2)}`);
    });
  }

  function updateNodePositions(state) {
    const { graph, size, expanded } = state;

    graph.nodes.forEach((node) => {
      node.element.setAttribute("transform", `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)})`);

      const angle = Math.atan2(node.y - size.centerY, node.x - size.centerX);
      const textBox = estimateTextBox(node.name, expanded ? 12.5 : 11.5);
      const labelLayout = resolveLabelPosition(node, graph.nodes, size, angle, textBox, expanded);

      node.label.setAttribute("x", String(labelLayout.textX));
      node.label.setAttribute("y", String(labelLayout.textY));
      node.labelBack.setAttribute("x", String(labelLayout.boxX));
      node.labelBack.setAttribute("y", String(labelLayout.boxY));
      node.labelBack.setAttribute("width", String(labelLayout.boxWidth));
      node.labelBack.setAttribute("height", String(labelLayout.boxHeight));
    });
  }

  function updateDetail(state, payload, persistent) {
    setDetail(state.detail, payload.title, payload.subtitle, payload.papers);
    if (state.detail) {
      state.detail.dataset.graphSelection = persistent ? "locked" : "preview";
    }
  }

  function resetState(state, resetDetail) {
    if (resetDetail) {
      updateDetail(state, EMPTY_DETAIL, false);
    }
    applyStateClasses(state);
    hideTooltip(state.scene.tooltip);
  }

  function applyStateClasses(state) {
    const active = state.selected || state.hovered;
    const activeNodeIds = new Set();
    const activeLinkIds = new Set();

    if (active) {
      if (active.type === "node") {
        activeNodeIds.add(active.id);
        state.graph.links.forEach((link) => {
          if (link.source === active.id || link.target === active.id) {
            activeLinkIds.add(link.index);
            activeNodeIds.add(link.source);
            activeNodeIds.add(link.target);
          }
        });
      } else if (active.type === "link") {
        activeLinkIds.add(active.id);
        const link = state.graph.links.find((entry) => entry.index === active.id);
        if (link) {
          activeNodeIds.add(link.source);
          activeNodeIds.add(link.target);
        }
      }
    }

    state.graph.links.forEach((link) => {
      const isActive = activeLinkIds.has(link.index);
      const isContext = activeNodeIds.has(link.source) || activeNodeIds.has(link.target);
      link.element.classList.toggle("is-active", isActive);
      link.element.classList.toggle("is-context", !isActive && isContext && !!active);
      link.element.classList.toggle("is-muted", !!active && !isActive && !isContext);
      link.element.setAttribute("opacity", String(resolveLinkOpacity(link, isActive, isContext, !!active)));
      link.element.setAttribute("stroke", resolveLinkStroke(link, isActive, isContext));
    });

    state.graph.nodes.forEach((node) => {
      const isActive = activeNodeIds.has(node.id) && (
        !active ||
        active.type === "node" && active.id === node.id ||
        active.type === "link" && activeNodeIds.has(node.id)
      );
      const isContext = activeNodeIds.has(node.id);
      const muted = !!active && !isContext;

      node.element.classList.toggle("is-active", isActive);
      node.element.classList.toggle("is-context", !isActive && isContext);
      node.element.classList.toggle("is-muted", muted);

      node.halo.setAttribute("opacity", isActive ? "1" : isContext ? "0.5" : "0");
      node.circle.setAttribute("stroke-width", isActive ? "2.8" : isContext ? "2.2" : state.expanded ? "1.8" : "1.5");
      node.circle.setAttribute("stroke", isActive ? "#f2f7fb" : isContext ? tintColor(node.stroke, 0.06) : node.stroke);
      node.circle.setAttribute("fill", muted ? tintColor(node.fill, 0.18) : isActive ? tintColor(node.fill, 0.08) : node.fill);
      node.circle.style.stroke = isActive ? "#f2f7fb" : isContext ? tintColor(node.stroke, 0.06) : node.stroke;
      node.circle.style.fill = muted ? tintColor(node.fill, 0.18) : isActive ? tintColor(node.fill, 0.08) : node.fill;
      node.halo.style.fill = node.haloColor;

      const prominent = node.labelWeight === "primary" || isContext || !!state.hovered && state.hovered.type === "node" && state.hovered.id === node.id;
      node.label.setAttribute("opacity", muted ? "0.18" : prominent ? "1" : "0.54");
      node.label.setAttribute("font-size", prominent ? (state.expanded ? "13.5" : "12.2") : (state.expanded ? "12.5" : "11.5"));
      node.labelBack.setAttribute("opacity", prominent ? "0.86" : "0");
      node.label.setAttribute("fill", muted ? "rgba(226, 233, 240, 0.35)" : prominent ? "#f8fafc" : "rgba(226, 233, 240, 0.78)");
    });
  }

  function resolveLinkOpacity(link, isActive, isContext, hasSelection) {
    if (isActive) {
      return 0.98;
    }
    if (isContext) {
      return Math.min(link.opacity + 0.22, 0.7);
    }
    if (hasSelection) {
      return 0.08;
    }
    return link.opacity;
  }

  function resolveLinkStroke(link, isActive, isContext) {
    if (isActive) {
      return "rgba(185, 232, 214, 0.98)";
    }
    if (isContext) {
      return "rgba(154, 191, 213, 0.72)";
    }
    return "rgba(140, 181, 200, 0.35)";
  }

  function buildNodeDetail(state, node) {
    const connected = state.graph.links.filter((link) => link.source === node.id || link.target === node.id);
    const sharedPapers = new Set();
    connected.forEach((link) => {
      link.papers.forEach((paper) => sharedPapers.add(paper));
    });

    return {
      title: node.name,
      subtitle: `${node.papers} paper${node.papers > 1 ? "s" : ""} in the library, ${connected.length} collaboration${connected.length === 1 ? "" : "s"}`,
      papers: Array.from(sharedPapers),
    };
  }

  function buildLinkDetail(link) {
    return {
      title: `${link.sourceName} + ${link.targetName}`,
      subtitle: `${link.weight} shared collaboration${link.weight > 1 ? "s" : ""}`,
      papers: link.papers,
    };
  }

  function showTooltip(state, event, payload) {
    if (typeof event.clientX !== "number" || typeof event.clientY !== "number") {
      return;
    }

    const { tooltip } = state.scene;
    tooltip.innerHTML = `
      <strong style="display:block;margin-bottom:0.2rem;">${escapeHtml(payload.title)}</strong>
      <span>${escapeHtml(payload.subtitle)}</span>
    `;
    tooltip.style.opacity = "1";

    const bounds = state.container.getBoundingClientRect();
    const x = event.clientX - bounds.left + 14;
    const y = event.clientY - bounds.top + 14;
    const maxX = Math.max(bounds.width - tooltip.offsetWidth - 8, 8);
    const maxY = Math.max(bounds.height - tooltip.offsetHeight - 8, 8);
    tooltip.style.left = `${clamp(x, 8, maxX)}px`;
    tooltip.style.top = `${clamp(y, 8, maxY)}px`;
  }

  function hideTooltip(tooltip) {
    tooltip.style.opacity = "0";
  }

  function installResizeHandling(state) {
    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (state.resizeFrame) {
        cancelAnimationFrame(state.resizeFrame);
      }
      state.resizeFrame = requestAnimationFrame(() => {
        const nextSize = resolveSize(state.container, state.expanded);
        if (nextSize.width === state.size.width && nextSize.height === state.size.height) {
          return;
        }
        render(state.container, state.detail, state.data);
      });
    });

    observer.observe(state.container);
    state.observer = observer;
  }

  function projectPointer(svg, event) {
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    return {
      x: ((event.clientX - rect.left) / rect.width) * viewBox.width,
      y: ((event.clientY - rect.top) / rect.height) * viewBox.height,
    };
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
      ${papers == null ? "" : items ? `<ul>${items}</ul>` : "<p>No shared paper metadata available.</p>"}
    `;
  }

  function createSvg(tagName, attributes, children) {
    const element = document.createElementNS(SVG_NS, tagName);
    Object.entries(attributes || {}).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    (children || []).forEach((child) => element.appendChild(child));
    return element;
  }

  function estimateTextBox(text, fontSize) {
    return {
      width: Math.max(text.length * fontSize * 0.52, 40),
      height: fontSize + 6,
    };
  }

  function resolveLabelPosition(node, nodes, size, angle, textBox, expanded) {
    const baseOffset = node.r + (expanded ? 18 : 15);
    const directionX = Math.cos(angle) || 1;
    const directionY = Math.sin(angle) || 0;
    const boxWidth = textBox.width + 14;
    const boxHeight = textBox.height + 8;
    let labelX = directionX * Math.min(baseOffset, 18);
    let labelY = directionY * baseOffset + (angle > 0 ? 10 : -6);

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const boxX = labelX - boxWidth / 2;
      const boxY = labelY - textBox.height + 2;
      const overlapsNode = nodes.some((other) => other !== node && labelIntersectsNode(node, boxX, boxY, boxWidth, boxHeight, other));
      if (!overlapsNode) {
        break;
      }

      labelX += directionX * 10;
      labelY += directionY * 10 + (directionY >= 0 ? 3 : -3);
    }

    const clampedTextX = clamp(labelX, -node.x + boxWidth / 2 + 6, size.width - node.x - boxWidth / 2 - 6);
    const clampedTextY = clamp(labelY, -node.y + boxHeight, size.height - node.y - 8);

    return {
      textX: clampedTextX,
      textY: clampedTextY,
      boxX: clamp(clampedTextX - boxWidth / 2, -node.x + 6, size.width - node.x - boxWidth - 6),
      boxY: clamp(clampedTextY - textBox.height + 2, -node.y + 6, size.height - node.y - boxHeight - 6),
      boxWidth,
      boxHeight,
    };
  }

  function labelIntersectsNode(node, boxX, boxY, boxWidth, boxHeight, other) {
    const closestX = clamp(other.x - node.x, boxX, boxX + boxWidth);
    const closestY = clamp(other.y - node.y, boxY, boxY + boxHeight);
    const dx = other.x - node.x - closestX;
    const dy = other.y - node.y - closestY;
    return dx * dx + dy * dy < Math.pow(other.r + 6, 2);
  }

  function normalize(value, min, max) {
    if (min === max) {
      return 0.5;
    }
    return clamp((value - min) / (max - min), 0, 1);
  }

  function interpolate(value, min, max, outMin, outMax, soften) {
    const t = soften ? Math.sqrt(normalize(value, min, max)) : normalize(value, min, max);
    return outMin + (outMax - outMin) * t;
  }

  function mixColors(from, to, t) {
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function tintColor(color, amount) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) {
      return color;
    }

    const [r, g, b] = match.map(Number);
    const mix = (channel) => Math.round(channel + (255 - channel) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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
