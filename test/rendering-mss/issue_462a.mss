#foo {
  line: auto;
  [feature = 'bar'] {
    line-color: red;
  }
  [feature = 'baz'] {
    line-color: blue;
  }
}
