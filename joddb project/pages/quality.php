<?php
session_start();
if (!isset($_SESSION['work_id']) || $_SESSION['level'] != 'quality') {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Quality Page</title>
</head>
<body>
<h2>Welcome Quality Employee <?php echo $_SESSION['work_id']; ?>!</h2>
<a href="../component/logout.php">Logout</a>
</body>
</html>