MML File Structure
==================

The MML File (we call it like that here because of its file extension .mml) is a
`YAML <https://en.wikipedia.org/wiki/YAML>`_ or `JSON <https://en.wikipedia.org/wiki/JSON>`_
file containing layer definitions and stylesheet references. Thus, it is the central
part of a CartoCSS stylesheet. If you generate Mapnik XML from a stylesheet this is
the file you feed to carto and from which and its references the XML is produced.

If you wonder whether you should use YAML or JSON here is a bit of advice. Internally,
JSON is used because it is a language that is easy to understand for machines.
YAML is a superset of JSON and is easier to read and write for humans and is also
less verbose. If you edit a stylesheet collaboratively and use version control
YAML might make it easier to resolve version conflicts. But carto understands both
forms.

.. note:: YAML makes it less tedious to specify repeating properties like database
   infos for PostGIS datasources or extents by using a language feature called
   `anchors or aliases <http://www.yaml.org/spec/1.2/spec.html#id2785586>`_.

Properties Overview
-------------------

What follows is an overview over properties a MML file can have. Simple ones are described
here while more complex ones get their own section.

center
^^^^^^
Type: ``Array``

Specifies the center coordinates and zoom level of the map. Longitude, latitude and
zoom level in that order. Example (WGS84): ``[-1.28398, 47.08997, 17]``

bounds
^^^^^^
Type: ``Array``

Defines a bounding box of the map extent. Lower left coordinates (longitude, latitude)
and upper right coordinates (longitude, latitude) in that order.
Example (WGS84): ``[-179, -80, 179, 80]``

description
^^^^^^^^^^^
Type: ``String``

A description for the stylesheet (usually a bit longer than the name)

format
^^^^^^
Type: ``Keyword``

Possible values: ``png, jpeg, tiff, webp``

Specifies the output format Mapnik should use. For more details see the `Mapnik wiki
page on Image IO <https://github.com/mapnik/mapnik/wiki/Image-IO>`_.

Layer
^^^^^
Lists all layers in the project (see :ref:`layer-reference`)

maxzoom
^^^^^^^
Type: ``Integer``

Specifies the maximum zoom level for the map

metatile
^^^^^^^^
Type: ``Integer``

Specifies the number of tiles that make up one side of a metatile. For example,
if the number is 2 then the metatile is 2 tiles wide and tall and consists of
4 individual tiles. For efficiency reasons Mapnik generates metatiles before
splitting them into individual tiles.

minzoom
^^^^^^^
Type: ``Integer``

Specifies the minimum zoom level for the map

name
^^^^
Type: ``String``

A name for the stylesheet

_properties
^^^^^^^^^^^
Type: ``Object``

This is the same as the ``properties`` property for layers on a global level with
a bit different structure. It is used when you do not specify the layers in the MML
itself but only reference them. This is used in vector tile styles where the style
and the data are separate.

Specify first the layer name and then below it specify its properties as you would
in the ``properties`` property of the specific layer.

scale
^^^^^
Type: ``Integer``

Specifies pixel scaling for the output. For example, a scale of 2 means that there
are two pixels for each pixel in the output.

srs
^^^
Type: ``String``

Specifies the projection used by Mapnik using the `PROJ.4 <http://proj4.org/>`_
format (SRS means `Spatial reference system <https://en.wikipedia.org/wiki/Spatial_reference_system>`_).
The format can be determined by e.g. using `spatialreference.org <http://spatialreference.org/>`_.

Stylesheet
^^^^^^^^^^
Lists all styles or style files in the project (see :ref:`stylesheet-reference`)

.. _layer-reference:

Layer property
---------------
Type: ``Array``

Within this property layer objects are referenced that are the building blocks
of the map style. The order of specification is important as it constitutes
the drawing order of layers used by Mapnik. Layers specified first are drawn first
and those specified later are drawn afterwards.

Layers have different properties and their data can come from different data sources
such as shape files or relational databases like PostgreSQL/PostGIS.

A layer object can have the following properties.

class
^^^^^
Type: ``String``

One or more classes associated with this layer separated by blanks. In style selectors
a class can be referenced by ``.classname`` if class contains ``classname``.

Datasource
^^^^^^^^^^
Mapnik supports different datasources. Within this property you specify the type
of the datasource and additional properties depending on the type.

Not all possible configuration options for each datasource are listed here. For
further information see the page for the datasource type on the Mapnik Wiki:
e.g. `PostGIS <https://github.com/mapnik/mapnik/wiki/PostGIS>`_,
`PgRaster <https://github.com/mapnik/mapnik/wiki/PgRaster>`_,
`ShapeFile <https://github.com/mapnik/mapnik/wiki/ShapeFile>`_,
`GDAL <https://github.com/mapnik/mapnik/wiki/GDAL>`_,
`OGR <https://github.com/mapnik/mapnik/wiki/OGR>`_,
`OsmPlugin <https://github.com/mapnik/mapnik/wiki/OsmPlugin>`_.

type
""""
Type: ``Keyword``

Possible values: ``shape, postgis, pgraster, raster, (gdal), (ogr), (osm)``

Specifies the format of the data source. Types in parenthesis are *not build
by default* according to the `Mapnik Wiki <https://github.com/mapnik/mapnik/wiki/XMLConfigReference#datasource>`_.

band (gdal, pgraster)
"""""""""""""""""""""
Type: ``Integer``

With this property you can request a specific raster band index (1-based). By
specifying `-1` (gdal) / `0` (pgraster) you request to read all bands.

