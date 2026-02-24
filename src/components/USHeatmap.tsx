"use client";
import { useEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { STATE_FIPS, STATE_NAMES } from "@/lib/constants";
import { StateCode } from "@/lib/types";

interface USHeatmapProps {
  stateData: Partial<Record<StateCode, number>>;
}

interface TopoFeature {
  type: string;
  id: string;
  properties: { name: string };
  geometry: GeoJSON.Geometry;
}

export default function USHeatmap({ stateData }: USHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    fetch("/data/states-albers-10m.json")
      .then((res) => res.json())
      .then((us) => {
        const states = topojson.feature(
          us as unknown as Topology,
          us.objects.states as GeometryCollection
        );

        const values = Object.values(stateData).filter(
          (v): v is number => v !== undefined
        );
        const maxVal = Math.max(...values, 0.01);

        // Simple two-color gradient: light gray (low) to deep amber (high)
        const colorScale = scaleLinear<string>()
          .domain([0, maxVal])
          .range(["#f1f5f9", "#b45309"])
          .clamp(true);

        const path = geoPath();
        const g = svg.append("g");

        g.selectAll("path")
          .data((states as GeoJSON.FeatureCollection).features)
          .enter()
          .append("path")
          .attr("d", (d) => path(d as GeoJSON.Feature) || "")
          .attr("fill", (d) => {
            const feature = d as unknown as TopoFeature;
            const fips = feature.id;
            const stateCode = STATE_FIPS[fips];
            const val = stateCode ? stateData[stateCode] : undefined;
            if (val === undefined) return "#f8fafc";
            return colorScale(val);
          })
          .attr("stroke", "#94a3b8")
          .attr("stroke-width", 0.5)
          .attr("cursor", "pointer")
          .on("mouseenter", function (event, d) {
            select(this).attr("stroke", "#1e293b").attr("stroke-width", 1.5);
            const feature = d as unknown as TopoFeature;
            const fips = feature.id;
            const stateCode = STATE_FIPS[fips];
            const name = stateCode ? STATE_NAMES[stateCode] : "Unknown";
            const val = stateCode ? stateData[stateCode] ?? 0 : 0;
            const rect = svgRef.current!.getBoundingClientRect();
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top - 10,
              name,
              value: val,
            });
          })
          .on("mousemove", function (event) {
            const rect = svgRef.current!.getBoundingClientRect();
            setTooltip((prev) =>
              prev
                ? {
                    ...prev,
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top - 10,
                  }
                : null
            );
          })
          .on("mouseleave", function () {
            select(this).attr("stroke", "#94a3b8").attr("stroke-width", 0.5);
            setTooltip(null);
          });

        // Color legend - centered below the map
        const legendWidth = 250;
        const legendHeight = 12;
        const legendX = (975 - legendWidth) / 2;
        const legendY = 575;

        const defs = svg.append("defs");
        const gradient = defs
          .append("linearGradient")
          .attr("id", "legend-gradient");

        for (let i = 0; i <= 10; i++) {
          gradient
            .append("stop")
            .attr("offset", `${i * 10}%`)
            .attr("stop-color", colorScale((i / 10) * maxVal));
        }

        const legend = svg.append("g").attr("transform", `translate(${legendX},${legendY})`);

        legend
          .append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .style("fill", "url(#legend-gradient)")
          .attr("rx", 2)
          .attr("stroke", "#cbd5e1")
          .attr("stroke-width", 0.5);

        const tickCount = 5;
        for (let i = 0; i <= tickCount; i++) {
          const x = (i / tickCount) * legendWidth;
          const pct = (i / tickCount) * maxVal * 100;
          const label = maxVal < 0.05
            ? `${pct.toFixed(1)}%`
            : `${Math.round(pct)}%`;

          legend
            .append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", 0)
            .attr("y2", legendHeight + 3)
            .attr("stroke", "#94a3b8")
            .attr("stroke-width", 0.5);

          legend
            .append("text")
            .attr("x", x)
            .attr("y", legendHeight + 14)
            .attr("text-anchor", i === 0 ? "start" : i === tickCount ? "end" : "middle")
            .text(label)
            .attr("fill", "#64748b")
            .attr("font-size", "12px");
        }
      });
  }, [stateData]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 975 610"
        className="w-full h-auto"
        style={{ maxHeight: "60vh" }}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <span className="font-semibold">{tooltip.name}</span>:{" "}
          {(tooltip.value * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
