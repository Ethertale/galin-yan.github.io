const images = document.querySelectorAll('.img-gallery img');
const wrapper = document.getElementById('wrapper');
const imgWrapper = document.getElementById('bigImg');
const closeBtn = document.getElementById('closeBtn');
const navBar = document.querySelector('nav')
const imageDesc = document.getElementById("imageDescription")

const project = document.body.dataset.project;
const imgBasePath = `/rsc/imgs/projects/${project}/`;

const imageDescLinker = {
    rnd_AdminPanel: "Accessible only by an admin, the admin panel allows the adding of new items, looking through the userbase and other game-related information.",
    rnd_Classes: "Displaying the classes through a JS function to switch images back and forth.",
    rnd_Dungeon_Ex: "A simple page showcasing a specific dungeon with a map and info related to it.",
    rnd_Dungeons: "Showing all the dungeons available in the database.",
    rnd_Error_404: "Error handling for all 4XX codes.",
    rnd_Error_500: "Error handling for all 5XX codes.",
    rnd_Forum: "The forum allows the user to create a post on a given topic and also participate on other topics.",
    rnd_Forum_Ex_Post: "Every forum post allows the user to comment and discuss the topic.",
    rnd_Guides: "Similar to the forum posts but only the admin can create the guide posts.",
    rnd_Guides_Ex_Post: "Overview of a guide post.",
    rnd_Home: "The home page, showcasing the last 5 of the most recent topics from each of the categories.",
    rnd_Item_Ex: "Display of an item from the database with Thymeleaf customization with switch cases for the name color.",
    rnd_Items: "All the available items from the database are displayed here (the filter is an unfinished feature).",
    rnd_Login: "The user must log in before accessing the website. The login page is simple yet it checks if the name/password match with an existing user, linked along with exception handling.",
    rnd_Lookup: "This page allows the user to look up other users with a specific word and the back-end checks if a user contains the given word in their name, thus retrieving a list of given users.",
    rnd_News: "Similar to the forum posts but only the admin can create the news posts.",
    rnd_News_Ex_Post: "Overview of a news post.",
    rnd_Profile: "The profile page is very simple but allows the user to change their profile pic and only the admin is allowed to change any users information.",
    rnd_Races: "Displaying the races through a JS function to switch images back and forth.",
    rnd_Register: "Registration has both front- and back-end checking for correct information and either does not allow the user to pass wrong info on the front- or the user gets redirected back with error from the back-end.",
    rnd_Support: "The website has different tiers for supporters, earning them a title (a placeholder, no transactions happen).",
    rnd_Timers: "This page is a microservice connected to the main app, showcasing the usage of FeignClient and Scheduled tasks to check the time and reset the timers.",
    rnd_Welcome: "The main page of the website.",
}

images.forEach(img => {
    img.addEventListener('click', () => {
        const filename = img.getAttribute('src').split('/').pop();
        openImage(imgBasePath + filename);
        console.log(filename)
        changeDescriptionOfImage(filename, project)
    });
});

function openImage(imageUrl) {
    imgWrapper.src = imageUrl;
    wrapper.style.display = 'flex';
    navBar.classList.remove('sticky-top')
    console.log(imageUrl)
    changeDescriptionOfImage(imageUrl)
}

closeBtn.addEventListener('click', () => {
    wrapper.style.display = 'none'
    navBar.classList.add('sticky-top')
});
wrapper.addEventListener('click', (e) => {
    if (e.target === wrapper) {
        wrapper.style.display = 'none'
        navBar.classList.add('sticky-top')
    }
});

function changeDescriptionOfImage(imgName, project) {
    switch (project) {
        case project = 'Reason-And-Domination': {
            checkImageName(imgName)
        }
    }
}

function checkImageName(imgName) {
    switch (imgName) {
        case imgName = 'Admin-Panel.png':
            imageDesc.textContent = imageDescLinker.rnd_AdminPanel
            break;
        case imgName = 'Classes.png':
            imageDesc.textContent = imageDescLinker.rnd_Classes
            break;
        case imgName = 'Dungeon-Ex.png':
            imageDesc.textContent = imageDescLinker.rnd_Dungeon_Ex
            break;
        case imgName = 'Dungeons.png':
            imageDesc.textContent = imageDescLinker.rnd_Dungeons
            break;
        case imgName = 'Error-404.png':
            imageDesc.textContent = imageDescLinker.rnd_Error_404
            break;
        case imgName = 'Error-500.png':
            imageDesc.textContent = imageDescLinker.rnd_Error_500
            break;
        case imgName = 'Forum.png':
            imageDesc.textContent = imageDescLinker.rnd_Forum
            break;
        case imgName = 'Forum-Ex-Post.png':
            imageDesc.textContent = imageDescLinker.rnd_Forum_Ex_Post
            break;
        case imgName = 'Guides.png':
            imageDesc.textContent = imageDescLinker.rnd_Guides
            break;
        case imgName = 'Guides-Ex-Post.png':
            imageDesc.textContent = imageDescLinker.rnd_Guides_Ex_Post
            break;
        case imgName = 'Home.png':
            imageDesc.textContent = imageDescLinker.rnd_Home
            break;
        case imgName = 'Item-Ex.png':
            imageDesc.textContent = imageDescLinker.rnd_Item_Ex
            break;
        case imgName = 'Items.png':
            imageDesc.textContent = imageDescLinker.rnd_Items
            break;
        case imgName = 'Login.png':
            imageDesc.textContent = imageDescLinker.rnd_Login
            break;
        case imgName = 'Lookup.png':
            imageDesc.textContent = imageDescLinker.rnd_Lookup
            break;
        case imgName = 'News.png':
            imageDesc.textContent = imageDescLinker.rnd_News
            break;
        case imgName = 'News-Ex-Post.png':
            imageDesc.textContent = imageDescLinker.rnd_News_Ex_Post
            break;
        case imgName = 'Profile.png':
            imageDesc.textContent = imageDescLinker.rnd_Profile
            break;
        case imgName = 'Races.png':
            imageDesc.textContent = imageDescLinker.rnd_Races
            break;
        case imgName = 'Register.png':
            imageDesc.textContent = imageDescLinker.rnd_Register
            break;
        case imgName = 'Support.png':
            imageDesc.textContent = imageDescLinker.rnd_Support
            break;
        case imgName = 'Timers.png':
            imageDesc.textContent = imageDescLinker.rnd_Timers
            break;
        case imgName = 'Welcome.png':
            imageDesc.textContent = imageDescLinker.rnd_Welcome
            break;

    }
}


