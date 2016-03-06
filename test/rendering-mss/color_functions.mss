#world {
  name/line-color: green;

  hex-3/line-color: #BED;
  hex-6/line-color: #DEADBE;

  rgb/line-color: rgb(123, 45, 67);
  rgba/line-color: rgba(123, 45, 67, 89%);
  rgba-d/line-color: rgba(123, 45, 67, .89);

  hsl/line-color: hsl(123, 45%, 67%);
  hsl-d/line-color: hsl(123, .45, .67);
  hsla/line-color: hsla(123, 45%, 67%, 89%);
  hsla-d/line-color: hsla(123, 45%, 67%, .89);

  husl/line-color: husl(123, 45%, 67%);
  husl-d/line-color: husl(123, .45, .67);
  husla/line-color: husla(123, 45%, 67%, 89%);
  husla-d/line-color: husla(123, 45%, 67%, .89);

  hsl-darken/line-color: darken(hsl(209, 81%, 64%), 10%);
  hsl-lighten/line-color: lighten(hsl(209, 81%, 64%), 10%);
  hsl-saturate/line-color: saturate(hsl(209, 81%, 64%), 10%);
  hsl-desaturate/line-color: desaturate(hsl(209, 81%, 64%), 10%);
  hsl-spin/line-color: spin(hsl(209, 81%, 64%), 10);
  hsl-fadein/line-color: fadein(hsla(209, 81%, 64%, 80%), 10%);
  hsl-fadeout/line-color: fadeout(hsla(209, 81%, 64%, 80%), 10%);
  hsl-greyscale/line-color: greyscale(hsl(209, 81%, 64%));

  percept-darken/line-color: darken(husl(209, 81%, 64%), 10%);
  percept-lighten/line-color: lighten(husl(209, 81%, 64%), 10%);
  percept-saturate/line-color: saturate(husl(209, 81%, 64%), 10%);
  percept-desaturate/line-color: desaturate(husl(209, 81%, 64%), 10%);
  percept-spin/line-color: spin(husl(209, 81%, 64%), 10);
  percept-fadein/line-color: fadein(husla(209, 81%, 64%, 80%), 10%);
  percept-fadeout/line-color: fadeout(husla(209, 81%, 64%, 80%), 10%);
  percept-greyscale/line-color: greyscale(husl(209, 81%, 64%));

  force-percept-darken/line-color: darkenp(hsl(209, 81%, 64%), 10%);
  force-percept-lighten/line-color: lightenp(hsl(209, 81%, 64%), 10%);
  force-percept-saturate/line-color: saturatep(hsl(209, 81%, 64%), 10%);
  force-percept-desaturate/line-color: desaturatep(hsl(209, 81%, 64%), 10%);
  force-percept-spin/line-color: spinp(hsl(209, 81%, 64%), 10);
  force-percept-fadein/line-color: fadeinp(hsla(209, 81%, 64%, 80%), 10%);
  force-percept-fadeout/line-color: fadeoutp(hsla(209, 81%, 64%, 80%), 10%);
  force-percept-greyscale/line-color: greyscalep(hsl(209, 81%, 64%));

  mix/line-color: mix(hsl(209, 81%, 64%), hsl(109, 81%, 64%), 20%);
  percept-mix/line-color: mix(husl(209, 81%, 64%), hsl(109, 81%, 64%), 20%);
  percept-mix2/line-color: mix(husl(209, 81%, 64%), husl(109, 81%, 64%), 20%);

  components/line-color: hsl(hue(hsl(209, 81%, 64%)), saturation(hsl(209, 81%, 64%)), lightness(hsl(209, 81%, 64%)));
  percept-components/line-color: husl(huep(hsl(209, 81%, 64%)), saturationp(hsl(209, 81%, 64%)), lightnessp(hsl(209, 81%, 64%)));
}
