// TaskFlow: adding assignments and tracking their completion.
const nameInput = document.getElementById("assignment");
const descriptionInput = document.getElementById("assignmentDescription");
const dateInput = document.getElementById("dueDate");
const subjectInput = document.getElementById("assignmentSubject");
const priorityInput = document.getElementById("assignmentPriority");
const addButton = document.getElementById("addAssignment");
const assignmentList = document.querySelector(".assignment-list");
const completedList = document.querySelector(".completed-list");
const completedEmptyState = document.querySelector(".completed-panel .empty-state");

let nextAssignmentId = 1;

function updateDueDateStatus(card) {
    const dueElement = card.querySelector(".due-date");
    if (!dueElement) return;

    const dueDate = new Date(dueElement.dataset.date + "T00:00:00");
    if (isNaN(dueDate.getTime())) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysLeft = Math.round((dueDate - today) / 86400000);

    card.classList.remove("overdue", "due-soon", "on-track");

    // Remove any previous status label.
    const oldLabel = card.querySelector(".deadline-status");
    if (oldLabel) oldLabel.remove();

    // Don't warn about completed assignments.
    if (card.classList.contains("is-completed")) return;

    const label = document.createElement("span");
    label.className = "deadline-status";

    if (daysLeft < 0) {
        label.textContent = "Overdue";
        card.classList.add("overdue");
    } else if (daysLeft <= 3) {
        label.textContent = "Due Soon";
        card.classList.add("due-soon");
    } else {
    label.textContent = "On Track";
    card.classList.add("on-track");
    }

    dueElement.after(label);
}


function updateCompletedEmptyState() {
    // Show the placeholder only when there are no finished assignments.
    completedEmptyState.hidden = completedList.children.length > 0;
}

function updateAssignmentCompletion(checkbox) {
    const card = checkbox.closest(".assignment-card");
    if (!card) return;

    const isComplete = checkbox.checked;
    card.classList.toggle("is-completed", isComplete);

    // Move only the changed card, preserving its checkbox and assignment data.
    if (isComplete) {
        completedList.appendChild(card);
    } else {
        assignmentList.appendChild(card);
    }
    updateDueDateStatus(card);
    updateCompletedEmptyState();
}

// Event delegation covers both example assignments and assignments added later.
document.querySelector(".dashboard").addEventListener("change", function (event) {
    if (!event.target.matches('.assignment-card input[type="checkbox"]')) return;
    updateAssignmentCompletion(event.target);
});

addButton.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;
    
const subject = subjectInput.value;
const priority = priorityInput.value;


    if (name === "" || description === "" || date === "" || subject === "") {

        alert("Please fill in all fields.");
        return;
    }

    const card = document.createElement("div");
    card.className = "assignment-card";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `added-task-${nextAssignmentId++}`;

    const details = document.createElement("div");
    details.className = "assignment-details";

    const title = document.createElement("label");
    title.htmlFor = checkbox.id;
    title.textContent = name;

    const due = document.createElement("span");
    due.className = "due-date";
    due.dataset.date = date;
    const parsedDate = new Date(`${date}T00:00:00`);
    due.textContent = `Due: ${parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = description;
    
const subjectLabel = document.createElement("span");
subjectLabel.className = "assignment-subject";
subjectLabel.textContent = `Subject: ${subject}`;
const priorityLabel = document.createElement("span");
priorityLabel.className = "assignment-priority";
priorityLabel.textContent = `Priority: ${priority}`;


    
details.append(title, due, subjectLabel, descriptionParagraph, priorityLabel);
    card.append(checkbox, details);
    assignmentList.appendChild(card);
    addEditDelete(card);
    updateDueDateStatus(card);

    nameInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    subjectInput.value = "";
    priorityInput.value = "Low";


    alert("Assignment added successfully!");
});


updateCompletedEmptyState();
document.querySelectorAll(".assignment-card").forEach(function(card) {
    const dueElement = card.querySelector(".due-date");
    if (!dueElement) return;

    const dateText = dueElement.textContent.replace("Due:", "").trim();
    const parsedDate = new Date(dateText);

    if (isNaN(parsedDate.getTime())) return;

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    dueElement.dataset.date = `${year}-${month}-${day}`;
    updateDueDateStatus(card);
});


// Edit and Delete Assignments
function addEditDelete(card) {
    const edit = document.createElement("button");
    edit.textContent = "Edit";

    const del = document.createElement("button");
    del.textContent = "Delete";

   
edit.onclick = function() {
    if (card.classList.contains("is-editing")) return;

    const details = card.querySelector(".assignment-details");
    const title = details.querySelector("label");
    const due = details.querySelector(".due-date");
    const description = details.querySelector("p");

    const originalName = title.textContent;
    const originalDate = due.dataset.date;
    const originalDescription = description?.textContent || "";

    const nameField = document.createElement("input");
    nameField.type = "text";
    nameField.value = originalName;
    nameField.placeholder = "Assignment name";

    const dateField = document.createElement("input");
    dateField.type = "date";
    dateField.value = originalDate;

    const descriptionField = document.createElement("textarea");
    descriptionField.value = originalDescription;
    descriptionField.placeholder = "Description";

    const editor = document.createElement("div");
    editor.className = "inline-editor";
    editor.append(nameField, dateField, descriptionField);

    const save = document.createElement("button");
    save.textContent = "Save";

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";

    const controls = document.createElement("div");
    controls.className = "edit-controls";
    controls.append(save, cancel);
    editor.appendChild(controls);

    details.hidden = true;
    details.after(editor);
    card.classList.add("is-editing");

    // Hide the regular Edit/Delete buttons while editing.
    const actions = card.querySelector(".assignment-actions");
    actions.hidden = true;

    function closeEditor() {
        editor.remove();
        details.hidden = false;
        actions.hidden = false;
        card.classList.remove("is-editing");
    }

    cancel.onclick = closeEditor;

    save.onclick = function() {
        const name = nameField.value.trim();
        const date = dateField.value;
        const newDescription = descriptionField.value.trim();

        if (!name || !date || !newDescription) {
            alert("Please enter an assignment name and due date.");
            return;
        }

        title.textContent = name;

        if (description) {
            description.textContent = newDescription;
        } else if (newDescription) {
            const p = document.createElement("p");
            p.textContent = newDescription;
            details.appendChild(p);
        }

        const parsedDate = new Date(date + "T00:00:00");
        due.dataset.date = date;
        due.textContent = "Due: " + parsedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        closeEditor();
        updateDueDateStatus(card);
    };
};

    del.onclick = function() {
        if (confirm("Delete this assignment?")) {
            card.remove();
            updateCompletedEmptyState();
        }
    };

    const buttons = document.createElement("div");
    buttons.className = "assignment-actions";
    buttons.append(edit, del);
    card.appendChild(buttons);
}

// Add buttons to existing assignments
document.querySelectorAll(".assignment-card").forEach(addEditDelete);
updateCompletedEmptyState();

