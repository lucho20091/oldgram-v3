import { postsData } from './posts.js'


// get localstorage item
const nameFromLocalStorage = JSON.parse(localStorage.getItem('username'))
const idFromLocalStorage = JSON.parse(localStorage.getItem('id'))
const name2FromLocalStorage = JSON.parse(localStorage.getItem('username2'))
// get modal
const modal = document.getElementById('modal');
const signInBtn = document.getElementById('sign-in');
const username = document.getElementById('username');
// // get main
const main = document.querySelector('main');
const header = document.querySelector('header');
// get username element
const usernameName = document.getElementById('username-name');
// get profile 
const profileUser = document.getElementById('profile-user');
// close sesion btn and modal
const closeBtn = document.getElementById('close-sesion');
const closeModal = document.getElementById('modal-close-sesion');



function getPostsArray(posts){
    const postsArray = []
    for (let post of posts){
            postsArray.push(post) 
    }
    return postsArray
}

function renderPosts(posts){
    let postItems = ``
    const postsID = getPostsArray(posts)
    for (let post of postsID){
        postItems += `
        <div class="container2">
        <div class="username">
            <div class="username-picture">
                <img src="./images/${post.avatarImage}" class="avatar" alt="this is ${post.id} avatar">
            </div>
            <div class="username-text">
                <p class="bold">${post.namePost}</p>
                <p>${post.userLocation}</p>
            </div>
        </div>
        <div class="image" id="post-image-${post.id}">
            <img src="./images/${post.image}" alt="a portrait of ${post.id}">
        </div>
        <div class="like-icons">
            <div id="like-heart-${post.id}"><i class="fa-regular fa-heart"></i></div>
            <div><i class="fa-regular fa-comment"></i></div>
            <div><i class="fa-regular fa-paper-plane"></i></div>
        </div>
        <div class="people-comments">
            <p id="likes-${post.id}">${post.likesCounter} likes</p>
            <p><span class="bold">${post.userNamePost}</span>${post.userNameTextPost}</p>
            <div class="divider"></div>
            <div class="comment-section" id="commentSection-${post.id}"></div>
            <div class="comment-div">
                <input 
                type="text" 
                class="comment"
                id="input-comment-${post.id}"
                placeholder="Leave a comment">
                <button id="send-comment-${post.id}">Send</button>
            </div>
        </div>
    </div>
    <div class="border"></div>` 
        main.innerHTML = postItems    
    }
}


renderPosts(postsData)








function likeInteraction(posts){
    const postsVar = getPostsArray(posts)
    const likeHeartArr = []
    const likesArr = []
    const counterArr = []
    const postImgArr = []

    for (let post of postsVar){
        likeHeartArr.push(`like-heart-${post.id}`)
        likesArr.push(`likes-${post.id}`)
        postImgArr.push(`post-image-${post.id}`)

        counterArr.push(`${post.likesCounter}`)
    }
    for (let i = 0; i < likeHeartArr.length; i++) {
        const likeHeartEl = document.getElementById(likeHeartArr[i])
        const likesEl = document.getElementById(likesArr[i])
        const counter = counterArr[i]
        const postImgEl = document.getElementById(postImgArr[i])

        if (likeHeartEl){
            likeHeartEl.addEventListener('click', () =>{ 
            likeHeartEl.classList.toggle('active')
            if (likeHeartEl.classList.contains('active')){
                likesEl.innerHTML = `${nameFromLocalStorage} and ${counter} likes`
            } else {
                likesEl.innerHTML = `${counter} likes`
            }
            })
        }
        if (postImgEl){
            postImgEl.addEventListener('dblclick', () =>{
                likeHeartEl.classList.toggle('active')
                })
            }        
    }


}

likeInteraction(postsData)

