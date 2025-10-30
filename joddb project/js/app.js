// assets/js/app.js

class TimerTracker {
    constructor() {
        // Define the sub-operations mapping
        this.subOperationsMap = {
            'L1': [
                'Lens Cleaning',
                'Nitrogen '
            ],
            'L2': [
                'FocusA340',
                'FocusA360'
            ],
            'L3': [
                'Objective and Doublet'
            ],
            'L4': [
                'Assemblage I',
                'Beam-Assy.I'
            ],
            'L5': [
                  'Assemblage II',
                'Assemblage II tubeless'
            ],
            'Final Touch': [
                'Purge Vulve&Cleaning',
                'Paint&Labeling.',
                'Purge Vulve&Cleaning.'
            ],
            'Troubleshooting': [
                'Change Battery contact',
                'Change Beam.',
                'Change Eye Piece.',
                'Bushing Installation',
                'Attaching Label',
                'Adjusters',
                'Adjust the Fiber Optic',
                'Add Tube Spacers',
                'Adaptors Installation'
            ],
            'Sub-Assemblies': [
                'Battery Contact Assy.',
                'Battery Cover Assy.',
                'Beam Combiner Assy.',
                'Cover Assy.',
                'Eyepiece Assy.',
                'Focus Assy.A340',
                'Focus Assy.A360',
                'Reticle Assy.',
                'Tube Assy.'
            ]
        };

        // State
        this.startTimestamp = null;
        this.timerInterval = null;
        this.elapsedBeforeStart = 0;
        this.isPaused = true;
        this.issues = [];
        this.operationIds = new Set();

        // Break timer state
        this.breakInterval = null;
        this.breakTimeRemaining = 3600; // 1 hour in seconds

        // Elements
        this.initializeElements();
        this.attachEventListeners();

        // Restore saved state (if any)
        this.loadState();
        this.updateDate();
        this.restoreSavedEntries();
        this.updateUIState();
    }

    initializeElements() {
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.endBtn = document.getElementById('endBtn');
        this.issueBtn = document.getElementById('issueBtn');
        this.breakBtn = document.getElementById('breakBtn');

        // Form elements
        this.unitSerialInput = document.getElementById('unitSerialNumber');
        this.jobSelect = document.getElementById('selectJob');
        this.subOperationSelect = document.getElementById('subOperation');
        this.notesTextarea = document.getElementById('notes');
        this.notesContainer = this.notesTextarea.closest('.notes-container');
        
        // Initialize the sub-operation dropdown
        this.updateSubOperations();

        // Modal elements
        this.issueModal = document.getElementById('issueModal');
        this.issueDescription = document.getElementById('issueDescription');
        this.submitIssueBtn = document.getElementById('submitIssue');
        this.cancelIssueBtn = document.getElementById('cancelIssue');
        this.closeModalBtn = document.querySelector('.close-modal');

        // Display elements
        this.timerDisplay = document.querySelector('.timer');
        this.timesheetEntries = document.getElementById('timesheetEntries');
        this.currentDate = document.getElementById('currentDate');
        this.breakTimerBox = document.querySelector('.break-timer-box');
        this.breakTimerDisplay = document.querySelector('.break-timer');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleStart());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.endBtn.addEventListener('click', () => this.endTimer());
        this.issueBtn.addEventListener('click', () => this.openIssueModal());
        this.breakBtn.addEventListener('click', () => this.toggleBreak());

        // Modal events
        this.submitIssueBtn.addEventListener('click', () => this.submitIssue());
        this.cancelIssueBtn.addEventListener('click', () => this.closeIssueModal());
        this.closeModalBtn.addEventListener('click', () => this.closeIssueModal());
        this.issueModal.addEventListener('click', (e) => {
            if (e.target === this.issueModal) this.closeIssueModal();
        });

        // Job selection change handler
        this.jobSelect.addEventListener('change', () => {
            this.updateSubOperations();
            this.saveState();
            this.updateEndBtnState();
        });

