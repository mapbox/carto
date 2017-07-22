#foo {
  line: none;
  line-width: 2;
  [feature = 'bar'] {
    line-color: red;
  }
  [feature = 'baz'] {
    line-color: blue;
  }
}
