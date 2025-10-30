<?php
session_start();
if (!isset($_SESSION['work_id']) || $_SESSION['level'] != 'production') {
    header("Location: ../index.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Production Time Tracking</title>
    <link rel="stylesheet" href="../css/stylesProduction.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
</head>
<body>
    <header>
        <div class="user-info">
            <div class="avatar">B</div>
            <span class="username">Baraa</span>
        </div>
        <div class="logo">aselsan</div>
        <div class="header-actions">
            <button id="breakBtn" class="btn btn-info"><i class="fas fa-coffee"></i> Break</button>
            <button class="btn btn-dark"><i class="fas fa-lock"></i> Lock</button>
          <a href = "../component/logout.php" style = "text-decoration:none;">
             <button class="btn btn-danger"><i class="fas fa-sign-out-alt" ></i> Logout</button>
         </a> 
        </div>
    </header>

    <main>
        <div class="panel production-entry">
            <h2>Production Data Entry</h2>
            <h2> <br> </h2>
            <div class="form-group">
                <select id="unitSerialNumber">
                    <option value="">Unit Serial Number</option>
                    <option value="JO963">JO963</option>
                    <option value="JO964">JO964</option>
                    <option value="JO965">JO965</option>

                </select>
            </div>
            <div class="form-group">
                <select id="selectJob">
                    <option value="">Select Job</option>
                    <option value="L1">Level 1</option>
                    <option value="L2">Level 2</option>
                    <option value="L3">Level 3</option>
                    <option value="L4">Level 4</option>
                    <option value="L5">Level 5</option>
                    <option value="Final Touch">Final Touch</option>
                    <option value="Sub-Assemblies">Sub-Assemblies</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                    
                </select>
            </div>
            <div class="form-group">
                <select id="subOperation">
                    <option value="">Sub - Operation</option>
                    <option value="Battery Contact Assy.">Battery Contact Assy.</option>
                    <option value="Battery Cover Assy.">Battery Cover Assy.</option>
                    <option value="Beam Combiner Assy.">Beam Combiner Assy.</option>
                    <option value="Cover Assy.">Cover Assy.</option>
                    <option value="Eyepiece Assy.">Eyepiece Assy.</option>
                    <option value="Focus Assy.A340">Focus Assy.A340</option>
                    <option value="Focus Assy.A360">Focus Assy.A360</option>
                    <option value="Reticle Assy.">Reticle Assy.</option>
                    <option value="Tube Assy.">Tube Assy.</option>
                    <option value="Adaptors Installation">Adaptors Installation</option>
                    <option value="Add Tube Spacers">Add Tube Spacers</option>
                    <option value="Adjust the Fiber Optic ">Adjust the Fiber Optic </option>
                    <option value="Adjusters">Adjusters</option>
                    <option value="Attaching Label">Attaching Label</option>
                    <option value="Bushing Installation">Bushing Installation</option>
                    <option value="Change Battery contact">Change Battery contact</option>
                    <option value="Change Beam">Change Beam</option>
                    <option value="Change Eye Piece">Change Eye Piece</option>
                    <option value="Change Power Card">Change Power Card</option>
                    <option value="Change Reticle">Change Reticle</option>
                    <option value="Change Reticle-Assy.II">Change Reticle-Assy.II</option>
                    <option value="Clean the Reticle">Clean the Reticle</option>
                    <option value="Assemblage I">Assemblage I</option>
                    <option value="Assemblage II">Assemblage II</option>
                    <option value="Assemblage II tubeless">Assemblage II tubeless</option>
                    <option value="Cleaning&Packing">Cleaning&Packing</option>
                    <option value="Paint&Labeling">Paint&Labeling</option>
                    <option value="Purge Vulve&Cleaning">Purge Vulve&Cleaning</option>
                    <option value="FocusA340">FocusA340</option>
                    <option value="FocusA360">FocusA360</option>
                    <option value="Lens Cleaning">Lens Cleaning</option>
                    <option value="Objective and Doublet">Objective and Doublet</option>
                    <option value="Nitrogen ">Nitrogen </option>
                </select>
            </div>
            <div class="form-group notes-container">
                <textarea id="notes" placeholder="Notes about this operation."></textarea>
                <div class="notes-indicator">
                    <i class="fas fa-check-circle"></i>
                    <span>Note added</span>
                </div>
            </div>

            <!-- Issue Modal -->
            <div id="issueModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Report an Issue</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <textarea id="issueDescription" placeholder="Describe the issue..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-gray" id="cancelIssue">Cancel</button>
                        <button class="btn btn-danger" id="submitIssue">Report</button>
                    </div>
                </div>
            </div>

            <div class="timer-box">
                <div class="timer" aria-live="polite">0:00:00</div>
                <div class="timer-status">Timer</div>
            </div>

            <!-- Break Timer Box -->
            <div class="break-timer-box hidden">
                <div class="break-timer">1:00:00</div>
                <div class="break-timer-status">Break Time Remaining</div>
            </div>

            <div class="action-buttons">
                
                <button id="pauseBtn" class="btn btn-gray" disabled><i class="fas fa-pause"></i> Pause</button>
                <button id="startBtn" class="btn btn-success"><i class="fas fa-play"></i> Start</button>
                <button id="issueBtn" class="btn btn-danger"><i class="fas fa-exclamation-triangle"></i> Issue?</button>
                <button id="endBtn" class="btn btn-dark btn-block" disabled><i class="fas fa-stop"></i> End</button>
            </div>
        </div>

        <div class="panel timesheet">
            <div class="timesheet-header">
                <h2>Today's timesheet</h2>
                <div class="date" id="currentDate"></div>
            </div>
            <div id="timesheetEntries"></div>
        </div>
    </main>

    <script src="../js/app.js"></script>
</body>
</html>