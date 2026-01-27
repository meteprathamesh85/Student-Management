const students = [
    {id:1, name:"Amit Patil", branch:"CSE", year:4, email:"amit@gmail.com", status:"Active"},
    {id:2, name:"Riya Deshmukh", branch:"IT", year:3, email:"riya@gmail.com", status:"Active"},
    {id:3, name:"Sagar Pawar", branch:"Mechanical", year:4, email:"sagar@gmail.com", status:"Passed"},
    {id:4, name:"Neha Kale", branch:"CSE", year:2, email:"neha@gmail.com", status:"Active"}
];

const table = document.getElementById("studentTable");
const search = document.getElementById("search");
const branchFilter = document.getElementById("branchFilter");

function render(data){
    table.innerHTML = "";
    data.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.branch}</td>
                <td>${s.year}</td>
                <td>${s.email}</td>
                <td>${s.status}</td>
            </tr>
        `;
    });

    document.getElementById("total").innerText = students.length;
    document.getElementById("active").innerText = students.filter(s=>s.status==="Active").length;
    document.getElementById("final").innerText = students.filter(s=>s.year===4).length;
}

function filterStudents(){
    let filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (branchFilter.value === "" || s.branch === branchFilter.value)
    );
    render(filtered);
}

search.addEventListener("input", filterStudents);
branchFilter.addEventListener("change", filterStudents);

render(students);


    localStorage.setItem("studentsData",JSON.stringify(students));
    renderStudents(students);
    modal.style.display = "none";
