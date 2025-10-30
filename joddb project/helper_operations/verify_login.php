<?php
session_start();
include '../component/db_connect.php';

// ✅ Get client IP
$ip = $_SERVER['REMOTE_ADDR'];

// ✅ Allow local or internal network IPs
if (
    !preg_match('/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/', $ip)
    && $ip !== '127.0.0.1'
    && $ip !== '::1'
) {
    die("<h3>Access denied: You must be inside company network or localhost.</h3>");
}

// ✅ Retrieve login form data
$work_id = trim($_POST['work_id']);
$password = trim($_POST['password']);

// ✅ Check if fields are not empty
if (empty($work_id) || empty($password)) {
    die("<h3>Please enter both Work ID and Password.</h3>");
}

// ✅ Prepare and execute SQL safely
$stmt = $conn->prepare("SELECT password, level FROM employees WHERE work_id = ?");
$stmt->bind_param("s", $work_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $row = $result->fetch_assoc()) {
    // ✅ Verify hashed password
    if (password_verify($password, $row['password'])) {
        // ✅ Set session variables
        $_SESSION['work_id'] = $work_id;
        $_SESSION['level'] = $row['level'];

        // ✅ Redirect based on level
        switch ($row['level']) {
            case 'production':
                header("Location: ../pages/production.php");
                exit;
            case 'tester':
                header("Location: ../pages/tester.php");
                exit;
            case 'quality':
                header("Location: ../pages/quality.php");
                exit;
            case 'supervisor':
                header("Location: ../pages/supervisor.php");
                exit;
            default:
                echo "<h3>Unknown user level</h3>";
        }
    } else {
        echo "<h3>Invalid password</h3>";
    }
} else {
    echo "<h3>User not found</h3>";
}

$stmt->close();
$conn->close();
?>
