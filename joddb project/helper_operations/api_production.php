<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = 'data.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // preflight
    http_response_code(200);
    exit;
}

function readData() {
    global $dataFile;
    if (file_exists($dataFile)) {
        $raw = file_get_contents($dataFile);
        $json = json_decode($raw, true);
        return is_array($json) ? $json : [];
    }
    return [];
}

function writeData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode(array_values($data), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        echo json_encode(readData());
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !is_array($input)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
            break;
        }

        $data = readData();

        // Ensure unique operationId to prevent accidental duplicates
        $existingOperationIds = array_column($data, 'operationId');
        if (isset($input['operationId']) && in_array($input['operationId'], $existingOperationIds)) {
            // duplicate -> ignore but respond success
            echo json_encode(['success' => true, 'note' => 'Duplicate operationId ignored', 'entry' => $input]);
            break;
        }

        // assign id & timestamp if not present
        if (!isset($input['id'])) $input['id'] = uniqid('entry_', true);
        if (!isset($input['timestamp'])) $input['timestamp'] = date('c');

        array_unshift($data, $input);
        writeData($data);

        echo json_encode(['success' => true, 'entry' => $input]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if ($id) {
            $data = readData();
            $filtered = array_filter($data, function($entry) use ($id) {
                return !isset($entry['id']) || $entry['id'] !== $id;
            });
            writeData(array_values($filtered));
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
