## CHANGELOG

#### 4.0.5

Tagged Aug 30, 2012

Updated when Mapnik master was at 2e44e8c4

* Various docs fixes

* Added `interior` option for `markers-placement`

* Fixed required values for shields with Mapnik >= 2.1

* Added `map-maximum-extent`

* Fixed up layer and style properties in all versions

* Remove `font-set` which was uneeded

* Fixed doc string for `marker-width`.

#### 4.0.4

Tagged Aug 15, 2012

Updated when Mapnik master was at 4cf1484

* Removed experimental `colorize-alpha` comp-op to match Mapnik removal (https://github.com/mapnik/mapnik/issues/1371).

#### 4.0.3

Tagged Aug 8, 2012

Updated when Mapnik master was at 7847af51e7

* Corrected internally reported versions for `latest` and `2.0.2`

#### 4.0.2

Tagged Aug 8, 2012

Updated when Mapnik master was at 7847af51e7

* Made `point-file` optional
* Added `marker-ignore-placement` to 2.0.1 as per backport (https://github.com/mapnik/mapnik/issues/1163)
* Added new 2.0.2 reference - an exact copy of 2.0.1 as no changes were made in Mapnik between these releases

#### 4.0.1

Tagged Aug 2, 2012

Updated when Mapnik master was at a22b31b0cc

* Added `line-gamma-method` and `polygon-gamma-method`
* Added `line-miterlimit`
* Removed remaining `shield-no-text` from `latest/reference.json`

#### 4.0.0

Tagged Aug 1, 2012

Updated when Mapnik master was at a22b31b0cc

* Now `transform` properties are `functions` type
* Added `fill-opacity` for markers
* Exposed clip and smooth on all appropriate symbolizers
* Declared `text-orientation` as expression type
* Matched `transform` naming with Mapnik
* Fixed default value for `raster-scaling` to `near`
* Added more `raster-scaling` types:
  `near,spline36,hanning,hamming,hermite,kaiser,quadric,catrom,bessel,mitchell,sinc,blackman`
* Removed `raster-mode`, use `raster-comp-op` instead
* Added polygon-pattern-opacity - newly supported in Mapnik
* Fixed up which symbolizers support `comp-op` (removed buildings, added line-pattern)
* Removed `no-text` for shield symbolizer since Mapnik >= 2.1.x no longer uses this.
* Fixed naming of `stroke-dashoffset`
* Renamed all instances of `composite-operation` to `comp-op` to match mapnik/svg spec
* Fixed `buffer-size` type in 2.0.1 reference (uri -> float)
* Improved tests: run them with `make test`

#### 3.1.0

* Add `shield-allow-overlap`
* Add `shield-vertical-alignment`
* Add `text-wrap-before` and `shield-wrap-before`
* Made `marker-width`, `marker-height`, and `shield-name` expressions
* Fixed default value for text/shield alignment properties

#### 3.0.0

* Add `expression` type
* Add `functions` type
* Add transform function definitions for `point-transform` and,
  eventually, other transforms

#### 2.2.2

* Fixed type definition of `font-directory` in reference targeting latest mapnik

#### 2.2.1

* Fixed type definition of `font-directory`, ensuring it is interpreted as a uri

#### 2.2.0

* Add `raster-comp-op` (temporarily named `raster-composite-operation`)

#### 2.1.0

* Add `invert()` image filter function
* Rename `color-spin` compositing to `colorize-alpha`

#### 2.0.0

* The style-property `image-filters` becomes of the `functions`
  type and gains `[name, arity]` specs for each function.

#### 1.0.0

* For the property `buffer-size` under the Map symbolizer,
  the CSS representation becomes `buffer-size`, not `buffer.

#### 0.0.1

* Added symbolizer-specific `composite-operation` code.
