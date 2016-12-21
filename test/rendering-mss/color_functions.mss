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

  hsluv/line-color: hsluv(123, 45%, 67%);
  hsluv-d/line-color: hsluv(123, .45, .67);
  hsluva/line-color: hsluva(123, 45%, 67%, 89%);
  hsluva-d/line-color: hsluva(123, 45%, 67%, .89);

  hsl-darken/line-color: darken(hsl(209, 81%, 64%), 10%);
  hsl-lighten/line-color: lighten(hsl(209, 81%, 64%), 10%);
  hsl-saturate/line-color: saturate(hsl(209, 81%, 64%), 10%);
  hsl-desaturate/line-color: desaturate(hsl(209, 81%, 64%), 10%);
  hsl-spin/line-color: spin(hsl(209, 81%, 64%), 10);
  hsl-fadein/line-color: fadein(hsla(209, 81%, 64%, 80%), 10%);
  hsl-fadeout/line-color: fadeout(hsla(209, 81%, 64%, 80%), 10%);
  hsl-greyscale/line-color: greyscale(hsl(209, 81%, 64%));

  percept-darken/line-color: darken(hsluv(209, 81%, 64%), 10%);
  percept-lighten/line-color: lighten(hsluv(209, 81%, 64%), 10%);
  percept-saturate/line-color: saturate(hsluv(209, 81%, 64%), 10%);
  percept-desaturate/line-color: desaturate(hsluv(209, 81%, 64%), 10%);
  percept-spin/line-color: spin(hsluv(209, 81%, 64%), 10);
  percept-fadein/line-color: fadein(hsluva(209, 81%, 64%, 80%), 10%);
  percept-fadeout/line-color: fadeout(hsluva(209, 81%, 64%, 80%), 10%);
  percept-greyscale/line-color: greyscale(hsluv(209, 81%, 64%));

  force-percept-darken/line-color: darkenp(hsl(209, 81%, 64%), 10%);
  force-percept-lighten/line-color: lightenp(hsl(209, 81%, 64%), 10%);
  force-percept-saturate/line-color: saturatep(hsl(209, 81%, 64%), 10%);
  force-percept-desaturate/line-color: desaturatep(hsl(209, 81%, 64%), 10%);
  force-percept-spin/line-color: spinp(hsl(209, 81%, 64%), 10);
  force-percept-fadein/line-color: fadeinp(hsla(209, 81%, 64%, 80%), 10%);
  force-percept-fadeout/line-color: fadeoutp(hsla(209, 81%, 64%, 80%), 10%);
  force-percept-greyscale/line-color: greyscalep(hsl(209, 81%, 64%));

  mix/line-color: mix(hsl(209, 81%, 64%), hsl(109, 81%, 64%), 20%);
  mix2/line-color: mix(#5ba2a2, #0080ff, 50%);
  mix3/line-color: mix(#ff0000, #00ff00, 0%);
  mix4/line-color: mix(#ff0000, #00ff00, 100%);
  mix5/line-color: mix(rgba(255, 0, 0, 0.2), rgba(0, 255, 0, 0.8), 20%);
  percept-mix/line-color: mix(hsl(109, 81%, 64%), hsluv(209, 81%, 64%), 20%);
  percept-mix2/line-color: mix(hsluv(109, 81%, 64%), hsluv(209, 81%, 64%), 20%);

  multiply/line-color: #f8f4f0 * 0.8;
  divide/line-color: #f8f4f0 / 1.2;
  add/line-color: #f8f4f0 + 0.8;
  subtract/line-color: #f8f4f0 - 0.8;

  multiply2/line-color: #252525 * #020202;
  divide2/line-color: #f8f4f0 / #83b7eb;
  add2/line-color: #f8f4f0 + #020202;
  subtract2/line-color: #f8f4f0 - #83b7eb;

  components/line-color: hsl(hue(hsl(209, 81%, 64%)), saturation(hsl(209, 81%, 64%)), lightness(hsl(209, 81%, 64%)));
  percept-components/line-color: hsluv(huep(hsl(209, 81%, 64%)), saturationp(hsl(209, 81%, 64%)), lightnessp(hsl(209, 81%, 64%)));
}
