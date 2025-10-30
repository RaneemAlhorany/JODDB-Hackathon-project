<?php

include '../component/db_connect.php';

$select = "select * from summary";

$res = $conn->query($select);
if($res && $row = $res->fetch_assoc()) {
    $stats = [
        'total_projects' => $row['total_project'],
         'completed_projects' => $row['completed_project'],
         'avg_per_project' => $row['avg_progress_active_projects'],
        'closest_deadline' => 'Helium binoculars Jo3' // edit later
    ];
} else
    die("Query failed: " . $conn->error);


$projects_status = [
    'Quality Assemblage' => 18,
    'Adjustment' => 16,
    'Unit Test' => 14
];

$projects_status_distribution = [
    'testing' =>  getSumStatus_distribution ($conn , "testing"),
    'In Progress' => getSumStatus_distribution ($conn , "in_progress") ,
    'packaging' => getSumStatus_distribution ($conn , "packaging")
];

$time_chart = [
    'labels' => ['time'],
    'estimated' => [getSumTime($conn , "real_time")],
    'real' =>[getSumTime($conn , "estimated_time")]
];

$active_projects = [
    ['name' => 'Helium binoculars Tu1', 'progress' => 75, 'deadline' => '30/10/2025'],
    ['name' => 'Helium binoculars Jo1', 'progress' => 45, 'deadline' => '30/10/2025'],
    ['name' => 'Helium binoculars Jo3', 'progress' => 20, 'deadline' => '30/10/2025'],
    ['name' => 'Night vision binoculars Jo2', 'progress' => 90, 'deadline' => '30/10/2025']
];

$table_rows = [
    ['Helium binoculars Tu1', 'JO 2891', 'Lens Cleaning', 'omar', 'abood'],
    ['Helium binoculars Jo1', 'JO 2893', 'Objective and Doublet', 'ahmad', 'sondos'],
    ['Helium binoculars Jo3', 'JO 2895', 'Assemblage II', 'bara', 'farah'],
    ['Night vision binoculars Jo2', 'JO 2899', 'FocusA360', 'raneem', 'yousef']
];

// Provide the JS code a global object with required data
$dashboard_js = [
    'projects_status' => $projects_status,
    'projects_status_distribution' => $projects_status_distribution,
    'time_chart' => $time_chart
];




function getSumTime ($conn , $nameColumn) {
    $summation  = 0;
    $select = "select $nameColumn from parts";
    $res = $conn->query($select);
    while($res && $row = $res->fetch_assoc()) {
        $summation += $row[$nameColumn];
    }
        return $summation;
}     

function getSumStatus_distribution($conn , $value) {
    $summation = 0;
    $res = $conn->query("SELECT status FROM parts");
    if ($res) {
        while ($row = $res->fetch_assoc())
            if ($row['status'] === $value) 
                $summation++;
    }
    return $summation;
}





?>