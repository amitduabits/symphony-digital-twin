import { Link } from "react-router-dom";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { listCities } from "../cities/registry";

export function Cities() {
  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>City packs</div>
        <h1>Any city you can grant access to.</h1>
        <p>
          Each city is a pack: bbox, timezone, agencies, corridor, adapters. Bengaluru is the
          reference deployment. London, New York, and Hong Kong ship with seed geometry and public
          open-data adapters. Add a fifth city without rewriting the command centre.
        </p>
      </div>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          {listCities().map((c) => (
            <article key={c.id} className="card">
              <h3>
                {c.name} · {c.tz}
              </h3>
              <p>
                {c.agencies.join(", ")}
                <br />
                Corridor: {c.corridors[0]?.name}
                <br />
                Speeds: {c.adapters.speeds.join(", ")}
                <br />
                Cameras: {c.adapters.cameras}
                <br />
                Geometry: {c.geometrySource} · {c.junctions.length} junctions
              </p>
              <p className="muted">
                {c.adapters.speeds.includes("google") || c.adapters.speeds.includes("tomtom")
                  ? "Live when keys present / open-data and weather in Observe."
                  : "Open-data Observe. Seed geometry until OSM refresh."}
              </p>
              <Link to="/app" className="btn btn-teal">
                Open {c.name}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
