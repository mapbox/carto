#layer {
  group-layout: simplelayout();
}
#layer[zoom>2] {
  group-layout: pairlayout();
}
#layer[zoom>4] {
  group-layout: simplelayout(1);
}
#layer[zoom>6] {
  group-layout: pairlayout(2);
}
#layer[zoom>8] {
  group-layout: pairlayout(2, 14);
}