# Carto documentation

The following is a list of properties provided in CartoCSS that you can apply to map elements.

## All elements

##### image-filters `functions`

`agg-stack-blur``emboss``blur``gray``sobel``edge-detect``x-gradient``y-gradient``invert``sharpen``color-blind-protanope``color-blind-deuteranope``color-blind-tritanope``colorize-alpha``color-to-alpha``scale-hsla`

Default Value: none
_(no filters.)_

A list of image filters that will be applied to the active rendering canvas for a given style. The presence of one more `image-filters` will trigger a new canvas to be created before starting to render a style and then this canvas will be composited back into the main canvas after rendering all features and after all `image-filters` have been applied. See `direct-image-filters` if you want to apply a filter directly to the main canvas.
* * *

##### image-filters-inflate `boolean`



Default Value: false
_(No special handling will be done and image filters that blur data will only blur up to the edge of a tile boundary.)_

A property that can be set to true to enable using an inflated image internally for seamless blurring across tiles (requires buffered data).
* * *

##### direct-image-filters `functions`

`agg-stack-blur``emboss``blur``gray``sobel``edge-detect``x-gradient``y-gradient``invert``sharpen``color-blind-protanope``color-blind-deuteranope``color-blind-tritanope``colorize-alpha``color-to-alpha``scale-hsla`

Default Value: none
_(no filters.)_

A list of image filters to apply to the main canvas (see the `image-filters` doc for how they work on a separate canvas).
* * *

##### comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current layer on top of other layers.)_

Composite operation. This defines how this layer should behave relative to layers atop or below it.
* * *

##### opacity `float`



Default Value: 1
_(No separate buffer will be used and no alpha will be applied to the style after rendering.)_

An alpha value for the style (which means an alpha applied to all features in separate buffer and then composited back to main buffer).
* * *


## map

##### background-color `color`



Default Value: none
_(Will be rendered transparent.)_

Map Background color.
* * *

##### background-image `uri`



Default Value: 
_(No background image will be used.)_

An image that is repeated below all features on a map as a background. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### background-image-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(The background-image will be blended with the background normally (placed on top of any existing background-color).)_

Set the compositing operation used to blend the image into the background.
* * *

##### background-image-opacity `float`



Default Value: 1
_(The image opacity will not be changed when applied to the map background.)_

Set the opacity of the image.
* * *

##### srs `string`



