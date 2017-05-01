#test {
    [zoom >= 3][way_pixels > 0.00000010000][way_pixels < 0.00003600000] {
        text-name: "[name]";
        text-size: 10;
        [zoom >= 4] {
          text-size: 11;
        }
        text-fill: #ff0000;
        text-face-name: 'Arial';
    }
    [zoom >= 3][render = '1_outline'] {
        text-name: "[name]";
        text-size: 12;
        text-fill: #ff0000;
        text-face-name: 'Arial';
    }
}
