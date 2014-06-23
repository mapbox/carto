#style {
  text-face-name: "Deja Vu Sans";
  text-name: 'root';
  text::layout(1) {
    content: 'layout1';
  }
  text::after(2) {
    content: 'after2';
  }
  text::layout(3) {
    content: 'layout3';
  }
  text::after(1) {
    content: 'after1';
  }
  text::before(2) {
    content: 'before2';
  }
  text::layout(0) {
    content: 'layout0';
  }
  text::before(1) {
    content: 'before1';
  }
  text::before(3) {
    content: 'before3';
  }
  text::after {
    content: 'after0';
  }
}