const nameInput = document.getElementById("studentName")
const dateInput = document.getElementById("AttendanceDate")
const tableBody = document.querySelector("#attendanceTable tbody")

let students = []
let rollno = 1

window.onload = function(){
    const savedData = localStorage.getItem("student");

    if (savedData){
        students = JSON.parse(savedData)

        if (students.length > 0){
            rollno = students[students.length - 1].roll + 1;
        }
    }

    setTodayDate();
    displayStudents();
}

function setTodayDate(){
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today
    dateInput.addEventListener("change", displayStudents)
}

function savedData(){
    localStorage.setItem("student", JSON.stringify(students));
}

function addStudent(){
    const name = nameInput.value.trim();

    if (name === ''){
        alert("Student name is required")
        return
    }

    const student = {
        roll: rollno,
        name: name,
        attendance: {}
    }

    students.push(student)
    rollno++;
    nameInput.value = ''

    savedData();
    displayStudents();
}

function displayStudents(){

    tableBody.innerHTML = ''

    let selectedDate = dateInput.value;

    students.forEach((student) => {

        let status = student.attendance[selectedDate] || "Not Marked";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>
                <span>${status}</span>
                <br>

                <button class="status-btn present-btn"
                    onclick="markAttendance(${student.roll}, 'Present')">
                    Present
                </button>

                <button class="status-btn absent-btn"
                    onclick="markAttendance(${student.roll}, 'Absent')">
                    Absent
                </button>
            </td>

            <td>
                <span class="attendance-percentage">
                    ${calculateAttendance(student)}%
                </span>
            </td>

            <td>
                <button class="delete-btn"
                    onclick="deleteStudent(${student.roll})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function markAttendance(roll, status) {

    const selectedDate = dateInput.value;

    const student = students.find(s => s.roll === roll);

    if (student) {
        student.attendance[selectedDate] = status;
    }

    savedData();
    displayStudents();
}

function deleteStudent(roll) {

    const student = students.find(s => s.roll === roll);

    if (student) {

        const confirmDelete = confirm(
            "Are you sure you want to delete " + student.name + "?"
        );

        if (confirmDelete) {

            students = students.filter(s => s.roll !== roll);

            savedData();
            displayStudents();
        }
    }
}

function calculateAttendance(student) {

    const attendance = Object.values(student.attendance);

    if (attendance.length === 0) {
        return 0;
    }

    const presentDays = attendance.filter(
        status => status === "Present"
    ).length;

    return ((presentDays / attendance.length) * 100).toFixed(2);
}