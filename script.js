// TaskFlow: adding assignments and tracking their completion.
const nameInput = document.getElementById("assignment");
const descriptionInput = document.getElementById("assignmentDescription");
const dateInput = document.getElementById("dueDate");
const addButton = document.getElementById("addAssignment");
const assignmentList = document.querySelector(".assignment-list");
const completedList = document.querySelector(".completed-list");
const completedEmptyState = document.querySelector(".completed-panel .empty-state");

let nextAssignmentId = 1;

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

    if (name === "" || description === "" || date === "") {
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
    const parsedDate = new Date(`${date}T00:00:00`);
    due.textContent = `Due: ${parsedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = description;

    details.append(title, due, descriptionParagraph);
    card.append(checkbox, details);
    assignmentList.appendChild(card);

    nameInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";

    alert("Assignment added successfully!");
});

updateCompletedEmptyState();
