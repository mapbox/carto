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

If there's a high chance of regression, please bump to a new major version number
so that code using a semver ^ or ~ doesn't auto-upgrade anyone.

For examples of previous releases see: https://github.com/mapbox/carto/issues/440

## Documentation

This repository contains auto-generated documentation of the content of Carto
that's published on readthedocs.io. You find the relevant files in the `docs`
directory. Those files with the extension `rst` are the ones where you find
the documentation sources in reStructuredText.
