[zoom >= 11] {
  [tourism =~ "anythingelse"] {
    marker-type: ellipse;
    marker-fill: blue;
    marker-width: 6;
  }
}
[zoom >= 12] {
  [tourism = "attraction"] {
    marker-type: ellipse;
    marker-fill: red;
    marker-width: 20;
  }
}