// setting up firebase 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://oldgram-dd94a-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const oldgramInDB = ref(database, "oldgram")
// sign in send username to localStorage
signInBtn.addEventListener('click', () => {
    if (username.value === name2FromLocalStorage){
        localStorage.setItem('username', JSON.stringify(username.value))
    } else if (idFromLocalStorage){
        let message = 'you already have an account, would you like to create a new account?'
        if (confirm(message)){
            localStorage.setItem('username', JSON.stringify(username.value))
            const random = Math.floor(Math.random() * 10000 )
            localStorage.setItem('id', JSON.stringify(random))
            localStorage.setItem('username2', JSON.stringify(username.value))
        }
    } else {
        localStorage.setItem('username', JSON.stringify(username.value))
        const random = Math.floor(Math.random() * 10000 )
        localStorage.setItem('id', JSON.stringify(random))
        localStorage.setItem('username2', JSON.stringify(username.value))
    }
})
// logic when user created account
if (nameFromLocalStorage){
    modal.style.display = 'none'
    header.style.display = 'block'
    main.style.display = 'block'
    usernameName.textContent = nameFromLocalStorage
} 


function sendComments(){
    const postsVar = getPostsArray(postsData)
    const inputArr = []
    const btnArr = []
    const commentArr = []

    for (let post of postsVar){
        inputArr.push(`input-comment-${post.id}`)
        btnArr.push(`send-comment-${post.id}`)
        commentArr.push(`commentSection-${post.id}`)
    }

    for (let i = 0; i < inputArr.length; i++) {
        const inputEl = document.getElementById(inputArr[i])
        const btnEl = document.getElementById(btnArr[i])
        // const commentEl = document.getElementById(commentArr[i])

        if (btnEl){
            btnEl.addEventListener('click', () => {
                let myObj = {
                    id: idFromLocalStorage,
                    name: nameFromLocalStorage,
                    comment: inputEl.value,
                    html: `${commentArr[i]}`,
                }

                if (!inputEl.value == ""){
                    push(oldgramInDB, myObj)
                }

                inputEl.value = ""
            })
        }
    }
}

sendComments() 
// logic to get data from DB
onValue(oldgramInDB, function(snapshot){
    if (snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
        clearCommentSections()
        
        const postsVar = getPostsArray(postsData)
        const commentSectionArr = []

        for (let post of postsVar){
            commentSectionArr.push(`commentSection-${post.id}`)
        }

        for (let item of itemsArray){
            if (item[1].html === "commentSection" || item[1].html == commentSectionArr[0]){
                const commentSectionEl = document.getElementById(commentSectionArr[0])
                appendComments(item, commentSectionEl)
            } else if (item[1].html === "commentSection2"|| item[1].html == commentSectionArr[1]){
                const commentSectionEl = document.getElementById(commentSectionArr[1])
                appendComments(item, commentSectionEl)
            } else if (item[1].html === "commentSection3" || item[1].html == commentSectionArr[2]){
                const commentSectionEl = document.getElementById(commentSectionArr[2])
                appendComments(item, commentSectionEl)
            } 
        }
    } else {
        push(oldgramInDB, "hello")
    }
})

function clearCommentSections(){
    const postsVar = getPostsArray(postsData)
    const commentsArr = []
    for (let post of postsVar){
        commentsArr.push(`commentSection-${post.id}`)
    }
    for (let i = 0; i < commentsArr.length; i++){
        const commentsEl = document.getElementById(commentsArr[i])
        if (commentsEl){        
            commentsEl.innerHTML = ''
        }
            
    }
}

function appendComments(item, commentSectionEl){
    let itemID = item[0]
    let itemComment = item[1].comment
    let itemName = item[1].name
    let itemUserID = item[1].id

    let newEl = document.createElement('div')
    newEl.className = 'flex-comment'
    newEl.innerHTML = `
    <p><span class="bold">${itemName}</span> ${itemComment}</p>`
    commentSectionEl.append(newEl)
    if (itemUserID === idFromLocalStorage){
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete'
        deleteBtn.addEventListener('click', () => {
            let exactLocationOfItem = ref(database, `oldgram/${itemID}`);
            const text = `Are you sure you want to delete this comment? \n
            username: ${itemName} \n
            text content: ${itemComment}`
            if (confirm(text)){
                remove(exactLocationOfItem)
            }
        })
        newEl.append(deleteBtn)
        }
}

profileUser.addEventListener('click', () => {
    closeModal.classList.toggle('hidden')
});

usernameName.addEventListener('click', () => {
    closeModal.classList.toggle('hidden')
});

closeBtn.addEventListener('click', () => {
    localStorage.removeItem('username')
    window.location.reload();

})