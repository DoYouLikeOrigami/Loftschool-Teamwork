<?php
include "../wideimage/lib/WideImage.php";

if(isset($_POST)){
    $data        = $_POST;
    $path_images = 'files/';
    $path_out = $path_images.'out/';
    $main_image  = $path_images.$data['mainImage'];
    $watermark_image = $path_images.$data['watermark'];
    $water_name = current(explode(".", $data['watermark']));
    $out_filename = uniqid();

    $image         = WideImage::load($main_image);
    $watermark     = WideImage::load($watermark_image)->saveToFile($path_images.$water_name.'.png');
    $watermark_png = WideImage::load($path_images.$water_name.'.png');
    //$new       = $image->merge($watermark, $data['coordX'], $data['coordY'], $data['opacity']);

    $image->merge($watermark_png,
        $data['coordX'],
        $data['coordY'],
        $data['opacity'] * 100)
        ->saveToFile($path_out.$out_filename.'.jpg');
    //$new = $image->merge($watermark_png, 10, 10, 30)->output('jpg', 100);

    echo json_encode(array('name' => $out_filename.'.jpg'));
}
