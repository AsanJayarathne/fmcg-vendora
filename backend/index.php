<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "fmcg_vendora";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully <br>";

// Insert multiple rows correctly
$sql = "INSERT INTO roles (role_id, role_name, description) VALUES
  (1, 'SUPER_ADMIN',  'System Administrator with full access'),
  (2, 'DISTRIBUTOR',  'Distributor who manages orders and inventory'),
  (3, 'RETAILER',     'Retailer who places orders'),
  (4, 'DRIVER',       'Driver who handles deliveries');";

if ($conn->query($sql) === TRUE) {
    echo "Insert successful";
} else {
    echo "Error: " . $conn->error;
}

$conn->close();
?>