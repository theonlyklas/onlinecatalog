<?php
$contents = file_get_contents('http://online.fliphtml5.com/dcmh/vpmf/');

print_r(gzinflate(substr($contents,10,-8)));

// print_r(get_headers('http://online.fliphtml5.com/dcmh/vpmf/'));
?>
