#style {
  text-face-name: "Deja Vu Sans";
  text-name: [col1];
  text::layout {
    content: [col2];
    dy: -10;
    ::before {
      content: 'before';
      size: 10;
      ::after {
        content: 'after';
        fill: red;
      }
    }
  }
  text::layout(1) {
    content: [col3];
    dy: 10;
  }
  text::layout(1)::before::after(2)::layout {
    content: 'after layout';
    dx: 3;
  }
}