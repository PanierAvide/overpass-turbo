import L from "leaflet";
import osmtogeojson from "osmtogeojson";

L.OSM4Leaflet = L.Class.extend({
  initialize(data, options) {
    this.options = {
      data_mode: "xml",
      baseLayerClass: L.GeoJSON,
      baseLayerOptions: {}
    };
    L.Util.setOptions(this, options);

    this._baseLayer = new this.options.baseLayerClass(
      null,
      this.options.baseLayerOptions
    );
    this._resultData = null;
    // if data
    if (data) this.addData(data);
  },
  addData(data, onDone) {
    setTimeout(() => {
      // 1. convert to GeoJSON
      const geojson = osmtogeojson(data, {flatProperties: false});
      this._resultData = geojson;
      if (this.options.afterParse) this.options.afterParse();
      setTimeout(() => {
        // 2. add to baseLayer
        this._baseLayer.addData(geojson);
        if (onDone) onDone();
      }, 1); //end setTimeout
    }, 1); //end setTimeout
  },
  getGeoJSON() {
    return this._resultData;
  },
  getBaseLayer() {
    return this._baseLayer;
  },
  onAdd(map) {
    this._baseLayer.addTo(map);
  },
  onRemove(map) {
    map.removeLayer(this._baseLayer);
  }
});

L.osm4Leaflet = (data, options) => new L.OSM4Leaflet(data, options);

export default L.OSM4Leaflet;
