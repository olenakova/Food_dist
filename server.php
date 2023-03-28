<?php

/* for working with the json format */
$_POST = json_decode(file_get_contents("php://input"), true);

echo var_dump($_POST);