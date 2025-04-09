// App.jsx
import React, { useState, useEffect } from "react";
import MapContainer from "./Maps";  // Import the renamed component
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import * as shapefile from "shapefile"; // Import shapefile library for loading shapefiles

function App() {
  const [geojsonData, setGeojsonData] = useState(null);

  const loadFromStaticFiles = async () => {
    try {
      const shpRes = await fetch("/data/Charsadda_Roads.shp");
      const dbfRes = await fetch("/data/Charsadda_Roads.dbf");

      const shpBuffer = await shpRes.arrayBuffer();
      const dbfBuffer = await dbfRes.arrayBuffer();

      const source = await shapefile.open(shpBuffer, dbfBuffer);
      const features = [];

      let result;
      while (!(result = await source.read()).done) {
        features.push(result.value);
      }

      setGeojsonData({ type: "FeatureCollection", features });
    } catch (error) {
      console.error("Failed to load shapefile:", error);
    }
  };

  useEffect(() => {
    loadFromStaticFiles();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      {geojsonData ? (
        <MapContainer geojsonData={geojsonData} />
      ) : (
        <p style={{ padding: "10px", color: "white", background: "black" }}>
          Loading shapefile...
        </p>
      )}
    </div>
  );
}

export default App;
