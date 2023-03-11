<?php

/* для того, чтобы мы могли рботать с форматом json */
$_POST = json_decode(file_get_contents("php://input"), true);

echo var_dump($_POST);