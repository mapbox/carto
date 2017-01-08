#world {
  polygon-fill: grey;
  [data_column = null] { polygon-fill: red; polygon-opacity: 0.5; }
  [data_column >= 100] { polygon-fill: blue; }
}

#sea {
  polygon-fill: grey;
  [data_column = null] { polygon-fill: red; }
  [data_column >= 100] { polygon-fill: blue; }
}
