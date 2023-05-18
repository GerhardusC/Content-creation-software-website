/* 
This script is run on the "blog", "index" and "saved-posts" pages.

Breakdown:
    -The functional "save for later" page is called "blog.html" and can be accessed by clicking on "Blog" in the navigation bar, 
     here you can click on the "save" button to earmark the blog posts.
    
    -Each blog post can be saved for later.
     
    -An alert shows the user how many items they have added to their saved for later page.

    -Another HTML page called "savedPosts.html" can be accessed by clicking on "Saved posts" in the navigation bar
     which allows the user to see the posts they have saved and remove posts that have already been saved.

    -A form on each post allows users to leave a comment. At the moment the comments do not maintain their state accross reloads, but
     if I were to spend more time on this task I would implement that.

    -Forms allow users to like a blog post. Currently it also doesn't have a state that persists through reloads, but
     if I had to expand on this project I would add this functionality.

    -A form at the bottom of the "index.html" page, accessible either through clicking on the "recommended software" link on the navigation bar
     or the "Free (No asterisk)" text in the navigation bar allows you to submit contact information.

*/

//Grabbing the blogposts and save post buttons on the page (They exist on blog.html)
let blogPosts = document.querySelectorAll(".blog-post");
let submitButtons = document.querySelectorAll(".save-post-button");

//A class to describe a blog post.
class Post {
    constructor(title, date, postContent, saved) {
        this.title = title;
        this.date = date;
        this.postContent = postContent;
        this.saved = saved;
    }
}

//A class to describe a user that wants to be contacted.
class User {
    constructor(userName, userEmail, preferredSoftware, comment, boolReceiveUpdates){
        this.userName = userName;
        this.userEmail = userEmail;
        this.preferredSoftware = preferredSoftware;
        this.comment = comment;
        this.boolReceiveUpdates = false;
    }
}


//Arrays to store saved posts and data collected from users.
let savedPosts = [];
let userData = [];

//If session storage exists, we retrieve it.
if (sessionStorage.getItem("userData") != null){
    userData = JSON.parse(sessionStorage.getItem("userData"));
}

if (sessionStorage.getItem("savedPosts") != null){
    savedPosts = JSON.parse(sessionStorage.getItem("savedPosts"));
}

//This function compares the saved posts to the posts on the page to restyle the posts that have already been saved.
let compareSavedPosts = () => {
    let currentPosts = [];
    for (let i = 0; i < blogPosts.length; i++){
        let aPost = new Post (
            blogPosts[i].querySelector(".blog-post-title").innerHTML,
            blogPosts[i].querySelector(".blog-post-date").innerHTML,
            blogPosts[i].querySelector(".blog-post-body").innerHTML,
            false
        )
        currentPosts.push(aPost);
    }
    //Looping through the saved posts and comparing them with the current posts. Changes styling if the post is both in current posts and saved posts.
    for (let i = 0; i < currentPosts.length; i++){
        for (let j = 0; j<savedPosts.length; j++){
            if (currentPosts[i].title == savedPosts[j].title && currentPosts[i].postContent == savedPosts[j].postContent){
                blogPosts[i].querySelector(".blog-post-title").setAttribute("class", "blog-post-title already-in-database");
                blogPosts[i].querySelector(".save-post-button").setAttribute("class", "button-already-in-database");
            }
        }
    }
}

//This function lets you add a comment to a blog post.
const addComment = (e) => {
    e.preventDefault();
    e.target.parentElement.querySelector(".comment").innerText += `Piet Pompies: ${e.target.parentElement.querySelector(".comment-text").value}\n`;
    e.target.parentElement.querySelector(".comment-text").value = "";
}

//Adding eventlisteners to the comments forms so users can add comments.
let commentSections = document.querySelectorAll(".comments-form");

for (let i = 0; i < commentSections.length; i++){
    commentSections[i].addEventListener("submit", addComment)
}


//A function that lets you save a post.
const savePost = (e) => {
    //Create a post object made from the content of the post.
    let clickedPost = new Post(
        e.target.parentElement.querySelector(".blog-post-title").innerHTML,
        e.target.parentElement.parentElement.querySelector(".blog-post-date").innerHTML,
        e.target.parentElement.parentElement.querySelector(".blog-post-body").innerHTML,
        false
    )
    //Changing styling on blog post if it has been saved.
    e.target.parentElement.querySelector(".blog-post-title").setAttribute("class", "blog-post-title already-in-database");
    e.target.setAttribute("class", "button-already-in-database");

    //Checking which of the posts in the array is the one that was clicked.
    for (let i = 0; i < savedPosts.length; i++){
        if (clickedPost.title == savedPosts[i].title && clickedPost.date == savedPosts[i].date && clickedPost.postContent == savedPosts[i].postContent){
            clickedPost.saved = true;
        }
    }
    //If the clicked post is not yet saved, we add the post to the saved posts array and save it to session storage.
    if (!clickedPost.saved) {
        savedPosts.push(clickedPost);
        sessionStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    } else (
        //Otherwise mention that the post is already in the database and tell the user how to remove the post.
        alert("This post is already in the database. To remove it, navigate to the 'saved posts' page.")
    )
    //As per the brief, telling the user how many items they have saved for later.
    alert(`You currently have ${savedPosts.length} items saved for later.`)
}

