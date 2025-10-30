<?php
include '../component/db_connect.php';

$query = "
SELECT ROUND(AVG(pp.progress_percent), 2) AS avg_progress
FROM project_progress pp
JOIN projects pr ON pp.project_id = pr.project_id
WHERE pr.status = 'active';
";

$result = $conn->query($query);

if ($result && $row = $result->fetch_assoc()) {
    $avg_progress = $row['avg_progress'] ?? 0;

    $update = "
        UPDATE summary
        SET avg_progress_active_projects = $avg_progress
        WHERE id = 0;
    ";

    if ($conn->query($update) === TRUE) {
        echo "<h3> Summary updated successfully!</h3>";
        echo "<p>New average progress for active projects: <b>$avg_progress%</b></p>";
    } else {
        echo "<h3> Failed to update summary:</h3> " . $conn->error;
    }
} else {
    echo "<h3> Could not calculate average progress.</h3> " . $conn->error;
}

$conn->close();
?>
