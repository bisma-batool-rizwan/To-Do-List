// TaskFlow 


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Elements

const createTaskBtn = document.getElementById("createTask");

const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskContainer = document.getElementById("taskContainer");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progress = document.getElementById("progress");

const todayDate = document.getElementById("todayDate");

const toast = document.getElementById("toast");


// Save Tasks

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Toast Message

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");


    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}



// Today's Date

function showDate(){

    let date = new Date();

    todayDate.innerText =
    date.toLocaleDateString(
        "en-US",
        {
            day:"numeric",
            month:"short",
            year:"numeric"
        }
    );

}


showDate();

// Create & Display Tasks


// Create New Task

createTaskBtn.addEventListener("click", function(){

    let title = taskTitle.value.trim();


    if(title === ""){

        showToast("Please enter task title");

        return;

    }



    let newTask = {

        id: Date.now(),

        title:title,

        description:taskDescription.value,

        category:taskCategory.value,

        priority:taskPriority.value,

        date:taskDate.value,

        completed:false

    };



    tasks.push(newTask);


    saveTasks();


    displayTasks();


    clearForm();


    showToast("Task created successfully");


});




// Display Tasks

function displayTasks(){


    taskContainer.innerHTML = "";



    if(tasks.length === 0){


        taskContainer.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-clipboard"></i>

            <h3>No Tasks Yet</h3>

            <p>Create your first task.</p>

        </div>

        `;


        updateStats();

        return;

    }



    tasks.forEach(task => {



        let card = document.createElement("div");


        card.className = 
        task.completed 
        ? "task-card completed"
        : "task-card";



        card.innerHTML = `


        <h3>${task.title}</h3>


        <p>${task.description || "No description"}</p>



        <div class="badges">


        <span class="badge category">

        ${task.category}

        </span>



        <span class="badge ${task.priority.toLowerCase()}">

        ${task.priority}

        </span>


        </div>



        <div class="task-date">

        <i class="fa-regular fa-calendar"></i>

        ${task.date || "No due date"}

        </div>



        <div class="task-actions">


        <button 
        class="complete-btn"
        onclick="toggleComplete(${task.id})">

        <i class="fa-solid fa-check"></i>

        </button>



        <button 
        class="edit-btn"
        onclick="editTask(${task.id})">

        <i class="fa-solid fa-pen"></i>

        </button>



        <button 
        class="delete-btn"
        onclick="deleteTask(${task.id})">

        <i class="fa-solid fa-trash"></i>

        </button>


        </div>


        `;



        taskContainer.appendChild(card);



    });


    updateStats();


}




// Clear Form

function clearForm(){


    taskTitle.value="";

    taskDescription.value="";

    taskDate.value="";


}

//Task Actions


// Delete Task

function deleteTask(id){


    tasks = tasks.filter(function(task){

        return task.id !== id;

    });



    saveTasks();


    displayTasks();


    showToast("Task deleted");

}




// Complete / Undo Task

function toggleComplete(id){



    tasks = tasks.map(function(task){



        if(task.id === id){


            task.completed = !task.completed;


        }



        return task;


    });



    saveTasks();


    displayTasks();


    showToast("Task updated");


}






// Edit Task

function editTask(id){



    let task = tasks.find(function(task){


        return task.id === id;


    });




    if(task){



        taskTitle.value = task.title;

        taskDescription.value = task.description;

        taskCategory.value = task.category;

        taskPriority.value = task.priority;

        taskDate.value = task.date;



        deleteTask(id);



        scrollToForm();



        showToast("Edit your task");


    }


}

//Update Statistics



function updateStats(){



    let total = tasks.length;



    let completed = tasks.filter(function(task){


        return task.completed === true;


    }).length;




    let pending = total - completed;



    let percent = 0;



    if(total > 0){


        percent = Math.round(
            (completed / total) * 100
        );


    }




    totalTasks.innerText = total;


    completedTasks.innerText = completed;


    pendingTasks.innerText = pending;


    progress.innerText = percent;



}




// Load Existing Tasks

displayTasks(); 

//Search & Filters


const searchTasks = document.getElementById("searchTasks");

const categoryFilter = document.getElementById("categoryFilter");

const priorityFilter = document.getElementById("priorityFilter");

const statusFilter = document.getElementById("statusFilter");





function filterTasks(){



    let searchValue = searchTasks.value.toLowerCase();


    let categoryValue = categoryFilter.value;


    let priorityValue = priorityFilter.value;


    let statusValue = statusFilter.value;




    let filteredTasks = tasks.filter(function(task){



        let matchSearch =
        task.title.toLowerCase()
        .includes(searchValue);



        let matchCategory =
        categoryValue === "All" ||
        task.category === categoryValue;



        let matchPriority =
        priorityValue === "All" ||
        task.priority === priorityValue;



        let matchStatus =
        statusValue === "All" ||

        (statusValue === "Completed" && task.completed) ||

        (statusValue === "Pending" && !task.completed);



        return (
            matchSearch &&
            matchCategory &&
            matchPriority &&
            matchStatus
        );



    });



    displayFilteredTasks(filteredTasks);



}





function displayFilteredTasks(filteredTasks){



    taskContainer.innerHTML = "";



    if(filteredTasks.length === 0){


        taskContainer.innerHTML = `

        <div class="empty-state">

        <h3>No Matching Tasks</h3>

        <p>Try different filters.</p>

        </div>

        `;


        return;


    }





    filteredTasks.forEach(task => {



        let card = document.createElement("div");


        card.className =
        task.completed
        ? "task-card completed"
        : "task-card";



        card.innerHTML = `


        <h3>${task.title}</h3>


        <p>${task.description || "No description"}</p>



        <div class="badges">


        <span class="badge category">

        ${task.category}

        </span>


        <span class="badge ${task.priority.toLowerCase()}">

        ${task.priority}

        </span>


        </div>



        <div class="task-date">

        ${task.date || "No due date"}

        </div>



        <div class="task-actions">


        <button class="complete-btn"
        onclick="toggleComplete(${task.id})">

        <i class="fa-solid fa-check"></i>

        </button>


        <button class="edit-btn"
        onclick="editTask(${task.id})">

        <i class="fa-solid fa-pen"></i>

        </button>



        <button class="delete-btn"
        onclick="deleteTask(${task.id})">

        <i class="fa-solid fa-trash"></i>

        </button>


        </div>


        `;



        taskContainer.appendChild(card);



    });



}




searchTasks.addEventListener(
"input",
filterTasks
);



categoryFilter.addEventListener(
"change",
filterTasks
);



priorityFilter.addEventListener(
"change",
filterTasks
);



statusFilter.addEventListener(
"change",
filterTasks
);


// Final Features



// Dark Mode


const themeBtn = document.getElementById("themeBtn");


themeBtn.addEventListener("click", function(){



    document.body.classList.toggle("dark");



    let icon = themeBtn.querySelector("i");



    if(document.body.classList.contains("dark")){


        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");


        localStorage.setItem(
            "theme",
            "dark"
        );


    }else{


        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");


        localStorage.setItem(
            "theme",
            "light"
        );


    }



});






// Load Saved Theme


function loadTheme(){



    let savedTheme = localStorage.getItem("theme");



    if(savedTheme === "dark"){



        document.body.classList.add("dark");



        let icon = themeBtn.querySelector("i");


        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");


    }



}


loadTheme();


// Scroll To Task Form


function scrollToForm(){


    document.querySelector(".task-section")
    .scrollIntoView({

        behavior:"smooth"

    });


}

// Initial Load

displayTasks();

updateStats();

// Part 7: Notifications


const notificationBtn = document.getElementById("notificationBtn");

const notificationPanel = document.getElementById("notificationPanel");

const notificationText = document.getElementById("notificationText");





function updateNotifications(){


    let total = tasks.length;


    let completed = tasks.filter(function(task){

        return task.completed;

    }).length;


    let pending = total - completed;



    if(total === 0){


        notificationText.innerHTML =
        "No tasks created yet";


        return;


    }



    notificationText.innerHTML = `

    Total Tasks: ${total}<br><br>

    Completed: ${completed}<br><br>

    Pending: ${pending}

    `;


}






notificationBtn.addEventListener("click", function(e){


    e.stopPropagation();


    updateNotifications();


    notificationPanel.classList.toggle("show");


});






// Close notification when clicking outside

document.addEventListener("click", function(){


    notificationPanel.classList.remove("show");


});






// Prevent closing when clicking inside panel

notificationPanel.addEventListener("click", function(e){


    e.stopPropagation();


});

//Profile Dropdown


const profileBtn = document.getElementById("profileBtn");

const profileMenu = document.getElementById("profileMenu");




// Open / Close Profile Menu

profileBtn.addEventListener("click", function(e){


    e.stopPropagation();


    profileMenu.classList.toggle("show");


});




// Close when clicking outside

document.addEventListener("click", function(){


    profileMenu.classList.remove("show");


});




// Prevent closing inside menu

profileMenu.addEventListener("click", function(e){


    e.stopPropagation();


});

//Settings System


const settingsBtn = document.getElementById("settingsBtn");

const settingsPanel = document.getElementById("settingsPanel");

const closeSettings = document.getElementById("closeSettings");

const darkToggle = document.getElementById("darkToggle");

const notificationToggle = document.getElementById("notificationToggle");





// Open Settings

settingsBtn.addEventListener("click", function(e){

    e.stopPropagation();

    settingsPanel.classList.add("show");

    profileMenu.classList.remove("show");

});






// Close Settings

closeSettings.addEventListener("click", function(){


    settingsPanel.classList.remove("show");


});






// Dark Mode Toggle From Settings


darkToggle.addEventListener("change", function(){



    document.body.classList.toggle(
        "dark",
        darkToggle.checked
    );



    localStorage.setItem(

        "theme",

        darkToggle.checked ? "dark" : "light"

    );



});






// Load Dark Mode State


if(localStorage.getItem("theme") === "dark"){


    darkToggle.checked = true;


}







// Notification Preference


notificationToggle.addEventListener(
"change",
function(){


    localStorage.setItem(

        "notifications",

        notificationToggle.checked

    );


});





// Load Notification Setting


if(
localStorage.getItem("notifications") === "false"
){

    notificationToggle.checked = false;

}  

// Profile Option


const profileOption = document.getElementById("profileOption");


profileOption.addEventListener("click", function(){


    showToast("Profile feature coming soon");


});

// Logout


const logoutBtn = document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", function(){


    let confirmLogout = confirm(
        "Are you sure you want to logout?"
    );


    if(confirmLogout){


        localStorage.removeItem("tasks");


        tasks = [];


        displayTasks();


        showToast("Logged out successfully");


    }


});
