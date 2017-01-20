@sans_bold: 'Helvetica Neue', 'Foo Bar';
#world[zoom>=11][zoom<=22][reflen<=8][type='bicycle'] {
    [network='ncn'],[network='rcn'] {
        shield-name: "[ref]";
        shield-face-name: @sans_bold;
        shield-file: url(img/shield-motorway-1.png);
        [network='ncn'] {
            [reflen=8] { shield-file: url(img/shield-motorway-8.png); }
        }
        [network='rcn'] {
            [reflen=8] { shield-file: url(img/shield-trunk-8.png); }
        }
    }
}
