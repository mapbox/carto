## Developing

Installing:

    git clone https://github.com/mapbox/carto.git
    cd carto
    npm install

Test:

    npm test

Running the head binary:

    ./bin/carto

## Releasing

 - Make sure all tests are passing
 - Ensure CHANGELOG.md is up to date
 - Test relevant applications to ensure no regressions
 - `npm publish`
 - Regenerate documentation (see below)

If there's a high chance of regression, please bump to 1.0.0 so that code using a semver ^ or ~ doesn't auto-upgrade anyone.

For examples of previous releases see: https://github.com/mapbox/carto/issues/440

## Documentation

This repository contains auto-generated documentation of the content of Carto
that's published on Mapbox.com.

    git fetch origin gh-pages:gh-pages

Edit `_docs/package.json` to point to the head version of [mapnik-reference](https://github.com/mapnik/mapnik-reference).

    cd _docs
    npm install
    node generate.js

Then run up a directory and run the testing server:

    cd ../
    jekyll serve -p 4000

Test the new site at `localhost:4000/carto` and if things look good then git add your changes and push.
