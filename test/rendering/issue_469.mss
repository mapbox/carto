.place {
  [type="continent"][zoom <= 2] {
    text-name: "[name]";
    text-face-name: "Arial";
    text-size: 12;
  }
  [type="country"][zoom <= 3] {
    text-name: "[name]";
    text-face-name: "Arial";
    text-size: 10;
  }
  [type="city"][zoom <= 14] {
    [zoom >= 4] {
      text-name: "[name]";
      text-face-name: "Arial";
      text-size: 10;
    }
    [zoom >= 9] { text-size: 12; }
  }
}
