 /*****************************************************************
         File: main.js
         Author: Kai Gao
         App Name: ReviewR
         Description: 
         Here is the sequence of logic for the app

         Version: 0.0.1
         Updated: Arpil 8, 2017
     *****************************************************************/
 var app = {
     localStorageList: {
         reviews: []
     }
     , rating: 0
     , stars: null
     , imgPath: null
     , currentReviewID: 0
     , init: function () {
         document.addEventListener('deviceready', app.onDeviceReady);
     }
     , onDeviceReady: function () {
         console.dir("enter onDeviceReady method");
         //show the main page when first load the app
         app.showPageOne();
         // only stars on the add-review modal having class name star
         app.stars = document.querySelectorAll(".star");
         app.addListeners();
         var btnCloseAddModal = document.getElementById("closeAddReviewModal");
         btnCloseAddModal.addEventListener("touchend", function (ev) {
             //go the main page
             btnCloseAddModal.setAttribute("href", "#addReviewModal");
             let divAddModalContent = document.getElementById("addModalContent");
             // remove the picture if pic exists, idPic is the parent element of the img tag         
             var idPic = document.getElementById("id-pic");
             if (idPic) {
                 divAddModalContent.removeChild(idPic);
             }
             // remove the take-pic button if take-pic button exists
             let buttons = document.getElementById("buttons");
             let takePicBtn = document.getElementById("takePicAddReviewModal");
             if (takePicBtn) {
                 buttons.removeChild(takePicBtn);
             }
         });
         //dispatch click to the close button
         document.getElementById("btnCancelAddReviewModal").addEventListener("touchstart", app.cancelAddModal);
         //add new review button
         var btnAddReview = document.getElementById("btnAdd");
         btnAddReview.addEventListener("touchstart", function (ev) {
             console.log("ADD button touchstart works");
             //reset the number of rated stars to 0
             app.rating = 0;
             app.setRating();
             //reset the imgage path to null before clicking the save button
             app.imgPath = null;
             //reset the item tile to empty
             document.getElementById("item").value = "";
             // add take-pic button. 
             //Everytime enter the add-review modal, create a new take-pic button; and everytime leaving the add-review modal, delete the take-pic button if exists OR delete the img created in che successCallBack function. Inside successCallBack function, creating an img and removing the take-pic button
             var btnTakePic = document.createElement("button");
             btnTakePic.className = "btn btn-positive btn-block";
             btnTakePic.setAttribute("id", "takePicAddReviewModal");
             var span = document.createElement("span");
             span.className = "icon icon-play";
             span.textContent = "Take Picture";
             btnTakePic.appendChild(span);
             let buttons = document.getElementById("buttons");
             let btnCancel = document.getElementById("btnCancelAddReviewModal");
             buttons.insertBefore(btnTakePic, btnCancel);
             var options = {
                 quality: 20
                 , destinationType: Camera.DestinationType.FILE_URI
                 , encodingType: Camera.EncodingType.PNG
                 , mediaType: Camera.MediaType.PICTURE
                 , pictureSourceType: Camera.PictureSourceType.CAMERA
                 , allowEdit: true
                 , targetWidth: 300
                 , targetHeight: 300
             };
             btnTakePic.addEventListener("touchstart", function (ev) {
                 navigator.camera.getPicture(app.successCallback, app.errorCallback, options);
             });
             
         });
         
         //delete button
         var btnDelete = document.getElementById("btnDeleteDetailReviewModal");
         btnDelete.addEventListener("touchstart", app.deleteReview);
         
         
         var btnSaveReview = document.getElementById("btnSaveAddReviewModal");
         btnSaveReview.addEventListener("touchstart", app.saveReview);
     }
     , deleteReview: function(ev){
         console.log("enter delete function and show current review ID");
         console.log(app.currentReviewID);
         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-gao00078"));
         for(var i=0, len = app.localStorageList.reviews.length; i < len; i++){
             if(app.currentReviewID == app.localStorageList.reviews[i].id){
                 console.log("find a match for deleteing");
                 app.localStorageList.reviews.splice(i,1);
                 localStorage.setItem("reviewr-gao00078",JSON.stringify(app.localStorageList));
                 
                 //dispatch to back button
                 var myTouchEndEv = new CustomEvent("touchend", {bubbles:true});
                 var closeDetailModal = document.getElementById("closeDetailReviewModal");
                 closeDetailModal.dispatchEvent(myTouchEndEv);
                 //after deleting one review, refresh the page
                 app.showPageOne();
                 //break is important. Once we find the match, there is no need to continue the loop
                 break;
             }
         }
         
     }
     , saveReview: function(){
        console.log("enter save review fucntion");
         
         let reviewTemp = {
             id: Date.now(),
             name: document.getElementById("item").value,
             rating: app.rating,
             img: app.imgPath
         }
         //make sure all 3 fields have values
         if(reviewTemp.name && reviewTemp.rating!=0 && reviewTemp.img){
             app.localStorageList.reviews.push(reviewTemp);
             localStorage.setItem("reviewr-gao00078",JSON.stringify(app.localStorageList));
//            process the info then dispatch click to the close button 
             var myTouchEndEv = new CustomEvent("touchend", {bubbles:true});
             var closeAddModal = document.getElementById("closeAddReviewModal");
             closeAddModal.dispatchEvent(myTouchEndEv);
            //after adding one review, refresh the page
             app.showPageOne();
         
         }else{
             //generate a message to user and make the message disappear after 3 seconds
             let divparent = document.getElementById("addModalContent");
             let form = document.getElementById("id-form");
             
             let divMsg = document.createElement("div");
             divMsg.classList.add("msg");
             setTimeout(function(){
                 divMsg.classList.add("bad");
             },20);
             
             divMsg.textContent = "You missed at least one field!";
             //insert the message before the form.
             divparent.insertBefore(divMsg, form);
             setTimeout((function(dparent,dm){
                 return function(){
                     dparent.removeChild(dm);
                 }
             })(divparent,divMsg),3000);
         }
         
    
     }
     , showReviewDetail: function(ev){
         console.log("herer");
		 //the shevron being clicked on the main page, the shevron has a attribute with id inside of it.
         let anchorTag = ev.currentTarget;
         let idForReviewClicked = anchorTag.getAttribute("id-review-clicked");
         //this is for delete button to find the matched review then do deleting thing
         //update the global variable app.currentReviewID, which can only be used to delete the current reveiw because 
         //delete button is now on the detail-review modal
         app.currentReviewID = idForReviewClicked;
         console.log(idForReviewClicked);
         console.log("enter show review details function");
         //since after clicking shevron, we enter the detail-reveiw modal, we know that there is at least one review in the localstroage. So I did not check if the app.localStorageList is empty here
         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-gao00078"));
         
         for(var i=0, len = app.localStorageList.reviews.length; i < len; i++){
             if(idForReviewClicked == app.localStorageList.reviews[i].id){
                 console.log("got a review match");
                 let ul = document.getElementById("review-detail-list");
                 ul.innerHTML="";
                 let liImg = document.createElement("li");
                 liImg.className = "table-view-cell";
                 let img = document.createElement("img");
                 img.className = "media-object pull-left";
                 img.classList.add("imgBig");
                 
                 //img.src
                 img.src = app.localStorageList.reviews[i].img;
//                 if(img && img.style){
//                     img.style.height = "123%";
//                     img.style.width = "123%";
//                 }
                 
                 let liItem = document.createElement("li");
                 liItem.className = "table-view-cell";
                 //item name
                 liItem.textContent ="Item: "+ app.localStorageList.reviews[i].name;
                 
                 //draw stars
                 console.log("rating:");
                 console.log(app.localStorageList.reviews[i].rating);
                 let liStars = document.createElement("li");
                 liStars.className = "table-view-cell";
                 liStars.textContent = "Rating: ";
                 //draw rated stars
                 for(var j=0; j<app.localStorageList.reviews[i].rating; j++){
                     let span = document.createElement("span");
                     span.className = "starPageOne";
                     span.innerHTML = "&#x2605;";
                     liStars.appendChild(span);

                 }
                 //draw unrated stars
                 for(var j=0; j<5-app.localStorageList.reviews[i].rating; j++){
                     let span = document.createElement("span");
                     span.className = "starPageOne";
                     span.innerHTML = "&#x2606;";
                     liStars.appendChild(span);
                 }
                 //append all children
                 liImg.appendChild(img);
                 ul.appendChild(liImg);
                 ul.appendChild(liItem);
                 ul.appendChild(liStars);
                //once finding the match, no need to loop, OR cause error
                 break;
             }
         }

         
     }
     , showPageOne: function(){
        console.log("enter showPageOne");
         let list = document.getElementById("review-list");
         list.innerHTML="";
         app.localStorageList = JSON.parse(localStorage.getItem("reviewr-gao00078"));
         //if there is nothing in localstorage, then assign am empty array to localStorageList on JS side

         if(!app.localStorageList){
             app.localStorageList = {
                 reviews:[]
             };
         }else{
             //sorted by creation time
             app.localStorageList.reviews.sort(function(a,b){
                 return a.id - b.id;
             })
         }
         
         app.localStorageList.reviews.forEach(function(review){
             let li = document.createElement("li");
             li.className = "table-view-cell media";
             
             let img = document.createElement("img");
             img.className = "media-object pull-left";
             img.classList.add("imgSmall");
             
             img.src =  review.img;
//             if(img && img.style){
//                 img.style.height = "33%";
//                 img.style.width = "33%";
//             }
             
             
             let divparent = document.createElement("div");
             divparent.className = "media-body ";
             divparent.textContent = review.name;
             
             let divChildStars = document.createElement("div");
             divChildStars.className = "allStarsPageOne";
//             divChildStars.innerHTML = "Number of stars: " + review.rating;
             //draw stars on each review on the main page
             for(var i=0; i<review.rating; i++){
                 let span = document.createElement("span");
                 span.className = "starPageOne";
                 span.innerHTML = "&#x2605;";
                 divChildStars.appendChild(span);
                 
             }
             for(var i=0; i<5-review.rating; i++){
                 let span = document.createElement("span");
                 span.className = "starPageOne";
                 span.innerHTML = "&#x2606;";
                 divChildStars.appendChild(span);
                 
             }
             
             
             
             let a = document.createElement("a");
             a.className = "navigate-right";
             a.href = "#detailsReviewModal";
             //one main page, each review has its own unique anchor tage, save its id as a attribute inside of its own anchor tag
             //when clicking on the anchor tag, opens the detail-review modal. since the anchor tag is the clicked target,
             //we can access the clicked target's attribute. then we can reset and assign this to the global variable app.currentReviewID, which will be used to find the match when deleting that review.
             a.setAttribute("id-review-clicked", review.id);
             
             a.addEventListener("touchstart", app.showReviewDetail);
             
             divparent.appendChild(divChildStars);
             divparent.appendChild(a);
             li.appendChild(img);
             li.appendChild(divparent);
             
             list.appendChild(li);
         })
         
         
         
     }
     , cancelAddModal: function () {
         var myTouchEv = new CustomEvent("touchend", {
             bubbles: true
         });
         var closeAddModal = document.getElementById("closeAddReviewModal");
         closeAddModal.dispatchEvent(myTouchEv);
     }
     , successCallback: function (imageURI) {
         console.log("entet success call function");
         console.dir(imageURI);
         //         var image = document.getElementById("imgTest2");
         //         image.src = imageURI;
         //replacing the take pic button with the pic
         let divAddModalContent = document.getElementById("addModalContent");
         let ul = document.createElement("ul");
         ul.className = "table-view";
         ul.setAttribute("id", "id-pic");
         let li = document.createElement("li");
         li.className = "table-view-cell";
         let img = document.createElement("img");
         img.classList.add("imgBig");
         
         img.src = imageURI;
//         img.src = "data:image/png;base64,"+imageURI;
         //assign imgage path to the global variable

         app.imgPath = imageURI;
//         app.imgPath = "data:image/png;base64,"+imageURI;
         
         
//         if(img && img.style){
//                 img.style.height = "123%";
//                 img.style.width = "123%";
//             }
         
         li.appendChild(img);
         ul.appendChild(li);
         //add the pic right before all the buttons 
         let buttons = document.getElementById("buttons");
         divAddModalContent.insertBefore(ul, buttons);
         // then buttons remove its child--- take-pic button
         let takePicBtn = document.getElementById("takePicAddReviewModal");
         buttons.removeChild(takePicBtn);
     }
     , errorCallback: function (message) {
         console.log("enter error function");
         alert('Failed because: ' + message);
     }
     , addListeners: function () {
          [].forEach.call(app.stars, function (star, index) {
             star.addEventListener('touchstart', (function (idx) {
                 console.log('adding listener', idx);
                 return function () {
                     app.rating = idx + 1;
                     console.log('Rating is now', app.rating)
                     app.setRating();
                 }
             })(index));
         });
     }
     //decide and show stars with or wiout being rated on add-review page 
     , setRating: function () {
           [].forEach.call(app.stars, function (star, index) {
             if (app.rating > index) {
                 star.classList.add('rated');
                 console.log('added rated on', index);
             }
             else {
                 star.classList.remove('rated');
                 console.log('removed rated on', index);
             }
         });
     }
 };
 app.init();