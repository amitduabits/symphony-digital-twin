import { Fragment } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { congestionColor, type JunctionState, type Vehicle } from "../engine";

interface Props {
  junctions: JunctionState[];
  vehicles: Vehicle[];
  height?: number;
}

export default function MapView({ junctions, vehicles, height = 520 }: Props) {
  const path = junctions.map((j) => [j.lat, j.lon] as [number, number]);
  const center: [number, number] = path.length
    ? [path.reduce((s, p) => s + p[0], 0) / path.length, path.reduce((s, p) => s + p[1], 0) / path.length]
    : [12.93, 77.66];

  return (
    <div style={{ height }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom key={center.join(",")}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline positions={path} pathOptions={{ color: "#3EE0D2", weight: 3, opacity: 0.7 }} />
        {junctions.map((j) => (
          <CircleMarker
            key={j.id}
            center={[j.lat, j.lon]}
            radius={12}
            pathOptions={{
              color: "#0b1f3a",
              weight: 2,
              fillColor: congestionColor(j.congestion),
              fillOpacity: 0.95,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              {j.short} · {j.fusedSpeed.toFixed(0)} km/h
            </Tooltip>
            <Popup>
              <strong>{j.name}</strong>
              <br />
              Speed {j.fusedSpeed.toFixed(1)} km/h
              <br />
              Congestion {j.congestion.toFixed(0)}%
              <br />
              Phase {j.phase} · {j.phaseElapsed.toFixed(0)}s / {j.phaseDuration.toFixed(0)}s
              <br />
              Queues NS {j.ns.queue.toFixed(0)} · EW {j.ew.queue.toFixed(0)}
            </Popup>
          </CircleMarker>
        ))}
        {vehicles.map((v) => (
          <Fragment key={v.id}>
            <CircleMarker
              center={[v.lat, v.lon]}
              radius={3}
              pathOptions={{
                color: v.dir === 1 ? "#F0B429" : "#9b7bff",
                fillColor: v.dir === 1 ? "#F0B429" : "#9b7bff",
                fillOpacity: 0.9,
                weight: 0,
              }}
            />
          </Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
