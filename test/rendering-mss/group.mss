#roads-text-ref {
  [highway = 'motorway'][zoom >= 13] {
    group-start-column: 1;
    group-num-columns: 6;
    group-placement: line;
    group-spacing: 750;
    group-min-distance: 30;

    shield/shield-size: 10;
    shield/shield-fill: #fff;
    shield/shield-face-name: "Some Font";
    shield/shield-name: "[ref%]";
    shield/shield-file: url("symbols/mot_shield[length%].png");
  }
}