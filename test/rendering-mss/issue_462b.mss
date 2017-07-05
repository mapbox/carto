#foo {
  shield: none;
  [feature = 'bar'] {
    shield-name: "[refs]";
    shield-face-name: "Arial";
    shield-file: url('test.svg');
    shield-fill: red;
  }
  [feature = 'baz'] {
      shield-name: "[refs]";
      shield-face-name: "Arial";
      shield-file: url('test.svg');
      shield-fill: blue;
  }
}
