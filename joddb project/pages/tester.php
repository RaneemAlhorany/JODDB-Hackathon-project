<?php
session_start();
if (!isset($_SESSION['work_id']) || $_SESSION['level'] != 'tester') {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Tester Page</title>
</head>
<body>
<h2>Welcome Tester <?php echo $_SESSION['work_id']; ?>!</h2>
<a href="../component/logout.php">Logout</a>
</body>
</html>