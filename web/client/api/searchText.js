/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const WFS = require('./WFS');
const assign = require('object-assign');


const toNominatim = (fc) =>
    fc.features && fc.features.map( (f) => ({
        boundingbox: f.properties.bbox,
        lat: 1,
        lon: 1,
        display_name: `${f.properties.STATE_NAME} (${f.properties.STATE_ABBR})`

    }));


module.exports = {
    nominatim: (searchText) => require('./Nominatim').geocode(searchText).then( res => res.data),
    wfs: (searchText, {url, typeName, queriableAttributes, outputFormat="application/json", predicate ="ILIKE", ...params }) => {
        return WFS.getFeatureSimple(url,
            assign({
                maxFeatures: 10,
                startIndex: 0,
                typeName,
                outputFormat,
                cql_filter: queriableAttributes.map( attr => `${attr} ${predicate} '%${searchText}%'`).join(' OR ')
            }, params)).then( response => toNominatim(response ));
    }
};
