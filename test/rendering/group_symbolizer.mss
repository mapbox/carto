.shield {
  shield-file: url('generic_shield.svg');
  shield-name: [shield_num%];
  shield-face-name: "DejaVu Sans Bold";
  text-name: [above_text%];
  text-face-name: "DejaVu Sans Book";
  text-dy: -15;
}

#shield-us {
  shield-file: url('state_highway.svg');
  [[type%]="I"] {
    shield-file: url('interstate.svg');
    shield-fill: white;
  }
  [[type%]="US"] {
    shield-file: url('us_highway.svg');
  }
}

#shield-canada[[type%]="TCH"] {
  shield-file: url('trans_canada_highway_small.svg');
  shield-fill: green;
  [zoom>15] {
    shield-file: url('trans_canada_highway_large.svg');
  }
}

#shield-canada[[type%]="QC"] {
  shield-file: url('quebec_highway.svg');
}

.shield-minor[[type%]="CR"] {
  shield-face-name: "DejaVu Sans Bold";
  shield-file: url('images/county_route.svg');
}

#secondary {
  text-face-name: "DejaVu Sans Book";
  text-name: [name];
}

#world {
  group-num-columns: 2;
  group-class: "shield";
  group-layout: simplelayout();
  [zoom>12] {
    group-class: "shield shield-minor";
  }
  [country="USA"] {
    group-layout: pairlayout(1);
    group-name: "shield-us";
  }
  [country="CAN"] {
    group-name: "shield-canada";
    [zoom>8] {
      secondary/group-name: "secondary";
      secondary/group-num-columns: 0;
      secondary/group-layout: simplelayout();
    }
  }
}