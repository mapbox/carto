## Changelog


## 0.15.1

* Support for Mapnik 3.0.4

## 0.15.0

* Support for Mapnik 3.0.3

## 0.14.1

* Support latest Mapnik 3.x
* Bump `mapnik-reference` dependency to 7.x.

## 0.14.0

* Support for Mapnik 3.x
* Bump `mapnik-reference` dependency to ~6.0.1.

## 0.13.0

* Allows optional args in transforms.
* Bump `mapnik-reference` dependency to 5.1.x.

## 0.12.0

* Drop mml2json and xml2js dependency.

## 0.11.0

* Switch API to be synchronous. All errors should be caught using try/catch now.

## 0.10.0

* Remove automatic inclusion of `maximum-extent` on Map element to allow geometries that are buffered past extent bounds (e.g. dateline). 
* Bump `mapnik-reference` dependency to ~5.0.9 (with `shield-halo-rasterizer`)

## 0.9.6

* Fixed support for `text-face-name` values with `&` like `El&Font Bubble`
* Fixed support for filtering on fields containing single quotes. Now `#layer[name="it's"] { ... }` is possible.
* Fixed support for filtering on fields containing `&`. Now `#layer["Hello&Goodbye"="yes"] { ... }` is possible.
* Added support for exponential notation in filters. Now `#layer[value = 1.2e3] { ... }` is possible.
* Bump `mapnik-reference` dependency to ~5.0.8 (with support for Mapnik v2.3.0 and 3.x)

## 0.9.5

* Various speed optimizations to help address #20 (#231)
* Fixed support for fields that contain the word `zoom` in them (previous clashed with `zoom` keyword)
* Fixed support for a space in front of `zoom` keyword (#288)
* Improved error messages when color functions encounter invalid color (#309)
* The `carto` command line tool now exits cleanly when millstone is used
* The `carto` command line tool now only localized with millstone if requested (#243)
* Added man page for `carto` (#257)
* Fix repeated comments in selectors. Fixes #260
* Fixed `image-filter` duplication (#270)
* Quote all needed XML chars. See #263.
* Added higher tolerance for various characters in field names (#230)
* Bump `mapnik-reference` dependency to ~5.0.7 (with support for Mapnik v2.2.0)
* Adds compatibility with screen units.
* Fixed ability to use carto as global module (#236)
* Now using 'console' instead of `util` for `stderr` (#217)

## 0.9.4

* Fixes nesting of regex calls

## 0.9.3

* Allows `text-face-name` properties to be unquoted
* Detects inline Format XML tags in `text-name` and passes such output
  straight to XML for advanced text names.
* Fixes bugs around concatenation of strings in expressions
* Fixes parsing of comments in between selectors
* Fixes parsing of whitespace in calls
* Improved error messages for unknown properties - advises user on
  the property name most closely matching the incorrect input.
* Improved errors for calls, advises user on number of arguments
* Fixes instance inheritance - thanks @gravitystorm!

## 0.9.2

Tagged Sept 6, 2012

* Bump `mapnik-reference` dependency to ~5.0.0
* Better support for unsigned types in certain Mapnik styling properties

## 0.9.1

Tagged Aug 15, 2012

* Improved error handling for different target `mapnik-reference` versions (strk)
* Bump `mapnik-reference` dependency to ~4.0.3
* Fixed handling of image-filter syntax as per [Mapnik changes](https://github.com/mapnik/mapnik/issues/1384)

## 0.9.0

* Bump `mapnik-reference` dependency to ~4.0.0 to pull in new properties.
* Adapted to `comp-op` rename upstream in `mapnik-reference`.
* Adapted to `transform` rename upstream in `mapnik-reference` and Mapnik.

## 0.8.1

* Bump `mapnik-reference` dependency to ~3.1.0 to pull in new properties.

## 0.8.0

* Adds the modulus operator `%` as an option
* Adds a new field-type like `[FIELD]` instead of "[FIELD]"
* Supports function syntax for transforms, optionally with variables and arguments.

### 0.7.1

* Updated mapnik-reference to `~2.2.1`
* Added support for `status` parameter on layers.
* Command line `carto` program gained `--nosymlink` option to pass to millstone to use absolute paths instead of symlinking files.
* Removed unsupported mixin code.

### 0.7.0

* Updated mapnik-reference to `~2.1.0`
* Support an `opacity` property on any style that is a style-level property

### 0.6.0

* Bump `mapnik-reference` dependency to 1.0.0 to allow for using `buffer-size` in the
  `Map` element.

### 0.5.0

* Now uses the [mapnik-reference](https://github.com/mapnik/mapnik-reference) npm module
  instead of copying `reference.json` when it's updated
* Adds a second parameter to `carto.Renderer` - an object which has a key `mapnik_version`
  that specifies the version of Mapnik this stylesheet should target.

### 0.4.10

* Updated reference.json

### 0.4.9

* Render TileJSON, Mapnik options to Mapnik XML parameters.

### 0.4.8

* Updated reference.json

### 0.4.7

* Removed deprecation warnings re: sys/util
* Updated reference.json
* Updated underscore dependency

### 0.4.6

* Node >=v0.6.x compatibility
* Dropped cartox
* Updated reference.json

### 0.4.5

* Fixes text-name with HTML entities
* Fixes function calls with incorrect number of arguments
* Fixes invalid code segments not having eval

### 0.4.3

* Fixes serialization bug with invalid selectors.

### 0.4.0

* Switches text-symbolizer syntax to new-style for Mapnik 2.0

### 0.3.0

* Add "name/" prefix for creating multiple instances of a symbolizer in the same
  attachment
* Only output `<Layer>` tag when there's at least one style
* Sort styles by location of first rule's index
* Don't support selectors that are not either `Map`, `.` or `#`-prefixed.

### 0.2.3

* Fixes many bugs
* Supports arbitrary properties on layers with the `properties` key in MML
* Adds `min-path-length`
* Updates `reference.json`

### 0.2.2

* Update `carto` to use `millstone` if available.

### 0.2.1

* Accept valid Map properties directly from input mml object.

### 0.2.0

* Removed all external handling - see http://github.com/mapbox/millstone for localizing/caching MML objects with external references.
* All errors are now handled as Error objects.

### 0.1.14

* Optional-file datasources - allows string argument to OGR

### 0.1.9

* Variables in filters.

### 0.1.6 & 0.1.8

* Fixed bug caused by jshint testing

### 0.1.5

* Using npm devDependencies in place of ndistro
* Updated package.json format
* Fixes tests

### 0.1.4

* Fix bug in which SRS autodetection broke error handling
* Update carto