        // Save on input change
        ['change', 'input'].forEach(ev => {
            this.unitSerialInput.addEventListener(ev, () => this.saveState());
            this.subOperationSelect.addEventListener(ev, () => { this.saveState(); this.updateEndBtnState(); });
            this.notesTextarea.addEventListener(ev, () => { this.saveState(); this.updateNotesIndicator(); });
        });

        // Before unload - persist current state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });

        // Page visibility: when page becomes visible, ensure UI updated
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.updateTimerDisplay();
        });
    }

    updateSubOperations() {
        const selectedJob = this.jobSelect.value;
        const subOperations = this.subOperationsMap[selectedJob] || [];
        
        // Save the current selection if it exists
        const currentSelection = this.subOperationSelect.value;
        
        // Clear current options
        this.subOperationSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sub - Operation';
        this.subOperationSelect.appendChild(defaultOption);
        
        // Add filtered options
        subOperations.forEach(operation => {
            const option = document.createElement('option');
            option.value = operation;
            option.textContent = operation;
            this.subOperationSelect.appendChild(option);
        });
        
        // Restore the selection if it's still valid
        if (subOperations.includes(currentSelection)) {
            this.subOperationSelect.value = currentSelection;
        } else {
            this.subOperationSelect.value = '';
        }
    }

    updateDate() {
        const now = new Date();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'long' };
        this.currentDate.textContent = now.toLocaleDateString('en-GB', options);
    }

    toggleStart() {
        if (this.timerInterval) {
            // currently running -> should not happen since we have pause. keep safe.
            return;
        }
        if (this.isPaused) {
            // Start or resume
            this.startTimer();
        }
    }

    startTimer() {
        // If first start, set startTimestamp to now minus elapsedBeforeStart
        if (!this.startTimestamp) {
            this.startTimestamp = Date.now() - this.elapsedBeforeStart;
        } else {
            // resuming: set startTimestamp so elapsed accumulates correctly
            this.startTimestamp = Date.now() - this.elapsedBeforeStart;
        }

        this.timerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
        this.isPaused = false;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        this.saveState();
    }

    pauseTimer() {
        if (!this.timerInterval) return;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.elapsedBeforeStart = Date.now() - (this.startTimestamp || Date.now());
        this.startTimestamp = null;
        this.isPaused = true;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.saveState();
    }

    updateTimerDisplay() {
        let elapsed = this.elapsedBeforeStart;
        if (this.startTimestamp) {
            elapsed = Date.now() - this.startTimestamp;
        }
        // If running, add current elapsed to any previously accumulated
        if (this.timerInterval && this.startTimestamp) {
            elapsed = Date.now() - this.startTimestamp;
        }

        // If the timer was stopped but had elapsedBeforeStart, include it
        if (!this.timerInterval && this.isPaused) {
            elapsed = this.elapsedBeforeStart;
        }

        // compute h:m:s
        const totalSeconds = Math.floor(elapsed / 1000);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor((totalSeconds / 60) % 60);
        const hours = Math.floor(totalSeconds / 3600);

        this.timerDisplay.textContent = `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }

    // End button behavior: only allowed if either timer ran or elapsed > 0 and job & subOperation set
    endTimer() {
        // Guard: require job & subOperation selected
        if (!this.jobSelect.value || !this.subOperationSelect.value) {
            alert('Please select Job and Sub-operation before ending.');
            return;
        }

        // Determine duration from display
        const duration = this.timerDisplay.textContent;

        const entry = {
            id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2,6),
            operationId: 'op-' + Date.now() + '-' + Math.random().toString(36).substr(2,6),
            serialNumber: this.unitSerialInput.value || '',
            operation: this.jobSelect.value || '',
            status: this.subOperationSelect.value || '',
            duration: duration,
            notes: this.notesTextarea.value || '',
            timestamp: new Date().toISOString()
        };

        // add to UI and storage
        this.addTimesheetEntry(entry, false);

        // send to server (optional; safe attempt)
        this.postEntryToServer(entry);

        // Reset timer state but keep form values cleared
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.startTimestamp = null;
        this.elapsedBeforeStart = 0;
        this.isPaused = true;
        this.timerDisplay.textContent = '0:00:00';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i> Start';

        // Reset form fields (but keep timesheet entries saved)
        this.resetForm();
        this.saveState();
        this.updateEndBtnState();
    }

    addTimesheetEntry(data, saveToLocal = true) {
        const operationId = data.operationId || `op-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;

        if (this.operationIds.has(operationId)) {
            console.warn('Duplicate entry prevented:', operationId);
            return;
        }
        this.operationIds.add(operationId);

        const entry = document.createElement('div');
        entry.className = 'timesheet-entry' + (data.isIssue ? ' issue-entry' : '');
        entry.dataset.operationId = operationId;
        entry.innerHTML = `
            <div class="entry-details">
                <i class="fas ${data.isIssue ? 'fa-exclamation-triangle text-danger' : 'fa-cog'} entry-gear"></i>
                <div>
                    <div><strong>Unit:</strong> ${this.escapeHtml(data.serialNumber)}</div>
                    <div><strong>Operation:</strong> ${this.escapeHtml(data.operation)} - ${this.escapeHtml(data.status)}</div>
                    ${data.notes ? `<div><strong>Notes:</strong> ${this.escapeHtml(data.notes)}</div>` : ''}
                </div>
            </div>
            <div><strong>Time:</strong> ${this.escapeHtml(data.duration)}</div>
        `;
        this.timesheetEntries.insertBefore(entry, this.timesheetEntries.firstChild);

        if (saveToLocal) {
            this.saveEntryToLocal(data);
        }
    }

    resetForm() {
        this.unitSerialInput.value = '';
        this.jobSelect.value = '';
        this.subOperationSelect.value = '';
        this.notesTextarea.value = '';
        this.updateNotesIndicator();
        this.updateSubOperations();
    }

    openIssueModal() {
        this.issueModal.classList.add('active');
        this.issueDescription.focus();
    }

    closeIssueModal() {
        this.issueModal.classList.remove('active');
        this.issueDescription.value = '';
    }

    submitIssue() {
        const issueDescription = this.issueDescription.value.trim();
        if (!issueDescription) {
            alert('Please describe the issue');
            return;
        }

        if (!this.jobSelect.value || !this.subOperationSelect.value) {
            if (!confirm('You did not select Job or Sub-operation. Do you want to proceed reporting an issue without them?')) {
                return;
            }
        }

        // Get current device time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;

        const entry = {
            id: 'issue-' + Date.now() + '-' + Math.random().toString(36).substr(2,6),
            operationId: 'op-' + Date.now() + '-' + Math.random().toString(36).substr(2,6),
            serialNumber: this.unitSerialInput.value || '',
            operation: this.jobSelect.value || '',
            status: 'Issue Reported',
            duration: currentTime,
            notes: issueDescription,
            isIssue: true,
            timestamp: now.toISOString()
        };

        this.issues.push(entry);
        this.addTimesheetEntry(entry, true);
        this.postEntryToServer(entry);
        this.closeIssueModal();
        this.saveState();
    }

    saveEntryToLocal(entry) {
        const entries = JSON.parse(localStorage.getItem('timesheetEntries') || '[]');
        entries.unshift(entry);
        localStorage.setItem('timesheetEntries', JSON.stringify(entries));
    }

    saveState() {
        const state = {
            startTimestamp: this.startTimestamp, // null or epoch
            elapsedBeforeStart: this.elapsedBeforeStart || 0,
            isPaused: this.isPaused,
            unitSerialNumber: this.unitSerialInput.value || '',
            selectJob: this.jobSelect.value || '',
            subOperation: this.subOperationSelect.value || '',
            notes: this.notesTextarea.value || '',
            issues: this.issues || [],
            operationIds: Array.from(this.operationIds || [])
        };
        localStorage.setItem('timerTrackerState', JSON.stringify(state));
    }

    loadState() {
        const raw = localStorage.getItem('timerTrackerState');
        if (!raw) return;
        try {
            const state = JSON.parse(raw);
            this.startTimestamp = state.startTimestamp || null;
            this.elapsedBeforeStart = state.elapsedBeforeStart || 0;
            this.isPaused = state.isPaused ?? true;
            this.unitSerialInput.value = state.unitSerialNumber || '';
            this.jobSelect.value = state.selectJob || '';
            this.subOperationSelect.value = state.subOperation || '';
            this.notesTextarea.value = state.notes || '';
            this.issues = state.issues || [];
            (state.operationIds || []).forEach(id => this.operationIds.add(id));
            this.updateNotesIndicator();
            this.updateEndBtnState();

            // If timer was running (startTimestamp exists), resume it
            if (this.startTimestamp && !this.timerInterval) {
                // compute elapsedBeforeStart in case
                this.elapsedBeforeStart = Date.now() - this.startTimestamp;
                this.startTimestamp = Date.now() - this.elapsedBeforeStart;
                this.timerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
                this.isPaused = false;
                this.startBtn.disabled = true;
                this.pauseBtn.disabled = false;
            } else {
                // If paused, ensure display shows stored elapsed
                this.updateTimerDisplay();
            }
        } catch (e) {
            console.error('Failed to parse saved state', e);
        }
    }

    restoreSavedEntries() {
        const entries = JSON.parse(localStorage.getItem('timesheetEntries') || '[]');
        // show latest first
        entries.forEach(entry => this.addTimesheetEntry(entry, false));
    }

    updateNotesIndicator() {
        if (this.notesTextarea.value.trim()) {
            this.notesContainer.classList.add('has-content');
        } else {
            this.notesContainer.classList.remove('has-content');
        }
    }

    updateEndBtnState() {
        // 🔹 Modification: End button enabled only when both job and subOperation are selected
        if (this.jobSelect.value && this.subOperationSelect.value) {
            this.endBtn.disabled = false;
        } else {
            this.endBtn.disabled = true;
        }
    }

    toggleBreak() {
        if (this.breakInterval) {
            // Stop break
            clearInterval(this.breakInterval);
            this.breakInterval = null;
            this.breakTimeRemaining = 3600;
            this.breakTimerBox.classList.add('hidden');
            this.breakBtn.classList.remove('btn-danger');
            this.breakBtn.classList.add('btn-info');
            this.breakBtn.innerHTML = '<i class="fas fa-coffee"></i> Break';
        } else {
            // Start break
            this.breakTimerBox.classList.remove('hidden');
            this.updateBreakTimerDisplay();
            this.breakInterval = setInterval(() => this.updateBreakTimer(), 1000);
            this.breakBtn.classList.remove('btn-info');
            this.breakBtn.classList.add('btn-danger');
            this.breakBtn.innerHTML = '<i class="fas fa-times"></i> End Break';
        }
    }

    updateBreakTimer() {
        if (this.breakTimeRemaining <= 0) {
            this.toggleBreak();
            alert('Break time is over!');
            return;
        }

        this.breakTimeRemaining--;
        this.updateBreakTimerDisplay();
    }

    updateBreakTimerDisplay() {
        const hours = Math.floor(this.breakTimeRemaining / 3600);
        const minutes = Math.floor((this.breakTimeRemaining % 3600) / 60);
        const seconds = this.breakTimeRemaining % 60;
        this.breakTimerDisplay.textContent = 
            `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }

    updateUIState() {
        // start/pause buttons
        if (this.timerInterval) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
        }
        this.updateTimerDisplay();
        this.updateEndBtnState();
    }

    postEntryToServer(entry) {
        // Try to post to server endpoint /api.php (or whatever your PHP file path is)
        // If server fails, we still keep local copy.
        try {
            fetch('../helper_operations/api_production.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            })
            .then(res => res.json())
            .then(resp => {
                // optional: handle server response
                console.log('Server response:', resp);
            })
            .catch(err => {
                console.warn('Post to server failed, kept local copy.', err);
            });
        } catch (e) {
            console.warn('Posting entry failed', e);
        }
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.replace(/[&<"'>]/g, function(m) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m];
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new TimerTracker();
});
