function YandexGeocoderView(data) {
    this._data = data;
}

YandexGeocoderView.prototype.toJSON = function (options) {
    var geoObject = this._data.response.GeoObjectCollection.featureMember[0].GeoObject;

    if(!geoObject) {
        return;
    }

    options = options || {};

    var lowerCorner = geoObject.boundedBy.Envelope.lowerCorner.split(' ').map(Number),
        upperCorner = geoObject.boundedBy.Envelope.upperCorner.split(' ').map(Number),
        coordinates = geoObject.Point.pos.split(' ').map(Number);

    if(options.coordorder === 'latlong') {
        [lowerCorner, upperCorner, coordinates].forEach(function (c) {
            c.reverse();
        });
    }

    return {
        "type": "Feature",
        "bbox": [lowerCorner, upperCorner],
        "geometry": {
            "type": "Point",
            "coordinates": coordinates,
        },
        "properties": {
            "name": geoObject.name,
            "description": geoObject.description,
            "metaDataProperty": geoObject.metaDataProperty
        }
    };
};

module.exports = YandexGeocoderView;