//Adding save post event liteners to the save post buttons.
for (let i = 0; i < submitButtons.length; i++){
    submitButtons[i].addEventListener("click", savePost)
}

//A function to display saved posts on the savedPosts.html page.
const displaySavedPosts = () => {
    if (savedPosts.length > 0){
        document.querySelector("#saved-posts").innerHTML = "";

        //Loop through the saved posts and create elements for displaying each post.
        for (let i = 0; i < savedPosts.length; i++){
            let removalDivision = document.createElement("div");
            let detailsContainer = document.createElement("details");
            let blogPostTitle = document.createElement("summary");
            let blogPostContent = document.createElement("div");
            let deleteButton = document.createElement("div");

            //Setting classes to style newly created elements.
            removalDivision.setAttribute("class", "removal-division")
            blogPostContent.setAttribute("class", "saved-post-content")
            blogPostTitle.setAttribute("class", "saved-post-title")
            deleteButton.setAttribute("class", "remove-saved-post-button")
            deleteButton.setAttribute("id", `remove-post${i}`)
            deleteButton.addEventListener("click", removeSavedItem)

            //Adding text to the posts.
            blogPostTitle.innerHTML = savedPosts[i].title;
            blogPostContent.innerHTML = savedPosts[i].postContent;
            deleteButton.innerHTML = "Remove";

            
            detailsContainer.appendChild(blogPostTitle);
            detailsContainer.appendChild(blogPostContent);

            removalDivision.appendChild(detailsContainer)
            removalDivision.appendChild(deleteButton)
            //Adding the posts one by one to the document.
            document.querySelector("#saved-posts").appendChild(removalDivision);
        }

    } else {
        document.querySelector("#saved-posts").innerHTML = "You have no saved posts to display."
    }
}

//A function to remove a blog post from the saved posts page.
const removeSavedItem = (e) => {
    for (let i = 0; i < savedPosts.length; i++){
        if (e.target.id == `remove-post${i}`) {
            savedPosts.splice(i, 1);
        }
    }
    //Save the removed item to sessionStorage.
    sessionStorage.setItem("savedPosts", JSON.stringify(savedPosts));
    displaySavedPosts();
}

//A function to like a post.
const likePost = (e) => {
    //Changes the styling of a post depending on if it has been liked.
    if (e.target.parentElement.classList.contains("already-liked")){
        e.target.parentElement.setAttribute("class", "like-form");
    } else {
        e.target.parentElement.setAttribute("class", "already-liked");
    }
}


//Add event listeners to the like buttons.
let likeButtons = document.querySelectorAll(".like-form")
for (let i = 0; i<likeButtons.length; i++) {
    likeButtons[i].addEventListener("click", likePost)
}


//A function that runs on the index.html page to collect user information in the form at the bottom.
const collectUserInformation = (e) => {
    //Create a new user to contact.
    let userToContact = new User (
        e.target.querySelector("#name").value,
        e.target.querySelector("#email").value,
        null,
        e.target.querySelector("#comment-or-question").value,
        null
    )
    //Checking which software user selected and setting the user's preferred software to the selected software.
    let radioOptions = document.getElementsByName("software-selection");
    for(let i = 0; i < radioOptions.length; i++){
        if(radioOptions[i].checked){
            userToContact.preferredSoftware = radioOptions[i].value
        }
    }
    //Checking if the user wants to join the mailing list and setting the receiveUpdates property to true or false accordingly.
    if (document.getElementById("subscribe").checked){
        userToContact.boolReceiveUpdates = true;
    } else {
        userToContact.boolReceiveUpdates = false;
    }
    //Add the user to the userData.
    userData.push(userToContact);
    //Save Userdata to sessionStorage.
    sessionStorage.setItem("userData", JSON.stringify(userData))
    //Telling the user that they have been added successfully.
    alert(`User added to mailing list:\nName: ${userToContact.userName}\nEmail: ${userToContact.userEmail}\nSoftware interest: ${userToContact.preferredSoftware}`)
}
//If the contact details form exists add the event listener to collect user information.
if (document.getElementById("contact-details-form") != null){
    document.getElementById("contact-details-form").addEventListener("submit", collectUserInformation)
}

const changeLinkStyle = (e) => {
    e.target.parentElement.parentElement.style.backgroundColor = "gray"
    console.log("I ran.")
}

let blockLinks = document.querySelectorAll("block-link");

for(let i = 0; i < blockLinks.length; i++){
    blockLinks[i].addEventListener("mouseover", changeLinkStyle)
}