dbname (postgis, pgraster)
""""""""""""""""""""""""""
Type: ``String``

Specifies the database name of the PostgreSQL database.

encoding (ogr, postgis, shape)
""""""""""""""""""""""""""""""
Type: ``String``

Specifies the encoding of the database or shapefile e.g. `utf-8` or `latin1`.

extent (ogr, postgis, pgraster)
"""""""""""""""""""""""""""""""
Type: ``String``

Specifies the maximum extent of the geometries or raster data.
Lower left coordinates (longitude, latitude) and upper right coordinates
(longitude, latitude) in that order. By default this is deduced from the
metadata of the table.

file (gdal, ogr, osm, raster, shape)
""""""""""""""""""""""""""""""""""""
Type: ``String``

Path and file name.

geometry_field (postgis)
""""""""""""""""""""""""
Type: ``String``

Specifies the name of the column that contains the geometry. Normally this will
be deduced from the query but sometimes it can be necessary to specify it manually
e.g. when there is more than one column with geometry.

host (postgis, pgraster)
""""""""""""""""""""""""
Type: ``String``

Specifies the hostname of the PostgreSQL database.

layer (ogr)
"""""""""""
Type: ``String``

The name of the layer to display.

layer_by_index (ogr)
""""""""""""""""""""
Type: ``Integer``

The index of the layer to display (mandatory if no layer name specified).

layer_by_sql (ogr)
""""""""""""""""""
Type: ``String``

SQL-Statement to execute against the OGR datasource.

password (postgis, pgraster)
""""""""""""""""""""""""""""
Type: ``String``

Specifies the password for connecting to the PostgreSQL database.

port (postgis, pgraster)
""""""""""""""""""""""""
Type: ``String``

Specifies the port of the PostgreSQL database.

raster_field (pgraster)
"""""""""""""""""""""""
Type: ``String``

Specifies the name of the column that contains the raster data. Normally this will
be deduced from the query but sometimes it can be necessary to specify it manually
e.g. when there is more than one column with raster data.

simplify_geometries (postgis)
"""""""""""""""""""""""""""""
Type: ``Boolean``

Specify if input vertices should be automatically reduced or not.

table (postgis, pgraster)
"""""""""""""""""""""""""
Type: ``String``

Either the name of the table to fetch or a sub query `(...) AS queryname`.

user (postgis, pgraster)
""""""""""""""""""""""""
Type: ``String``

Specifies the username for connecting to the PostgreSQL database.

extent
^^^^^^
Type: ``Array``

Defines a bounding box of the layer extent. Lower left coordinates (longitude, latitude)
and upper right coordinates (longitude, latitude) in that order.
Example (WGS84): ``[-179, -80, 179, 80]``

geometry
^^^^^^^^
Type: ``Keyword``

Possible values: ``linestring, point, polygon, raster``

Specifies the geometry type for (the datasource of) this layer.

id
^^
Type: ``String``

A unique identifier for this layer. In style selectors it can be referenced with
``#layerid`` if the id is ``layerid``.

properties
^^^^^^^^^^
Type: ``Object``

This property basically adds any sub-property as attribute to the Mapnik layer. So
available values depend greatly on what Mapnik allows. Here is an (incomplete) list:

abstract
""""""""
Type: ``String``

A short description of this layer (typically longer than the title).

group-by
""""""""
Type: ``String``

Enables `grouped rendering <https://github.com/mapnik/mapnik/wiki/Grouped-rendering>`_
for Mapnik by specifying the field of the datasource that should be used for grouping.
Mapnik then renders all styles of the layer for those features that have the same
value for that field before moving on to other features that have different value.

maxzoom
"""""""
Type: ``Integer``

Specifies the zoom level until which the layer is visible.

minzoom
"""""""
Type: ``Integer``

Specifies the zoom level from which the layer is visible.

status
""""""
Type: ``Integer``

Specifies if the layer is active or not. 0 means inactive or off, 1 means
active or on.

title
"""""
Type: ``String``

The title of this layer. Probably more verbose than the ID.

srs
^^^
Type: ``String``

Specifies the projection for this layer using the `PROJ.4 <http://proj4.org/>`_
format (SRS means `Spatial reference system <https://en.wikipedia.org/wiki/Spatial_reference_system>`_).
The format can be determined by e.g. using `spatialreference.org <http://spatialreference.org/>`_.

srs-name
^^^^^^^^
Type: ``String``

The name of this SRS.

.. _stylesheet-reference:

Stylesheet property
--------------------

Type: ``Array``

You have two options to specify the styles. Either you reference MSS files or
you specify style objects directly.

Referencing style files
^^^^^^^^^^^^^^^^^^^^^^^
Here you reference the style files used in an array of paths/file names. Carto
understands relative as well as absolute paths. The order of style references is
normally not important, but re-definition of variables can be affected by the order
of the style files referenced.

Specifying style objects
^^^^^^^^^^^^^^^^^^^^^^^^
Internally style file references are transformed into style objects anyway, so you
can also specify them directly. This only makes sense if you generate them
programmatically otherwise the notation could become a bit tedious. You specify
an array of style objects. The order of the objects is normally not important,
but re-definition of variables can be affected by the order of the style objects.

A style object consists of the following properties.

id
"""
This is the identifier of the style object. When styles are being read from a
style file this is usually the file name. The property is used when generating
errors or warnings so it is advisable to set something recognizable here.

data
""""
This contains the actual style in the form of a string.