Default Value: +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs
_(The proj4 literal of EPSG:4326 is assumed to be the Map&#39;s spatial reference and all data from layers within this map will be plotted using this coordinate system. If any layers do not declare an srs value then they will be assumed to be in the same srs as the Map and not transformations will be needed to plot them in the Map&#39;s coordinate space.)_

Map spatial reference (proj4 string).
* * *

##### buffer-size `float`



Default Value: 0
_(No buffer will be used.)_

Extra tolerance around the map (in pixels) used to ensure labels crossing tile boundaries are equally rendered in each tile (e.g. cut in each tile). Not intended to be used in combination with "avoid-edges".
* * *

##### maximum-extent `string`



Default Value: -20037508.34,-20037508.34,20037508.34,20037508.34
_(All data will be clipped to global mercator extent (default is applied in Carto.js).)_

An extent to be used to limit the bounds used to query all layers during rendering. Should be minx, miny, maxx, maxy in the coordinates of the Map.
* * *

##### base `string`



Default Value: 
_(This base path defaults to an empty string meaning that any relative paths to files referenced in styles or layers will be interpreted relative to the application process.)_

Any relative paths used to reference files will be understood as relative to this directory path if the map is loaded from an in memory object rather than from the filesystem. If the map is loaded from the filesystem and this option is not provided it will be set to the directory of the stylesheet.
* * *

##### font-directory `uri`



Default Value: none
_(No map-specific fonts will be registered.)_

Path to a directory which holds fonts which should be registered when the Map is loaded (in addition to any fonts that may be automatically registered).
* * *


## polygon

##### polygon-fill `color`



Default Value: The color gray will be used for fill.
_(Gray and fully opaque (alpha = 1), same as rgb(128,128,128) or rgba(128,128,128,1).)_

Fill color to assign to a polygon.
* * *

##### polygon-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of the polygon.
* * *

##### polygon-gamma `float`



Default Value: 1
_(Fully antialiased.)_
Range: 0-1
Level of antialiasing of polygon edges.
* * *

##### polygon-gamma-method `keyword`
`power``linear``none``threshold``multiply`


Default Value: power
_(pow(x,gamma) is used to calculate pixel gamma, which produces slightly smoother line and polygon antialiasing than the &#39;linear&#39; method, while other methods are usually only used to disable AA.)_

An Antigrain Geometry specific rendering hint to control the quality of antialiasing. Under the hood in Mapnik this method is used in combination with the 'gamma' value (which defaults to 1). The methods are in the AGG source at https://github.com/mapnik/mapnik/blob/master/deps/agg/include/agg_gamma_functions.
* * *

##### polygon-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extend outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### polygon-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

Simplify geometries by the given tolerance.
* * *

##### polygon-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

Simplify geometries by the given algorithm.
* * *

##### polygon-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### polygon-geometry-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(The geometry will not be transformed.)_

Transform polygon geometry with specified function.
* * *

##### polygon-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## line

##### line-color `color`



Default Value: black
_(black and fully opaque (alpha = 1), same as rgb(0,0,0) or rgba(0,0,0,1).)_

The color of a drawn line.
* * *

##### line-width `float`



Default Value: 1
_(The line will be rendered 1 pixel wide.)_

The width of a line in pixels.
* * *

##### line-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of a line.
* * *

##### line-join `keyword`
`miter``miter-revert``round``bevel`


Default Value: miter
_(The line joins will be rendered using a miter look.)_

The behavior of lines when joining.
* * *

##### line-cap `keyword`
`butt``round``square`


Default Value: butt
_(The line endings will be rendered using a butt look.)_

The display of line endings.
* * *

##### line-gamma `float`



Default Value: 1
_(Fully antialiased.)_
Range: 0-1
Level of antialiasing of stroke line.
* * *

##### line-gamma-method `keyword`
`power``linear``none``threshold``multiply`


Default Value: power
_(pow(x,gamma) is used to calculate pixel gamma, which produces slightly smoother line and polygon antialiasing than the &#39;linear&#39; method, while other methods are usually only used to disable AA.)_

An Antigrain Geometry specific rendering hint to control the quality of antialiasing. Under the hood in Mapnik this method is used in combination with the 'gamma' value (which defaults to 1). The methods are in the AGG source at https://github.com/mapnik/mapnik/blob/master/deps/agg/include/agg_gamma_functions.
* * *

##### line-dasharray `numbers`



Default Value: none
_(The line will be drawn without dashes.)_

A pair of length values [a,b], where (a) is the dash length and (b) is the gap length respectively. More than two values are supported for more complex patterns.
* * *

##### line-dash-offset `numbers`



Default Value: none
_(The line will be drawn without dashes.)_

Valid parameter but not currently used in renderers (only exists for experimental svg support in Mapnik which is not yet enabled).
* * *

##### line-miterlimit `float`



Default Value: 4
_(Will auto-convert miters to bevel line joins when theta is less than 29 degrees as per the SVG spec: &#39;miterLength / stroke-width = 1 / sin ( theta / 2 )&#39;.)_

The limit on the ratio of the miter length to the stroke-width. Used to automatically convert miter joins to bevel joins for sharp angles to avoid the miter extending beyond the thickness of the stroking path. Normally will not need to be set, but a larger value can sometimes help avoid jaggy artifacts.
* * *

##### line-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### line-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

Simplify geometries by the given tolerance.
* * *

##### line-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

Simplify geometries by the given algorithm.
* * *

##### line-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### line-offset `float`



Default Value: 0
_(Will not be offset.)_

Offsets a line a number of pixels parallel to its actual path. Positive values move the line left, negative values move it right (relative to the directionality of the line).
* * *

##### line-rasterizer `keyword`
`full``fast`


Default Value: full
_(The line will be rendered using the highest quality method rather than the fastest.)_

Exposes an alternate AGG rendering method that sacrifices some accuracy for speed.
* * *

##### line-geometry-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(The geometry will not be transformed.)_

Transform line geometry with specified function.
* * *

##### line-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## markers

##### marker-file `uri`



Default Value: none
_(An ellipse or circle, if width equals height.)_

A file that this marker shows at each placement. If no file is given, the marker will show an ellipse. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### marker-opacity `float`



Default Value: 1
_(The stroke-opacity and fill-opacity of the marker.)_

The overall opacity of the marker, if set, overrides both the opacity of the fill and the opacity of the stroke.
* * *

##### marker-fill-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The fill opacity of the marker.
* * *

##### marker-line-color `color`



Default Value: black
_(The marker will be drawn with a black outline.)_

The color of the stroke around the marker.
* * *

##### marker-line-width `float`



Default Value: 0.5
_(The marker will be drawn with an outline of .5 pixels wide.)_

The width of the stroke around the marker, in pixels. This is positioned on the boundary, so high values can cover the area itself.
* * *

##### marker-line-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of a line.
* * *

##### marker-placement `keyword`
`point``line``interior``vertex-first``vertex-last`


Default Value: point
_(Place markers at the center point (centroid) of the geometry.)_

Attempt to place markers on a point, in the center of a polygon, or if markers-placement:line, then multiple times along a line. 'interior' placement can be used to ensure that points placed on polygons are forced to be inside the polygon interior. The 'vertex-first' and 'vertex-last' options can be used to place markers at the first or last vertex of lines or polygons.
* * *

##### marker-multi-policy `keyword`
`each``whole``largest`


Default Value: each
_(If a feature contains multiple geometries and the placement type is either point or interior then a marker will be rendered for each.)_

A special setting to allow the user to control rendering behavior for 'multi-geometries' (when a feature contains multiple geometries). This setting does not apply to markers placed along lines. The 'each' policy is default and means all geometries will get a marker. The 'whole' policy means that the aggregate centroid between all geometries will be used. The 'largest' policy means that only the largest (by bounding box areas) feature will get a rendered marker (this is how text labeling behaves by default).
* * *

##### marker-type `keyword`
`arrow``ellipse`


Default Value: ellipse
_(The marker shape is an ellipse.)_

The default marker-type. If a SVG file is not given as the marker-file parameter, the renderer provides either an arrow or an ellipse (a circle if height is equal to width).
* * *

##### marker-width `float`



Default Value: 10
_(The marker width is 10 pixels.)_

The width of the marker, if using one of the default types.
* * *

##### marker-height `float`



Default Value: 10
_(The marker height is 10 pixels.)_

The height of the marker, if using one of the default types.
* * *

##### marker-fill `color`



Default Value: blue
_(The marker fill color is blue.)_

The color of the area of the marker.
* * *

##### marker-allow-overlap `boolean`



Default Value: false
_(Do not allow markers to overlap with each other - overlapping markers will not be shown.)_

Control whether overlapping markers are shown or hidden.
* * *

##### marker-avoid-edges `boolean`



Default Value: false
_(Markers will be potentially placed near tile edges and therefore may look cut off unless they are rendered on each adjacent tile.)_

Avoid placing markers that intersect with tile boundaries.
* * *

##### marker-ignore-placement `boolean`



Default Value: false
_(do not store the bbox of this geometry in the collision detector cache.)_

Value to control whether the placement of the feature will prevent the placement of other features.
* * *

##### marker-spacing `float`



Default Value: 100
_(In the case of marker-placement:line then draw a marker every 100 pixels along a line.)_

Space between repeated markers in pixels. If the spacing is less than the marker size or larger than the line segment length then no marker will be placed. Any value less than 1 will be ignored and the default will be used instead.
* * *

##### marker-max-error `float`



Default Value: 0.2
_(N/A: not intended to be changed.)_

N/A: not intended to be changed.
* * *

##### marker-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(No transformation.)_

Transform marker instance with specified function. Ignores map scale factor.
* * *

##### marker-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### marker-simplify `float`



Default Value: 0
_(Geometry will not be simplified.)_

geometries are simplified by the given tolerance.
* * *

##### marker-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

geometries are simplified by the given algorithm.
* * *

##### marker-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### marker-geometry-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(The geometry will not be transformed.)_

Transform marker geometry with specified function.
* * *

##### marker-offset `float`



Default Value: 0
_(Will not be offset.)_

Offsets a marker from a line a number of pixels parallel to its actual path. Positive values move the marker left, negative values move it right (relative to the directionality of the line).
* * *

##### marker-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *

##### marker-direction `keyword`
`auto``auto-down``left``right``left-only``right-only``up``down`


Default Value: right
_(Markers are oriented to the right in the line direction.)_

How markers should be placed along lines. With the "auto" setting when marker is upside down the marker is automatically rotated by 180 degrees to keep it upright. The "auto-down" value places marker in the opposite orientation to "auto". The "left" or "right" settings can be used to force marker to always be placed along a line in a given direction and therefore disables rotating if marker appears upside down. The "left-only" or "right-only" properties also force a given direction but will discard upside down markers rather than trying to flip it. The "up" and "down" settings don't adjust marker's orientation to the line direction.
* * *


## shield

##### shield-name `string`



Default Value: 
_(No text label will be rendered with the shield.)_

Value to use for a shield"s text label. Data columns are specified using brackets like [column_name].
* * *

##### shield-file `uri`



Default Value: none


Image file to render behind the shield text. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### shield-face-name `string`



Default Value: none


Font name and style to use for the shield text.
* * *

##### shield-unlock-image `boolean`



Default Value: false
_(text alignment relative to the shield image uses the center of the image as the anchor for text positioning.)_

This parameter should be set to true if you are trying to position text beside rather than on top of the shield image.
* * *

##### shield-size `float`



Default Value: 10
_(Font size of 10 will be used to render text.)_

The size of the shield text in pixels.
* * *

##### shield-fill `color`



Default Value: black
_(The shield text will be rendered black.)_

The color of the shield text.
* * *

##### shield-placement `keyword`
`point``line``vertex``interior`


Default Value: point
_(One shield will be placed per geometry.)_

How this shield should be placed. Point placement places one shield on top of a point geometry and at the centroid of a polygon or the middle point of a line, line places along lines multiple times per feature, vertex places on the vertexes of polygons, and interior attempts to place inside of a polygon.
* * *

##### shield-avoid-edges `boolean`



Default Value: false
_(Shields will be potentially placed near tile edges and therefore may look cut off unless they are rendered on each adjacent tile.)_

Avoid placing shields that intersect with tile boundaries.
* * *

##### shield-allow-overlap `boolean`



Default Value: false
_(Do not allow shields to overlap with other map elements already placed.)_

Control whether overlapping shields are shown or hidden.
* * *

##### shield-margin `float`



Default Value: 0
_(No extra margin will be used to determine if a shield collides with any other text, shield, or marker.)_

Minimum distance that a shield can be placed from any other text, shield, or marker.
* * *

##### shield-repeat-distance `float`



Default Value: 0
_(Shields with the same text will be rendered without restriction.)_

Minimum distance between repeated shields. If set this will prevent shields being rendered nearby each other that contain the same text. Similiar to shield-min-distance with the difference that it works the same no matter what placement strategy is used.
* * *

##### shield-min-distance `float`



Default Value: 0
_(Shields with the same text will be rendered without restriction.)_

Minimum distance to the next shield with the same text. Only works for line placement.
* * *

##### shield-spacing `float`



Default Value: 0
_(Only one shield per line will attempt to be placed.)_

Distance the renderer should use to try to place repeated shields on a line.
* * *

##### shield-min-padding `float`



Default Value: 0
_(No margin will be used to detect if a shield is nearby a tile boundary.)_

Minimum distance a shield will be placed from the edge of a tile. This option is similiar to shield-avoid-edges:true except that the extra margin is used to discard cases where the shield+margin are not fully inside the tile.
* * *

##### shield-label-position-tolerance `float`



Default Value: shield-spacing/2.0
_(If a shield cannot be placed then the renderer will advance by shield-spacing/2.0 to try placement again.)_

Allows the shield to be displaced from its ideal position by a number of pixels (only works with placement:line).
* * *

##### shield-wrap-width `unsigned`



Default Value: 0
_(Text will not be wrapped.)_

Length of a chunk of text in pixels before wrapping text. If set to zero, text doesn't wrap.
* * *

##### shield-wrap-before `boolean`



Default Value: false
_(Wrapped lines will be a bit longer than wrap-width.)_

Wrap text before wrap-width is reached.
* * *

##### shield-wrap-character `string`



Default Value: " "
_(Lines will be wrapped when whitespace is encountered.)_

Use this character instead of a space to wrap long names.
* * *

##### shield-halo-fill `color`



Default Value: white
_(The shield halo text will be rendered white.)_

Specifies the color of the halo around the text.
* * *

##### shield-halo-radius `float`



Default Value: 0
_(no halo.)_

Specify the radius of the halo in pixels.
* * *

##### shield-halo-rasterizer `keyword`
`full``fast`


Default Value: full
_(The shield will be rendered using the highest quality method rather than the fastest.)_

Exposes an alternate text halo rendering method that sacrifices quality for speed.
* * *

##### shield-halo-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: 
_(No transformation.)_

Transform shield halo relative to the actual text with specified function. Allows for shadow or embossed effects. Ignores map scale factor.
* * *

##### shield-halo-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``screen``overlay``darken``lighten``color-dodge``color-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *

##### shield-halo-opacity `float`



Default Value: 1
_(Fully opaque.)_

A number from 0 to 1 specifying the opacity for the text halo.
* * *

##### shield-character-spacing `unsigned`



Default Value: 0
_(The default character spacing of the font will be used.)_

Horizontal spacing between characters (in pixels). Currently works for point placement only, not line placement.
* * *

##### shield-line-spacing `unsigned`



Default Value: 0
_(The default font spacing will be used.)_

Vertical spacing between lines of multiline labels (in pixels).
* * *

##### shield-text-dx `float`



Default Value: 0
_(Text will not be displaced.)_

Displace text within shield by fixed amount, in pixels, +/- along the X axis.  A positive value will shift the shield right.
* * *

##### shield-text-dy `float`



Default Value: 0
_(Text will not be displaced.)_

Displace text within shield by fixed amount, in pixels, +/- along the Y axis.  A positive value will shift the shield down.
* * *

##### shield-dx `float`



Default Value: 0
_(Shield will not be displaced.)_

Displace shield by fixed amount, in pixels, +/- along the X axis.  A positive value will shift the text right.
* * *

##### shield-dy `float`



Default Value: 0
_(Shield will not be displaced.)_

Displace shield by fixed amount, in pixels, +/- along the Y axis.  A positive value will shift the text down.
* * *

##### shield-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of the image used for the shield.
* * *

##### shield-text-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of the text placed on top of the shield.
* * *

##### shield-horizontal-alignment `keyword`
`left``middle``right``auto`


Default Value: auto
_(TODO.)_

The shield's horizontal alignment from its centerpoint.
* * *

##### shield-vertical-alignment `keyword`
`top``middle``bottom``auto`


Default Value: middle
_(TODO.)_

The shield's vertical alignment from its centerpoint.
* * *

##### shield-placement-type `keyword`
`dummy``simple``list`


Default Value: dummy
_(Alternative placements will not be enabled.)_

Re-position and/or re-size shield to avoid overlaps. "simple" for basic algorithm (using shield-placements string,) "dummy" to turn this feature off.
* * *

##### shield-placements `string`



Default Value: 
_(No alternative placements will be used.)_

If "placement-type" is set to "simple", use this "POSITIONS,[SIZES]" string. An example is `shield-placements: "E,NE,SE,W,NW,SW";`.
* * *

##### shield-text-transform `keyword`
`none``uppercase``lowercase``capitalize``reverse`


Default Value: none
_(No text transformation will be applied.)_

Transform the case of the characters.
* * *

##### shield-justify-alignment `keyword`
`left``center``right``auto`


Default Value: auto
_(TODO.)_

Define how text in a shield's label is justified.
* * *

##### shield-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(No transformation.)_

Transform shield instance with specified function. Ignores map scale factor.
* * *

##### shield-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### shield-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

Simplify the geometries used for shield placement by the given tolerance.
* * *

##### shield-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

Simplify the geometries used for shield placement by the given algorithm.
* * *

##### shield-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out the angles of the geometry used for shield placement. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### shield-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## line-pattern

##### line-pattern-file `uri`



Default Value: none


An image file to be repeated and warped along a line. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### line-pattern-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### line-pattern-opacity `float`



Default Value: 1
_(The image is rendered without modifications.)_

Apply an opacity level to the image used for the pattern.
* * *

##### line-pattern-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

geometries are simplified by the given tolerance.
* * *

##### line-pattern-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

geometries are simplified by the given algorithm.
* * *

##### line-pattern-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### line-pattern-offset `float`



Default Value: 0
_(The line will not be offset.)_

Offsets a line a number of pixels parallel to its actual path. Positive values move the line left, negative values move it right (relative to the directionality of the line).
* * *

##### line-pattern-geometry-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(The geometry will not be transformed.)_

Transform line geometry with specified function and apply pattern to transformed geometry.
* * *

##### line-pattern-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## polygon-pattern

##### polygon-pattern-file `uri`



Default Value: none


Image to use as a repeated pattern fill within a polygon. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### polygon-pattern-alignment `keyword`
`global``local`


Default Value: global
_(Patterns will be aligned to the map (or tile boundaries) when being repeated across polygons. This is ideal for seamless patterns in tiled rendering.)_

Specify whether to align pattern fills to the layer's geometry (local) or to the map (global).
* * *

##### polygon-pattern-gamma `float`



Default Value: 1
_(Fully antialiased.)_
Range: 0-1
Level of antialiasing of polygon pattern edges.
* * *

##### polygon-pattern-opacity `float`



Default Value: 1
_(The image is rendered without modifications.)_

Apply an opacity level to the image used for the pattern.
* * *

##### polygon-pattern-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### polygon-pattern-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

geometries are simplified by the given tolerance.
* * *

##### polygon-pattern-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

geometries are simplified by the given algorithm.
* * *

##### polygon-pattern-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out geometry angles. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### polygon-pattern-geometry-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(The geometry will not be transformed.)_

Transform polygon geometry with specified function and apply pattern to transformed geometry.
* * *

##### polygon-pattern-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## raster

##### raster-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of the raster symbolizer on top of other symbolizers.
* * *

##### raster-filter-factor `float`



Default Value: -1
_(Allow the datasource to choose appropriate downscaling.)_

This is used by the Raster or Gdal datasources to pre-downscale images using overviews. Higher numbers can sometimes cause much better scaled image output, at the cost of speed.
* * *

##### raster-scaling `keyword`
`near``fast``bilinear``bicubic``spline16``spline36``hanning``hamming``hermite``kaiser``quadric``catrom``gaussian``bessel``mitchell``sinc``lanczos``blackman`


Default Value: near
_(Nearest neighboor resampling will be used to scale the image to the target size of the map.)_

The scaling algorithm used to making different resolution versions of this raster layer. Bilinear is a good compromise between speed and accuracy, while lanczos gives the highest quality.
* * *

##### raster-mesh-size `unsigned`



Default Value: 16
_(Reprojection mesh will be 1/16 of the resolution of the source image.)_

A reduced resolution mesh is used for raster reprojection, and the total image size is divided by the mesh-size to determine the quality of that mesh. Values for mesh-size larger than the default will result in faster reprojection but might lead to distortion.
* * *

##### raster-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *

##### raster-colorizer-default-mode `keyword`
`discrete``linear``exact`


Default Value: linear
_(A linear interpolation is used to generate colors between the two nearest stops.)_

This can be either `discrete`, `linear` or `exact`. If it is not specified then the default is `linear`.
* * *

##### raster-colorizer-default-color `color`



Default Value: transparent
_(Pixels that are not colored by the colorizer stops will be transparent.)_

This can be any color. Sets the color that is applied to all values outside of the range of the colorizer-stops. If not supplied pixels will be fully transparent.
* * *

##### raster-colorizer-epsilon `float`



Default Value: 1.1920928955078125e-07
_(Pixels must very closely match the stop filter otherwise they will not be colored.)_

This can be any positive floating point value and will be used as a tolerance in floating point comparisions. The higher the value the more likely a stop will match and color data.
* * *

##### raster-colorizer-stops `tags`



Default Value: 
_(No colorization will happen without supplying stops.)_

Assigns raster data values to colors. Stops must be listed in ascending order, and contain at a minimum the value and the associated color. You can also include the color-mode as a third argument, like `stop(100,#fff,exact)`.
* * *


## point

##### point-file `uri`



Default Value: none
_(A 4x4 black square will be rendered.)_

Image file to represent a point. Accepted formats: svg, jpg, png, tiff, and webp.
* * *

##### point-allow-overlap `boolean`



Default Value: false
_(Do not allow points to overlap with each other - overlapping markers will not be shown.)_

Control whether overlapping points are shown or hidden.
* * *

##### point-ignore-placement `boolean`



Default Value: false
_(do not store the bbox of this geometry in the collision detector cache.)_

Control whether the placement of the feature will prevent the placement of other features.
* * *

##### point-opacity `float`



Default Value: 1
_(Fully opaque.)_

A value from 0 to 1 to control the opacity of the point.
* * *

##### point-placement `keyword`
`centroid``interior`


Default Value: centroid
_(The centroid of the geometry will be used to place the point.)_

Control how this point should be placed. Centroid calculates the geometric center of a polygon, which can be outside of it, while interior always places inside of a polygon.
* * *

##### point-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: none
_(No transformation.)_

Transform point instance with specified function. Ignores map scale factor.
* * *

##### point-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *


## text

##### text-name `string`



Default Value: none


Value to use for a text label. Data columns are specified using brackets like [column_name].
* * *

##### text-face-name `string`



Default Value: none


Font name and style to render a label in.
* * *

##### text-size `float`



Default Value: 10
_(Font size of 10 will be used to render text.)_

Text size in pixels.
* * *

##### text-ratio `unsigned`



Default Value: 0
_(TODO.)_

Define the amount of text (of the total) present on successive lines when wrapping occurs.
* * *

##### text-wrap-width `unsigned`



Default Value: 0
_(Text will not be wrapped.)_

Length of a chunk of text in pixels before wrapping text. If set to zero, text doesn't wrap.
* * *

##### text-wrap-before `boolean`



Default Value: false
_(Wrapped lines will be a bit longer than wrap-width.)_

Wrap text before wrap-width is reached.
* * *

##### text-wrap-character `string`



Default Value: " "
_(Lines will be wrapped when whitespace is encountered.)_

Use this character instead of a space to wrap long text.
* * *

##### text-repeat-wrap-character `boolean`



Default Value: false
_(Character will be removed when used to wrap a line.)_

Keep the character used to wrap a line instead of removing it, and repeat it on the new line.
* * *

##### text-spacing `unsigned`



Default Value: 0
_(Only one label per line will attempt to be placed.)_

Distance the renderer should use to try to place repeated text labels on a line.
* * *

##### text-character-spacing `float`



Default Value: 0
_(The default character spacing of the font will be used.)_

Horizontal spacing adjustment between characters in pixels. This value is ignored when `horizontal-alignment` is set to `adjust`. Typographic ligatures are turned off when this value is greater than zero.
* * *

##### text-line-spacing `unsigned`



Default Value: 0
_(The default font spacing will be used.)_

Vertical spacing adjustment between lines in pixels.
* * *

##### text-label-position-tolerance `float`



Default Value: text-spacing/2.0
_(If a shield cannot be placed then the renderer will advance by text-spacing/2.0 to try placement again.)_

Allows the label to be displaced from its ideal position by a number of pixels (only works with placement:line).
* * *

##### text-max-char-angle-delta `float`



Default Value: 22.5
_(The label will not be placed if a character falls on a line with an angle sharper than 22.5 degrees.)_

The maximum angle change, in degrees, allowed between adjacent characters in a label. This value internally is converted to radians to the default is 22.5*math.pi/180.0. The higher the value the fewer labels will be placed around around sharp corners.
* * *

##### text-fill `color`



Default Value: black
_(The text will be rendered black.)_

Specifies the color for the text.
* * *

##### text-opacity `float`



Default Value: 1
_(Fully opaque.)_

A number from 0 to 1 specifying the opacity for the text.
* * *

##### text-halo-opacity `float`



Default Value: 1
_(Fully opaque.)_

A number from 0 to 1 specifying the opacity for the text halo.
* * *

##### text-halo-fill `color`



Default Value: white
_(The halo will be rendered white.)_

Specifies the color of the halo around the text.
* * *

##### text-halo-radius `float`



Default Value: 0
_(no halo.)_

Specify the radius of the halo in pixels.
* * *

##### text-halo-rasterizer `keyword`
`full``fast`


Default Value: full
_(The text will be rendered using the highest quality method rather than the fastest.)_

Exposes an alternate text halo rendering method that sacrifices quality for speed.
* * *

##### text-halo-transform `functions`

`matrix``translate``scale``rotate``skewX``skewY`

Default Value: 
_(No transformation.)_

Transform text halo relative to the actual text with specified function. Allows for shadow or embossed effects. Ignores map scale factor.
* * *

##### text-dx `float`



Default Value: 0
_(Text will not be displaced.)_

Displace text by fixed amount, in pixels, +/- along the X axis.  With "dummy" placement-type, a positive value displaces to the right. With "simple" placement-type, it is either left, right or unchanged, depending on the placement selected. Any non-zero value implies "horizontal-alignment" changes to "left" by default. Has no effect with 'line' text-placement-type.
* * *

##### text-dy `float`



Default Value: 0
_(Text will not be displaced.)_

Displace text by fixed amount, in pixels, +/- along the Y axis.  With "dummy" placement-type, a positive value displaces downwards. With "simple" placement-type, it is either up, down or unchanged, depending on the placement selected. With "line" placement-type, a positive value displaces above the path.
* * *

##### text-vertical-alignment `keyword`
`top``middle``bottom``auto`


Default Value: auto
_(Default affected by value of dy; &quot;top&quot; for dy&gt;0, &quot;bottom&quot; for dy&lt;0.)_

Position of label relative to point position.
* * *

##### text-avoid-edges `boolean`



Default Value: false
_(Text will be potentially placed near tile edges and therefore may look cut off unless the same text label is rendered on each adjacent tile.)_

Avoid placing labels that intersect with tile boundaries.
* * *

##### text-margin `float`



Default Value: 0
_(No extra margin will be used to determine if a label collides with any other text, shield, or marker.)_

Minimum distance that a label can be placed from any other text, shield, or marker.
* * *

##### text-repeat-distance `float`



Default Value: 0
_(Labels with the same text will be rendered without restriction.)_

Minimum distance between repeated text. If set this will prevent text labels being rendered nearby each other that contain the same text. Similiar to text-min-distance with the difference that it works the same no matter what placement strategy is used.
* * *

##### text-min-distance `float`



Default Value: 0
_(Labels with the same text will be rendered without restriction.)_

Minimum distance to the next label with the same text. Only works for line placement. Deprecated: replaced by `text-repeat-distance` and `text-margin`
* * *

##### text-min-padding `float`



Default Value: 0
_(No margin will be used to detect if a text label is nearby a tile boundary.)_

Minimum distance a text label will be placed from the edge of a tile. This option is similiar to shield-avoid-edges:true except that the extra margin is used to discard cases where the shield+margin are not fully inside the tile.
* * *

##### text-min-path-length `float`



Default Value: 0
_(place labels on all geometries no matter how small they are.)_

Place labels only on polygons and lines with a bounding width longer than this value (in pixels).
* * *

##### text-allow-overlap `boolean`



Default Value: false
_(Do not allow text to overlap with other text - overlapping markers will not be shown.)_

Control whether overlapping text is shown or hidden.
* * *

##### text-orientation `float`



Default Value: 0
_(Text is not rotated and is displayed upright.)_

Rotate the text. (only works with text-placement:point).
* * *

##### text-rotate-displacement `boolean`



Default Value: false
_(Label center is used for rotation.)_

Rotates the displacement around the placement origin by the angle given by "orientation".
* * *

##### text-upright `keyword`
`auto``auto-down``left``right``left-only``right-only`


Default Value: auto
_(Text will be positioned upright automatically.)_

How this label should be placed along lines. By default when more than half of a label's characters are upside down the label is automatically flipped to keep it upright. By changing this parameter you can prevent this "auto-upright" behavior. The "auto-down" value places text in the opposite orientation to "auto". The "left" or "right" settings can be used to force text to always be placed along a line in a given direction and therefore disables flipping if text appears upside down. The "left-only" or "right-only" properties also force a given direction but will discard upside down text rather than trying to flip it.
* * *

##### text-placement `keyword`
`point``line``vertex``interior`


Default Value: point
_(One shield will be placed per geometry.)_

How this label should be placed. Point placement places one label on top of a point geometry and at the centroid of a polygon or the middle point of a line, line places along lines multiple times per feature, vertex places on the vertexes of polygons, and interior attempts to place inside of a polygon.
* * *

##### text-placement-type `keyword`
`dummy``simple``list`


Default Value: dummy
_(Alternative placements will not be enabled.)_

Re-position and/or re-size text to avoid overlaps. "simple" for basic algorithm (using text-placements string,) "dummy" to turn this feature off.
* * *

##### text-placements `string`



Default Value: 
_(No alternative placements will be used.)_

If "placement-type" is set to "simple", use this "POSITIONS,[SIZES]" string. An example is `text-placements: "E,NE,SE,W,NW,SW";`.
* * *

##### text-transform `keyword`
`none``uppercase``lowercase``capitalize``reverse`


Default Value: none
_(Transform text instance with specified function. Ignores map scale factor.)_

Transform the case of the characters.
* * *

##### text-horizontal-alignment `keyword`
`left``middle``right``auto``adjust`


Default Value: auto
_(TODO.)_

The text's horizontal alignment from it's centerpoint. If `placement` is set to `line`, then `adjust` can be set to auto-fit the text to the length of the path by dynamically calculating `character-spacing`.
* * *

##### text-align `keyword`
`left``right``center``auto`


Default Value: auto
_(Auto alignment means that text will be centered by default except when using the &#96;placement-type&#96; parameter - in that case either right or left justification will be used automatically depending on where the text could be fit given the &#96;text-placements&#96; directives.)_

Define how text is justified.
* * *

##### text-clip `boolean`



Default Value: false
_(The geometry will not be clipped to map bounds before rendering.)_

Turning on clipping can help performance in the case that the boundaries of the geometry extent outside of tile extents. But clipping can result in undesirable rendering artifacts in rare cases.
* * *

##### text-simplify `float`



Default Value: 0
_(geometry will not be simplified.)_

Simplify the geometries used for text placement by the given tolerance.
* * *

##### text-simplify-algorithm `keyword`
`radial-distance``zhao-saalfeld``visvalingam-whyatt`


Default Value: radial-distance
_(The geometry will be simplified using the radial distance algorithm.)_

Simplify the geometries used for text placement by the given algorithm.
* * *

##### text-smooth `float`



Default Value: 0
_(No smoothing.)_
Range: 0-1
Smooths out the angles of the geometry used for text placement. 0 is no smoothing, 1 is fully smoothed. Values greater than 1 will produce wild, looping geometries.
* * *

##### text-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *

##### text-halo-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``screen``overlay``darken``lighten``color-dodge``color-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current symbolizer on top of other symbolizer.)_

Composite operation. This defines how this symbolizer should behave relative to symbolizers atop or below it.
* * *

##### text-font-feature-settings `string`



Default Value: 
_(Default set of typographic features recommended by OpenType specification. Ligatures are turned off by default when &#96;character-spacing&#96; is greater than zero.)_

Comma separated list of OpenType typographic features. The syntax and semantics conforms to `font-feature-settings` from W3C CSS.
* * *

##### text-largest-bbox-only `boolean`



Default Value: true
_(For multipolygons only polygon with largest bbox area is labeled (does not apply to other geometries).)_

Controls default labeling behavior on multipolygons. The default is true and means that only the polygon with largest bbox is labeled.
* * *


## building

##### building-fill `color`



Default Value: The color gray will be used for fill.
_(Gray and fully opaque (alpha = 1), same as rgb(128,128,128) or rgba(128,128,128,1).)_

The color of the buildings fill. Note: 0.8 will be used to multiply each color component to auto-generate a darkened wall color.
* * *

##### building-fill-opacity `float`



Default Value: 1
_(Color is fully opaque.)_

The opacity of the building as a whole, including all walls.
* * *

##### building-height `float`



Default Value: 0
_(Buildings will not have a visual height and will instead look like flat polygons.)_

The height of the building in pixels.
* * *


## debug

##### debug-mode `string`



Default Value: collision
_(The otherwise invisible collision boxes will be rendered as squares on the map.)_

The mode for debug rendering.
* * *


## dot

##### dot-fill `color`



Default Value: gray
_(The dot fill color is gray.)_

The color of the area of the dot.
* * *

##### dot-opacity `float`



Default Value: 1
_(The opacity of the dot.)_

The overall opacity of the dot.
* * *

##### dot-width `float`



Default Value: 1
_(The marker width is 1 pixel.)_

The width of the dot in pixels.
* * *

##### dot-height `float`



Default Value: 1
_(The marker height is 1 pixels.)_

The height of the dot in pixels.
* * *

##### dot-comp-op `keyword`
`clear``src``dst``src-over``dst-over``src-in``dst-in``src-out``dst-out``src-atop``dst-atop``xor``plus``minus``multiply``divide``screen``overlay``darken``lighten``color-dodge``color-burn``linear-dodge``linear-burn``hard-light``soft-light``difference``exclusion``contrast``invert``invert-rgb``grain-merge``grain-extract``hue``saturation``color``value`


Default Value: src-over
_(Add the current layer on top of other layers.)_

Composite operation. This defines how this layer should behave relative to layers atop or below it.
* * *




### Values

Below is a list of values and an explanation of any expression that can be applied to properties in CartCSS.

### Color

CartoCSS accepts a variety of syntaxes for colors - HTML-style hex values, rgb, rgba, hsl, hsla, husl, and husla. It also supports the predefined HTML colors names, like `yellow` and `blue`.

``` css
#line {
line-color: #ff0;
line-color: #ffff00;
line-color: rgb(255, 255, 0);
line-color: rgba(255, 255, 0, 1);
line-color: hsl(100, 50%, 50%);
line-color: hsla(100, 50%, 50%, 1);
line-color: husl(100, 50%, 50%); // same values yield different color than HSL
line-color: husla(100, 50%, 50%, 1);
line-color: yellow;
}
```

Especially of note is the support for hsl and husl, which can be [easier to reason about than rgb()](http://mothereffinghsl.com/). Carto also includes several color operation functions [borrowed from less](http://lesscss.org/functions/#color-operations):

``` css
// lighten and darken colors
lighten(#ace, 10%);
darken(#ace, 10%);

// saturate and desaturate
saturate(#550000, 10%);
desaturate(#00ff00, 10%);

// increase or decrease the opacity of a color
fadein(#fafafa, 10%);
fadeout(#fefefe, 14%);

// spin rotates a color around the color wheel by degrees
spin(#ff00ff, 10);

// mix generates a color in between two other colors.
mix(#fff, #000, 50%);

// get color components
hue(#ff00ff);
saturation(#ff00ff);
lightness(#ff00ff);
alpha(hsla(100, 50%, 50%, 0.5));
```

These functions all take arguments which can be color variables, literal colors, or the results of other functions operating on colors. All the above mentioned functions also come in
a `functionp`-variant (e.g. `lightenp`), which force a given color into perceptual color space.

### Float

Float is a fancy way of saying 'number'. In CartoCSS, you specify _just a number_ - unlike CSS, there are no units, but everything is specified in pixels.

``` css
#line {
line-width: 2;
}
```

It's also possible to do simple math with number values:

``` css
#line {
line-width: 4 / 2; // division
line-width: 4 + 2; // addition
line-width: 4 - 2; // subtraction
line-width: 4 * 2; // multiplication
line-width: 4 % 2; // modulus
}
```

### URI

URI is a fancy way of saying URL. When an argument is a URI, you use the same kind of `url('place.png')` notation that you would with HTML. Quotes around the URL aren't required, but are highly recommended. URIs can be paths to places on your computer, or on the internet.

```css
#markers {
marker-file: url('marker.png');
}
```

### String

A string is basically just text. In the case of CartoCSS, you're going to put it in quotes. Strings can be anything, though pay attention to the cases of `text-name` and `shield-name` - they actually will refer to features, which you refer to by putting them in brackets, as seen in the example below.

```css
#labels {
text-name: "[MY_FIELD]";
}
```

### Boolean

Boolean means yes or no, so it accepts the values `true` or `false`.

```css
#markers {
marker-allow-overlap:true;
}
```

### Expressions

Expressions are statements that can include fields, numbers, and other types in a really flexible way. You have run into expressions before, in the realm of 'fields', where you'd specify `"[FIELD]"`, but expressions allow you to drop the quotes and also do quick addition, division, multiplication, and concatenation from within Carto syntax.

```css
#buildings {
building-height: [HEIGHT_FIELD] * 10;
}
```

### Numbers
Numbers are comma-separated lists of one or more number in a specific order. They're used in line dash arrays, in which the numbers specify intervals of line, break, and line again.

```css
#disputedboundary {
line-dasharray: 1, 4, 2;
}
```

### Percentages
In Carto, the percentage symbol, `%` universally means `value/100`. It's meant to be used with ratio-related properties, like opacity rules.

_You should not use percentages as widths, heights, or other properties - unlike CSS, percentages are not relative to cascaded classes or page size, they're, as stated, simply the value divided by one hundred._

```css
#world {
// this syntax
polygon-opacity: 50%;

// is equivalent to
polygon-opacity: 0.5;
}
```

### Functions

Functions are comma-separated lists of one or more functions. For instance, transforms use the `functions` type to allow for transforms within Carto, which are optionally chainable.

```css
#point {
point-transform: scale(2, 2);
}
```
