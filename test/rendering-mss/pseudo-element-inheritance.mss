#style {
  text-face-name: "Deja Vu Sans";
  text-name: [name];
  text::layout {
    content: [alt1];
    dy: -10;
  }
  text::layout(1) {
    content: [alt2];
    dy: 10;
    ::layout {
      content: "test";
      dy: 2;
    }
  }
  [zoom>5] {
    text::layout {
      dy: -15;
    }
    text::layout(1) {
      dy: 15;
      dx: 10;
    }
  }
  [zoom>5][zoom<10] {
    text::layout::layout {
      content: "test";
      dx: 5;
    }
  }
  [class=2] {
    text::layout {
      content: "Alt" + [alt1];
      dy: 10;
    }
    text::layout(1)::layout {
      dy: 3;
      dx: 2;
    }
  }
}