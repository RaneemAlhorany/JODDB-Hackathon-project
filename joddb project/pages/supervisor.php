<?php
session_start();
if (!isset($_SESSION['work_id']) || $_SESSION['level'] != 'supervisor') {
    header("Location: ../index.html");
    exit;
}

include '../component/db_connect.php';
include "../helper_operations/getData.php";
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard</title>

    <!-- Updated CSS with new color palette -->
    <link rel="stylesheet" href="../css/style.css?v=3">

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        /* ensure canvas background matches the new gray theme */
        canvas {
            background-color: #f1f2f4;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="app">
        <aside class="sidebar">
            <div class="brand">
                <div class="logo">aselsan</div>
                <div class="sub">Middle East</div>
            </div>
            <nav class="nav">
                <a class="nav-item active" href="#">Dashboard</a>
                <a class="nav-item" href="#">People</a>
                <a class="nav-item" href="#">Projects</a>
                <a class="nav-item" href="#">New Order</a>
                <a class="nav-item" href="../component/logout.php">Logout</a>
            </nav>
        </aside>

        <main class="main">
            <header class="topbar">
                <h1>Dashboard</h1>
            </header>

            <!-- Statistics -->
            <section class="stats">
                <div class="stat-card">
                    <div class="stat-title">Total Projects</div>
                    <div class="stat-value"><?php echo $stats['total_projects']; ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Completed Projects</div>
                    <div class="stat-value"><?php echo $stats['completed_projects']; ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Average Per Project</div>
                    <div class="stat-value"><?php echo $stats['avg_per_project']; ?>%</div>
                </div>
                <div class="stat-card">
                    <div class="stat-title">Closest Deadline</div>
                    <div class="stat-value"><?php echo $stats['closest_deadline']; ?></div>
                </div>
            </section>

            <!-- Charts -->
            <section class="panels">
                <div class="panel chart-panel">
                    <div class="panel-inner">
                        <h3>Projects Status Percentage</h3>
                        <canvas id="barChart"></canvas>
                    </div>
                </div>

                <div class="panel chart-panel">
                    <div class="panel-inner">
                        <h3>Projects Status Percentage</h3>
                        <canvas id="pieChart"></canvas>
                    </div>
                </div>

                <div class="panel chart-panel tall">
                    <div class="panel-inner">
                        <h3>Project's Time</h3>
                        <canvas id="verticalBarChart"></canvas>
                    </div>
                </div>
            </section>

            <!-- Active Projects + Table -->
            <section class="lower">
                <div class="panel projects-panel">
                    <h3>Active Projects</h3>
                    <div class="projects-list">
                        <?php foreach ($active_projects as $p): ?>
                            <div class="project-row">
                                <div class="project-meta">
                                    <div class="project-name"><?php echo $p['name']; ?></div>
                                    <div class="project-progress">
                                        <div class="progress-bar" style="--p: <?php echo $p['progress']; ?>%"></div>
                                    </div>
                                </div>
                                <div class="project-deadline"><?php echo $p['deadline']; ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="panel table-panel">
                    <h3>Data Table</h3>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>project name </th>
                                    <th>serial number</th>
                                    <th>operation </th>
                                    <th>last worker</th>
                                    <th>supervisor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($table_rows as $row): ?>
                                <tr>
                                    <?php foreach ($row as $cell): ?>
                                        <td><?php echo $cell; ?></td>
                                    <?php endforeach; ?>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script>
        // Pass PHP data to JS
        window.dashboardData = <?php echo json_encode($dashboard_js, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT); ?>;
    </script>

    <!-- Updated charts with new color palette -->
    <script src="../js/charts.js?v=3"></script>
</body>
</html>
